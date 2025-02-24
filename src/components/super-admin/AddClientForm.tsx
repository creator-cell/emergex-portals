"use client";
import React, { useState } from "react";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { gps } from "@/assets/icons";
import { IoCloseOutline } from "react-icons/io5";
import { DialogTrigger } from "../ui/dialog";
import { UploadIcons } from "@/assets/icons/SvgIcons";

const AddClientForm = () => {
  // Define the validation schema with Yup
  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company name is required"),
    location: Yup.string().required("Location is required"),
    businessType: Yup.string().required("Business type is required"),
    emergencyContact: Yup.string()
      .matches(/^[0-9]{10}$/, "Emergency contact must be a 10-digit number")
      .required("Emergency contact is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email ID is required"),
    contactNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Contact number must be a 10-digit number")
      .required("Contact number is required"),
  });

  // Initialize the form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [logo, setLogo] = useState<File | null>(null);
  // Handle form submission
  console.log(logo);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setLogo(file);
    }
  };

  const onSubmit = (data: any) => {
    console.log("Form Data: ", data);
  };
  const handleFileInputClick = () => {
    document.getElementById("logo-input")?.click(); // Trigger click on the file input
  };

  return (
    <div className="">
      <h3 className="border-b pb-4 text-lg font-[600] text-darkish">
        Add client
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 mt-4 max-h-[70vh]  overflow-y-auto pb-10">
          {/* Company Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="companyName" className="text-[#636B62] text-sm">
              Company name
            </label>
            <input
              type="text"
              id="companyName"
              placeholder="Enter company name"
              className=" placeholder-[#767676] outline-none border border-[#D9D9D9] h-[45px] px-4 text-base rounded-[8px]  "
              {...register("companyName")}
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div  className="flex flex-col gap-1 ">
            <label htmlFor="" className="text-[#636B62] text-sm">
              Logo
            </label>
            <div className="border cursor-pointer border-[#D9D9D9] h-[45px] px-4 text-base rounded-[8px] flex items-center justify-between">
              {logo ? (
                <p className="text-base text-[#303030] font-[400]">
                  {logo.name}
                </p>
              ) : (
                <p className="text-base text-[#767676] font-[400]">
                  Upload logo
                </p>
              )}

              {logo ? (
                <button type="button" onClick={()=>setLogo(null)} className="text-[24px]">
                  <IoCloseOutline />
                </button>
              ) : (
                <button type="button" onClick={handleFileInputClick} className="w-[24px]">
                 <UploadIcons/>
                </button>
              )}

              <input
                type="file"
                hidden
                name=""
                id="logo-input"
                placeholder="Upload logo"
                onChange={handleFileChange}
                className=" outline-none border border-[#D9D9D9] h-[45px] px-4 text-base rounded-[8px] text-[#767676]"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1">
            <label htmlFor="location" className="text-[#636B62] text-sm">
              Location
            </label>
            <div className="border cursor-pointer border-[#D9D9D9] h-[45px] px-4 text-base rounded-[8px] flex items-center justify-between">
              <input
                type="text"
                id="location"
                placeholder="Add the branch location from map"
                className="placeholder-[#767676] outline-none border-none px-4 text-base rounded-[8px]"
                {...register("location")}
              />
              <button type="button" className="w-[24px]">
                <Image src={gps} alt="icon" height={100} width={100} />
              </button>
            </div>
            {errors.location && (
              <p className="text-red-500 text-xs">{errors.location.message}</p>
            )}
          </div>

          {/* Business Type */}
          <div className="flex flex-col gap-1">
            <label htmlFor="businessType" className="text-[#636B62] text-sm">
              Type of business
            </label>
            <input
              type="text"
              id="businessType"
              placeholder="Enter business type"
              className="placeholder-[#767676] outline-none border border-[#D9D9D9] h-[45px] px-4 text-base rounded-[8px]"
              {...register("businessType")}
            />
            {errors.businessType && (
              <p className="text-red-500 text-xs">
                {errors.businessType.message}
              </p>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="emergencyContact"
              className="text-[#636B62] text-sm"
            >
              Emergency contact number
            </label>
            <input
              type="text"
              id="emergencyContact"
              placeholder="Enter emergency contact"
              className="placeholder-[#767676] outline-none border border-[#D9D9D9] h-[45px] px-4 text-base rounded-[8px]"
              {...register("emergencyContact")}
            />
            {errors.emergencyContact && (
              <p className="text-red-500 text-xs">
                {errors.emergencyContact.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-[#636B62] text-sm">
              Email ID
            </label>
            <input
              type="text"
              id="email"
              placeholder="Enter email ID"
              className="placeholder-[#767676] outline-none border border-[#D9D9D9] h-[45px] px-4 text-base rounded-[8px]"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Contact Number */}
          <div className="flex flex-col gap-1">
            <label htmlFor="contactNumber" className="text-[#636B62] text-sm">
              Contact number
            </label>
            <input
              type="text"
              id="contactNumber"
              placeholder="Enter contact number"
              className="placeholder-[#767676] outline-none border border-[#D9D9D9] h-[45px] px-4 text-base rounded-[8px]"
              {...register("contactNumber")}
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-xs">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          {/* Buttons */}
         
            <div className="flex gap-4 absolute bottom-2 right-6">

            <DialogTrigger >
            <button
                type="button"
                className="text-[#3DA229] bg-white text-base font-[600] border border-[#3DA229] rounded-xl py-[15] px-[18px] h-[45px]"
              >
                Cancel
              </button>
            </DialogTrigger>
              
              <button
                type="submit"
                className="text-white bg-[#3DA229] text-base font-[600] border border-[#3DA229] rounded-xl py-[15] px-[18px] h-[45px]"
              >
                Add Client
              </button>
            </div>
          
        </div>
      </form>
    </div>
  );
};

export default AddClientForm;

{
  /* <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-[#636B62] text-sm">
              Logo
            </label>
            <div className="border border-[#D9D9D9] h-[45px] px-4 text-base rounded-[8px] flex items-center">
                <p className="text-base text-[#767676] font-[400]">Upload logo</p>
            <input
              type="file"
              hidden
              name=""
              id=""
              placeholder="Upload logo"
              className=" outline-none border border-[#D9D9D9] h-[45px] px-4 text-base rounded-[8px] text-[#767676]"
            />
            </div>
           
          </div> */
}
