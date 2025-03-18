import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TeamMemberCard } from "./TeamMemberCard";
import { useEffect, useState } from "react";
import { useFetchEmployeesQuery } from "@/store/api/team/teamApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TeamMember {
  name: string;
  contactNo: string;
  email: string;
  designation: string;
}

interface TeamSectionProps {
  title: string;
  members: TeamMember[];
  onAddMember?: (selectedEmployees: any[], teamId: string) => void; // Add teamId to the onAddMember callback
  onMemberClick?: (member: TeamMember) => void;
  teamId: string; // Add teamId prop
}

export function TeamSection({
  title,
  members,
  onAddMember,
  onMemberClick,
  teamId, // Receive teamId as a prop
}: TeamSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: employees, isLoading } = useFetchEmployeesQuery();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]); // Store multiple selections

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees(
      (prev) =>
        prev.includes(employeeId)
          ? prev.filter((id) => id !== employeeId) // Remove if already selected
          : [...prev, employeeId] // Add if not selected
    );
  };

  const handleAddMember = () => {

    if (selectedEmployees.length > 0 && onAddMember) {
      const selected = employees?.data?.filter((emp: any) =>
        selectedEmployees.includes(emp._id)
      );
      if (selected) {
        onAddMember(selected, teamId); // Pass the selected employees and teamId
      }
    }
    setIsDropdownOpen(false); // Close the dropdown
    setSelectedEmployees([]); // Reset the selection
  };

  return (
    <div className="mb-8 teamMemeberBG">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button
          className="rounded-full bg-white text-green h-12 flex items-center justify-center"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Plus className="h-4 w-4 mr-2 border border-black rounded-[5px]" />
          Add Team Member
        </Button>
      </div>
      <div>
        {members.map((member, index) => (
          <TeamMemberCard key={index} {...member} />
        ))}
      </div>

      {isDropdownOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-[40px] p-6 w-[500px] shadow-lg">
            <h3 className="text-lg mb-4 font-bold">Add Employees to {title}                 <span className="text-white">Add new</span>
            </h3>

            {/* Multi-select Dropdown */}
            <div className="mb-6">
              {isLoading && <p>Loading...</p>}
              <Select
                onValueChange={(employeeId) => handleSelectEmployee(employeeId)}
              >
                <SelectTrigger className="w-full h-12 border rounded">
                  <SelectValue placeholder="Select Employees" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.data?.map((employee: any) => (
                    <SelectItem
                      key={employee._id}
                      value={employee._id}
                      className={`${selectedEmployees.includes(employee._id)
                          ? "font-bold text-green-600"
                          : ""
                        }`}
                    >
                      {employee.name} - {employee.email} -{" "}
                      {employee.designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Display Selected Employees */}
              {selectedEmployees.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold text-sm text-gray-600 mb-2">
                    Selected Employees:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {employees?.data
                      ?.filter((employee: any) =>
                        selectedEmployees.includes(employee._id)
                      )
                      .map((employee: any) => (
                        <span
                          key={employee._id}
                          className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {employee.name}
                          <button
                            onClick={() => handleSelectEmployee(employee._id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                className="bg-gray-200 text-gray-700 rounded-[20px]"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r rounded-[20px] from-[rgba(36,120,20,1)] to-[rgba(61,162,41,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-5 w-full sm:w-auto"
                onClick={handleAddMember}
              >
                <span className="text-white">Add Members</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
