"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type ActionContextType = {
  isOpen: boolean;

  selectedUnit: string;
  setSelectedUnit: (isHovered: string) => void;

  selectedZoneId: string;
  setSelectedZoneId: (isHovered: string) => void;

  selectedDuration: string;
  setselectedDuration: (isHovered: string) => void;

  selectedStateId: string;
  setSeletedStateId: (isHovered: string) => void;

  selectedCentreId: string;
  setselectedCentreId: (isHovered: string) => void;

  setIsOpen: (isHovered: boolean) => void;
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
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [selectedDuration, setselectedDuration] = useState("");
  const [selectedCentreId, setselectedCentreId] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

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
        setselectedCentreId

      }}
    >
      {children}
    </ActionContext.Provider>
  );
};
