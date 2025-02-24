"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  HiOutlineArrowNarrowRight,
  HiOutlineArrowNarrowLeft,
} from "react-icons/hi";
import { SuperAdminData } from "./SuperAdminData";

const SuperAdminSideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const pathName = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div
        className={`w-[250px] h-screen fixed left-0 top-[69px] border-r transition-transform duration-300 ${
          isSidebarOpen ? "transform-none" : "transform -translate-x-full"
        } lg:transform-none lg:translate-x-0 bg-white lg:bg-transparent`}
        style={{ zIndex: 20 }}
      >
        <div className="lg:hidden relative w-full">
          <div
            className="z-50 absolute top-1 -right-4 cursor-pointer"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <HiOutlineArrowNarrowLeft className="text-gray-600 hover:text-green-500 w-4 h-4" />
            ) : (
              <HiOutlineArrowNarrowRight className="text-gray-600 hover:text-green-500 w-4 h-4" />
            )}
          </div>
        </div>

        <ul className="space-y-2 pt-5">
          {SuperAdminData?.map((e, i) => {
            const isActive = pathName === e.link;
            return (
              <li key={i} className="text-base px-6">
                <Link
                  href={e.link}
                  className={`flex text-sm items-center gap-[16px] text-[16px] leading-[24px] pt-3 pb-3 pl-4 rounded-full ${
                    isActive
                      ? "text-black font-semibold adminSidebarBg"
                      : "text-[#303030] adminSidebarBgInactive"
                  }`}
                >
                  {e.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed w-full h-full bg-gray-800 bg-opacity-25 left-0 top-0"
          style={{ zIndex: 10 }}
        ></div>
      )}
    </>
  );
};

export default SuperAdminSideBar;
