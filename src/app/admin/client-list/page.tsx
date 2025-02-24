import { addIcon } from "@/assets/icons";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { IoSearch } from "react-icons/io5";
import AddNewTask from "@/components/common/AddNewForm";
import AddClientForm from "@/components/super-admin/AddClientForm";

const page = () => {
  const arr = [0, 1, 2, 3];

  return (
    <div className=" md:p-4 min-h-screen ">
      <div className="bg-white   rounded-2xl ">
        <div className="flex items-center justify-between my-4 gap-4">
          <div className="flex items-center rounded-[16px] overflow-hidden bg-[#f9fafb] gap-4 px-2 md:px-4 border border-[#E5E7EB]">
            <span className="text-[24px]">

            <IoSearch />
            </span>
            <input
              type="text"
              name=""
              id=""
              className=" border-none outline-none h-[45px] bg-[#f9fafb] py-[13px] w-[80%]"
            />
          </div>

          <AddNewTask
            triggerLabel={
              <Button
                className="rounded-xl px-4 md:px-8 h-10  "
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
                <span className=" hidden md:flex"> Add client</span>
              
              </Button>
            }
            dialogContent={<AddClientForm />}
          />
        </div>
        <div className=" overflow-x-auto ">
          <table className=" table-auto w-full border border-gray-300 mt-4 rounded-[12px] overflow-hidden">
            <thead>
              <tr className="bg-[#f9fafb] text-[#6B7280] text-xs font-[600]">
                <th className=" p-2 lg:p-4   text-left ">CLIENT</th>
                <th className="p-2 lg:p-4  text-left ">ID</th>
                <th className="p-2 lg:p-4  text-left ">TYPE OF BUSINESS </th>
                <th className="p-2 lg:p-4   text-left ">LOCATION</th>
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
                    <div className=" w-[32px] h-[32px] ">
                      <Image
                        src={"/companyprofile/profile.png"}
                        alt="clientprofile"
                        width={100}
                        height={100}
                      />
                    </div>
                    <p className="text-[#111827] font-[600] text-[16px] whitespace-nowrap">
                      Company Name
                    </p>
                  </td>
                  <td
                    className={`${
                      i % 2 == 0 ? "bg-white" : "bg-[#F9FAFB]"
                    } text-[14px] text-[#111827] font-[400] p-2 lg:p-4  whitespace-nowrap`}
                  >
                    COM-93HS
                  </td>
                  <td
                    className={` ${
                      i % 2 == 0 ? "bg-white" : "bg-[#F9FAFB]"
                    } text-[14px] text-[#6B7280] font-[400] p-2 lg:p-4  whitespace-nowrap`}
                  >
                    Business 1
                  </td>
                  <td
                    className={`${
                      i % 2 == 0 ? "bg-white" : "bg-[#F9FAFB]"
                    }  text-[14px] text-[#111827] font-[500] rounded-r-xl p-2 lg:p-4  whitespace-nowrap`}
                  >
                    114 Strand, London WC2R 0AG, United Kingdom
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
