"use client"

import { EditPenicon, LogoutIcon, ShareIcon } from "@/assets/icons/SvgIcons";
import BackButton from "@/components/admin/BackButton";
import { useFetchIncidentHistoryByIncidentIdQuery } from "@/store/api/common/commonApi";
import { useAppSelector } from "@/store/hooks";
import React from "react";

const page = () => {
  const historyData = [
    {
      id: "ab2",
      title: "Evacuation started ",
      name: "Gilbert Lambert",
      desaignation: "Onsite Emergency Response Manager",
      tiem: "12:34 AM",
      date: "23 Dec 2024",
    },
    {
      id: "ab3",
      title: "Road cleared ",
      name: "Daniel Brown",
      desaignation: "Onsite ERT Leader",
      tiem: "12:34 AM",
      date: "23 Dec 2024",
    },
    {
      id: "ab4",
      title: "First aid ",
      name: "Lily Ryan",
      desaignation: "Medical Officer",
      tiem: "12:34 AM",
      date: "23 Dec 2024",
    },
  ];
  const incidentId = useAppSelector(
    (state) => state.incident.selectedIncidentId
  );

  const { data, error, isLoading } = useFetchIncidentHistoryByIncidentIdQuery(incidentId);
  return (
    <div>
      <div className="flex items-center justify-between mb-4 bg-transparent mt-4">
        <div className="flex items-center gap-6">
          <BackButton />

          <div>
            <h1 className="text-[20px] font-medium leading-none">History</h1>
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
        {historyData?.map((e, i) => (
          <div
            key={e.id}
            className="bg-white p-4 flex items-center justify-between rounded-2xl     "
          >
            <div>
              <h2 className=" text-darkish  text-lg">{e.title}</h2>
              <p className=" text-[#767676] text-sm">
                {e.name} (<span>{e.desaignation}</span>){" "}
              </p>
            </div>
            <div>
              <div className=" text-sm  sm:text-base text-[#5A5A5A]">
                {e.tiem}
              </div>
              <div className="text-[#767676] text-xs sm:text-sm ">{e.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
