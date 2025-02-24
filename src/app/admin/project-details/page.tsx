"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrganizationChart } from "@/components/super-admin/OrganizationChart";
import { useState } from "react";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="p-2 rounded-[50px]">
        <div className="grid gap-6 md:grid-cols-3 mb-6 p-6 rounded-t-[50px] " style={{ background: 'rgba(236, 244, 234, 1)' }}>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              Country
            </h2>
            <p className="font-medium">United States, Saudi Arabia</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              Region
            </h2>
            <p className="font-medium">Puerto Rico, Guam</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              Worksite
            </h2>
            <p className="font-medium">Kingman Reef, Baker Island</p>
          </div>
        </div>
        <div className="p-4">
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Description
          </h2>
          <p className="text-sm text-muted-foreground">
            The Titan Oil Rig Emerge-x cases is set to revolutionize offshore
            exploration and production. Located in the vibrant waters of the
            Gulf of Mexico, this ambitious initiative aims to tap into untapped
            reserves while ensuring minimal environmental impact. With
            state-of-the-art technology and a dedicated team of experts, the
            Emerge-x cases promises to enhance energy security and create
            numerous job opportunities in the region. The exploration phase is
            expected to commence in early 2024, paving the way for sustainable
            production practices that prioritize safety and efficiency.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">
                Role
              </h2>
              <p className="font-medium">Onsite Emergency Response Manager</p>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">
                  Assigned to
                </h2>
                <p className="font-medium">Gilbert Lambert</p>
                <p className="text-sm text-muted-foreground">Manager</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">
                  Assigned to
                </h2>
                <p className="font-medium">Gilbert Lambert</p>
                <p className="text-sm text-muted-foreground">
                  Assistant Manager
                </p>
              </div>
            </div>
          </div>

          <hr />

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">
                Role
              </h2>
              <p className="font-medium">Onsite ERT Leader</p>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">
                  Assigned to
                </h2>
                <p className="font-medium">Daniel Brown</p>
                <p className="text-sm text-muted-foreground">Manager</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">
                  Assigned to
                </h2>
                <p className="font-medium">Gilbert Lambert</p>
                <p className="text-sm text-muted-foreground">
                  Assistant Manager
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </Card>

      <Card className="p-6 rounded-[50px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg ">Organisation chart</h2>
          <Button onClick={openModal} className="bg-gradient-to-r rounded-full from-[rgba(36,120,20,1)] to-[rgba(61,162,41,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-5 w-full sm:w-auto">
        <div className="border-[1px] border-white rounded-[5px] p-[1px]">
          <Plus className="text-white" />
        </div>
        <span className="text-white">Add new</span>
      </Button>
          
        </div>
        <OrganizationChart />
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-[40px] p-6 w-[500px] shadow-lg">
            <h3 className="text-lg mb-4">Add new role</h3>

            {/* Role Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Role</label>
              <select className="w-full p-2 border rounded">
                <option>Client</option>
              </select>
            </div>

            {/* Employee Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-1">Employee</label>
              <select className="w-full p-2 border rounded">
                <option>Manager</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                className="bg-gray-200 text-gray-700"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button className="bg-gradient-to-r rounded-full from-[rgba(36,120,20,1)] to-[rgba(61,162,41,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-5 w-full sm:w-auto">
                <span className="text-white">Add new</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
