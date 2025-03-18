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
  
  export const SuperAdminData: superAdminSidebarListTypes[] = [
    {
      label: "Dashboard",
      link: "/admin",
      icon: <DashboardIcon />,
    },
    // {
    //   label: "Project Details",
    //   link: "/admin/project-details",
    //   icon: <TasklistIcon />,
    // },
    {
      label: "Company Profile",
      link: "/admin/company-profile",
      icon: <ProfileTwouserIcon />,
    },
    {
      label: "Chat",
      link: "/admin/chat",
      icon: <MessageIcon />,
    },
    {
      label: "Announcements",
      link: "/admin/announcements",
      icon: <LifebuoyIcon />,
    },
    // {
    //   label: "Task list",
    //   link: "/admin/task-list",
    //   icon: <TasklistIcon />,
    // },
    // {
    //   label: "Client list",
    //   link: "/admin/client-list",
    //   icon: <ClientList />,
    // },
  
    // {
    //   label: "Demo request",
    //   link: "/admin/demo-request",
    //   icon: <VideoIcons />,
    // },
    // {
    //   label: "Team",
    //   link: "/admin/team-members",
    //   icon: <ProfileTwouserIcon />,
    // },
    // {
    //   label: "Support",
    //   link: "/admin/support",
    //   icon: <LifebuoyIcon />,
    // },
    {
      label: "ERP methods",
      link: "/admin/erp-methods",
      icon: <ProfileTwouserIcon />,
    },
    {
      label: "Team members",
      link: "/admin/team-members",
      icon: <LifebuoyIcon />,
    },
    {
      label: "Employees",
      link: "/admin/employees",
      icon: <LifebuoyIcon />,
    },
  ];
  