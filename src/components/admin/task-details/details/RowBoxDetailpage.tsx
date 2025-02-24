import TextBar from "@/components/common/TextBar";
import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import React from "react";



interface RowBoxPropsType {
  name: string;
  status: string;

  dateAndTime: string;
}
const RowBoxDetailpage: React.FC<RowBoxPropsType> = ({
  name,
  status,

  dateAndTime,
}) => {
  return (
    <div
      className={cn(
        `flex flex-wrap items-center justify-between w-full bg-white gap-[16px] border-b  px-[22px] py-[24px] `
      )}
    >
      <div className="text-left pl-4 ">
        <TextBar
          title="Manager"
          line={name}
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
          line={dateAndTime}
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
