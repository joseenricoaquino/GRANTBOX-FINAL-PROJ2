"use client";
import { User } from "@prisma/client";
import * as React from "react";

type ContextType = {
  toggleEdit: boolean;
  toggleDelete: boolean;
  setToggleEdit: (temp: boolean) => void;
  setToggleDelete: (temp: boolean) => void;
  selected: User | undefined;
  setSelected: (temp: User | undefined) => void;
};

const Context = React.createContext<ContextType>({
  toggleEdit: false,
  toggleDelete: false,
  setToggleEdit: (temp: boolean) => {},
  setToggleDelete: (temp: boolean) => {},
  selected: undefined,
  setSelected: (temp: User | undefined) => {},
});

export const useCollegeScholarsContext = () => React.useContext(Context);

const CollegeScholarsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toggleEdit, setToggleEdit] = React.useState<boolean>(false);
  const [toggleDelete, setToggleDelete] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<User>();

  return (
    <Context.Provider
      value={{
        toggleEdit,
        setToggleEdit,
        toggleDelete,
        setToggleDelete,
        selected,
        setSelected,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default CollegeScholarsProvider;
