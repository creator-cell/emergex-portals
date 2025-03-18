import TextBar from "@/components/common/TextBar";
import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import React from "react";



interface RowBoxPropsType {
  role: {
    employee: {
      name:string;
      designation:string;
    };
    role: {
      title:string;
    };
  };
  status: string;
  createdAt: string;
}

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp?.replace(/\.\d+Z|([+-]\d{2}:\d{2})$/, "Z"));
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleDateString("en-US", options);
};

const RowBoxDetailpage: React.FC<RowBoxPropsType> = ({
  role,
  status,
  createdAt,
}) => {

  return (
    <div
      className={cn(
        `flex flex-wrap items-center justify-between w-full bg-white gap-[16px] border-b  px-[22px] py-[24px] `
      )}
    >
      <div className="text-left pl-4 ">
        <TextBar
          title={role?.role.title}
          line={role?.employee.name}
          TitleClassName="text-label"
          LineClassname="text-[16px] leading-6 font-medium"
        />
      </div>
      <div className="text-left pl-4">
        <TextBar
          title="Status"
          line={status}
          TitleClassName="text-label"
          LineClassname="text-[16px] leading-6 font-medium"
        />
      </div>

      <div className="text-left pl-4">
        <TextBar
          title="Date and time"
          line={formatDate(createdAt)}
          TitleClassName="text-label"
          LineClassname="text-[16px] leading-6 font-medium"
        />
      </div>

      <div className=" flex justify-end items-center border-2 rounded-full p-2">
        <MoveRight size={16} />
      </div>
    </div>
  );
};

export default RowBoxDetailpage;
