"use client";

import { PreparednessChart } from "@/components/admin/PreparednessChart";
import { RecoveryChart } from "@/components/admin/RecoveryChart";
import { ResponseChart } from "@/components/admin/ResponseChart";
import { StaticsGraph } from "@/components/admin/StatisticsGraph";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Settings2,
  HelpCircle,
  ArrowRight,
  Filter,
  Plus,
  Search,
  MoveRight,
} from "lucide-react";
import Link from "next/link";
import { FilterIcon } from "@/assets/icons/FilterIcon";
import Branchs from "@/components/admin/Branchs";
import {
  useGetProjectsQuery,
  useOverallStatisticsQuery,
} from "@/store/api/common/commonApi";
import { ProjectCard } from "@/components/admin/ProjectCard";
import { ClientProjectCard } from "@/components/ClientProjectCard";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const preparednessSections = [
    {
      name: "Hazard and Risk Assessment",
      value: 15,
      color: "rgb(255, 99, 99)",
    },
    { name: "Resource Inventory", value: 12, color: "rgb(99, 102, 241)" },
    { name: "Communication Systems", value: 24, color: "rgb(255, 99, 162)" },
    { name: "Emergency Plans", value: 10, color: "rgb(255, 159, 99)" },
  ];

  const [search, setSearch] = useState("");
  const {
    data: projects,
    isLoading,
    refetch,
  } = useGetProjectsQuery({ search });

  useEffect(() => {
    refetch();
  }, [search]);

  if (isLoading) return <div></div>;

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="text-left flex items-end justify-end">
        <Button className="bg-transparent borderofCustomizedDB text-green-600 hover:bg-gray-50 flex gap-2 w-full sm:w-auto rounded-[5px] border  m-4">
          <Settings2 className="h-5 w-5" />
          Customize dashboard
        </Button>
      </div>

      <div className="flex flex-wrap gap-6 mb-6">
        {/* Prevention */}
        <Card
          className="adminDashboardBg p-6 flex-grow text-lg font-semibold text-center xl:text-left 2xl:text-left rounded-[20px]"
          style={{ flexBasis: "11.67%" }}
        >
          <h3 className="adminDashboardText mb-4">Prevention</h3>
          <div className="space-y-4">
            <div className="mt-8">
              <h1 className="text-[28px] font-medium">15</h1>
              <div className="adminDashboardTextTitle">Thermal suit</div>
            </div>
            <div>
              <h1 className="text-[28px] font-medium mt-8">24</h1>
              <div className="adminDashboardTextTitle">Thermal Hardware</div>
            </div>
            <div>
              <h1 className="text-[28px] font-medium mt-8">120</h1>
              <div className="adminDashboardTextTitle">Wristband</div>
            </div>
          </div>
        </Card>

        {/* Preparedness */}
        <Card
          className="p-6 flex-grow adminDashboardBg h-auto rounded-[20px]"
          style={{ flexBasis: "50%" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="adminDashboardText mb-4">Preparedness</h3>
            <FilterIcon />
          </div>
          <PreparednessChart />
        </Card>

        {/* Response & Recovery */}
        <div className="flex flex-col gap-6" style={{ flexBasis: "26.33%" }}>
          {/* Response */}
          <Card className="pt-6 pb-6 adminDashboardBg h-auto lg:h-[10rem] rounded-[20px]">
            <div className="flex justify-between items-center ml-4 mr-4 mb-2">
              <h3 className="adminDashboardText mb-4">Response</h3>
              <FilterIcon />
            </div>
            <ResponseChart />
          </Card>

          {/* Recovery */}
          <Card className="pt-6 pb-6 adminDashboardBg h-auto lg:h-[10rem] rounded-[20px]">
            <div className="flex justify-between items-center ml-4 mr-4">
              <h3 className="adminDashboardText mb-4">Recovery</h3>
              <FilterIcon />
            </div>
            <RecoveryChart />
          </Card>
        </div>
      </div>

      {/* Search and Projects */}
      <div className="space-y-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Input with Search Icon */}
          <div
            className="adminDashboardBg relative flex items-center w-full sm:max-w-xs rounded-[6px]"
            style={{ border: "1px solid rgba(164, 184, 159, 1)" }} // Custom border color
          >
            <Search className="absolute left-2 text-gray-400" size={24} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Project"
              style={{ paddingLeft: "42px" }}
              className="searchEmergeButton p-6 text-[16px]" // Increased padding-left
            />
          </div>

          {/* Create New Project Button */}
          <div className="flex gap-4 items-center h-[56px]">
            <div className="border filterIconBGofBelow bg-whhite rounded-full p-[12px]">
              <FilterIcon />
            </div>
            <Link href={"/create-new-project"}>
              <Button className="bg-gradient-to-r rounded-[5px] from-[rgba(61,162,41,1)] to-[rgba(36,120,20,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-6 w-full sm:w-auto">
                <div className="border-[1px] border-white rounded-[5px]">
                  <Plus className="text-white" />
                </div>
                <span className="text-white text-[16px]">
                  Create new Project
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {Array.isArray(projects?.data) ? (
          projects.data.map((project: any) => (
            <ClientProjectCard
              key={project._id}
              _id={project._id}
              id={project.id}
              name={project.name}
              country={project.location?.country?.name || "N/A"}
              worksite={project.location?.worksite?.name || "N/A"}
            />
          ))
        ) : (
          <div>No projects available</div>
        )}
      </div>
    </div>
  );
}
