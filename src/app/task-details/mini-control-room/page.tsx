import { LogoutIcon } from "@/assets/icons/SvgIcons";
import BackButton from "@/components/admin/BackButton";
import Image from "next/image";
import React from "react";

const images = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
];

const page = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 bg-transparent mt-4">
        <div className="flex items-center gap-6">
          <BackButton />

          <div>
            <h1 className="text-[20px] font-medium leading-none">Mini control room</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-medium timerCOlor">23:05:283</div>

          <div className="logoutIconBG p-[8px] rounded-[10px] mr-4">
            <LogoutIcon />
          </div>
        </div>
      </div>

      {/* Display images in 3 columns */}
      <div className="min-h-screen space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="flex justify-center">
              {/* Corrected Image path */}
              <Image 
                src={`/images/mini-control/${image}`} 
                alt={`Image ${index + 1}`} 
                width={300}  // Set width according to your desired image size
                height={300} // Set height according to your desired image size
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
