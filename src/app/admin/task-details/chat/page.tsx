"use client";
import {
  Video,
  Phone,
  ImageIcon,
  SendHorizontal,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/admin/ChatMessage";
import { TeamSidebar } from "@/components/admin/TeamSidebar";
import { useState } from "react";
import { AttachSquareIcon, LogoutIcon, SendIcon } from "@/assets/icons/SvgIcons";
import BackButton from "@/components/admin/BackButton";

interface TeamGroup {
  name: string;
  members: TeamMember[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor?: string;
}

function TeamMemberAvatar({ member }: { member: TeamMember }) {
  return (
    <div className="w-8 h-8 rounded-full chatAvatarBg flex items-center justify-center text-sm font-medium text-emerald-700">
      {member.initials}
    </div>
  );
}

// Sample data
const groups = [
  {
    name: "Emergency Response team",
    members: [
      {
        id: "1",
        name: "Gilbert Lambert",
        role: "Onsite Emergency Response Manager",
        initials: "GL",
      },
      {
        id: "2",
        name: "Joshua Thomas",
        role: "Onsite Emergency Response Coordinator",
        initials: "JT",
      },
      {
        id: "3",
        name: "Harriso Thomas",
        role: "Onsite ERT Leader",
        initials: "HT",
      },
      { id: "4", name: "Mason Lee", role: "Onsite ERT Leader", initials: "ML" },
    ],
  },
  {
    name: "HSE team",
    members: [
      {
        id: "5",
        name: "Charlotte King",
        role: "HSE Supervisor",
        initials: "CK",
      },
      { id: "6", name: "Ella Smith", role: "HSE Supervisor", initials: "ES" },
      {
        id: "7",
        name: "Amelia Harris",
        role: "HSE coordinator",
        initials: "AH",
      },
    ],
  },
  {
    name: "Medical team",
    members: [
      {
        id: "8",
        name: "Jasmine Morton",
        role: "Medical Officer",
        initials: "JM",
      },
      {
        id: "9",
        name: "Benjamin Thompson",
        role: "Medical Officer",
        initials: "BT",
      },
      { id: "10", name: "Zoe Nguyen", role: "Medical Officer", initials: "ZN" },
      { id: "11", name: "Sophie Davis", role: "Nurse", initials: "SD" },
    ],
  },
];

const messages = [
  {
    id: "1",
    senderId: "1",
    content:
      "Our teams are equipped with snow removal equipment and are ready to deploy. However, due to the severity of the storm, we're anticipating potential delays in response times.",
    timestamp: "12:32 PM",
  },
  {
    id: "2",
    senderId: "2",
    content:
      "Prioritize critical infrastructure and ensure the safety of our personnel.",
    timestamp: "12:32 PM",
  },
];

export default function Page() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility

  const handleSidebarClick = (memberId: string) => {
    setSelectedMember(memberId);
    setIsSidebarOpen(false); // Hide sidebar when a member is selected
  };

  const handleBackToSidebar = () => {
    setIsSidebarOpen(true); // Show sidebar when the back arrow is clicked
    setSelectedMember(null); // Deselect the member
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 bg-transparent mt-4">
        <div className="flex items-center gap-6">
          <BackButton />

          <div>
            <h1 className="text-[20px] font-medium leading-none">History</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-medium timerCOlor">23:05:283</div>

          <div className="logoutIconBG p-[8px] rounded-[10px] mr-4">
            <LogoutIcon />
          </div>
        </div>
      </div>
    <div className="flex h-screen sm:h-[75vh] sm:flex-row flex-col bg-custom-gradient gap-8">
      
      {/* chat ui */}
      <div
        className={`flex-1 flex flex-col bg-white rounded-[20px] ${
          selectedMember ? "block" : "hidden"
        } sm:block`}
      >
        <header className="h-16 border-b flex items-center justify-between px-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-700">
              GL
            </div>
            <div>
              <h1 className="text-base font-semibold text-[14px]">
                Gilbert Lambert
              </h1>
              <p className="text-sm text-gray-500 text-[12px]">
                Onsite Emergency Response Manager
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {selectedMember && (
              <Button
                variant="ghost"
                onClick={handleBackToSidebar}
                size="icon"
                className="text-black border border-black-700 p-2 w-10 h-10 rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-black border border-black-700 p-2 w-10 h-10 rounded-full flex items-center justify-center"
            >
              <Video className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-black border border-black-700 p-2 w-10 h-10 rounded-full flex items-center justify-center"
            >
              <Phone className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="flex-1 flex flex-col h-full sm:h-[65vh]">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                sender={
                  groups
                    .flatMap((g) => g.members)
                    .find((m) => m.id === message.senderId)!
                }
                isCurrentUser={message.senderId === "2"}
              />
            ))}
          </div>

          {/* Input area */}
          <div className="border-t p-4 bg-white">
            <div className="flex gap-2 items-center">
              <div className="flex flex-1 border rounded-lg bg-gray-100">
                <input
                  type="text"
                  placeholder="Type your message"
                  className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 bg-gray-100 focus:ring-green-500"
                />
                <Button className="h-11  w-11 bg-transparent shadow-none ">
                  <AttachSquareIcon  />
                </Button>
              </div>

              <Button className="bg-gradient-to-r rounded-full from-[rgba(36,120,20,1)] to-[rgba(61,162,41,1)] text-black p-2 w-10 h-10 rounded-full flex items-center justify-center">
                <SendIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-full sm:w-80 border-l overflow-y-auto rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] custom-scrollbar bg-white">
          {groups.map((group, groupIndex) => (
            <div key={group.name} className="mb-4">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-4 p-4 bg-[rgba(245,245,245,1)]">
                {group.name}
              </h3>
              <div className="space-y-3">
                {group.members.map((member, memberIndex) => (
                  <div
                    key={member.id}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100`}
                    onClick={() => handleSidebarClick(member.id)}
                  >
                    <TeamMemberAvatar member={member} />
                    <div>
                      <div className="text-[14px] font-semibold text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-[12px] text-gray-500">
                        {member.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    </div>

  );
}
