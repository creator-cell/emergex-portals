import { LogoutIcon } from '@/assets/icons/SvgIcons'
import BackButton from '@/components/admin/BackButton'
import React from 'react'

const page = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 bg-transparent mt-4">
        <div className="flex items-center gap-6">
          <BackButton />

          <div>
            <h1 className="text-[20px] font-medium leading-none">Root cause</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-medium timerCOlor">23:05:283</div>

          <div className="logoutIconBG p-[8px] rounded-[10px] mr-4">
            <LogoutIcon />
          </div>
        </div>
      </div>
      <div className=" min-h-screen space-y-4">
    
      <section className="bg-white/80 backdrop-blur-sm rounded-[20px] p-6 shadow-sm">
        <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Human Factors</h2>
        <ul className="space-y-3">
          <li className="flex gap-2">
            <span className="text-emerald-700">♦</span>
            <div>
              <span className="font-medium">Lack of Training:</span>
              <span className="text-black-600 text-[16px]"> Inadequate training or lack of knowledge/skills among personnel.</span>
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-700">♦</span>
            <div>
              <span className="font-medium">Communication Issues:</span>
              <span className="text-black-600 text-[16px]"> Poor communication between teams, lack of clear command structure, or communication equipment failures.</span>
            </div>
          </li>
        </ul>
      </section>

      <section className="bg-white/80 backdrop-blur-sm rounded-[20px] p-6 shadow-sm">
        <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Equipment and Resource Issues</h2>
        <ul className="space-y-3">
          <li className="flex gap-2">
            <span className="text-emerald-700">♦</span>
            <div>
              <span className="font-medium text-[16px]">Equipment Malfunctions:</span>
              <span className="text-balck-600 text-[16px]"> Failures of snow removal equipment (plows, snow blowers), communication devices, or other critical equipment.</span>
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-700">♦</span>
            <div>
              <span className="font-medium text-[16px]">Insufficient Resources:</span>
              <span className="text-black-600 text-[16px]"> Lack of adequate personnel, equipment, or supplies to effectively respond to the emergency.</span>
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-700">♦</span>
            <div>
              <span className="font-medium text-[16px]">Poorly Maintained Equipment:</span>
              <span className="text-black-600 text-[16px]"> Inadequate maintenance of equipment leading to breakdowns or reduced effectiveness.</span>
            </div>
          </li>
        </ul>
      </section>

      <section className="bg-white/80 backdrop-blur-sm rounded-[20px] p-6 shadow-sm">
        <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Operational Issues</h2>
        <ul className="space-y-3">
          <li className="flex gap-2">
            <span className="text-emerald-700">♦</span>
            <div>
              <span className="font-medium text-[16px]">Lack of Coordination:</span>
              <span className="text-black-600 text-[16px]"> Poor coordination between different agencies and organizations involved in the response.</span>
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-700">♦</span>
            <div>
              <span className="font-medium text-[16px]">Traffic Congestion:</span>
              <span className="text-black-600 text-[16px]"> Difficulty in navigating and responding due to heavy traffic or road closures.</span>
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-700">♦</span>
            <div>
              <span className="font-medium text-[16px]">Supply Chain Disruptions:</span>
              <span className="text-black-600 text-[16px]"> Delays in the delivery of essential supplies.</span>
            </div>
          </li>
        </ul>
      </section>



</div>
      </div>
  )
}

export default page