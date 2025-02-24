import { addIcon } from "@/assets/icons";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

import AddNewTask from "@/components/common/AddNewForm";
import AddClientForm from "@/components/super-admin/AddClientForm";
import { ReadonlyURLSearchParams } from "next/navigation";
import TasklistTabTogle from "@/components/super-admin/TasklistTabTogle";

// export default function Home({ searchParams }: { searchParams: ReadonlyURLSearchParams }) {

//     const plane=searchParams  ? new URLSearchParams(searchParams).toString():''
const page = ({ searchParams }: { searchParams: ReadonlyURLSearchParams }) => {
  const tab = searchParams ? new URLSearchParams(searchParams).toString() : "";
  const arr = [0, 1, 2, 3];
  return (
    <div className=" md:p-4 min-h-screen ">
      <div className="bg-white rounded-2xl ">
        <div className="flex items-center justify-between  my-4">
          <TasklistTabTogle tab={tab} />

          <Button
            className="rounded-xl px-4 md:px-8 h-10  "
            style={{
              background:
                "linear-gradient(89.14deg, #3DA229 0.68%, #247814 100%)",
            }}
          >
            <Image src={addIcon ?? ""} alt="add icon" width={20} height={20} />
            <span className=" hidden md:flex">  Add task</span>
           
          </Button>
        </div>

        <div className=" overflow-x-auto">
          <table className=" table-auto w-full border border-gray-300 mt-4 rounded-[12px] overflow-hidden">
            <thead>
              <tr className="bg-[#f9fafb] text-[#6B7280] text-xs font-[600]">
                <th className="p-4   text-left ">TASK</th>
                <th className="p-4  text-left ">ID</th>
                <th className="p-4  text-left ">STATUS</th>
                <th className="p-4  text-left ">TIMER</th>
                <th className="p-4  text-left ">ASSIGNED TO</th>
              </tr>
            </thead>
            <tbody>
              {arr?.map((e, i) => (
                <tr
                  key={i}
                  className="  rounded-[12px] overflow-hidden mx-5 w-full"
                >
                  <td
                    className={` ${
                      i % 2 == 0 ? "bg-white" : "bg-[#F9FAFB]"
                    } flex items-center  rounded-l-xl p-4 whitespace-nowrap`}
                  >
                    <p className="text-[#111827] font-[600] text-[16px] whitespace-nowrap">
                      Demo request
                    </p>
                  </td>
                  <td
                    className={`${
                      i % 2 == 0 ? "bg-white" : "bg-[#F9FAFB]"
                    } text-[14px] text-[#111827] font-[400] p-4 whitespace-nowrap`}
                  >
                    COM-93HS
                  </td>
                  <td
                    className={` ${
                      i % 2 == 0 ? "bg-white" : "bg-[#F9FAFB]"
                    } text-[14px] text-[#6B7280] font-[400] p-4 whitespace-nowrap`}
                  >
                    In progress
                  </td>
                  <td
                    className={` ${
                      i % 2 == 0 ? "bg-white" : "bg-[#F9FAFB]"
                    } text-[14px] text-[#6B7280] font-[400] p-4 whitespace-nowrap`}
                  >
                    23:05:283
                  </td>
                  <td
                    className={`${
                      i % 2 == 0 ? "bg-white" : "bg-[#F9FAFB]"
                    }   rounded-r-xl p-4 `}
                  >
                    <p className="text-[14px] text-[#111827] font-[500] whitespace-nowrap">
                      Gilbert Lambert
                    </p>
                    <p className="text-[12px] text-[#767676] font-[400] whitespace-nowrap">
                      Onsite Emergency Response Manager
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default page;
