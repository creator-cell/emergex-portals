import { notification, settings } from "@/assets/icons";
import { logo } from "@/assets/logo";
import { AppSidebar } from "@/components/main/app-sidebar";
import Nav from "@/components/main/Nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { IoSearch } from "react-icons/io5";

import Image from "next/image";
import SuperAdminSideBar from "@/components/super-admin/SuperAdminSideBar";
import NavbarSuperAdmin from "@/components/super-admin/NavbarSuperAdmin";
import SuperAdminNavBar from "@/components/super-admin/SuperAdminNavBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className=" flex flex-col w-full min-h-screen bg-custom-gradient">
     <SuperAdminNavBar/>

      <SuperAdminSideBar />
      <div className=" w-full  lg:pl-[250px]  "> {children}</div>
    </main>
  );
}
