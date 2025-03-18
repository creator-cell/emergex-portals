"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast, Toaster } from "sonner"
import { useAddEmployeeMutation, useFetchEmployeesQuery } from "@/store/api/team/teamApi"
import { TeamMemberCard } from "@/components/super-admin/TeamMemberCard"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  contactNo: z.string().min(10, "Contact number must be at least 10 digits"),
  designation: z.string().min(1, "Designation is required"),
})

interface Employee {
  _id: string
  name: string
  // Add other properties as needed
}

type EmployeeFormData = z.infer<typeof employeeSchema>

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: employees, isLoading, error, refetch } = useFetchEmployeesQuery()
  const [addEmployee, { isLoading: isAdding }] = useAddEmployeeMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  })

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      await addEmployee(data).unwrap()
      toast.success("Employee added successfully")
      setIsModalOpen(false)
      reset() // Reset form after successful submission
      refetch() // Refetch employees after adding
    } catch (error: any) {
      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        // Loop through and display each error message
        error.data.errors.forEach((err: { message: string }) => {
          toast.error(err.message)
        })
      } else {
        toast.error("Failed to add employee")
      }
      console.error("Error adding employee:", error)
    }
  }


  if (isLoading) return <p>Loading...</p>

  return (
    <div className="min-h-screen p-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-8">
          <Button
            className="bg-gradient-to-r rounded-full from-[rgba(61,162,41,1)] to-[rgba(36,120,20,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-3 w-full sm:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="border-[1px] border-white rounded-[5px]">
              <Plus className="text-white" />
            </div>
            <span className="text-white text-[16px]">Add Employee</span>
          </Button>
        </div>

        <div className="mb-8 teamMemeberBG">
          <div>
            {isLoading ? (
              <p>Loading employees...</p>
            ) : error ? (
              <p>Error fetching employees.</p>
            ) : employees?.data?.length === 0 ? (
              <p>No employees found.</p>
            ) : (
              employees?.data?.map((member: Employee) => <TeamMemberCard key={member._id} {...member} />)
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-[40px] p-6 w-[500px] shadow-lg">
            <h3 className="text-lg mb-4">Add Employee</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name                           <span className="text-red-500">*</span>

                </label>
                <input {...register("name")} className="w-full border p-2 rounded" placeholder="Enter name" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email                           <span className="text-red-500">*</span>

                </label>
                <input {...register("email")} className="w-full border p-2 rounded" placeholder="Enter email" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contact No                           <span className="text-red-500">*</span>

                </label>
                <input {...register("contactNo")} className="w-full border p-2 rounded" placeholder="Enter contact no" />
                {errors.contactNo && <p className="text-red-500 text-sm">{errors.contactNo.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Designation                           <span className="text-red-500">*</span>

                </label>
                <input {...register("designation")} className="w-full border p-2 rounded" placeholder="Enter designation" />
                {errors.designation && <p className="text-red-500 text-sm">{errors.designation.message}</p>}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" className="bg-gray-200 text-gray-700 rounded-[20px]" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-800 hover:to-green-600 text-white rounded-[20px] p-5" type="submit" disabled={isAdding}>
                  {isAdding ? (
                    <div className="h-5 w-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-white">                    {isAdding ? "Adding..." : "Add Employee"}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  )
}

