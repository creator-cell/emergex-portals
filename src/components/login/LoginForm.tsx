"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Validation Schemas for each form
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

const LoginForm: React.FC = () => {
  const [loginPassVies, setLoginPassVies] = useState<boolean>(false);
  const router=useRouter()

  // Login Form
  const {
    register,
    handleSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });


  const handleLogin = async (data: any) => {
    router.push('/')
  };

  return (
    <div className=" p-8  w-[85%]  lg:w-[38%]  max-w-[400px] ">
      <div className="flex items-center justify-center mb-8">
        <div className=" flex items-center justify-center w-[148px] ">
          <Image
            src={"/emere-logo.png"}
            alt="emere-logo"
            width={400}
            height={100}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mb-8">
        <h2 className="text-[30px] font-[600] mb-6 text-center text-white leading-10">
          Log in to your account
        </h2>
        <p className="text-center text-base font-normal  leading-6  decoration-none  text-[#9A9EAC]">
          Welcome back! Please enter your details.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleLogin)} className=" space-y-5">
        <div>
          <label htmlFor="email" className="block text-[#9A9EAC] mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="email"
            {...register("email")}
            placeholder="Enter your email"
            className="w-full mt-1 p-2 border border-[#2D372C] rounded-lg  bg-[#1e251d] placeholder-[#636B62] text-white outline-none shadow-custom-login "
          />
          {loginErrors.email && (
            <p className="text-red-500 text-sm">{loginErrors.email.message}</p>
          )}
        </div>
        {/* a  */}
        <div>
          <label htmlFor="password" className="block text-[#9A9EAC] mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="flex w-full items-center  p-2  border border-[#2D372C] rounded-lg  bg-[#1e251d] shadow-custom-login ">
            <input
              type={loginPassVies ? "text" : "password"}
              id="password"
              {...register("password")}
              placeholder="Enter password"
              className="w-full  rounded-lg  border-none outline-none flex items-center bg-[#1e251d] placeholder-[#636B62] text-white"
            />
            <span
              className=" cursor-pointer"
              onClick={() => setLoginPassVies(!loginPassVies)}
            >
              {loginPassVies ? (
                <FaRegEye color="#7A8092" />
              ) : (
                <FaRegEyeSlash color="#7A8092" />
              )}
            </span>
          </div>
          {loginErrors.password && (
            <p className="text-red-500 text-sm">
              {loginErrors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full font-semibold py-2 px-4 text-white rounded-lg  bg-gradient-to-r from-[#3DA229] via-[#247814] to-[#247814]"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

// const Spiner = () => {
//   return (
//     <div className="w-full flex items-center justify-center">
//       <div className="h-10 w-10 border-4 border-t-blue-600 rounded-full animate-spin"></div>
//     </div>
//   );
// };
