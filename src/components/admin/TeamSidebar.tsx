interface TeamSidebarProps {
  groups: TeamGroup[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor?: string;
}

interface TeamGroup {
  name: string;
  members: TeamMember[];
}

function TeamMemberAvatar({ member }: { member: TeamMember }) {
  return (
    <div className="w-8 h-8 rounded-full chatAvatarBg flex items-center justify-center text-sm font-medium text-emerald-700">
      {member.initials}
    </div>
  );
}

export function TeamSidebar({ groups }: TeamSidebarProps) {
  return (
    <div className="w-80 border-l overflow-y-auto rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] custom-scrollbar ml-4 mr-4 bg-white">
      {groups.map((group, groupIndex) => (
        <div key={group.name} className="mb-4">
          <h3 className="text-[13px] font-semibold text-gray-900 mb-4 p-4 bg-[rgba(245,245,245,1)]">
            {group.name}
          </h3>
          <div className="space-y-3">
            {group.members.map((member, memberIndex) => (
              <div
                key={member.id}
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                  groupIndex === 0 && memberIndex === 0
                    ? "bg-[rgba(235,248,237,1)]"
                    : ""
                }`}
              >
                <TeamMemberAvatar member={member} />
                <div>
                  <div className="text-[14px] font-semibold text-gray-900">
                    {member.name}
                  </div>
                  <div className="text-[12px] text-gray-500">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
