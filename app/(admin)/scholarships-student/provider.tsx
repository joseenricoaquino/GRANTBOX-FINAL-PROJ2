"use client";
import { FullScholarshipType } from "@/utils/interfaces";
import * as React from "react";

type ContextType = {
  toggleEdit: boolean;
  toggleDelete: boolean;
  toggleView: boolean;
  setToggleView: (temp: boolean) => void;
  setToggleEdit: (temp: boolean) => void;
  setToggleDelete: (temp: boolean) => void;
  selected: FullScholarshipType | undefined;
  setSelected: (temp: FullScholarshipType | undefined) => void;
};

const Context = React.createContext<ContextType>({
  toggleEdit: false,
  toggleDelete: false,
  toggleView: false,
  setToggleView: (temp: boolean) => {},
  setToggleEdit: (temp: boolean) => {},
  setToggleDelete: (temp: boolean) => {},
  selected: undefined,
  setSelected: (temp: FullScholarshipType | undefined) => {},
});

export const useScholarshipsContext = () => React.useContext(Context);

const ScholarshipsProvider = ({ children }: { children: React.ReactNode }) => {
  const [toggleEdit, setToggleEdit] = React.useState<boolean>(false);
  const [toggleDelete, setToggleDelete] = React.useState<boolean>(false);
  const [toggleView, setToggleView] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<FullScholarshipType>();

  return (
    <Context.Provider
      value={{
        toggleEdit,
        setToggleEdit,
        toggleDelete,
        setToggleDelete,
        selected,
        setSelected,
        toggleView,
        setToggleView,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ScholarshipsProvider;
