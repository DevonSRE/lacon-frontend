import React from "react";
import AdminDashboardSkeleton from "@/components/skeleton/dashboard";
import { Plus } from "lucide-react";
import DashboardStats from "./components/DashboardStats";
import CaseDistributionChart from "./components/CaseDistributionChart";
import CaseAssignmentPage from "./components/CaseAssignmentTable";

export default function Dashboard() {
    //   return <AdminDashboardSkeleton/> ;
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 ">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Admin</h1>
                        <p className="text-gray-600">Today, Monday, 28th April, 2025</p>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Plus size={20} />
                        New
                    </button>
                </div>
                <DashboardStats />
                <CaseAssignmentPage />
                <CaseDistributionChart />
            </div>
        </div>
    );
}
