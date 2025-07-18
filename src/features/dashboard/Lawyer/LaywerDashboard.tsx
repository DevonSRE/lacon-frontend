'use client';
import React, { useState } from "react";
import Intro from "@/components/Intro";
import AssignedCases from "./_components/menu/AssignedCases";
import UploadHistory from "./_components/menu/UploadHistory";
import CaseIntake from "./_components/menu/CaseIntake";
import { CustomeSheet } from "@/components/CustomSheet";
import { Button } from "@/components/ui/button";
import CaseIntakeForm from "./_components/CaseIntake";
import { ROLES } from "@/types/auth";
import { PlusCircleIcon } from "lucide-react";
import MediationCaseForm from "./_components/MediationCaseForm";
import MediationCase from "./_components/menu/MediationCase";


const LawyerDashboard = ({ role }: { role: string }) => {
  const menu = ["Assigned Cases", "Case Intake", "Upload History"];
  const [menuTab, setMenuTab] = useState("Assigned Cases");
  const [open, setDialogOpen] = useState(false);
  const [openMediation, setDialogOpenMediation] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <Intro user={role} />
        {(role === ROLES.EXTERNAL_PARALEGAL) ?
        ""
          // <Button variant="outline" onClick={() => setDialogOpenMediation(true)}>
          //   <PlusCircleIcon />
          //   File a Case</Button>
          : <Button variant="outline" onClick={() => setDialogOpen(true)}>
            <PlusCircleIcon />
            New Intake</Button>
        }
      </div>
      <hr />
      <div className="">

        {role !== ROLES.EXTERNAL_PARALEGAL && (
          <>
            <div className="flex items-center mb-2 text-xl space-x-2 bg-white p-2">
              {menu.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => {
                    setMenuTab(tab);
                  }}
                  className={`focus:outline-none ${menuTab === tab ? "text-black" : "text-gray-400"}`}
                >
                  {tab}
                  {index < menu.length - 1 && " / "}
                </button>
              ))}
            </div>
            {menuTab === "Assigned Cases" && <AssignedCases />}
            {menuTab === "Case Intake" && <CaseIntake />}
            {menuTab === "Upload History" && <UploadHistory />}
          </>
        )}

        {role === ROLES.EXTERNAL_PARALEGAL && (
          <MediationCase />
        )}


        <CustomeSheet open={open} setOpen={setDialogOpen} className="min-w-3xl" backButton={true}>
          <div className="max-w-3xl mx-auto p-4 space-y-8">
            <CaseIntakeForm isPublic={false} setDialogOpen={setDialogOpen} />
          </div>
        </CustomeSheet>

        <CustomeSheet open={openMediation} setOpen={setDialogOpenMediation} className="min-w-2xl" backButton={true}>
          <div className="max-w-2xl mx-auto p-4 space-y-8">
            <MediationCaseForm isPublic={false} setDialogOpen={setDialogOpenMediation} />
          </div>
        </CustomeSheet>
      </div>
    </div>
  );
};

export default LawyerDashboard;