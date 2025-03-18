import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAddRoleInProjectOrganizationChartMutation, useFetchProjectOrganizationEmployeesQuery } from "@/store/api/common/commonApi";
import { useFetchEmployeesQuery, useFetchRolesQuery, useGetTeamDetailsQuery, useGetTeamsNamesQuery } from "@/store/api/team/teamApi";

type AddProjectOrganizationRoleFormProps = {
    projectId: string;
    closeModel: any;
    refetchProjectRoles: any;
    refetch: any
};

const schema = z.object({
    role: z.union([z.string().regex(/^[a-f\d]{24}$/i, "Invalid team ID"), z.string().length(0)]).optional(),
    employee: z.string().nonempty("Employee ID is required").regex(/^[a-f\d]{24}$/i, "Invalid employee ID"),
    from: z.union([z.string().regex(/^[a-f\d]{24}$/i, "Invalid from employee ID"), z.string().length(0)]).optional(),
    to: z.union([z.string().regex(/^[a-f\d]{24}$/i, "Invalid to employee ID"), z.string().length(0)]).optional(),
});


const AddProjectOrganizationRoleForm: React.FC<AddProjectOrganizationRoleFormProps> = ({ projectId, closeModel, refetchProjectRoles, refetch }) => {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            role: "",
            employee: "",
            from: "",
            to: "",
        },
    });

    const selectedTeam = watch("role");
    const { data: projectEmployeesResponse } = useFetchProjectOrganizationEmployeesQuery({ projectId, priority: true });
    const projectEmployees = projectEmployeesResponse?.data?.[0]?.employees || []

    const { data: projectEmployeesWithoutPriorityResponse } = useFetchProjectOrganizationEmployeesQuery({ projectId, priority: false });
    const projectEmployeesWithoutPriority = projectEmployeesWithoutPriorityResponse?.data?.[0]?.employees || []

    const { data: teamApiResponse } = useGetTeamsNamesQuery();
    const { data: rolesApiResponse } = useFetchRolesQuery();
    const { data: employeesResponse } = useFetchEmployeesQuery();

    const teamData = teamApiResponse?.data;

    const { data: teamDetails } = useGetTeamDetailsQuery(selectedTeam, {
        skip: !selectedTeam,
    });
    const teamEmployees = employeesResponse?.data

    const rolesData = rolesApiResponse?.data

    const [addRoleInProjectOrganizationChart, { isLoading, isError }] =
        useAddRoleInProjectOrganizationChartMutation();


    const selectedFrom = watch("from");

    const onSubmit = async (data: any) => {
        try {
            const response = await addRoleInProjectOrganizationChart({
                id: projectId,
                from: data.from || undefined,
                to: data.to || undefined,
                role: data.role || undefined,
                employee: data.employee,
            }).unwrap();


            await refetchProjectRoles();
            await refetch();
            reset();
            closeModel();
        } catch (error) {
            console.error("Error adding role:", error);
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-[20px] p-6 w-[500px] shadow-lg">
                <h3 className="text-lg mb-4">Add New Role</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* From Employee */}
                        <div className="space-y-2">
                            <Label>From</Label>
                            <Controller
                                name="from"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger className="h-12">
                                            <SelectValue placeholder="Select from employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projectEmployees.map((employee: any, index: number) => (
                                                <SelectItem key={employee._id + index} value={employee._id}>
                                                    {employee.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.from && (
                                <p className="text-red-500 text-sm">{errors.from.message}</p>
                            )}
                        </div>

                        {/* To Employee */}
                        <div className="space-y-2">
                            <Label>To</Label>
                            <Controller
                                name="to"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger className="h-12">
                                            <SelectValue placeholder="Select to employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projectEmployees.map((employee: any, index: number) => (
                                                <SelectItem
                                                    key={employee._id + index}
                                                    value={employee._id}
                                                    disabled={employee._id === selectedFrom}
                                                >
                                                    {employee.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.to && (
                                <p className="text-red-500 text-sm">{errors.to.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Team */}
                    <div className="space-y-2">
                        <Label>Role
                        <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rolesData?.map((team: any, index: number) => (
                                            <SelectItem
                                                key={team._id + index}
                                                value={team._id}
                                            >
                                                {team.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.team && (
                            <p className="text-red-500 text-sm">{errors.team.message}</p>
                        )}
                    </div>

                    {/* Employee */}
                    <div className="space-y-2">
                        <Label>Employee
                        <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                            name="employee"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {teamEmployees?.map((team: any, index: number) => (
                                            <SelectItem
                                                key={team._id + index}
                                                value={team._id}
                                            >
                                                {team.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.employee && (
                            <p className="text-red-500 text-sm">{errors.employee.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            className="bg-gray-200 text-gray-700"
                            onClick={() => {
                                reset()
                                closeModel()
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-[rgba(36,120,20,1)] to-[rgba(61,162,41,1)] hover:bg-gradient-to-l text-white"
                        >
                            {isLoading ? "Adding Role" : "Add New"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectOrganizationRoleForm;
