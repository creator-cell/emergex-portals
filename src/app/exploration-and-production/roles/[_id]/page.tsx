"use client"

import React, { useState } from "react"
import { X } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useFetchEmployeesQuery, useFetchTeamsQuery, useAddEmployeeInTeamMutation, useAddProjectRoleMutation, useFetchRolesQuery } from "@/store/api/team/teamApi"
import { toast, Toaster } from "sonner"

const formSchema = z.object({
  role: z.string().min(1, "Role is required"),
  description: z.string().min(1, "Description is required"),
  assignTo: z.string().min(1, "Assign to is required"),
})

type FormValues = z.infer<typeof formSchema>

export default function RoleManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const projectId = window.location.pathname.split('/').pop() || ''

  const { data: rolesApiResponse } = useFetchRolesQuery();

  const { data: teamData } = useFetchTeamsQuery()
  const { data: employeeData } = useFetchEmployeesQuery()
  const [addEmployeeInTeam] = useAddEmployeeInTeamMutation()
  const [addProjectRole, { isLoading }] = useAddProjectRoleMutation()

  const rolesData = rolesApiResponse?.data

  const {
    control,
    setValue,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      description: "",
      assignTo: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await addProjectRole({
        projectId,
        roles: [
          {
            roleId: data.role,
            roleDescription: data.description,
            assignTo: data.assignTo,
          },
        ],
      }).unwrap()

      if (response?.success) {
        toast.success("Role assigned successfully")
        reset()
        setSelectedRole(null)
      } else {
        toast.error(response?.error || response?.message || "Failed to assign role")
      }
    } catch (error: any) {
      toast.error(error?.data?.error || error?.data?.message || "Failed to assign role")
    }
  }


  const handleModalSubmit = () => {
    if (newRoleName && selectedEmployee) {
      setIsCreatingRole(true);
      addEmployeeInTeam({ teamId: newRoleName, employeeId: selectedEmployee })
        .unwrap()
        .then((response) => {
          if (response?.success) {
            toast.success(response?.message || "Employee added to team successfully");
          } else {
            toast.error(response?.error || "Something went wrong");
          }
          setIsCreatingRole(false);
          setIsModalOpen(false);
          setNewRoleName("");
          setSelectedEmployee("");
        })
        .catch((error) => {
          toast.error(error?.data?.error || "Failed to add employee to team");
          setIsCreatingRole(false);
        });
    } else {
      toast.error("Please select both a role and an employee");
      setIsCreatingRole(false);
    }
  };

  return (
    <div className="p-6 mx-auto w-full max-w-[100rem]">
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8">
          <div className="relative mb-12">
            <Card className="ml-8 p-6 space-y-6 rounded-[20px] shadow-none border-none">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm text-gray-600">Role
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                        <Controller
                                                name="role"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <SelectTrigger className="h-12">
                                                            <SelectValue placeholder="Select team" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {rolesData?.map((team: any, index: number) => (
                                                                <SelectItem
                                                                    key={team._id + index}
                                                                    value={team._id}
                                                                >
                                                                    {team.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                    {/* <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            setSelectedRole(value)
                            field.onChange(value)
                            const selectedRole = rolesApiResponse?.data.find((team) => team._id === value)
                            if (selectedRole) {
                              // You could set description or other fields based on role
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Add Role">
                              {rolesApiResponse?.data.find((team) => team._id === field.value)?.name || "Add Role"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {rolesApiResponse?.data.map((team) => (
                              <SelectItem key={team._id} value={team._id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    /> */}
                    {errors.role && <p className="text-red-500 text-sm mt-1">{String(errors.role.message)}</p>}
                    {selectedRole && (
                      <Button
                        variant="outline"
                        className="h-12 flex items-center"
                        onClick={() => {
                          setSelectedRole(null)
                          setValue("role", "")
                        }}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  className="mt-8 text-green-500 h-12"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create new role
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Description           <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Enter the description" className="min-h-[100px]" />
                  )}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.description.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Assign to           <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="assignTo"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select employee">
                          {employeeData?.data.find((employee) => employee._id === field.value)?.name ||
                            "Select employee"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {employeeData?.data.map((employee) => (
                          <SelectItem key={employee._id} value={employee._id}>
                            {employee.name} - {employee.designation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.assignTo && <p className="text-red-500 text-sm mt-1">{String(errors.assignTo.message)}</p>}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  className="bg-gradient-to-r rounded-full from-[rgba(36,120,20,1)] to-[rgba(61,162,41,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-5"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-white">Save Role Assignment</span>
                  )}


                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-[20px] p-6 w-[500px] shadow-lg">
            <h3 className="text-lg mb-4">Add new role</h3>

            <div className="mb-6">
              <label className="block text-sm font-normal mb-1">Team           <span className="text-red-500">*</span>
              </label>
              <div className="relative border rounded">
                <Select onValueChange={(value) => setNewRoleName(value)} value={newRoleName}>
                  <SelectTrigger className="border-none">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamData?.data.map((team) => (
                      <SelectItem key={team._id} value={team._id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-normal mb-1">Employee           <span className="text-red-500">*</span>
              </label>
              <div className="relative border rounded">
                <Select onValueChange={(value) => setSelectedEmployee(value)} value={selectedEmployee}>
                  <SelectTrigger className="border-none">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeData?.data.map((employee) => (
                      <SelectItem key={employee._id} value={employee._id}>
                        {employee.name} - {employee.designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" className="bg-gray-200 text-gray-700" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r rounded-full from-[rgba(36,120,20,1)] to-[rgba(61,162,41,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-5 w-full sm:w-auto"
                onClick={handleModalSubmit}
                disabled={isCreatingRole || !newRoleName || !selectedEmployee}
              >
                {isCreatingRole ? (
                  <div className="h-5 w-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-white">                Add Employee to Team
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}