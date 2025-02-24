"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  useFetchCountriesQuery, 
  useFetchRegionsByCountryQuery, 
  useFetchWorksitesByRegionQuery,
  useCreateAnnouncementMutation 
} from "@/store/api/common/commonApi"
import { useFetchTeamsQuery } from "@/store/api/team/teamApi"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useState } from "react"

// Define the Zod schema for form validation
const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  worksite: z
    .string()
    .min(1, "Worksite is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid worksite ID"),
  region: z
    .string()
    .min(1, "Region is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid region ID"),
  country: z
    .string()
    .min(1, "Country is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid country ID"),
  team: z
    .string()
    .min(1, "Team is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid team ID"),
})

type AnnouncementFormData = z.infer<typeof announcementSchema>

export default function AnnouncementForm() {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")

  const { data: countriesData, isLoading: countriesLoading } = useFetchCountriesQuery()
  const { data: regionsData, isLoading: regionsLoading } = useFetchRegionsByCountryQuery(selectedCountry, {
    skip: !selectedCountry,
  })
  const { data: worksitesData, isLoading: worksitesLoading } = useFetchWorksitesByRegionQuery(selectedRegion, {
    skip: !selectedRegion,
  })
  const { data: teamsData, isLoading: teamsLoading } = useFetchTeamsQuery()

  const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
  })

  if (countriesLoading || teamsLoading) {
    return <div>Loading...</div>
  }

  const onSubmit = async (data: AnnouncementFormData) => {
    try {
      const validatedData = announcementSchema.parse(data)
      const response = await createAnnouncement(validatedData).unwrap()

      if (response.success) {
        toast.success(response.message || "Announcement created successfully")
        reset({
          title: "",
          description: "",
          country: "",
          region: "",
          worksite: "",
          team: "",
        })
        setSelectedCountry("")
        setSelectedRegion("")
      } else {
        toast.error("Failed to create announcement")
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((error) => {
          toast.error(`${error.path.join(".")}: ${error.message}`)
        })
      } else {
        toast.error("Failed to create announcement")
      }
    }
  }

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value)
    setValue("country", value)
    setValue("region", "") // Reset region when country changes
    setValue("worksite", "") // Reset worksite when country changes
    setSelectedRegion("") // Reset selected region state
  }

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setValue("region", value)
    setValue("worksite", "") // Reset worksite when region changes
  }

  return (
    <div className="min-h-screen bg-[#f0f6f0] p-4 flex items-center justify-center flex-col loginFormBg">
      <div className="w-[90%] space-y-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="rounded-[40px] shadow-none border-none">
            <CardContent className="p-6 space-y-8">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Add Title"
                  className="h-12 border-none text-lg placeholder:text-xl"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter the description"
                  className="min-h-[200px] resize-none"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[40px] shadow-none border-none mt-8">
            <CardContent className="p-6 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={handleCountryChange} value={field.value}>
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
                  {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Region</Label>
                  <Controller
                    name="region"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        onValueChange={handleRegionChange} 
                        value={field.value}
                        disabled={!selectedCountry || regionsLoading}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder={!selectedCountry ? "Select country first" : regionsLoading ? "Loading..." : "Select region"} />
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
                  {errors.region && <p className="text-red-500 text-sm">{errors.region.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Worksite</Label>
                  <Controller
                    name="worksite"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!selectedRegion || worksitesLoading}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder={!selectedCountry ? "Select country first" : !selectedRegion ? "Select region first" : worksitesLoading ? "Loading..." : "Select worksite"} />
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
                  {errors.worksite && <p className="text-red-500 text-sm">{errors.worksite.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Team</Label>
                  <Controller
                    name="team"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamsData?.data.map((team) => (
                            <SelectItem key={team._id} value={team._id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.team && <p className="text-red-500 text-sm">{errors.team.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center sm:justify-end mt-8">
            <Button
              type="submit"
              className="w-[10rem] rounded-full bg-green-600 hover:bg-green-700 text-white h-12"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Announce"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}