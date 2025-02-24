

import {
  ClientList,
  DashboardIcon,
  LifebuoyIcon,
  MessageIcon,
  ProfileTwouserIcon,
  TasklistIcon,
  VideoIcons,
} from "@/assets/icons/SvgIcons";

interface superAdminSidebarListTypes {
  label: string;
  link: string;
  icon: React.ReactNode;
}

export const superAdminSidebarList: superAdminSidebarListTypes[] = [
  {
    label: "Dashboard",
    link: "/super-admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    label: "Task list",
    link: "/super-admin/task-list",
    icon: <TasklistIcon />,
  },
  {
    label: "Client list",
    link: "/super-admin/client-list",
    icon: <ClientList />,
  },

  {
    label: "Demo request",
    link: "/super-admin/demo-request",
    icon: <VideoIcons />,
  },
  {
    label: "Team",
    link: "/super-admin/team",
    icon: <ProfileTwouserIcon />,
  },
  {
    label: "Chat",
    link: "/super-admin/chat",
    icon: <MessageIcon />,
  },
  {
    label: "Support",
    link: "/super-admin/support",
    icon: <LifebuoyIcon />,
  },
];
