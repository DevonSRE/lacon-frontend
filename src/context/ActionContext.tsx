"use client";
import React, { createContext, useContext, useState, useEffect, SetStateAction, Dispatch } from "react";

type LoadingDialogType = {
  open: boolean;
  title: string;
  details: string;
};

type ActionContextType = {
  isOpen: boolean;
  openLoadingDialog: LoadingDialogType;

  selectedUnit: string;
  setSelectedUnit: (isHovered: string) => void;

  selectedZoneId: string;
  setSelectedZoneId: (isHovered: string) => void;

  selectedZone: string;
  setSelectedZone: (isHovered: string) => void;

  selectedDuration: string;
  setselectedDuration: (isHovered: string) => void;

  selectedStateId: string;
  setSeletedStateId: (isHovered: string) => void;

  selectedState: string;
  setSelectesState: (isHovered: string) => void;

  selectedCentreId: string;
  setselectedCentreId: (isHovered: string) => void;

  // setIsOpen: (isHovered: boolean) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setLoadingDialog: Dispatch<SetStateAction<LoadingDialogType>>;
  toggleOpen: () => void;
};

const ActionContext = createContext<ActionContextType | undefined>(undefined);

export const useAction = () => {
  const context = useContext(ActionContext);
  if (!context) {
    throw new Error("useAction must be used within a actionProvider");
  }
  return context;
};

export const ActionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStateId, setSeletedStateId] = useState("");
  const [selectedState, setSelectesState] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedDuration, setselectedDuration] = useState("");
  const [selectedCentreId, setselectedCentreId] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [openLoadingDialog, setLoadingDialog] = useState({
    open: false,
    title: "",
    details: "",
  });

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };


  return (
    <ActionContext.Provider
      value={{
        selectedUnit,
        setSelectedUnit,
        isOpen,
        selectedStateId,
        setSeletedStateId,
        toggleOpen,
        setIsOpen,
        selectedZoneId,
        setSelectedZoneId,
        selectedDuration,
        setselectedDuration,
        selectedCentreId,
        setselectedCentreId,
        openLoadingDialog,
        setLoadingDialog,
        selectedZone,
        setSelectedZone,
        selectedState,
        setSelectesState,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};
