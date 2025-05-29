'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Grid3X3, List, MoreVertical, Slash } from "lucide-react";
import NewIntake from "./_components/NewIntake";
import Intro from "@/components/Intro";
import LawyersReportTable from "./_components/LawyerReportTable";
import LawyersReportGrid from "./_components/LawyerReportGrid";

const AssignedCases = () => {
  const [view, setView] = useState("grid");

  const caseData = [
    {
      id: "LCN-23456",
      title: "Joshua Bulus Vs Micheal OPCDERTYU.......",
      category: "Criminal Cases",
      assignedDate: "June 1, 2025",
      status: "Closed",
    },
    {
      id: "LCN-23457",
      title: "Jane Doe Vs John Smith",
      category: "Criminal Cases",
      assignedDate: "June 2, 2025",
      status: "Closed",
    },
    {
      id: "LCN-23458",
      title: "State Vs Emily Brown",
      category: "Criminal Cases",
      assignedDate: "June 3, 2025",
      status: "Closed",
    },
  ];

  const tableData = [
    {
      id: "LCN - 001",
      title: "State VS Ahmed SO",
      client: "Adaobi Nwankwo",
      type: "Criminal",
      status: "Closed",
      dueDate: "May 22, 2025",
    },
    {
      id: "LCN - 002",
      title: "State VS Lisa Tran",
      client: "Mark Obi",
      type: "Criminal",
      status: "Closed",
      dueDate: "June 15, 2025",
    },
    {
      id: "LCN - 003",
      title: "State VS John Doe",
      client: "Chika Umeh",
      type: "Criminal",
      status: "Closed",
      dueDate: "July 30, 2025",
    },
  ];


  const toggleView = () => {
    setView(view === "list" ? "grid" : "list");
  };


  const upcomingEvents = [
    { date: "May 22, 2025", type: "Hearing", title: "State Vs Ahmed Musa" },
    { date: "June 15, 2025", type: "Trial", title: "State Vs Lisa Tran" },
    { date: "July 30, 2025", type: "Sentencing", title: "State Vs John Doe" },
  ];
  const tabs = ["All Cases", "Active", "In Progress", "Closed"];
  const [activeTab, setActiveTab] = useState("All Cases");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-4">
        <Intro user="Emmanuel" />
        <NewIntake />
      </div>
      <hr />


      <Breadcrumb>
        <BreadcrumbList className="text-md">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Assigned Cases</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Case Intake</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Upload History</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* <Tabs defaultValue="closed">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Cases</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inProgress">In progress</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList> */}
      <div className="flex justify-between">

        <div className="flex items-center text-sm space-x-2 bg-white p-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${activeTab === tab
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex justify-end mb-4 space-x-2">
          <Button size="icon" onClick={toggleView}>
            {view === "list" ? <Grid3X3 /> : <List />}
          </Button>
        </div>

      </div>
      {view === "grid" ? (
        <LawyersReportGrid caseData={caseData} />
      ) : (
        <LawyersReportTable tableData={tableData} />
      )}
      {/* </Tabs> */}

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingEvents.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-2 border p-3 rounded-lg shadow-sm"
            >
              <input type="checkbox" />
              <p className="text-sm">
                {event.date} <span className="mx-1">•</span> {event.type}
                <span className="mx-1">•</span> {event.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignedCases;