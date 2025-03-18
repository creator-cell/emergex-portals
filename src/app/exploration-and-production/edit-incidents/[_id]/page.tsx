"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { EditPenicon, ImageIcon } from "@/assets/icons/SvgIcons"
import { Input } from "@/components/ui/input"
import { IoMdClose } from "react-icons/io"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import Label from "@/components/common/Label"
import { useRouter } from "next/navigation"
import {
  useFetchProjectByIdQuery,
  useFetchIncidentByIncidentIdQuery,
  useUpdateIncidentMutation,
} from "@/store/api/common/commonApi"
import { useFetchEmployeesQuery } from "@/store/api/team/teamApi"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { compressImage } from "@/components/ImageCompression"

interface FormData extends z.infer<typeof FormSchema> { }

// Zod Validation Schema
const FormSchema = z.object({
  status: z.string().min(1, "Status is required"),
  level: z.enum(["Level 1", "Level 2", "Level 3"], {
    errorMap: () => ({
      message: "Level must be one of 'Level 1', 'Level 2', 'Level 3'",
    }),
  }),
  id: z.string().min(3, "Id is required"),
  description: z.string().min(1, "Description is required"),
  assignedTo: z.string().min(1, "Assigned to is required"),
  countOfInjuredPeople: z.string().min(1, "Count of injured people is required"),
  countOfTotalPeople: z.string().min(1, "Count of total people is required"),
  location: z.string().min(1, "Location is required"),
  damageAssets: z.array(z.string()).min(1, "At least one utility must be selected"),
  finance: z.string().min(1, "Finance is required"),
  utilityAffected: z.array(z.string()).min(1, "At least one utility must be selected"),
  informToTeam: z.boolean().default(false),
  termsAndConditions: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms and Conditions",
  }),
  image: z.any(),
  signature: z.any().refine((val) => val != null, {
    message: "Digital signature is required",
  }),
  images: z.array(z.any()).min(1, "At least one image is required"),
  type: z.string().min(1, "Type is required"),
  audio: z.any(),
  projectId: z.string().min(1, "Project Id is required"),
})

const utilityeffected = [{ title: "Water" }, { title: "Electricity" }, { title: "Swage" }]

