"use client";
import * as React from "react";

type ContextType = {
  toggleEdit: boolean;
  toggleDelete: boolean;
  toggleAdd: boolean;
  setToggleAdd: (temp: boolean) => void;
  setToggleEdit: (temp: boolean) => void;
  setToggleDelete: (temp: boolean) => void;
  selected: any | undefined;
  setSelected: (temp: any | undefined) => void;
};

const Context = React.createContext<ContextType>({
  toggleEdit: false,
  toggleDelete: false,
  toggleAdd: false,
  setToggleAdd: (temp: boolean) => {},
  setToggleEdit: (temp: boolean) => {},
  setToggleDelete: (temp: boolean) => {},
  selected: undefined,
  setSelected: (temp: any | undefined) => {},
});

export const useHelpDeskContext = () => React.useContext(Context);

const HelpDeskProvider = ({ children }: { children: React.ReactNode }) => {
  const [toggleEdit, setToggleEdit] = React.useState<boolean>(false);
  const [toggleDelete, setToggleDelete] = React.useState<boolean>(false);
  const [toggleAdd, setToggleAdd] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<any>();

  return (
    <Context.Provider
      value={{
        toggleEdit,
        setToggleEdit,
        toggleDelete,
        setToggleDelete,
        selected,
        setSelected,
        toggleAdd,
        setToggleAdd,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default HelpDeskProvider;
