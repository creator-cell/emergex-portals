"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { gps } from "@/assets/icons";
import Image from "next/image";
import { Input } from "../ui/input";

// Zod validation schema for the form
const schema = z.object({
    branchName: z.array(z.string()).nonempty("Please select at least one task type"),
    location: z.string()

});

export type schemaType = z.infer<typeof schema>;

const AddBranchForm = () => {


    const formMethods = useForm<schemaType>({
        resolver: zodResolver(schema),
        defaultValues: {
        },
        mode: "all",
        criteriaMode: "all",
        progressive: true,
        reValidateMode: "onChange",
    });

    const { control, handleSubmit, watch, formState: { errors } } = formMethods;

    // Handle form submission
    const onSubmit = (data: schemaType) => {
        console.log("🚀 ~ onSubmit ~ data:", data)
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="w-full space-y-1 my-2">
                <Label className="block text-[20px] font-medium text-[#1E1E1E]">
                    Add new branch
                </Label>
                <div className=" text-[16px] leading-6 font-normal text-[#636B62]" >Add some description in 2 line </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <div className="mb-4 ">
                    <Label htmlFor="branchName" className="block text-sm font-medium text-gray-700">
                        Branch name
                    </Label>
                    <Controller
                        name="branchName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="branchName"
                                type="text"
                                placeholder="Enter the branch name"
                                className="mt-1"

                            />
                        )}
                    />
                    {errors?.branchName && (
                        <span className="text-red-500 text-xs">{errors.branchName.message}</span>
                    )}

                </div>
                <div className="mb-4 relative">
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Location
                    </Label>
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <div className="relative">
                                <Input
                                    {...field}
                                    id="description"
                                    placeholder="Add  the branch location from map"
                                    className="mt-1 peer pe-4"
                                />
                                <div className="pointer-events-auto cursor-pointer absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                    <Image
                                        src={gps ?? ""}
                                        alt="gps"
                                        width={16}
                                        height={16}
                                    />
                                </div>
                            </div>

                        )}
                    />

                    {errors?.location && (
                        <span className="text-red-500 text-xs">{errors.location.message}</span>
                    )}
                </div>
                <div className="self-end flex gap-6 mt-3" >
                    <Button className="bg-gray-300 text-black hover:bg-gray-300  rounded-2xl w-28 py-2" type="button"> Cancel</Button>
                    <Button
                        className="rounded-2xl w-28 py-2"
                        style={{
                            background: "linear-gradient(89.14deg, #3DA229 0.68%, #247814 100%)"
                        }}
                    >
                        Add New
                    </Button>
                </div>

            </form>
        </div >
    );
};

export default AddBranchForm;
