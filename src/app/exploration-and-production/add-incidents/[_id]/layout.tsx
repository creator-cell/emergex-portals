"use client";

import React from "react";
import Sidebar from "@/components/common/sidebar";
import Nav from "@/components/main/Nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { projectDetailsSidebarLinks } from "@/enums/admin/project-details-sidebar";

interface LayoutProps {
  children: React.ReactNode;
  params: { _id: string };
}

const AdminLayout: React.FC<LayoutProps> = ({ children, params }) => {
  const updatedLinks = projectDetailsSidebarLinks.map((link) => ({
    ...link,
    link: `${link.link}/${params._id}`,
  }));

  return (
    <SidebarProvider className="bg-custom-gradient">
      <Sidebar sidebarLinks={updatedLinks} />
      <main className="flex flex-col w-full min-h-screen">
        <Nav Sidebar={true} />
        <div className="flex flex-1 flex-col gap-5 w-full container">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
