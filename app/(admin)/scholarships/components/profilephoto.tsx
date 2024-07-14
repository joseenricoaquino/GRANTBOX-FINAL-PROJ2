"use client";

import { useToast } from "@/components/ui/use-toast";
// import { FullParentType } from "@/types";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import React from "react";

const ProfilePhotoSection = ({
  profile,
  handleUpload,
}: {
  profile: string;
  handleUpload: (temp: any) => void;
}) => {
  return (
    <div className="grid w-full space-y-4">
      <div className="aspect-square rounded-lg shadow overflow-hidden relative">
        <Image
          src={profile || ""}
          alt="Profile"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex justify-center items-center w-full">
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onSuccess={handleUpload}
          uploadPreset="baoqlgle"
          className="px-4 bg-blue-500 text-white font-semibold py-2 rounded-lg h-8 hover:bg-blue-400 transition-colors flex justify-center items-center"
        >
          Update Profile Picture
        </CldUploadButton>
      </div>
    </div>
  );
};

export default ProfilePhotoSection;
