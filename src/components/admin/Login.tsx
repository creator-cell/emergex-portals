"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation"; // Correct import for navigation
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import { logo } from "@/assets/logo";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, useLoginMutation } from "@/store/api/auth/authSlice";

export default function Login() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const showPasswordRef = useRef(false);
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const togglePasswordVisibility = () => {
    showPasswordRef.current = !showPasswordRef.current;
    const passwordInput = passwordRef.current;
    if (passwordInput) {
      passwordInput.type = showPasswordRef.current ? "text" : "password";
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();

      if (response.success) {
        dispatch(setCredentials(response));

        toast.success(response.message || "Login successful!");

        const role = response.admin.role;
        if (role === "super-admin") {
          router.push("/admin");
        } else if (role === "client-admin") {
          router.push("/");
        }
      } else {
        toast.error(response.error || "Login failed!");
      }
    } catch (err: any) {
      console.error("Failed to login:", err);
      const errorMessage =
        err?.data?.error || "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 loginFormBg items-center px-8 md:px-20">
      {/* Left side - Image */}
      <div className="relative rounded-[20px] overflow-hidden m-4 w-[90%] h-[80%] lg:ml-12">
        <Image
          src="/images/LoginLeft.png"
          alt="Construction workers reviewing information on a tablet"
          fill
          className="object-cover"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Image
                src={logo}
                alt="emere-logo"
                width={150}
                height={100}
                className="mb-2"
              />
            </div>
            <div className="space-y-1">
              <h2
                className="text-xl font-semibold"
                style={{
                  fontWeight: "600",
                  fontSize: "30px",
                  lineHeight: "38px",
                }}
              >
                Log in to your account
              </h2>
              <p className="text-[16px] font-normal leading-[24px] loginSubTextBg">
                Welcome back! Please enter your details.
              </p>
            </div>
          </div>

          <form className="w-[360px] mx-auto" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[14px]">
                  Email*
                </label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  ref={emailRef}
                  className="w-full px-3 py-2 inputBgColor rounded-[8px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-[14px]">
                  Password*
                </label>
                <div className="relative inputBgColor">
                  <Input
                    id="password"
                    placeholder="Enter password"
                    type="password"
                    ref={passwordRef}
                    className="w-full px-3 py-2 inputBgColor rounded-[8px] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPasswordRef.current ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              className="w-full loginFormBgButton hover:bg-green-700 text-white py-2 h-[44px] rounded-[8px] mt-6"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
