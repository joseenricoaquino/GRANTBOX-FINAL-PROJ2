"use client";
import * as React from "react";

export type SidebarContextType = {
  toggleSidebar: boolean;
  setToggleSidebar: (temp: boolean) => void;
};

export const SidebarContext = React.createContext<SidebarContextType>({
  toggleSidebar: false,
  setToggleSidebar: (temp: boolean) => {},
});

export const useSidebarContext = () => React.useContext(SidebarContext);

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [toggleSidebar, setToggleSidebar] = React.useState<boolean>(false);

  return (
    <SidebarContext.Provider
      value={{
        toggleSidebar,
        setToggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
