"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type ActionContextType = {
  isOpen: boolean;
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

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };


  return (
    <ActionContext.Provider
      value={{
        isOpen,
        toggleOpen,
        setIsOpen,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};
