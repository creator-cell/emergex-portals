"use client"

import { EditPenicon, LogoutIcon, ShareIcon } from "@/assets/icons/SvgIcons";
import BackButton from "@/components/admin/BackButton";
import { useFetchIncidentHistoryByIncidentIdQuery } from "@/store/api/common/commonApi";
import { useAppSelector } from "@/store/hooks";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton"
import dayjs from "dayjs";

const page = () => {
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

      <div className="min-h-screen space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))
        ) : (
          data?.data?.map((e: any) => (
            <div
              key={e._id}
              className="bg-white p-4 flex items-center justify-between rounded-2xl"
            >
              <div>
                <h2 className="text-darkish text-lg">{e.title}</h2>
                <p className="text-[#767676] text-sm">
                  {e.role.username} (<span>{e.role.desaignation || "Hr officer"}</span>)
                </p>
              </div>
              <div>
                <div className="text-sm sm:text-base text-[#5A5A5A]">
                  {dayjs(e.createdAt).format("hh:mm A")}
                </div>
                <div className="text-[#767676] text-xs sm:text-sm">
                  {dayjs(e.createdAt).format("DD MMM YYYY")}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default page;