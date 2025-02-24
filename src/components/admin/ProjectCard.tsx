"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { MoveRight } from "lucide-react";

interface ProjectCardProps {
  id: string;
  name: string;
  country: string;
  worksite: string;
  _id: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  country,
  worksite,
  _id,
}) => (
  <Card className="p-6 rounded-[20px]">
    <Link href={`/admin/exploration-and-production/${_id}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1">
          <div>
            <div className="text-[12PX] text-gray-500">Emerge-x cases ID</div>
            <div className="text-[16px] font-medium">{id}</div>
          </div>
          <div>
            <div className="text-[12PX] text-gray-500">Emerge-x cases Name</div>
            <div className="text-[16px] font-medium">{name}</div>
          </div>
          <div>
            <div className="text-[12PX] text-gray-500">Country</div>
            <div className="text-[16px] font-medium">{country}</div>
          </div>
          <div>
            <div className="text-[12PX] text-gray-500">Worksite</div>
            <div className="text-[16px] font-medium">{worksite}</div>
          </div>
        </div>
        <MoveRight className="h-5 w-5 text-gray-400 mt-4 sm:mt-0 moveRight" />
      </div>
    </Link>
  </Card>
);
