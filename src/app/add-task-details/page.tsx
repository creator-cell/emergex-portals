import AddTaskDetailsForm from "@/components/admin/add-task-details-comp/AddTaskDetailsForm";
import Nav from "@/components/main/Nav";
import React from "react";

const page = () => {
  return (
    <div className=" container min-h-screen  ">
      {" "}
      <Nav Sidebar={false} />
      <AddTaskDetailsForm />
    </div>
  );
};

export default page;
