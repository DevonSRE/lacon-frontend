import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
            <p className="text-gray-600">Today, Monday, 28th April, 2025</p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={20} />
            New
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className=" p-4 rounded-lg shadow-xs">
            <Skeleton className="h-28 w-full mb-4" />
          </div>
          <div className=" p-4 rounded-lg shadow-xs">
            <Skeleton className="h-28 w-full mb-4" />
          </div>
          <div className=" p-4 rounded-lg shadow-xs">
            <Skeleton className="h-28 w-full mb-4" />
          </div>
          <div className=" p-4 rounded-lg shadow-xs">
            <Skeleton className="h-28 w-full mb-4" />
          </div>
        </div>

        <div className=" rounded-lg shadow-xs mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Case Assignment Overview</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className=" divide-y divide-gray-200">
                {/* Skeleton rows */}
                {Array.from({ length: 8 }).map((_, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-16" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reports Section */}
        <div className=" rounded-lg shadow-xs mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">2</button>
            <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">3</button>
            <span className="px-3 py-2 text-gray-400">...</span>
            <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">8</button>
            <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">9</button>
            <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">10</button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;