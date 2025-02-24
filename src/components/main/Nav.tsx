"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { settings, notification } from "@/assets/icons";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logo } from "@/assets/logo";
import Link from "next/link";

interface Navprops {
  Sidebar: boolean;
}
const Nav: React.FC<Navprops> = ({ Sidebar }) => {
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
    <div
      className={`w-full flex items-center justify-between px-4 border-b h-[69px] sticky top-0 ${
        scrolled ? "bg-white" : "bg-transparent"
      }`}
      style={{ zIndex: 20 }}
    >
      {Sidebar && <SidebarTrigger />}
      {Sidebar ? (
        ""
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-[80px] lg:w-[117px]">
            <Image src={logo} alt="emere-logo" width={200} height={100} />
          </div>
          <div className="w-[80px] lg:w-[117px]">
            <Image
              src="/images/topLogo.png"
              alt="emere-logo"
              width={200}
              height={100}
            />
          </div>
        </div>
      )}
      <div className=" flex gap-4 ">
        <div className="bg-white rounded-full p-2">
          <Image src={settings} alt="settings" width={22} height={22} />
        </div>
        <div className="bg-white rounded-full p-2">
          <Image src={notification} alt="notification" width={22} height={22} />
        </div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Nav;
