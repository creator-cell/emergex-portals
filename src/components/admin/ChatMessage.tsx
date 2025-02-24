interface ChatMessageProps {
  message: Message;
  sender: TeamMember;
  isCurrentUser?: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export function ChatMessage({
  message,
  sender,
  isCurrentUser,
}: ChatMessageProps) {
  return (
    <div
      className={`flex gap-3 mt-6 ${isCurrentUser ? "flex-row-reverse" : ""}`}
    >
      {/* <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-700 flex-shrink-0">
        {sender.initials}
      </div> */}
      <div className={`max-w-[70%] ${isCurrentUser ? "text-right" : ""}`}>
        {/* <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">
            {sender.name}
          </span>
          <span className="text-xs text-gray-500">{message.timestamp}</span>
        </div> */}
        <div
          className={`p-3 ${
            isCurrentUser
              ? "bg-[rgba(55,55,55,1)] text-white rounded-t-lg rounded-bl-lg text-[14px]"
              : "bg-[rgba(24,118,5,1)] text-white rounded-t-lg rounded-br-lg text-[14px]"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
