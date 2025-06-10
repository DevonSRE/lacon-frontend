'use client';
import React, { useState } from "react";
import NewIntake from "./_components/NewIntake";
import Intro from "@/components/Intro";
import AssignedCases from "./_components/menu/AssignedCases";
import UploadHistory from "./_components/menu/UploadHistory";
import CaseIntake from "./_components/menu/CaseIntake";
const LawyerDashboard = ({ user }: { user: string }) => {

  
  const menu = ["Assigned Cases", "Case Intake", "Upload History"];
  const [menuTab, setMenuTab] = useState("Assigned Cases");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <Intro user={user} />
        <NewIntake />
      </div>
      <hr />
      <div className="">
        <div className="flex items-center text-lg space-x-2 bg-white p-2">
          {menu.map((tab, index) => (
            <button
              key={tab}
              onClick={() => {
                setMenuTab(tab);
              }}
              className={`focus:outline-none ${menuTab === tab ? "text-black" : "text-gray-400"}`}
            >
              {tab}
              {index < menu.length - 1 && " /"}
            </button>
          ))}
        </div>

        {(menuTab === "Assigned Cases") && (
          <AssignedCases />
        )}
        {(menuTab === "Case Intake") && (
          <CaseIntake />
        )}
        {(menuTab === "Upload History") && (
          <UploadHistory />
        )}

      </div>
    </div>
  );
};

export default LawyerDashboard;