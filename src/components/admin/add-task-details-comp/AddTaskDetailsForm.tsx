"use client";
import { EditPenicon, ImageIcon } from "@/assets/icons/SvgIcons";
import { Input } from "@/components/ui/input";
import React, { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SignaturePad from "react-signature-pad-wrapper";
import AddNewForm from "@/components/common/AddNewForm";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Label from "@/components/common/Label";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  level: string;
  status: string;
  injuredPeople: number;
  startTime: string;
  endTime: string;
  location: string;
  damgeAssets: string;
  finance: string;
  utilityeffected: string[];
  images: any[];
  signature: string;
  informtoHRteam: boolean;
  agreeTermsConditionPrimaryPolicy: boolean;
}

// Yup Validation Schema
const validationSchema = Yup.object({
  level: Yup.string().required("Level is required"),
  status: Yup.string().required("Status is required"),
  injuredPeople: Yup.number()
    .required("Injured people count is required")
    .min(1, "At least one person is injured")
    .typeError("Please enter a valid number"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),
  location: Yup.string().required("Location is required"),
  damgeAssets: Yup.string().required("Damge Assets is required"),
  finance: Yup.string().required("Finance Assets is required"),
  utilityeffected: Yup.array()
    .test(
      "at-least-one-checked",
      "At least one checkbox must be selected",
      (value) => value && value.length > 0
    )
    .required("This field is required"),
  images: Yup.array()
    .of(Yup.string())
    .min(1, "Please upload at least one image.")
    .required("Images are required."),
  signature: Yup.string().required("Signature is required"),
  informtoHRteam: Yup.boolean()
    .oneOf([true], "You must check this filled.")
    .required("This field is required"),
  agreeTermsConditionPrimaryPolicy: Yup.boolean()
    .oneOf([true], "You must check this filled.")
    .required("This field is required"),
});

const sugetionLocation = [
  { location: "Primrose Hil" },
  { location: "Millennium Bridge" },
];
const utilityeffected = [
  { title: "Water" },
  { title: "Electricity" },
  { title: "Swage" },
];

