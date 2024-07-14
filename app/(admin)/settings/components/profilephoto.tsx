"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { College } from "@prisma/client";
// import { FullParentType } from "@/types";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import React, { useState } from "react";

const ProfilePhotoSection = ({
  userId,
  profile,
}: {
  userId: string;
  profile: string;
}) => {
  const { toast } = useToast();

  const handleUpload = (result: any) => {
    axios
      .post(`/api/settings/profile-pic`, {
        image: result?.info?.secure_url,
        userId,
      })
      .then((d) => {
        toast({
          title: "Updated Profile Picture",
        });
      })
      .catch((e) => {
        toast({
          title: "Error in Updating Profile Picture",
          description: `${e}`,
        });
      })
      .finally(() => {
        window.location.reload();
      });
  };

  return (
    <div className="grid w-full space-y-4">
      <div className="aspect-square rounded-lg shadow overflow-hidden relative">
        <Image src={profile || ""} alt="Image" fill className="object-cover" />
      </div>
      <div className="flex justify-center items-center w-full">
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onSuccess={handleUpload}
          uploadPreset="hl3k5ot2"
          className="px-4 bg-blue-500 text-white font-semibold py-2 rounded-lg h-8 hover:bg-blue-400 transition-colors flex justify-center items-center"
        >
          Update Profile Picture
        </CldUploadButton>
      </div>
    </div>
  );
};

export default ProfilePhotoSection;
