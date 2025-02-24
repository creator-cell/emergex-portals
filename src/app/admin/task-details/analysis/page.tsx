"use client";

import { LogoutIcon, SnowIcon } from "@/assets/icons/SvgIcons";
import { AnalysisRecoveryChart } from "@/components/admin/AnalysisRecoveryChart";
import { AnalysisResponseChart } from "@/components/admin/AnalysisResponseChart";
import BackButton from "@/components/admin/BackButton";
import { RecoveryChart } from "@/components/admin/RecoveryChart";
import { ResponseChart } from "@/components/admin/ResponseChart";
import { Card } from "@/components/ui/card";

interface TemperaturePoint {
  time: string;
  temp: number;
  selected?: boolean;
}

const temperatures: TemperaturePoint[] = [
  { time: "Now", temp: -4 },
  { time: "10:00", temp: -10 },
  { time: "11:00", temp: -14 },
  { time: "12:00", temp: -19, selected: true },
  { time: "13:00", temp: -24 },
  { time: "14:00", temp: -19 },
  { time: "14:00", temp: -19 },
  { time: "14:00", temp: -19 },
  { time: "14:00", temp: -19 },
  { time: "14:00", temp: -19 },
  { time: "14:00", temp: -19 },
  { time: "14:00", temp: -19 },
  { time: "14:00", temp: -19 },
];

export default function Analysis() {
  return (
    <div className="min-h-screen ">
      <div className="flex items-center justify-between  bg-transparent mt-4">
        <div className="flex items-center gap-6">
          <BackButton />

          <div>
            <h1 className="text-[20px] font-medium leading-none">Analysis</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-medium timerCOlor">23:05:283</div>

          <div className="logoutIconBG p-[8px] rounded-[10px] mr-4">
            <LogoutIcon />
          </div>
        </div>
      </div>

      <div className="p-6 mx-auto">
        {/* Temperature Timeline */}
        <div>
          <h2 className=" font-medium mb-4 tmpColor">Temperature</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
  {temperatures.map((point, i) => (
    <div
      key={i}
      className={`flex flex-col items-center p-4 ${
        i === 3
          ? "customCardBGWhite"
          : "customCardBG"
      }`}
    >
      <span className={i === 3 ? "text-white" : "tmpColor"}>{point.time}</span>

      <SnowIcon color={i === 3 ? "#FFFFFF" : "#303030"} />
      <span className={i === 3 ? "text-white" : "tmpColor"}>{point.temp}°</span>
    </div>
  ))}
</div>

        </div>

        <div className="flex flex-row gap-5 mt-4">
          {/* Response */}
          <Card className="pt-6 h-[164px] adminDashboardBg w-[29%] rounded-[20px]">
            <div className="flex justify-between items-center ml-4 mr-4 mb-2">
              <h3 className="adminDashboardText font-semibold text-[16px] mb-4">
                Snowfall rates
              </h3>
            </div>
            <AnalysisResponseChart />
          </Card>

          {/* Recovery */}
          <Card className="pt-6 pb-6 adminDashboardBg h-[164px] w-[66%] rounded-[20px]">
            <div className="flex justify-between items-center ml-4 mr-4">
              <h3 className="adminDashboardText font-semibold text-[16px] mb-4">
                Past snowfall
              </h3>
            </div>
            <AnalysisRecoveryChart />
          </Card>
        </div>

        <div className="flex flex-row gap-5 mt-4">
          {/* Response */}
          <Card className="pt-6 adminDashboardBg w-[47.5%] h-[293px] rounded-[20px]">
            <div className="flex justify-between items-center ml-4 mr-4 mb-2">
              <h3 className="adminDashboardText font-semibold text-[16px] mb-4">
                Map
              </h3>
            </div>
           
          </Card>

          {/* Recovery */}
          <Card className="pt-6 pb-6 adminDashboardBg  w-[47.5%] h-[293px] rounded-[20px]">
            <div className="flex justify-between items-center ml-4 mr-4">
              <h3 className="adminDashboardText font-semibold text-[16px] mb-4">
                Performance
              </h3>
            </div>
            <Card className="performanceBG rounded-[16px] ml-6 mr-6  pl-6 pr-6  pt-6 pb-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-[28px] font-medium text-gray-900">19<span className="text-sm font-normal ml-0.5">min</span></div>
                <div className="tmpColorText mt-1">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-[28px] font-medium text-gray-900">42<span className="text-sm font-normal ml-0.5">min</span></div>
                <div className="tmpColorText mt-1">Road Clearance Time</div>
              </div>
              <div className="text-center">
                <div className="text-[28px] font-medium text-gray-900">1</div>
                <div className="tmpColorText mt-1">Location of incidents</div>
              </div>
              <div className="text-center">
                <div className="text-[28px] font-medium text-gray-900">3</div>
                <div className="tmpColorText mt-1">emergency calls received</div>
              </div>
              <div className="text-center">
                <div className="text-[28px] font-medium text-gray-900">2</div>
                <div className="tmpColorText mt-1">Resource Utilization</div>
              </div>
              <div className="text-center">
                <div className="text-[28px] font-medium text-gray-900">2</div>
                <div className="tmpColorText mt-1">Resource Utilization</div>
              </div>
            </div>
          </Card>
          </Card>
        </div>

       
      </div>
    </div>
  );
}
