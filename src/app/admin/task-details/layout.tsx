import BackButton from "@/components/admin/BackButton";
import Sidebar from "@/components/common/sidebar";
import Nav from "@/components/main/Nav";

import { SidebarProvider } from "@/components/ui/sidebar";
import { superadminSidebarLinks } from "@/enums/admin/admin-branch-list-sidebar";

import React from "react";
interface Props {
  children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  return (
    <SidebarProvider className="bg-custom-gradient">
      <Sidebar sidebarLinks={superadminSidebarLinks} />
      <main className=" flex flex-col w-full min-h-screen">
        <Nav Sidebar={true} />
        <div className="flex flex-1 flex-col gap-5 w-full container">
          {" "}
          {/* <BackButton /> */}
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
