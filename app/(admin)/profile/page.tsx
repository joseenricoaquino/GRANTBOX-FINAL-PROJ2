import React from "react";
import { getData } from "./(actions)/action";
import ProfileClient from "./client";

const ProfilePage = async () => {
  const userProfile = await getData();
  return (
    <div className="flex-1">
      <div className="container mx-auto w-full h-full relative pb-4">
        <ProfileClient profile={userProfile as any} />
      </div>
    </div>
  );
};

export default ProfilePage;
