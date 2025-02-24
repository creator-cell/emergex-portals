"use client ";
import { tabsIconColor } from "@/enums/main/tabs/tabs";
import { cn } from "@/lib/utils";
import { Incident, Project } from "@/store/api/common/commonTypes";
import { setSelectedIncident } from "@/store/api/common/incidentSlice";
import { useAppDispatch } from "@/store/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { RootState } from "@/store/store";

interface TaskRowProps {
  data: Incident;
  className?: string;
}

const AdminTaskRow: React.FC<TaskRowProps> = ({ data, className }) => {
  const router = useRouter();
  const { type: taskHead, level, createdAt, isStopped, stoppedTime }: { createdAt: Date, type: string, level: string, project: Project, _id: string, isStopped: boolean, stoppedTime: Date } = data;
  const taskId = data.id;

  // const isTimerStopped = useSelector((state: RootState) => state.incident.isTimerStopped)

  const dispatch = useAppDispatch();

  const [timer, setTimer] = useState("");

  const formatDuration: any = (startDate: Date, endDate: Date) => {
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {

    if (isStopped) {
      const createdAtNew = new Date(createdAt);
      const stoppedTimeNew = new Date(stoppedTime);

      setTimer(formatDuration(createdAtNew, stoppedTimeNew));
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const created = new Date(createdAt);
      const diff = Math.abs(now.getTime() - created.getTime());

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimer(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    };


    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [createdAt,isStopped]);

  const handleClicked = () => {
    dispatch(setSelectedIncident(data._id));
    router.push("/admin/task-details")
  }

  return (
    <div
      onClick={handleClicked}
      className={cn(
        `flex flex-wrap md:justify-between gap-6 md:gap-2 w-full bg-white rounded-[20px] shadow-md p-4 cursor-pointer`,
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 mr-4">
          <Image
            src={tabsIconColor[level]?.icon}
            alt="task icon"
            width={20}
            height={20}
          />
        </div>
        <div>
          <div className="text-label">Task ID</div>
          <div className=" text-[16px] leading-6 font-medium">{taskId}</div>
        </div>
      </div>
      <div className="text-left pl-4">
        <div className="text-label">Task Head</div>
        <div className="text-[16px] leading-6 font-medium ">{taskHead}</div>
      </div>

      <div className=" flex md:justify-end items-center">
        <div className="text-left">
          <div className="text-label">Timer</div>
          <div className="text-[16px] leading-6 font-medium">{timer}</div>
        </div>
      </div>

      <div className=" flex md:justify-end items-center">
        <div
          className={`px-5 py-1 w-fit  h-fit text-black rounded-md `}
          style={{
            background: tabsIconColor[level]?.color,
          }}
        >
          {/* Level  */}
          {level}
        </div>
      </div>
    </div>
  );
};

export default AdminTaskRow;
