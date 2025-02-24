"use client";
import {
  useFetchProjectByIdQuery,
  useFetchProjectOrganizationRolesQuery,
  useStatisticsByProjectQuery,
} from "@/store/api/common/commonApi";
import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrganizationChart } from "@/components/super-admin/OrganizationChart";
import { useState } from "react";
import { FilterIcon } from "@/assets/icons/FilterIcon";
import { EditPenicon, ShareIcon } from "@/assets/icons/SvgIcons";
import BackButton from "@/components/admin/BackButton";
import { PreparednessChart } from "@/components/admin/PreparednessChart";
import { RecoveryChart } from "@/components/super-admin/RecoveryChart";
import { ResponseChart } from "@/components/super-admin/ResponseChart";
import { StaticsGraph } from "@/components/super-admin/StatisticsGraph";
import AddProjectOrganizationRoleForm from "@/components/common/AddProjectOrganizationRoleForm";

const page = ({ params }: { params: { _id: string } }) => {
  const projectId = params._id;

  const { data, isLoading, error,refetch } = useFetchProjectByIdQuery(projectId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addRoleModel, setAddRoleModel] = useState(false);
   const { data: projectOrganizationRoles, refetch: refetchProjectRoles } =
    useFetchProjectOrganizationRolesQuery({ projectId });
  const {
    data: overallStats,
    isLoading: statsLoading,
    refetch: statsRefetch,
  } = useStatisticsByProjectQuery(projectId);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closeAddroleModel = () => setAddRoleModel(false);

  useEffect(() => {
    refetch();
    statsRefetch();
  }, [statsRefetch]);

  if (!projectId) {
    return <div></div>;
  }

  if (isLoading) {
    return <div></div>;
  }

  const project = data?.data;
  // console.log("project data: ",project)
  return (
    <div className="w-full min-h-screen relative flex flex-col py-5 container">
      <div className="flex items-center justify-between mb-4 bg-transparent">
        <div className="flex items-center gap-6">
          <BackButton />

          <div>
            <h1 className="text-[20px] font-medium leading-none">
              {project?.name || "N/A"}
            </h1>
            <p className="text-[14px] text-muted-foreground mt-0.5">
              {project?.id || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="rounded-full border p-3 bg-white">
              <EditPenicon />
            </button>

            <button className="rounded-full border p-3 bg-white">
              <ShareIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-screen">
        {/* Header */}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mt-4 gap-4">
          <Button variant="outline" className="rounded-full w-full sm:w-auto">
            Statistics
          </Button>
          <FilterIcon />
        </div>

        <Card className="p-6 mb-6 pt-16 adminDashboardBg">
          <div className="flex flex-col lg:flex-row items-start">
            {/* Left Section */}
            <div className="w-full lg:w-[22%] bg-white p-8 rounded-[20px] pt-12 pb-12">
            <h2 className="text-[28px] mb-1">{overallStats?.totalIncidents || 0}</h2>
              <p className="adminDashboardTextTitle">Total Incidents</p>
              <h2 className="text-[28px] mb-1 mt-4">
                15<span className="text-base text-gray-500">/min</span>
              </h2>
              <p className="adminDashboardTextTitle">Emergency Response Time</p>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-[78%]">
              <StaticsGraph incidentStats={overallStats}  />
            </div>
          </div>
        </Card>

        <div className="flex flex-wrap gap-6 mb-6">
          {/* Prevention */}
          <Card
            className="adminDashboardBg p-6 flex-grow text-lg font-semibold text-center xl:text-left 2xl:text-left rounded-[20px]"
            style={{ flexBasis: "11.67%" }}
          >
            <h3 className="adminDashboardText mb-4">Prevention</h3>
            <div className="space-y-4">
              <div className="mt-8">
                <h1 className="text-[28px] font-medium">15</h1>
                <div className="adminDashboardTextTitle">Thermal suit</div>
              </div>
              <div>
                <h1 className="text-[28px] font-medium mt-8">24</h1>
                <div className="adminDashboardTextTitle">Thermal Hardware</div>
              </div>
              <div>
                <h1 className="text-[28px] font-medium mt-8">120</h1>
                <div className="adminDashboardTextTitle">Wristband</div>
              </div>
            </div>
          </Card>

          {/* Preparedness */}
          <Card
            className="p-6 flex-grow adminDashboardBg h-auto rounded-[20px]"
            style={{ flexBasis: "50%" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="adminDashboardText mb-4">Preparedness</h3>
              <FilterIcon />
            </div>
            <PreparednessChart />
          </Card>

          {/* Response & Recovery */}
          <div className="flex flex-col gap-6" style={{ flexBasis: "26.33%" }}>
            {/* Response */}
            <Card className="pt-6 pb-6 adminDashboardBg h-auto lg:h-[10rem] rounded-[20px]">
              <div className="flex justify-between items-center ml-4 mr-4 mb-2">
                <h3 className="adminDashboardText mb-4">Response</h3>
                <FilterIcon />
              </div>
              <ResponseChart />
            </Card>

            {/* Recovery */}
            <Card className="pt-6 pb-6 adminDashboardBg h-auto lg:h-[10rem] rounded-[20px]">
              <div className="flex justify-between items-center ml-4 mr-4">
                <h3 className="adminDashboardText mb-4">Recovery</h3>
                <FilterIcon />
              </div>
              <RecoveryChart />
            </Card>
          </div>
        </div>

        <div className="">
          <Card className="p-2 rounded-[50px] border-none shadow-none mb-4">
            <div
              className="grid gap-6 md:grid-cols-3 mb-6 p-6 rounded-t-[50px] "
              style={{ background: "rgba(236, 244, 234, 1)" }}
            >
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">
                  Country
                </h2>
                <p className="font-medium">
                  {project?.location?.country?.name || "N/A"}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">
                  Region
                </h2>
                <p className="font-medium">
                  {project?.location?.region?.name || "N/A"}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">
                  Worksite
                </h2>
                <p className="font-medium">
                  {project?.location?.worksite?.name || "N/A"}
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-6">
                <h2 className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </h2>
                <p className="text-sm text-muted-foreground">
                  <p className="text-sm text-muted-foreground">
                    {project?.description || "No description available."}
                  </p>
                </p>
              </div>

              <div className="space-y-6">
                {project?.roles.map((role, index) => (
                  <>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h2 className="text-sm font-medium text-muted-foreground mb-2">
                          Role
                        </h2>
                        <p className="font-medium">{role?.team?.name}</p>
                      </div>
                      <div className="space-y-4">
                        {role?.employees.map((employee) => (
                          <div>
                            <h2 className="text-sm font-medium text-muted-foreground mb-2">
                              Assigned to
                            </h2>
                            <p className="font-medium">{employee?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {employee?.designation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {index + 1 !== project.roles.length && <hr />}
                  </>
                ))}

                {/* <div className="grid gap-6 md:grid-cols-2">
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
                </div> */}
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-[50px] ">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg ">Organisation chart</h2>
              <Button
                onClick={() => setAddRoleModel(true)}
                className="bgClolorofOrg flex items-center space-x-1 p-5 w-full sm:w-auto border-none shadow-none"
              >
                <div className="border-[1px] border-green-500 rounded-[5px] p-[1px]">
                  <Plus className="text-green-500" />
                </div>
                <span className="text-green-500">Add new</span>
              </Button>
            </div>
            <OrganizationChart data={projectOrganizationRoles?.data} />
          </Card>

          {addRoleModel && (
            <AddProjectOrganizationRoleForm
            refetch={refetch}
              projectId={projectId}
              closeModel={closeAddroleModel}
              refetchProjectRoles={refetchProjectRoles}
            />
          )}

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

                <div className="mb-8">
                  <label className="block text-sm font-medium mb-1">
                    Employee
                  </label>
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
      </div>
    </div>
  );
};

export default page;
