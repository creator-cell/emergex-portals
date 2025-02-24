import { useEffect, useRef, useState } from 'react'
import LineSvg from '@/assets/icons/LineSvg';

interface Worksite {
  _id: string
  name: string
}

interface Location {
  _id: string
  name: string
  worksites: Worksite[]
}

interface Country {
  _id: string
  name: string
  regions: Location[]
}

interface Position {
  x: number
  y: number
  width: number
  height: number
}

interface Connection {
  start: Position
  end: Position
}

// Define the expected structure of the data prop
interface WorkLocationChartProps {
  data: { data: Country[] }
}


export default function WorklocationChart({ data }:WorkLocationChartProps) {
  const [connections, setConnections] = useState<Connection[]>([])
  const elementsRef = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    const calculateConnections = () => {
      const newConnections: Connection[] = []

      // Static hard-coded connections (not used anymore)
      setConnections(newConnections)
    }

    // Recalculate on window resize
    window.addEventListener('resize', calculateConnections)
    return () => window.removeEventListener('resize', calculateConnections)
  }, [])

  const countries = data?.data || []; // Access the 'data' array inside the response object

  return (
    <div className="relative flex justify-between items-start w-full gap-8 mb-[2rem]">
      {/* Country column */}
      <div className="flex-1 mx-2 flex flex-col justify-start organizationChartBg items-start border border-gray-300 rounded-[20px] h-[26rem] p-6 overflow-y-auto">
        <h3 className="text-[16px] font-semibold mb-4 text-left">Country</h3>
        <div className="flex flex-col gap-4 items-start">
          {countries.map((country: Country) => (
            <div
              key={country._id}
              className="px-4 py-2 bg-white rounded-[20px] shadow-sm border workLocationBorder transition-shadow inline-block workLocationText text-left"
            >
              {country.name}
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Line between Country and Region */}
      <div className="absolute top-[120px] left-[50%] transform -translate-x-1/2">
        <div className="w-full h-0.5 bg-gray-400" />
      </div>

      {/* Region column */}
      <div className="flex-1 mx-2 flex flex-col justify-start organizationChartBg items-start border border-gray-300 rounded-[20px] h-[26rem] p-6 overflow-y-auto">
        <h3 className="text-[16px] font-semibold mb-4 text-left">Region</h3>
        <div className="flex flex-col gap-4 items-start">
          {countries.map((country: Country) =>
            country.regions.map((region, index) => (
              <div
                key={`${country._id}-${region._id}`}
                className="px-4 py-2 bg-white rounded-[20px] shadow-sm border workLocationText workLocationBorder transition-shadow inline-block text-left"
              >
                {region.name}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Horizontal Line between Region and Worksite */}
      <div className="absolute top-[240px] left-[50%] transform -translate-x-1/2">
        <div className="w-full h-0.5 bg-gray-400" />
      </div>

      {/* Worksite column */}
      <div className="flex-1 mx-2 flex flex-col justify-start organizationChartBg items-start border border-gray-300 rounded-[20px] h-[26rem] p-6 overflow-y-auto">
        <h3 className="text-[16px] font-semibold mb-4 text-left">Worksite</h3>
        <div className="flex flex-col gap-4 items-start">
          {countries.map((country: Country) =>
            country.regions.map((region) =>
              region.worksites.map((worksite) => (
                <div
                  key={`${region._id}-${worksite._id}`}
                  className="px-4 py-2 workLocationBg rounded-[20px]  border workLocationBorder hover:shadow-md transition-shadow inline-block text-left workLocationText"
                >
                  {worksite.name}
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  )
}