const AddTaskDetailsForm = () => {
  const [selectedLocation, setSelectedLocation] = useState("");

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const sigPadRef = useRef<any>(null);
const route=useRouter()
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: { images: [] },
  });
  const images = watch("images");

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64Result = reader.result as string;
            setValue("images", [...(images || []), base64Result]);
          };
          reader.readAsDataURL(file); // Convert file to Base64
        });
      }
    },
    [images, setValue]
  );

  const removeImage = (index: number) => {
    const updatedImages = [...(images || [])];
    updatedImages.splice(index, 1);
    setValue("images", updatedImages);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };
  const handleParentDivClick = () => {
    // Trigger the input file click event
    inputFileRef.current?.click();
  };

  const clearSignature = () => {
    sigPadRef.current.clear();
  };

  const saveSignature = () => {
    const signatureData = sigPadRef.current.toDataURL(); // Get the Base64 image
    setValue("signature", signatureData);
    console.log(signatureData);
  };

  const signature = watch("signature");

  const onSubmit = (data: FormData) => {
    alert(`You selected: ${data.level}`);
  };

  return (
    <div>
          <div className="flex justify-between items-center bg-transparent p-6 rounded-lg">
      <div className="flex flex-col">
        <span className="text-[14px] colorBGSubHeading">Project name</span>
        <span className="text-[16px] font-semibold">Exploration and Production</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[14px] colorBGSubHeading">Worksite</span>
        <span className="text-[16px] font-semibold">Perdido</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[14px] colorBGSubHeading">Country</span>
        <span className="text-[16px] font-semibold">United States</span>
      </div>
    </div>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border rounded-[15px] w-full px-[32px] py-[40px] md:rounded-[40px] space-y-10 bg-white"
    >
      <div className="border-b-2 border-[#D9D9D9] pb-4">
        <div>
          <h2 className="text-darkish text-xl font-medium">Snow fall</h2>
          <p className="text-[#B3B3B3] text-sm">Task ID : FIRMD-273UY</p>
        </div>
        <div className="flex justify-between mt-2">
          <div className="w-[85%] sm:w-[75%] md:w-[50%]">
            <p className="text-base text-[#434343]">
              Slip and fall occurred at Company due to adverse weather
              conditions caused by snowfall.
            </p>
          </div>
          <div>
            <button className="rounded-full border p-3">
              <EditPenicon />
            </button>
          </div>
        </div>
      </div>

      <div className=" space-y-2">
        <Label text="Level" />
        <div>
          <div className="flex flex-wrap gap-2  md:gap-4  text-darkish">
            <Controller
              name="level"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      {...field}
                      value="level 1"
                      className="hidden"
                    />
                    <div
                      className={` py-1.5 px-3 md:px-4 rounded-md text-sm  sm:text-base font-medium border border-[#D9D9D9] ${
                        field.value === "level 1"
                          ? " bg-light-greento-white border border-transparent"
                          : "bg-white  hover:bg-green-50 border border-[#D9D9D9]"
                      }`}
                    >
                      level 1
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      {...field}
                      value="level 2"
                      className="hidden"
                    />
                    <div
                      className={` py-1.5 px-3 md:px-4 rounded-md text-sm   sm:text-base font-medium border border-[#D9D9D9] ${
                        field.value === "level 2"
                          ? " bg-light-greento-white border border-transparent"
                          : "bg-white  hover:bg-green-50 border border-[#D9D9D9]"
                      }`}
                    >
                      level 2
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      {...field}
                      value="level 3"
                      className="hidden"
                    />
                    <div
                      className={` py-1.5 px-3 md:px-4 rounded-md  text-sm sm:text-base font-medium border border-[#D9D9D9] ${
                        field.value === "level 3"
                          ? " bg-light-greento-white border border-transparent"
                          : "bg-white  hover:bg-green-50 border border-[#D9D9D9]"
                      }`}
                    >
                      level 3
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      {...field}
                      value="level 4"
                      className="hidden"
                    />
                    <div
                      className={` py-1.5 px-3 md:px-4 rounded-md text-sm   sm:text-base font-medium border border-[#D9D9D9] ${
                        field.value === "level 4"
                          ? " bg-light-greento-white border border-transparent"
                          : "bg-white  hover:bg-green-50 border border-[#D9D9D9]"
                      }`}
                    >
                      level 4
                    </div>
                  </label>
                </>
              )}
            />
          </div>
          {errors.level && (
            <p className="text-red-500 text-sm">{errors.level.message}</p>
          )}
        </div>
      </div>

      <div className=" space-y-2">
        <Label text="Status" />
        <div className="flex flex-wrap gap-2  md:gap-4  text-darkish">
          <Controller
            name="status"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    {...field}
                    value="in progress"
                    className="hidden"
                  />
                  <div
                    className={` py-1.5 px-3 md:px-4 rounded-md text-sm  sm:text-base font-medium border border-[#D9D9D9] ${
                      field.value === "in progress"
                        ? " bg-green-50 border  border-customGreen shadow-md"
                        : "bg-white  hover:bg-green-50 border border-[#D9D9D9]"
                    }`}
                  >
                    In Progress
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    {...field}
                    value="assigned"
                    className="hidden"
                  />
                  <div
                    className={` py-1.5 px-3 md:px-4 rounded-md text-sm   sm:text-base font-medium border border-[#D9D9D9] ${
                      field.value === "assigned"
                        ? " bg-green-50 border  border-customGreen shadow-md"
                        : "bg-white  hover:bg-green-50 border border-[#D9D9D9]"
                    }`}
                  >
                    Assigned
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    {...field}
                    value="delayed"
                    className="hidden"
                  />
                  <div
                    className={` py-1.5 px-3 md:px-4 rounded-md  text-sm sm:text-base font-medium border border-[#D9D9D9] ${
                      field.value === "delayed"
                        ? " bg-green-50 border  border-customGreen shadow-md"
                        : "bg-white  hover:bg-green-50 border border-[#D9D9D9]"
                    }`}
                  >
                    Delayed
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    {...field}
                    value="completed"
                    className="hidden"
                  />
                  <div
                    className={` py-1.5 px-3 md:px-4 rounded-md text-sm   sm:text-base font-medium border border-[#D9D9D9] ${
                      field.value === "completed"
                        ? " bg-green-50 border  border-customGreen shadow-md"
                        : "bg-white  hover:bg-green-50 border border-[#D9D9D9]"
                    }`}
                  >
                    Completed
                  </div>
                </label>
              </>
            )}
          />
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className=" space-y-2 ">
        <Label text="Assigned to" htmlFor="Damageassets" />
        <div>
          <Controller
            name="damgeAssets"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger className="outline-none h-12">
                  <SelectValue placeholder="Gilbert Lambert" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assets 1">Gilbert Lambert</SelectItem>
                  <SelectItem value="assets 2">Gilbert Lambert</SelectItem>
                  <SelectItem value="assets 3">aGilbert Lambert</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.damgeAssets && (
            <p className="text-red-500 text-sm">{errors.damgeAssets.message}</p>
          )}
        </div>
      </div>

      <div className=" grid grid-cols-1 md:grid-cols-2  gap-4">
        <div className=" space-y-2 ">
          <Label text="Count of injured people" htmlFor="countinjuredPeople" />
          <div>
            <Controller
              name="injuredPeople"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  id="countinjuredPeople"
                  placeholder="Injured people"
                  className=" outline-none h-12"
                />
              )}
            />
            {errors.injuredPeople && (
              <p className="text-red-500 text-sm">
                {errors.injuredPeople.message}
              </p>
            )}
          </div>
        </div>

        <div className=" space-y-2 ">
          <Label text="Count of total people" htmlFor="counttotalPeople" />
          <div>
            <Controller
              name="injuredPeople"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  id="countinjuredPeople"
                  placeholder="Total count"
                  className=" outline-none h-12"
                />
              )}
            />
            {errors.injuredPeople && (
              <p className="text-red-500 text-sm">
                {errors.injuredPeople.message}
              </p>
            )}
          </div>
        </div>

        {/* <div className=" space-y-2">
          <Label text="Starting time" htmlFor="Startingtime" />
          <div>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="time"
                  id="Startingtime"
                  placeholder="Start Time"
                  className=" outline-none h-12"
                />
              )}
            />
            {errors.startTime && (
              <p className="text-red-500 text-sm">{errors.startTime.message}</p>
            )}
          </div>
        </div> */}

        {/* <div className=" space-y-2">
          <Label text="Ending time" htmlFor="EndTime" />
          <div>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="time"
                  id="EndTime"
                  placeholder="End Time"
                  className=" outline-none h-12"
                />
              )}
            />
            {errors.endTime && (
              <p className="text-red-500 text-sm">{errors.endTime.message}</p>
            )}
          </div>
        </div> */}
      </div>
      <div className=" space-y-2">
        <Label text="Location" htmlFor="location" />
        <div>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                id="location"
                placeholder="Location"
                className=" outline-none h-12"
              />
            )}
          />
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedLocation("Current location");
                setValue("location", "");
              }}
              className={` px-2.5 py-1 rounded-full text-base ${
                selectedLocation === "Current location"
                  ? " bg-[#CFF7D3]"
                  : "bg-[#F5F5F5]"
              }`}
            >
              Current location
            </button>
            {sugetionLocation?.map((e, i) => (
              <button
                type="button"
                key={i}
                onClick={() => {
                  setSelectedLocation(e.location);
                  setValue("location", e.location);
                }}
                className={` px-2.5 py-1 rounded-full text-base ${
                  selectedLocation === e.location
                    ? " bg-[#CFF7D3]"
                    : "bg-[#F5F5F5]"
                }`}
              >
                {e.location}
              </button>
            ))}
          </div>
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>
      </div>

      <div className=" space-y-2 ">
        <Label text="Damage assets" htmlFor="Damageassets" />
        <div>
          <Controller
            name="damgeAssets"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger className="outline-none h-12">
                  <SelectValue placeholder="Add assets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assets 1">assets 1</SelectItem>
                  <SelectItem value="assets 2">assets 2</SelectItem>
                  <SelectItem value="assets 3">assets 3</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.damgeAssets && (
            <p className="text-red-500 text-sm">{errors.damgeAssets.message}</p>
          )}
        </div>
      </div>

      <div className=" space-y-2 ">
        <Label text="Finance" htmlFor="Finance" />
        <div>
          <Controller
            name="finance"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                id="Finance"
                placeholder="Calculate estimate for asset damage"
                className=" outline-none h-12"
              />
            )}
          />
          {errors.finance && (
            <p className="text-red-500 text-sm">{errors.finance.message}</p>
          )}
        </div>
      </div>

      <div className=" space-y-2">
        <Label text="Utility effected" />
        <div>
          <div className="flex flex-wrap gap-2  md:gap-4  text-darkish">
            <Controller
              name="utilityeffected"
              control={control}
              render={({ field }) => (
                <>
                  {utilityeffected?.map((e, i) => (
                    <label
                      key={i}
                      htmlFor={e.title}
                      className={`cursor-pointer border rounded-lg px-3 py-2 flex items-center gap-2  ${
                        field?.value?.includes(e.title)
                          ? "border-customGreen"
                          : "border-[#D9D9D9]"
                      } `}
                    >
                      <Checkbox
                        id={e.title}
                        checked={field?.value?.includes(e.title)} // Determine if the checkbox is checked
                        onChange={(e: any) => {
                          const newValue = e.target.checked
                            ? [...field.value, e.target.id]
                            : field.value.filter((val) => val !== e.target.id); // Remove from array if unchecked
                          field.onChange(newValue);
                        }}
                        className="border-none data-[state=checked]:bg-custom-linear bg-[#E6E6E6] data-[state=checked]:text-white text-[#232323]"
                      />
                      <span>{e.title}</span>
                    </label>
                  ))}
                </>
              )}
            />
          </div>
          {errors.utilityeffected && (
            <p className="text-red-500 text-sm">
              {errors.utilityeffected.message}
            </p>
          )}
        </div>
      </div>

      <div className=" space-y-2">
        <Label text="Upload images" />
        <div>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="w-full border-2 border-dashed rounded-md p-4 mt-4 flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <input
              type="file"
              id="uploadImage"
              className="hidden"
              ref={inputFileRef}
              onChange={(e) => handleFileChange(e.target.files)}
            />
            {images.length > 0 ? (
              <div className="flex items-center  justify-start  gap-4 w-full">
                {images.map((src, index) => (
                  <div key={index} className="relative w-32 h-32 mb-2 ">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 text-xl text-red-600 rounded-full p-1 bg-green-50"
                    >
                      <IoMdClose />
                    </button>
                    {typeof src === "string" ? (
                      <Image
                        src={src}
                        alt="Uploaded Preview"
                        height={500}
                        width={500}
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-600">
                        Invalid Image
                      </div>
                    )}
                  </div>
                ))}

                <button
                  onClick={handleParentDivClick}
                  type="button"
                  className=" border rounded-md w-9 flex items-center justify-center text-[30px]"
                >
                  +
                </button>
              </div>
            ) : (
              <div onClick={handleParentDivClick} className="w-full ">
                <div className="flex flex-col items-center gap-1">
                  <Image src={'/images/imagePng.png'} width={40} height={40} alt="imagepng"  />
                  <p className="text-[#5A5A5A] text-sm">
                    Drop your image here or{" "}
                    <span className="text-[#3979FA] font-semibold">Browse</span>
                  </p>
                  <p className="text-[#B3B3B3]">Supports: jpeg, png</p>
                </div>
              </div>
            )}
          </div>
          {errors.images && (
            <p className="text-red-500 text-sm">{errors.images.message}</p>
          )}
        </div>
      </div>
      {/* Signature Upload */}
      <div className=" space-y-2">
        <Label text="Digital signature" />
        <div>
          <div className="w-full flex flex-col gap-6 mt-4">
            {signature ? (
              <div className="w-full bg-[#D9D9D9] text-[#5A5A5A] border-2 min-h-[126px] rounded-md p-4 text-center">
                <div className="relative w-[250px] flex flex-col items-start border border-green-400 rounded-sm">
                  <button
                    type="button"
                    onClick={() => setValue("signature", "")}
                    className="absolute top-1 right-1 text-xl text-red-600"
                  >
                    <IoMdClose />
                  </button>
                  <Image
                    src={signature}
                    alt="Signature Preview"
                    height={500}
                    width={500}
                    className=" object-cover rounded-md mb-2"
                  />
                </div>
              </div>
            ) : (
              <AddNewForm
                triggerLabel={
                  <div className="w-full signatureBG text-[#5A5A5A] border-2 h-[126px] rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer">
                    <div className="w-full flex items-center justify-center">
                      <p className="text-[#5A5A5A] text-sm">
                        Add your digital signature here
                      </p>
                    </div>
                  </div>
                }
                dialogContent={
                  <div>
                    <h2>Digital Signature</h2>
                    <SignaturePad ref={sigPadRef} />
                    <div className="flex items-center gap-3">
                      <Button
                        className="text-black border"
                        onClick={saveSignature}
                      >
                        Save Signature
                      </Button>
                      <Button
                        className="text-black border"
                        onClick={clearSignature}
                      >
                        Clear Signature
                      </Button>
                    </div>
                  </div>
                }
              />
            )}
          </div>
          {errors.signature && (
            <p className="text-red-500 text-sm">{errors.signature.message}</p>
          )}
        </div>
      </div>

      <div>
        <div className="     text-darkish">
          <Controller
            name="informtoHRteam"
            control={control}
            render={({ field }) => (
              <>
                <label
                  htmlFor="informtoHRteam"
                  className={`cursor-pointer  rounded-lg px-3 py-2 flex items-center gap-2 `}
                >
                  <Checkbox
                    checked={field.value}
                    onChange={(e: any) =>
                      setValue("informtoHRteam", e.target.checked)
                    }
                    id="informtoHRteam"
                    className={`  border-none data-[state=checked]:bg-custom-linear bg-[#E6E6E6]  data-[state=checked]:text-white text-[#232323]`}
                  />
                  <span>Inform to HR team</span>
                </label>
              </>
            )}
          />
          {errors.informtoHRteam && (
            <p className="text-red-500 text-sm">
              {errors.informtoHRteam.message}
            </p>
          )}
        </div>
        <div className="     text-darkish">
          <Controller
            name="agreeTermsConditionPrimaryPolicy"
            control={control}
            render={({ field }) => (
              <>
                <label
                  htmlFor="agreeTermsConditionPrimaryPolicy"
                  className={`cursor-pointer  rounded-lg px-3 py-2 flex items-center gap-2 `}
                >
                  <Checkbox
                    checked={field.value}
                    onChange={(e: any) =>
                      setValue(
                        "agreeTermsConditionPrimaryPolicy",
                        e.target.checked
                      )
                    }
                    id="agreeTermsConditionPrimaryPolicy"
                    className={`  border-none data-[state=checked]:bg-custom-linear bg-[#E6E6E6]  data-[state=checked]:text-white text-[#232323]`}
                  />
                  <span>
                    I agree to the Terms and condition and Primary policy
                  </span>
                </label>
              </>
            )}
          />
          {errors.agreeTermsConditionPrimaryPolicy && (
            <p className="text-red-500 text-sm">
              {errors.agreeTermsConditionPrimaryPolicy.message}
            </p>
          )}
        </div>
      </div>
      
    </form>
    <div className="flex items-center gap-4 justify-end mt-8 mb-8">
        
        <Button className="bg-gray-300 hover:bg-gradient-to-l flex items-center space-x-1 p-6 w-full sm:w-auto">
                <span className="text-black text-[16px]">Cancel</span>
              </Button>
              <Link href={'/task-details'}>
              <Button onClick={()=>route.push("/task-details/details")} className="bg-gradient-to-r rounded-[5px]  from-[rgba(61,162,41,1)] to-[rgba(36,120,20,1)] hover:bg-gradient-to-l flex items-center space-x-1 p-6 w-full sm:w-auto">
                <span className="text-white text-[16px]">Add Project</span>
              </Button>
              </Link>
      </div>
    </div>
  );
};

export default AddTaskDetailsForm;

