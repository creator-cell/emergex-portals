"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { notification, settings } from "@/assets/icons";
import { IoCloseOutline, IoSearch } from "react-icons/io5";
import { logo } from "@/assets/logo";

const SuperAdminNavBar = () => {
  const [searchBar, setSearchBar] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true); // When scroll position > 0, set scrolled to true
      } else {
        setScrolled(false); // When at top of the page, set scrolled to false
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav
      className={`w-full flex items-center justify-between px-4 border-b h-[69px] sticky top-0 ${
        scrolled ? "bg-white" : "bg-transparent"
      }`}
      style={{ zIndex: 20 }}
    >

      <div className={` flex  items-center gap-[20px]  `}>
        {searchBar ? null : (
          <div className="flex items-center gap-4 ml-8">
          <div className="w-[80px] lg:w-[117px]">
            <Image src={logo} alt="emere-logo" width={200} height={100} />
            </div>
            <div className="w-[80px] lg:w-[117px]">
            <Image src='/images/topLogo.png' alt="emere-logo" width={200} height={100} />
            </div>
          </div>
          
        )}

        {/* <div className=" hidden md:flex items-center rounded-2xl overflow-hidden bg-[#f9fafb] gap-4  px-[15px] border border-[#E5E7EB] ">
          <span className="text-[24px]">
            <IoSearch />
          </span>
          <input
            type="text"
            name=""
            id=""
            className=" border-none outline-none h-[45px] bg-[#f9fafb] py-[13px] w-[80%]"
          />
        </div> */}
      </div>

      {searchBar ? null : (
        <button
          onClick={() => setSearchBar(true)}
          className="block md:hidden text-[24px] "
        >
          {" "}
          <IoSearch />
        </button>
      )}

      {searchBar && (
        <div className=" fixed w-[85%] top-3 left-1/2 transform -translate-x-1/2  flex items-center rounded-2xl overflow-hidden bg-[#f9fafb] gap-4  px-[15px] border border-[#E5E7EB] ">
          <span className="text-[24px]">
            <IoSearch />
          </span>
          <input
            type="text"
            name=""
            id=""
            className=" border-none outline-none h-[45px] bg-[#f9fafb] py-[13px] w-[80%]"
          />
          <button onClick={() => setSearchBar(false)} className="text-[24px] ">
            <IoCloseOutline />
          </button>
        </div>
      )}

      {searchBar ? null : (
        <div className="flex gap-4 ">
          <div className="bg-white rounded-full p-2">
            <Image src={settings} alt="settings" width={22} height={22} />
          </div>
          <div className="bg-white rounded-full p-2">
            <Image
              src={notification}
              alt="notification"
              width={22}
              height={22}
            />
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      )}
    </nav>
  );
};

export default SuperAdminNavBar;
