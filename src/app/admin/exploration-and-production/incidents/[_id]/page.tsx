"use client"

import React, { useEffect } from "react";
import { addIcon } from "@/assets/icons";
import AssessmentCard from "@/components/admin/assessment-card";

import AddNewForm from "@/components/common/AddNewForm";

import Tabs from "@/components/main/Tabs";
import TaskAddForm from "@/components/main/TaskAddForm";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Nav from "@/components/main/Nav";
import AdminTaskAddFrom from "@/components/main/AdminTaskAddFrom";
import AdminTabs from "@/components/main/AdminTabs";
import { useGetIncidentsQuery } from "@/store/api/common/commonApi";
import { useSelector } from "react-redux"
import { RootState } from "@/store/store";


const page = ({ params }: { params: { _id: string } }) => {
  const _id = params._id;
  const isTimerStopped = useSelector((state: RootState) => state.incident.isTimerStopped)
  const { data, isLoading, error, refetch } = useGetIncidentsQuery(_id);

  useEffect(() => {
    refetch();
  }, [data,isTimerStopped])

  if (!_id) {
    return <div></div>;
  }

  if (isLoading) {
    return <div></div>;
  }

  const incidents = data?.data;

  return (
    <>
      <div className=" container mt-4 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
        <div className="w-full relative flex flex-col gap-6">
          <AddNewForm
            triggerLabel={
              <Button
                className="rounded-[20px] p-4 md:px-8 h-12 absolute top-0 right-0"
                style={{
                  background:
                    "linear-gradient(89.14deg, #3DA229 0.68%, #247814 100%)",
                }}
              >
                <Image
                  src={addIcon ?? ""}
                  alt="add icon"
                  width={20}
                  height={20}
                />
                <span className=" hidden md:block"> Add New</span>
              </Button>
            }
            dialogContent={<AdminTaskAddFrom _id={_id} />}
          />
          <AdminTabs data={incidents} />
        </div>
      </div>
    </>
  );
};

export default page;
