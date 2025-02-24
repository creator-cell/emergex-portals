"use client";

import {
    Sidebar as SidebarContainer,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

import { logo } from "@/assets/logo"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";


interface SidebarProps {
    children?: React.ReactNode
    sidebarLinks: {
        label: string
        link: string
    }[]
}

const Sidebar: React.FC<SidebarProps> = ({ children, sidebarLinks }) => {

    const pathName = usePathname()
    console.log("🚀 ~ AdminSidebar ~ pathName:", pathName)

    return (
        <SidebarContainer className="">
            <SidebarContent className="bg-custom-gradient">
                <SidebarGroup>
                    <SidebarGroupLabel className="w-[117px] py-5">
                    <Link href={"/admin"}>
                    <Image
                            src={logo}
                            alt="emere-logo"
                            width={200}
                            height={100}
                        />
                    </Link>
                      
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="mt-10">
                        <SidebarMenu className="space-y-2">
                            {sidebarLinks?.map((item) => {
                                const isActive = pathName === item.link
                                return (
                                    <SidebarMenuItem key={item.link}>
                                        <SidebarMenuButton asChild className={cn("rounded-full py-[1.5rem] px-3 text-[16px] font-normal leading-6", isActive && "font-semibold")} style={{
                                            background: isActive
                                                ? "linear-gradient(92.17deg, #BBF2B0 2.54%, #D8F3D2 99.39%)"
                                                : "linear-gradient(92.51deg, rgba(255, 255, 255, 0.58) 4.51%, rgba(255, 255, 255, 0.29) 98.11%)"
                                        }}>
                                            <Link href={item.link}>
                                                {item.label}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </SidebarContainer>
    )
}


export default Sidebar