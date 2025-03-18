"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  useCreateProjectMutation,
  useFetchCountriesQuery,
  useFetchRegionsByCountryQuery,
  useFetchWorksitesByRegionQuery,
  useFetchProjectByLocationQuery,
} from "@/store/api/common/commonApi"
import { toast, Toaster } from "sonner"
import { Label } from "recharts"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

interface Role {
  _id: string
  name: string
}

const schema = z.object({
  country: z.string().nonempty("Country is required"),
  region: z.string().nonempty("Region is required"),
  worksite: z.string().nonempty("Worksite is required"),
  name: z.string().nonempty("Emerge-x case name is required"),
  description: z
    .string()
    .min(25, "Description must be at least 25 characters long")
    .nonempty("Description is required"),
})

export default function Page() {
  const [step, setStep] = useState(1)
  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 2))
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1))

  const router = useRouter()

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedWorksite, setSelectedWorksite] = useState<string | null>(null)

  const { data: countriesData, isLoading: countriesLoading } = useFetchCountriesQuery()
  const { data: regionsData, isLoading: regionsLoading } = useFetchRegionsByCountryQuery(selectedCountry || "", {
    skip: !selectedCountry,
  })
  const { data: worksitesData, isLoading: worksitesLoading } = useFetchWorksitesByRegionQuery(selectedRegion || "", {
    skip: !selectedRegion,
  })
  const { data: projectsData, isLoading: projectsLoading } = useFetchProjectByLocationQuery(
    {
      country: selectedCountry || "",
      region: selectedRegion || "",
      worksite: selectedWorksite || "",
    },
    {
      skip: !selectedCountry || !selectedRegion || !selectedWorksite,
    },
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  })

  console.log("Form errors:", errors)

  const [createProject, { isLoading: isCreatingProject }] = useCreateProjectMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")

  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const onSubmit = async (data: any) => {
    console.log("onSubmit called")
    if (Object.keys(errors).length > 0) {
      console.log("Form has errors:", errors)
      return
    }
    const projectData = {
      description: data.description,
      country: data.country,
      worksite: data.worksite,
      region: data.region,
      parentProjectId: data.name,
    }

    try {
      const response = await createProject(projectData).unwrap()

      if (response.success) {
        toast.success(response.message || "Project created successfully")
        reset({
          description: "",
          country: "",
          worksite: "",
          region: "",
          name: "",
        })
        router.push("/")
      } else {
        toast.error(response.message || "Failed to create project")
      }
    } catch (err) {
      console.error("Error creating project:", err)
      if (err instanceof Error) {
        toast.error(err.message || "An unexpected error occurred. Please try again.")
      } else {
        toast.error("An unexpected error occurred. Please try again.")
      }
    }
  }
  const handleAddExistingProject = async () => {
    if (!newProjectName || !newProjectDescription) {
      toast.error("Please provide both name and description for the project.")
      return
    }

    if (newProjectDescription.length < 25) {
      toast.error("Description must be at least 25 characters long.")
      return
    }

    const projectData = {
      name: newProjectName,
      description: newProjectDescription,
      country: control._getWatch("country"),
      region: control._getWatch("region"),
      worksite: control._getWatch("worksite"),
    }

    try {
      const response = await createProject(projectData).unwrap()

      if (response.success) {
        toast.success(response.message || "Existing project added successfully")
        setIsModalOpen(false)
        setNewProjectName("")
        setNewProjectDescription("")
        router.push("/")
      } else {
        toast.error(response.message || "Failed to add existing project")
      }
    } catch (err) {
      console.error("Error adding existing project:", err)
      toast.error(
        err instanceof Error
          ? err.message || "An unexpected error occurred. Please try again."
          : "An unexpected error occurred. Please try again.",
      )
    }
  }

  if (countriesLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="min-h-screen bg-custom-gradient">
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-md mb-8">Create new Project</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-green-100">
              <div className="absolute left-0 top-0 w-[2px] h-full bg-green-500" />
            </div>

            {step >= 1 && (
              <div className="relative mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-4 h-4 rounded-full bg-green-500 relative z-10" />
                  <span className="font-medium text-sm">STEP 1</span>
                </div>
                <Card className="ml-8 p-6 space-y-6 rounded-[20px] shadow-none border-none">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              setSelectedCountry(value)
                              setValue("region", "")
                              setValue("worksite", "")
                              setSelectedRegion(null)
                              setSelectedWorksite(null)
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countriesData?.data.map((country) => (
                                <SelectItem key={country._id} value={country._id}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.country && <p className="text-red-500 text-sm mt-1">{String(errors.country.message)}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Region</Label>
                      <Controller
                        name="region"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              setSelectedRegion(value)
                              setValue("worksite", "")
                              setSelectedWorksite(null)
                            }}
                            value={field.value}
                            disabled={!selectedCountry || regionsLoading}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              {regionsData?.data.map((region) => (
                                <SelectItem key={region._id} value={region._id}>
                                  {region.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.region && <p className="text-red-500 text-sm mt-1">{String(errors.region.message)}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Worksite</Label>
                    <Controller
                      name="worksite"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedWorksite(value)
                          }}
                          value={field.value}
                          disabled={!selectedRegion || worksitesLoading}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select worksite" />
                          </SelectTrigger>
                          <SelectContent>
                            {worksitesData?.data.map((worksite) => (
                              <SelectItem key={worksite._id} value={worksite._id}>
                                {worksite.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.worksite && <p className="text-red-500 text-sm mt-1">{String(errors.worksite.message)}</p>}
                  </div>
                </Card>
              </div>
            )}

            {step >= 2 && (
              <div className="relative mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-4 h-4 rounded-full bg-green-500 relative z-10" />
                  <span className="font-medium text-sm">STEP 2</span>
                </div>
                <Card className="ml-8 p-6 space-y-6 rounded-[20px] shadow-none border-none">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-sm text-gray-600">
                        Project
                      </label>
                      <div className="flex items-center gap-4">
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={(value) => {
                                setSelectedProject(value)
                                const selectedProject = projectsData?.data?.find((project) => project._id === value)
                                field.onChange(value)
                                if (selectedProject) {
                                  setValue("description", selectedProject.description)
                                }
                              }}
                              value={field.value}
                              disabled={!selectedWorksite || projectsLoading}
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select project">
                                  {projectsData?.data?.find((project) => project._id === field.value)?.name ||
                                    "Select project"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {projectsData?.data?.map((project) => (
                                  <SelectItem key={project._id} value={project._id}>
                                    {project.name} - {project.id}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{String(errors.name.message)}</p>}
                        {selectedProject && (
                          <Button
                            variant="outline"
                            className="h-12 flex items-center"
                            onClick={() => {
                              setSelectedProject(null)
                              setValue("name", "")
                              setValue("description", "")
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
                      disabled={!!selectedProject}
                      className="border-[1px] border-[#3DA229] mt-8 text-green-500 h-12"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Add New
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Description <span className="text-red-500">*</span></label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea {...field} placeholder="Enter the description" className="min-h-[100px] h-12" />
                      )}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{String(errors.description.message)}</p>}
                  </div>
                </Card>
              </div>
            )}
          </div>

          <div className="flex justify-between gap-4 mt-8">
            <Button className="bg-gradient-to-r from-[#4D514C] to-[#232A21]" onClick={prevStep} disabled={step === 1}>
              Previous
            </Button>
            {step === 2 ? (
              <div className="flex gap-4">
                <Button
                  type="button"
                  className="bg-gradient-to-r from-[#4D514C] to-[#232A21] hover:bg-gradient-to-l flex items-center space-x-1 p-5 w-full sm:w-auto"
                >
                  <span className="text-white">Cancel</span>
                </Button>
                <Button
                  disabled={isCreatingProject}
                  type="submit"
                  className="bg-gradient-to-r from-[rgba(36,120,20,1)] to-[rgba(61,162,41,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-5 w-full sm:w-auto"
                  onClick={() => {
                    if (Object.keys(errors).length > 0) {
                      console.log("Form has errors:", errors)
                      toast.error("Please fill in all required fields correctly.")
                    }
                  }}
                >
                  {isCreatingProject ? (
                    <div className="h-5 w-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-white">Add Project</span>
                  )}

                </Button>
              </div>
            ) : (
              <Button className="bg-gradient-to-r from-[#3DA229] to-[#247814]" onClick={nextStep} disabled={step === 2}>
                Next
              </Button>
            )}
          </div>
        </form>
        <Toaster/>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-[20px] p-6 w-[500px] shadow-lg">
              <h3 className="text-lg mb-4">Add New Project</h3>

              <div className="mb-6">
                <label className="block text-sm font-normal mb-1">Name           <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border p-2 rounded">
                  <input
                    type="text"
                    className="w-full border-none outline-none"
                    placeholder="Enter Project Name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-normal mb-1">Description           <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border p-2 rounded">
                  <textarea
                    className="w-full border-none outline-none"
                    placeholder="Enter Project Description"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" className="bg-gray-200 text-gray-700" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r rounded-full from-[rgba(36,120,20,1)] to-[rgba(61,162,41,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-5 w-full sm:w-auto"
                  onClick={handleAddExistingProject}
                  disabled={isCreatingProject}
                >

                  {isCreatingProject ? (
                    <div className="h-5 w-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-white">Add New Project</span>
                  )}

                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

