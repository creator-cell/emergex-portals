"use client";

import { useState } from "react";
import { TeamSection } from "@/components/super-admin/TeamSection";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner"; // Import toast for notifications
import {
  useAddMembersInTeamMutation,
  useAddTeamMutation,
  useFetchTeamsQuery,
} from "@/store/api/team/teamApi";

const emergencyTeam = [
  {
    name: "Gilbert Lambert",
    contactNumber: "+21 5483 2323",
    email: "gilbertlambert@gmail.com",
    designation: "ERT Manager",
  },
  {
    name: "Alan Glennie",
    contactNumber: "+21 5483 2323",
    email: "gilbertlambert@gmail.com",
    designation: "Coastguard Focal Point",
  },
  {
    name: "Colin Sellar",
    contactNumber: "+21 5483 2323",
    email: "gilbertlambert@gmail.com",
    designation: "Operations Focal Point",
  },
];

const hrTeam = [
  {
    name: "Adrian Chubb",
    contactNumber: "+21 5483 2323",
    email: "gilbertlambert@gmail.com",
    designation: "Team Lead",
  },
  {
    name: "Gabriel Amaral",
    contactNumber: "+21 5483 2323",
    email: "gilbertlambert@gmail.com",
    designation: "Team Lead",
  },
];

interface Employee {
  _id: string; // Assuming _id is a string. Adjust the type if it's different.
  name: string; // You can add other properties as needed.
}

export default function Page() {
  const { data: teams, isLoading, refetch } = useFetchTeamsQuery(); // Get teams and refetch function
  const [addTeam, { isLoading: isAdding }] = useAddTeamMutation();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [teamName, setTeamName] = useState(""); // Team name state

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleAddTeam = async () => {
    if (!teamName) return; // Ensure the team name is provided

    try {
      const response = await addTeam({ name: teamName }).unwrap();

      if (response.success) {
        setTeamName(""); // Clear the team name input
        closeModal(); // Close the modal after submission

        refetch();

        toast.success(response.message || "Team added successfully!");
      } else {
        toast.error(response.message || "Failed to add team.");
      }
    } catch (error: any) {
      console.error("Error adding team:", error);

      if (error?.data?.error) {
        toast.error(error.data.error); // Display backend error message
      } else {
        // Handle unexpected errors
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };


  const [addMembersInTeam, { isLoading: isAddingMembers }] =
    useAddMembersInTeamMutation();

  const handleAddMembers = async (
    selectedEmployees: Employee[],
    teamId: string
  ) => {
    try {
      const employeeIds = selectedEmployees.map((emp) => emp._id); // Extract only the IDs
      await addMembersInTeam({
        teamId: teamId, // Now using the teamId passed as an argument
        employeeId: employeeIds, // Pass the selected employee IDs
      }).unwrap();

      refetch();

      toast.success("Members added successfully!");
    } catch (error: any) {
      console.error("Error adding members:", error);

      if (error?.data?.error) {
        toast.error(error.data.error); // Show backend error message
      } else {
        toast.error("Failed to add members. Please try again.");
      }
    }
  };


  if (isLoading) return <div></div>;

  return (
    <div className="min-h-screen p-8 ">
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-end mb-8">
          <Button
            className="bg-gradient-to-r rounded-full from-[rgba(61,162,41,1)] to-[rgba(36,120,20,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-3 w-full sm:w-auto"
            onClick={openModal}
          >
            <div className="border-[1px] border-white rounded-[5px]">
              <Plus className="text-white" />
            </div>
            <span className="text-white text-[16px]">Add team</span>
          </Button>
        </div>

        {/* Teams List */}
        {teams?.data?.map((team) => (
          <TeamSection
            key={team._id}
            title={team.name}
            members={team.members}
            onAddMember={handleAddMembers}
            teamId={team._id} // Pass the team ID here
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-[40px] p-6 w-[500px] shadow-lg">
            <h3 className="text-lg mb-4">Add new team</h3>

            {/* Team Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-normal mb-1">
                Team Name           <span className="text-red-500">*</span>

              </label>
              <div className="flex items-center border p-2 rounded">
                <input
                  type="text"
                  className="w-full border-none outline-none"
                  placeholder="Enter Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)} // Update team name state
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                className="bg-gray-200 text-gray-700 rounded-[20px]"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r rounded-[20px] from-[rgba(36,120,20,1)] to-[rgba(61,162,41,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-5 w-full sm:w-auto"
                onClick={handleAddTeam}
                disabled={isAdding}
              >
                {isAdding ? (
                  <div className="h-5 w-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-white">Add new</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
