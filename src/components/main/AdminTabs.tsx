"use client";

import {
  Tabs as TabContainer,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/custom/custom-tabs";
import React, { useState } from "react";
import { tabsData } from "@/enums/main/tabs/tabs";
import { cn } from "@/lib/utils";
import AdminTaskRow from "./AdminTaskRow";
import { Incident } from "@/store/api/common/commonTypes";

interface AdminTabsProps {
  data: Incident[];
}

const AdminTabs: React.FC<AdminTabsProps> = ({data}) => {
  const [activeTab, setactiveTab] = useState("In Progress");
  console.log("ActiveTab: ", activeTab);

  return (
    <TabContainer
      defaultValue="In Progress"
      onValueChange={(value) => setactiveTab(value)}
      className="w-full  "
    >
      <TabsList
        // defaultValue={activeTab}
        // onVolumeChange={() => setactiveTab("ongoing")}
        className=" rounded-b-none  ring-0 border-none relative"
      >
        <TabsTrigger
          value="In Progress"
          className={` w-4 md:w-36 relative ${
            activeTab === "In Progress" && "bg-[#f1f6f0] rounded-b-none active"
          }   pt-4 pb-8 px-12 rounded-tl-[40px] rounded-tr-[40px]`}
        >
          In Progress
        </TabsTrigger>
        <TabsTrigger
          value="Completed"
          className={` w-4 md:w-36 relative ${
            activeTab === "Completed" &&
            "bg-[#f1f6f0] active active-before rounded-b-none"
          }  pt-4 pb-8 px-8  rounded-t-[40px]`}
        >
          Completed
        </TabsTrigger>
        <TabsTrigger
          value="Cancelled"
          className={` relative w-4 md:w-36 ${
            activeTab === "Cancelled" &&
            "bg-[#f1f6f0] active active-before rounded-b-none"
          }  pt-4 pb-8 px-8 rounded-t-[40px] `}
        >
          Cancelled
        </TabsTrigger>
        <TabsTrigger
          value="Assigned"
          className={` relative w-4 md:w-36 ${
            activeTab === "Assigned" &&
            "bg-[#f1f6f0] active active-before rounded-b-none"
          }  pt-4 pb-8 px-8 rounded-t-[40px] `}
        >
          Assigned
        </TabsTrigger>
        <TabsTrigger
          value="Delayed"
          className={` relative w-4 md:w-36 ${
            activeTab === "Delayed" &&
            "bg-[#f1f6f0] active active-before rounded-b-none"
          }  pt-4 pb-8 px-8 rounded-t-[40px] `}
        >
          Delayed
        </TabsTrigger>
      </TabsList>
      <TabsContent
        className={cn(
          "bg-[#f1f6f0] rounded-b-[40px] rounded-tr-[40px] mt-0 p-5 flex flex-col gap-5 border-none w-full",
          activeTab != "In Progress" && " rounded-tl-[40px] "
        )}
        value={activeTab}
      >
        {data
          ?.filter((item) => item?.status === activeTab)
          .map((item) => (
            <AdminTaskRow key={item?._id} data={item} />
          ))}
      </TabsContent>
    </TabContainer>
  );
};

export default AdminTabs;
