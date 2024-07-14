"use client";
import React from "react";
import { Button } from "../ui/button";

const ToolButton = ({
  icon: Icon,
  handleClick,
}: {
  icon: any;
  handleClick?: () => void;
}) => {
  return (
    <Button
      variant={"ghost"}
      className="w-10 h-10 p-2 rounded-full"
      type="button"
      onClick={handleClick}
    >
      <Icon className="w-full h-full text-main-default" />
    </Button>
  );
};

export default ToolButton;
