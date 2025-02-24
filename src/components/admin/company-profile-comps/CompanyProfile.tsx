import TextBar from "@/components/common/TextBar";
import Image from "next/image";
import React from "react";

const CompanyProfile = () => {
  return (
    <div className="bg-white rounded-[40px] p-[32px]">
      <div className="flex items-center overflow-hidden">
        <div className="w-[50px] h-[50px]">
          <Image
            src={"/companyprofile/profile.png"}
            alt="logo"
            width={100}
            height={100}
          />
        </div>

        <div>
          <h5 className="text-darkish text-[20px] font-[500] ">Company name</h5>
          <p className="text-grayish text-[14px] font-[500]">
            Company ID : FIRMD-273UY
          </p>
        </div>
      </div>

      <div className="flex flex-col  gap-[27px] mt-6">
        <TextBar
          title="Location"
          line="114 Strand, London WC2R 0AG, United Kingdom"
        />
        <div className="flex flex-col md:flex-row gap-[27px] ">
          <div className="w-full md:w-[40%]">
            <TextBar title="Type of business" line="Business 1" />
          </div>
          <div className="w-full md:w-[40%]">
            <TextBar title="Emergency contact number" line="+21 4335 3432" />
          </div>
        </div>

        <div className="flex flex-col  md:flex-row gap-[27px] ">
          <div className="w-full md:w-[40%]">
            <TextBar title="Company mail ID" line="company@gmail.com" />
          </div>
          <div className="w-full md:w-[40%]">
            <TextBar title="Contact number" line="+21 4335 3432" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
