import Link from "next/link";
import React from "react";

interface TasklistTabTogletypes {
  tab: string;
}
const TasklistTabTogle: React.FC<TasklistTabTogletypes> = ({ tab }) => {

  return (
    <div className="flex">
      <Link href={"?tab=assigned-task"}>
        <div
          className={`text-base p-4 ${
            tab == "tab=unassigned-task" ? "" : "border-b-2 border-b-[#3DA229] text-[#3DA229]"
          }`}
        >
          Assigned Task
        </div>
      </Link>
      <Link href={"?tab=unassigned-task "}>
        <div
          className={`text-base p-4 ${
            tab == "tab=unassigned-task" ? " border-b-2 border-b-[#3DA229] text-[#3DA229]" : ""
          }`}
        >
          Unassigned Task
        </div>
      </Link>
    </div>
  );
};

export default TasklistTabTogle;