const Page = ({ params }: { params: { _id: string } }) => {
  const incidentId = params._id

  const [selectedLocation, setSelectedLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null)

  const inputFileRef = useRef<HTMLInputElement | null>(null)

  const {
    data: incidentData,
    isLoading: incidentLoading,
    refetch,
  } = useFetchIncidentByIncidentIdQuery(incidentId ?? "", { refetchOnMountOrArgChange: true })

  const [projectId, setProjectId] = useState<string | null>(null);


  useEffect(() => {
    if (incidentData?.data?.project?._id) {
      setProjectId(incidentData.data.project._id);
    }
  }, [incidentData]);

  const {
    data: projectData,
    isLoading: projectLoading,
    refetch: refetchProject,
  } = useFetchProjectByIdQuery(projectId ?? "", {
    skip: !projectId,
  });

  const { data: employees } = useFetchEmployeesQuery()
  const [updateIncident] = useUpdateIncidentMutation()

  const router = useRouter()

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: "",
      level: "Level 1",
      id: "",
      type: "",
      description: "",
      utilityAffected: [],
      informToTeam: false,
      termsAndConditions: false,
      projectId: projectId,
      images: [],
    },
  })

  const image = watch("image")
  const signature = watch("signature")
  const imagesArray = watch("images")

  const [images, setImages] = useState<File[]>([])

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Convert URL to base64
  const urlToBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error("Error converting URL to base64:", error)
      return url // Return original URL if conversion fails
    }
  }

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index)
      // Update the base64 images array in the form state
      const currentBase64Images = watch("images") || []
      const updatedBase64Images = currentBase64Images.filter((_, i) => i !== index)
      setValue("images", updatedBase64Images)
      return updatedImages
    })
  }

  // Handle file change for images and signature
  const handleFileChange = useCallback(
    async (files: FileList | null, fieldName: "images" | "signature") => {
      if (!files || files.length === 0) return

      try {
        if (fieldName === "images") {
          // Get current images array
          const currentImages = watch("images") || []

          // Check total number of images including existing ones
          if (currentImages.length + files.length > 5) {
            toast.error("Maximum 5 images allowed")
            return
          }

          const newImages: File[] = []
          const newBase64Images: string[] = []

          // Process each file
          for (let i = 0; i < files.length; i++) {
            const file = files[i]

            // Validate file type
            if (!file.type.startsWith("image/")) {
              toast.error(`${file.name} is not an image file`)
              continue
            }

            // Validate file size (5MB before compression)
            if (file.size > 5 * 1024 * 1024) {
              toast.error(`${file.name} is too large (max 5MB)`)
              continue
            }

            try {
              // Compress image
              const compressedFile = await compressImage(file)
              newImages.push(file)

              // Convert to base64
              const base64 = await fileToBase64(compressedFile)
              newBase64Images.push(base64)
            } catch (error) {
              console.error("Error processing image:", error)
              toast.error(`Failed to process ${file.name}`)
            }
          }

          if (newImages.length > 0) {
            // Update form state with combined base64 images
            const updatedBase64Images = [...currentImages, ...newBase64Images]
            setValue("images", updatedBase64Images)

            // Update UI state
            setImages((prev) => [...prev, ...newImages])
            toast.success("Images uploaded successfully")
          }
        } else {
          // Handle signature upload
          const file = files[0]

          if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file for signature")
            return
          }

          if (file.size > 2 * 1024 * 1024) {
            toast.error("Signature image is too large (max 2MB)")
            return
          }

          try {
            const compressedFile = await compressImage(file)
            const base64Signature = await fileToBase64(compressedFile)
            setValue(fieldName, base64Signature)
            setSignatureUrl(null) // Clear existing signature URL
            toast.success("Signature uploaded successfully")
          } catch (error) {
            console.error("Error processing signature:", error)
            toast.error("Failed to process signature image")
          }
        }
      } catch (error) {
        console.error("Error handling file upload:", error)
        toast.error("An error occurred while uploading files")
      }
    },
    [setValue, watch],
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, fieldName: "images" | "signature") => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files, fieldName)
    }
  }

  const handleParentDivClick = () => {
    // Trigger the input file click event
    inputFileRef.current?.click()
  }

  // Load incident data when available
  useEffect(() => {
    if (incidentData?.data && !incidentLoading) {
      const incident = incidentData.data

      // Set form values
      setValue("id", incident.id)
      setValue("level", incident.level)
      setValue("type", incident.type)
      setValue("description", incident.description)
      setValue("status", incident.status)
      setValue("assignedTo", incident.assignedTo._id)
      setValue("countOfInjuredPeople", incident.countOfInjuredPeople.toString())
      setValue("countOfTotalPeople", incident.countOfTotalPeople.toString())
      setValue("location", incident.location)

      setValue("damageAssets", Array.isArray(incident.damageAssets) ? incident.damageAssets : [incident.damageAssets])

      setValue("finance", incident.finance.toString())
      setValue("utilityAffected", incident.utilityAffected)
      setValue("informToTeam", incident.informToTeam)
      setValue("termsAndConditions", incident.termsAndConditions)
      setValue("projectId", projectId)

      // Handle existing images
      if (incident.image && incident.image.length > 0) {
        setExistingImages(incident.image)

        // Convert URLs to base64 and set in form
        const loadImages = async () => {
          try {
            const base64Images = await Promise.all(incident.image.map((url: string) => urlToBase64(url)))
            setValue("images", base64Images)
          } catch (error) {
            console.error("Error loading images:", error)
          }
        }

        loadImages()
      }

      // Handle signature
      if (incident.signature) {
        setSignatureUrl(incident.signature)

        // Convert signature URL to base64
        const loadSignature = async () => {
          try {
            const base64Signature = await urlToBase64(incident.signature)
            setValue("signature", base64Signature)
          } catch (error) {
            console.error("Error loading signature:", error)
          }
        }

        loadSignature()
      }
    }
  }, [incidentData, incidentLoading, setValue, projectId])

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true)
    try {
      const payload = {
        id: incidentId,
        utilityAffected: data.utilityAffected,
        projectId: params._id,
        termsAndConditions: data.termsAndConditions,
        informToTeam: data.informToTeam,
        finance: Number(data.finance),
        damageAssets: data.damageAssets,
        description: data.description,
        assignedTo: data.assignedTo,
        countOfInjuredPeople: Number(data.countOfInjuredPeople),
        countOfTotalPeople: Number(data.countOfTotalPeople),
        location: data.location,
        level: data.level,
        images: data.images,
        signature: data.signature,
        status: data.status,
        type: data.type,
      }

      const response = await updateIncident({ incidentId, ...payload }).unwrap()
      if (response.success) {
        toast.success(response.message || "Incident updated successfully!")
        router.push(`/exploration-and-production/incidents/${projectId}`)
      } else {
        toast.error(response.message || "Failed to update incident.")
      }
    } catch (error) {
      console.error("Error updating incident:", error)
      toast.error("An error occurred while updating the incident.")
    } finally {
      setLoading(false)
    }
  }

  const project = projectData?.data

  if (projectLoading || incidentLoading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center bg-transparent p-6 rounded-lg">
        <div className="flex flex-col">
          <span className="text-[14px] colorBGSubHeading">Project name</span>
          <h1 className="text-[20px] font-medium leading-none">{project?.name || "N/A"}</h1>
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] colorBGSubHeading">Worksite</span>
          <span className="text-[16px] font-semibold"> {project?.location?.worksite?.name || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] colorBGSubHeading">Country</span>
          <span className="text-[16px] font-semibold">{project?.location?.country?.name || "N/A"}</span>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border rounded-[15px] w-full px-[32px] py-[40px] md:rounded-[40px] space-y-10 bg-white"
      >
        <div className="border-b-2 border-[#D9D9D9] pb-4">
          <div>
            <h2 className="text-darkish text-xl font-medium">{project?.name || "N/A"}</h2>
            <p className="text-[#B3B3B3] text-sm">{watch("id") || "N/A"}</p>
          </div>
          <div className="flex justify-between mt-2">
            <div className="w-[85%] sm:w-[75%] md:w-[50%]">
              <p className="text-base text-[#434343]">{watch("description") || ""}</p>
            </div>
            <div>
              <button type="button" className="rounded-full border p-3">
                <EditPenicon />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label text="Level" />
          <span className="text-red-500">*</span>

          <div>
            <div className="flex flex-wrap gap-2 md:gap-4 text-darkish">
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <>
                    {["Level 1", "Level 2", "Level 3"].map((level) => (
                      <label key={level} className="cursor-pointer">
                        <input
                          type="radio"
                          {...field}
                          value={level}
                          className="hidden"
                          checked={field.value === level}
                          onChange={() => field.onChange(level)}
                        />
                        <div
                          className={`py-1.5 px-3 md:px-4 rounded-md text-sm sm:text-base font-medium border ${field.value === level
                            ? "bg-light-greento-white border-transparent"
                            : "bg-white hover:bg-green-50 border-[#D9D9D9]"
                            }`}
                        >
                          {level}
                        </div>
                      </label>
                    ))}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label text="Status" />
          <span className="text-red-500">*</span>
          <div className="flex flex-wrap gap-2 md:gap-4 text-darkish">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <>
                  <label className="cursor-pointer">
                    <input type="radio" {...field} value="In Progress" className="hidden" />
                    <div
                      className={`py-1.5 px-3 md:px-4 rounded-md text-sm sm:text-base font-medium border border-[#D9D9D9] ${field.value === "In Progress"
                        ? "bg-green-50 border border-customGreen shadow-md"
                        : "bg-white hover:bg-green-50 border border-[#D9D9D9]"
                        }`}
                    >
                      In Progress
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" {...field} value="Assigned" className="hidden" />
                    <div
                      className={`py-1.5 px-3 md:px-4 rounded-md text-sm sm:text-base font-medium border border-[#D9D9D9] ${field.value === "Assigned"
                        ? "bg-green-50 border border-customGreen shadow-md"
                        : "bg-white hover:bg-green-50 border border-[#D9D9D9]"
                        }`}
                    >
                      Assigned
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" {...field} value="Delayed" className="hidden" />
                    <div
                      className={`py-1.5 px-3 md:px-4 rounded-md text-sm sm:text-base font-medium border border-[#D9D9D9] ${field.value === "Delayed"
                        ? "bg-green-50 border border-customGreen shadow-md"
                        : "bg-white hover:bg-green-50 border border-[#D9D9D9]"
                        }`}
                    >
                      Delayed
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" {...field} value="Completed" className="hidden" />
                    <div
                      className={`py-1.5 px-3 md:px-4 rounded-md text-sm sm:text-base font-medium border border-[#D9D9D9] ${field.value === "Completed"
                        ? "bg-green-50 border border-customGreen shadow-md"
                        : "bg-white hover:bg-green-50 border border-[#D9D9D9]"
                        }`}
                    >
                      Completed
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" {...field} value="Cancelled" className="hidden" />
                    <div
                      className={`py-1.5 px-3 md:px-4 rounded-md text-sm sm:text-base font-medium border border-[#D9D9D9] ${field.value === "Cancelled"
                        ? "bg-green-50 border border-customGreen shadow-md"
                        : "bg-white hover:bg-green-50 border border-[#D9D9D9]"
                        }`}
                    >
                      Cancelled
                    </div>
                  </label>
                </>
              )}
            />
          </div>
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>

        <div className="space-y-2">
          <Label text="Type" htmlFor="type" />
          <span className="text-red-500">*</span>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                id="type"
                readOnly
                className="outline-none h-12 bg-gray-100 cursor-not-allowed"
              />
            )}
          />
          {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label text="Description" htmlFor="description" />
          <span className="text-red-500">*</span>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                id="description"
                placeholder="Enter description"
                className="outline-none h-12"
              />
            )}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label text="Assigned to" htmlFor="Damageassets" />
          <span className="text-red-500">*</span>

          <div>
            <Controller
              name="assignedTo"
              control={control}
              render={({ field }) => (
                <Select {...field} onValueChange={(value) => field.onChange(value)}>
                  <SelectTrigger className="outline-none h-12">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.data?.map((employee) => (
                      <SelectItem key={employee._id} value={employee._id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {errors.assignedTo && <p className="text-red-500 text-sm">{errors.assignedTo.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label text="Count of injured people" htmlFor="countinjuredPeople" />
            <span className="text-red-500">*</span>

            <div>
              <Controller
                name="countOfInjuredPeople"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    id="countinjuredPeople"
                    placeholder="Injured people"
                    className="outline-none h-12"
                  />
                )}
              />
              {errors.countOfInjuredPeople && (
                <p className="text-red-500 text-sm">{errors.countOfInjuredPeople.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label text="Count of total people" htmlFor="counttotalPeople" />
            <span className="text-red-500">*</span>
            <div>
              <Controller
                name="countOfTotalPeople"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    id="counttotalPeople"
                    placeholder="Total count"
                    className="outline-none h-12"
                  />
                )}
              />
            </div>
            {errors.countOfTotalPeople && <p className="text-red-500 text-sm">{errors.countOfTotalPeople.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label text="Location" htmlFor="location" />
          <span className="text-red-500">*</span>

          <div>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input {...field} type="text" id="location" placeholder="Location" className="outline-none h-12" />
              )}
            />
          </div>
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <Label text="Damage assets" htmlFor="Damageassets" />
          <span className="text-red-500">*</span>

          <div>
            <Controller
              name="damageAssets"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <div className="space-y-2">
                  {/* Display selected assets as tags */}
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((asset: string) => (
                        <div
                          key={asset}
                          className="bg-green-50 border border-customGreen rounded-md px-2 py-1 flex items-center gap-1"
                        >
                          <span>{asset}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedValue = field.value.filter((val: string) => val !== asset)
                              field.onChange(updatedValue)
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <IoMdClose size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dropdown for selecting assets */}
                  <Select
                    onValueChange={(value) => {
                      if (!field.value.includes(value)) {
                        field.onChange([...field.value, value])
                      }
                    }}
                  >
                    <SelectTrigger className="outline-none h-12">
                      <SelectValue placeholder="Add assets" />
                    </SelectTrigger>
                    <SelectContent>
                      {["assets 1", "assets 2", "assets 3"].map((asset) => (
                        <SelectItem key={asset} value={asset} disabled={field.value.includes(asset)}>
                          {asset}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
          {errors.damageAssets && <p className="text-red-500 text-sm">{errors.damageAssets.message}</p>}
        </div>

        <div className="space-y-2">
          <Label text="Finance" htmlFor="Finance" />
          <span className="text-red-500">*</span>

          <div>
            <Controller
              name="finance"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  id="Finance"
                  placeholder="Calculate estimate for asset damage"
                  className="outline-none h-12"
                />
              )}
            />
          </div>
          {errors.finance && <p className="text-red-500 text-sm">{errors.finance.message}</p>}
        </div>

        <div className="space-y-2">
          <Label text="Utility effected" />
          <span className="text-red-500">*</span>

          <div>
            <div className="flex flex-wrap gap-2 md:gap-4 text-darkish">
              <Controller
                name="utilityAffected"
                control={control}
                defaultValue={[]}
                rules={{ required: "At least one utility must be selected" }}
                render={({ field }) => (
                  <>
                    {utilityeffected?.map((e, i) => (
                      <label
                        key={i}
                        htmlFor={e.title}
                        className={`cursor-pointer border rounded-lg px-3 py-2 flex items-center gap-2 ${field.value.includes(e.title) ? "border-customGreen" : "border-[#D9D9D9]"
                          } `}
                      >
                        <Checkbox
                          id={e.title}
                          checked={field.value.includes(e.title)}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...field.value, e.title]
                              : field.value.filter((val: string) => val !== e.title)
                            field.onChange(updatedValue)
                          }}
                          className="border-none data-[state=checked]:bg-custom-linear bg-[#E6E6E6] data-[state=checked]:text-white text-[#232323]"
                        />
                        <span>{e.title}</span>
                      </label>
                    ))}
                  </>
                )}
              />
            </div>
          </div>
          {errors.utilityAffected && <p className="text-red-500 text-sm">{errors.utilityAffected.message}</p>}
        </div>

        <div className="space-y-2">
          <Label text="Upload images (Max 5)" />
          <span className="text-red-500">*</span>

          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "images")}
            className="w-full border-2 border-dashed rounded-md p-4 mt-4 flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <input
              type="file"
              id="uploadImages"
              className="hidden"
              ref={inputFileRef}
              onChange={(e) => handleFileChange(e.target.files, "images")}
              multiple
              accept="image/*"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full">
              {existingImages.map((imageUrl, index) => (
                <div key={`existing-${index}`} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setExistingImages((prev) => prev.filter((_, i) => i !== index))
                      const currentImages = watch("images") || []
                      setValue(
                        "images",
                        currentImages.filter((_, i) => i !== index),
                      )
                    }}
                    className="absolute top-1 right-1 text-xl text-red-600 bg-white rounded-full p-1"
                  >
                    <IoMdClose />
                  </button>
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Existing Image ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover rounded-md w-full h-24"
                  />
                </div>
              ))}
              {images.map((image, index) => (
                <div key={`new-${index}`} className="relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 text-xl text-red-600 bg-white rounded-full p-1"
                  >
                    <IoMdClose />
                  </button>
                  <Image
                    src={URL.createObjectURL(image) || "/placeholder.svg"}
                    alt={`Uploaded Preview ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover rounded-md w-full h-24"
                  />
                </div>
              ))}
              {existingImages.length + images.length < 5 && (
                <div
                  onClick={handleParentDivClick}
                  className="border-2 border-dashed rounded-md flex flex-col items-center justify-center p-4 h-24 cursor-pointer"
                >
                  <ImageIcon />
                  <p className="text-sm mt-2">Add Image</p>
                </div>
              )}
            </div>
            {existingImages.length === 0 && images.length === 0 && (
              <div onClick={handleParentDivClick} className="w-full py-8">
                <div className="flex flex-col items-center gap-1">
                  <Image src="/images/imagePng.png" width={40} height={40} alt="imagepng" />
                  <p className="text-[#5A5A5A] text-sm">
                    Drop your images here or <span className="text-[#3979FA] font-semibold">Browse</span>
                  </p>
                  <p className="text-[#B3B3B3]">Supports: jpeg, png (Max 5 images)</p>
                </div>
              </div>
            )}
          </div>
          {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
        </div>

        {/* Signature Upload */}
        <div className="space-y-2">
          <Label text="Digital signature" />
          <span className="text-red-500">*</span>
          <div>
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "signature")}
              className="w-full border-2 border-dashed rounded-md p-4 mt-4 flex flex-col items-center justify-center text-center cursor-pointer"
              onClick={() => document.getElementById("signatureUpload")?.click()}
            >
              <input
                type="file"
                id="signatureUpload"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files, "signature")}
                accept="image/*"
              />
              {signature || signatureUrl ? (
                <div className="relative w-full max-w-[250px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setValue("signature", null)
                      setSignatureUrl(null)
                    }}
                    className="absolute top-1 right-1 text-xl text-red-600 bg-white rounded-full p-1"
                  >
                    <IoMdClose />
                  </button>
                  <Image
                    src={signatureUrl || signature}
                    alt="Signature Preview"
                    width={250}
                    height={100}
                    className="object-contain rounded-md"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <ImageIcon />
                  <p className="text-[#5A5A5A] text-sm">
                    Drop your signature image here or <span className="text-[#3979FA] font-semibold">Browse</span>
                  </p>
                  <p className="text-[#B3B3B3]">Supports: jpeg, png</p>
                </div>
              )}
            </div>
          </div>
          {errors.signature && <p className="text-red-500 text-sm">{String(errors.signature.message)}</p>}
        </div>

        <div className="space-y-4">
          <div className="text-darkish">
            <Controller
              name="informToTeam"
              control={control}
              render={({ field }) => (
                <label htmlFor="informtoHRteam" className="cursor-pointer rounded-lg px-3 py-2 flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="informtoHRteam"
                    className="border-none data-[state=checked]:bg-custom-linear bg-[#E6E6E6] data-[state=checked]:text-white text-[#232323]"
                  />
                  <span>Inform to HR team</span>
                </label>
              )}
            />
            {errors.informToTeam && <p className="text-red-500 text-sm">{errors.informToTeam.message}</p>}
          </div>
          <div className="text-darkish">
            <Controller
              name="termsAndConditions"
              control={control}
              render={({ field }) => (
                <label
                  htmlFor="agreeTermsConditionPrimaryPolicy"
                  className="cursor-pointer rounded-lg px-3 py-2 flex items-center gap-2"
                >
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="agreeTermsConditionPrimaryPolicy"
                    className="border-none data-[state=checked]:bg-custom-linear bg-[#E6E6E6] data-[state=checked]:text-white text-[#232323]"
                  />
                  <span>I agree to the Terms and conditions and Primary policy</span>
                </label>
              )}
            />
            {errors.termsAndConditions && (
              <p className="text-red-500 text-sm mt-1">{errors.termsAndConditions.message}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 justify-end mt-8">
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 hover:bg-gradient-to-l flex items-center space-x-1 p-6 w-full sm:w-auto"
          >
            <span className="text-black text-[16px]">Cancel</span>
          </Button>
          <Button
            disabled={loading}
            type="submit"
            className="bg-gradient-to-r rounded-[5px] from-[rgba(61,162,41,1)] to-[rgba(36,120,20,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-6 w-full sm:w-auto"
          >
            {loading ? (
              <div className="h-5 w-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-white">Update Incident</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Page