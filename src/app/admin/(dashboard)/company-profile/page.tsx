"use client"
import { Button } from "@/components/ui/button"
import { LocateFixed, Plus } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { useState } from "react"
import home from "@/assets/logo/home.png"
import WorklocationChart from "@/components/super-admin/WorklocationChart"
import { toast } from "sonner"
import { useCreateWorkplacesMutation, useFetchCountriesWithWorkplacesQuery } from "@/store/api/common/commonApi"
import { z } from "zod"
import { Spinner } from "@/components/ui/Spinner"

const workLocationSchema = z.object({
  country: z.string().min(1, "Country is required"),
  region: z.string().min(1, "Region is required"),
  worksites: z
    .array(z.string().min(1, "Each worksite must be a non-empty string"))
    .min(1, "At least one worksite is required"),
})

const Page = () => {
  const [isGettingLocation, setIsGettingLocation] = useState<Boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<{
    country: string
    region: string
    worksites: string[]
  }>({
    country: "",
    region: "",
    worksites: [],
  })

  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });
  const [address, setAddress] = useState<{
    city: string;
    state: string;
    country: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);


  const [worksiteInput, setWorksiteInput] = useState("")

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const { data, error: fetchError, isLoading: isFetchingCountries, refetch } = useFetchCountriesWithWorkplacesQuery()
  const [createWorkplaces, { isLoading, isError, error: createWorkplaceError }] = useCreateWorkplacesMutation()

  const validateForm = () => {
    try {
      workLocationSchema.parse(formData)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0]?.message // Get the first error message
        if (firstError) {
          toast.error(firstError) // Show only one toast
        }
      }
      return false
    }
  }

  const handleAddWorksite = () => {
    if (worksiteInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        worksites: [...prev.worksites, worksiteInput.trim()],
      }))
      setWorksiteInput("") // Clear input
    } else {
      toast.error("Worksite cannot be empty")
    }
  }

  const handleWorksiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorksiteInput(e.target.value)
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const response = await createWorkplaces({
        country: formData.country,
        region: formData.region,
        worksites: formData.worksites,
      }).unwrap()

      if (response.success) {
        toast.success(response.message || "Work location created successfully")
        setFormData({
          country: "",
          region: "",
          worksites: [],
        })
        closeModal()
        refetch()
      } else {
        toast.error("Failed to create work location")
      }
    } catch (err) {
      toast.error("Failed to create work location")
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation((prev) => !prev);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const { address } = data;
            setAddress({
              city: address.city || address.town || address.village,
              state: address.state,
              country: address.country,
            });
            setFormData({ ...formData, country: address.country, region: address.state })
            setError(null);
          } catch (err) {
            setError("Failed to fetch address.");
          }
          finally{
            setIsGettingLocation(false)
          }
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  if (isFetchingCountries) {
    return <div></div>
  }

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm mt-8 mx-4">
        <div className="p-6">
          {/* Company Header */}
          <div className="flex gap-2 mb-8">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Image height={100} width={100} src={home || "/placeholder.svg"} alt="Company logo" />
            </div>
            <div>
              <h1 className="text-[18px] font-medium">Company name</h1>
              <p className="text-[14px] text-gray-500">Company ID : FIRMD-273UY</p>
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-[14px] text-gray-500 mb-1">Location</h2>
              <p className="text-[18px] font-medium">114 Strand, London WC2R 0AG, United Kingdom</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-[14px] text-gray-500 mb-1">Type of business</h2>
                <p className="text-[18px] font-medium">Business 1</p>
              </div>
              <div>
                <h2 className="text-[14px] text-gray-500 mb-1">Emergency contact number</h2>
                <p className="text-[18px] font-medium">+21 4335 3432</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-[14px] text-gray-500 mb-1">Company mail ID</h2>
                <p className="text-[18px] font-medium">company@gmail.com</p>
              </div>
              <div>
                <h2 className="text-[14px] text-gray-500 mb-1">Contact number</h2>
                <p className="text-[18px] font-medium">+21 4335 3432</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl shadow-sm mt-2 mx-4">
        <div className="p-2 pb-0">
          <div className="flex flex-col sm:flex-row items-center bg-[rgba(247, 251, 246, 1)] justify-between mb-6 rounded-lg">
            <h2 className="text-lg font-medium text-[30px] mb-4 sm:mb-0">Work location</h2>
            <Button
              onClick={openModal}
              className="bg-gradient-to-r rounded-full from-[rgba(61,162,41,1)] to-[rgba(36,120,20,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-3 w-full sm:w-auto"
            >
              <div className="border-[1px] border-white rounded-[5px]">
                <Plus className="text-white" />
              </div>
              <span className="text-white text-[16px]">Add new</span>
            </Button>
          </div>
        </div>

        {data ? <WorklocationChart data={data} /> : <div>No work locations available</div>}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-[40px] p-6 w-[90%] max-w-[500px] shadow-lg">
            <h3 className="text-lg mb-4">Add new work location</h3>

            {/* Country Input */}
            <div className="mb-6">
              <label htmlFor="country" className="block text-sm font-normal mb-1">
                Country
              </label>
              <div className="flex items-center border p-2 rounded">
                <input
                  id="country"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full border-none outline-none"
                  placeholder="Enter Country"
                />

                {
                  isGettingLocation ?
                    (<Spinner size="sm" />)
                    :
                    (<LocateFixed className="text-gray-500 text-lg cursor-pointer" onClick={getLocation} />)
                }
              </div>
            </div>

            {/* Region Input */}
            <div className="mb-6">
              <label htmlFor="region" className="block text-sm font-normal mb-1">
                Region
              </label>
              <div className="flex items-center border p-2 rounded">
                <input
                  id="region"
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full border-none outline-none"
                  placeholder="Enter Region"
                />
                {
                  isGettingLocation ?
                    (<Spinner size="sm" />)
                    :
                    (<LocateFixed className="text-gray-500 text-lg cursor-pointer" onClick={getLocation} />)
                }
              </div>
            </div>

            {/* Worksite Input */}
            <div className="mb-6">
              <label htmlFor="worksite" className="block text-sm font-normal mb-1">
                Worksite
              </label>
              <div className="flex items-center">
                <div className="flex-grow border p-2 rounded">
                  <input
                    id="worksite"
                    type="text"
                    value={worksiteInput}
                    onChange={handleWorksiteChange}
                    className="w-full border-none outline-none"
                    placeholder="Enter Worksite"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddWorksite}
                  className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Add
                </Button>
              </div>
            </div>

            {formData.worksites.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Added Worksites:</p>
                <ul className="list-disc list-inside">
                  {formData.worksites.map((site, index) => (
                    <li key={index}>{site}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" className="bg-gray-200 text-gray-700 rounded-[20px]" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r rounded-[20px] from-[rgba(36,120,20,1)] to-[rgba(61,162,41,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-5 w-full sm:w-auto"
              >
                <span className="text-white">Add new</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page

