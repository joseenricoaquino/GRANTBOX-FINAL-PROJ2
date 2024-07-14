import { Loader2 } from "lucide-react";
import React from "react";

const LoadingModal = () => {
  return (
    <div className="fixed w-screen h-screen flex justify-center items-center z-[100] bg-white/80 flex-col">
      <h2 className="text-2xl font-bold text-main-default">Please wait...</h2>
      <Loader2 className="w-8 h-8 animate-spin text-main-default" />
    </div>
  );
};

export default LoadingModal;
