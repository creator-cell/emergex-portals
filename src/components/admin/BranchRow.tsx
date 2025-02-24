"use client ";
import { BranchType } from "@/enums/admin/branch";
import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import TextBar from "../common/TextBar";

interface BranchRowProps {
  data: BranchType;
  className?: string;
}

const BranchRow: React.FC<BranchRowProps> = ({ data, className }) => {
  const { branchId, branchName, location } = data;
  // grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
  return (
    <Link
      href={`/exploration-and-production`}
      className={cn(
        `flex flex-wrap items-center justify-between w-full bg-white gap-[16px] rounded-[20px] shadow-md px-[22px] py-[24px] `,
        className
      )}
    >
      <div className="text-left pl-4 ">
        <TextBar
          title="Emerge-x cases ID"
          line={branchId}
          TitleClassName="text-label"
          LineClassname="text-[16px] leading-6 font-medium"
        />
      </div>
      <div className="text-left pl-4">
        <TextBar
          title="Emerge-x cases Name"
          line={branchName}
          TitleClassName="text-label"
          LineClassname="text-[16px] leading-6 font-medium"
        />
      </div>

      <div className="text-left pl-4">
        <TextBar
          title="Country"
          line={location}
          TitleClassName="text-label"
          LineClassname="text-[16px] leading-6 font-medium"
        />
      </div>
      <div className="text-left pl-4">
        <TextBar
          title="Worksite"
          line={location}
          TitleClassName="text-label"
          LineClassname="text-[16px] leading-6 font-medium"
        />
      </div>

      <div className=" flex justify-end items-center">
        <MoveRight size={24} />
      </div>
    </Link>
  );
};

export default BranchRow;
