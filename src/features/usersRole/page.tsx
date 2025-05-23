'use client';

import React, { useState } from "react";

import { DataTable } from "@/components/data-table";
import { CasesDataTableToolbar } from "./components/data-table-toolbar";
import { mainColumns } from "./components/table-columns";
import { useQuery } from "@tanstack/react-query";
import TablePagination from "@/components/TablePagination";
import { redirect, useParams, useRouter } from "next/navigation";
import ReusableTabs from "@/components/ui/reusable-tabs";
import { Button } from "@/components/ui/button";
import { Icons } from "@/icons/icons";
import { Plus } from "lucide-react";
import { AddUserSheet } from "../component/AddUserSheet";

export type TusersRoles =
  "all" |
  "DIRECTOR_GENERAL" |
  "CIVIL_JUSTICE_DEPT" |
  "CRIMINAL_JUSTICE_DEPT" |
  "PARALEGAL" |
  "PRO_BONO_LAWYER" |
  "CENTRE_COORDINATOR" |
  "ZONAL_DIRECTOR" |
  "STATE_COORDINATOR" |
  "DECONGESTION_UNIT_HEAD" |
  "PREROGATIVE_OF_MERCY_UNIT_HEAD" |
  "OSCAR_UNIT_HEAD" |
  "ADMIN" |
  "PLATFORM_ADMIN";

export default function UserRoles() {

  const params = useParams();
  const tab = params.tab;
  console.log(tab);
  const router = useRouter();
  const activeTab = params?.tab as string;


  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setLoading] = useState(false);
  // const { data, isLoading } = useQuery({
  //   queryKey: ["getUser", currentPage, searchTerm],
  //   queryFn: async () => {
  //     const filters = {
  //       page: currentPage,
  //       size: DEFAULT_PAGE_SIZE,
  //       query: searchTerm,
  //     };
  //     return await GetUserListAction(filters);
  //   },
  //   staleTime: 100000,
  // });

  // if (!isLoading) {
  //   console.log(data?.data);
  //   console.log(data?.data?.length);
  //   console.log(data?.data.total_rows);
  // }

  const tabs: { id: TusersRoles; label: string }[] = [
    { id: "all", label: "All Users" },
    { id: "DIRECTOR_GENERAL", label: "DIRECTOR GENERAL" },
    { id: "CIVIL_JUSTICE_DEPT", label: "CIVIL JUSTICE DEPT" },
    { id: "CRIMINAL_JUSTICE_DEPT", label: "CRIMINAL JUSTICE DEPT" },
    { id: "PARALEGAL", label: "PARALEGAL" },
    { id: "PRO_BONO_LAWYER", label: "PRO BONO LAWYER" },
    { id: "CENTRE_COORDINATOR", label: "CENTRE COORDINATOR" },
    { id: "ZONAL_DIRECTOR", label: "ZONAL DIRECTOR" },
    { id: "STATE_COORDINATOR", label: "STATE COORDINATOR" },
    { id: "DECONGESTION_UNIT_HEAD", label: "DECONGESTION UNIT HEAD" },
    { id: "PREROGATIVE_OF_MERCY_UNIT_HEAD", label: "PREROGATIVE OF MERCY UNIT HEAD" },
    { id: "OSCAR_UNIT_HEAD", label: "OSCAR UNIT HEAD" },
    { id: "ADMIN", label: "ADMIN" },
    { id: "PLATFORM_ADMIN", label: "PLATFORM ADMIN" },
  ];
  const handleTabChange = (newTab: string) => {
    router.push(`/users-role/${newTab}`);
  };


  const getColumns = () => {
    return mainColumns;
  };
  const columns = getColumns();

  const handleRowClick = (row: any) => {
    redirect(`/user-profile/${encodeURIComponent(row.id)}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 pt-0 mx-4 lg:mx-0">
      <div className="row flex justify-between">
        <div className="text-lg font-semibold">Users</div>
        <AddUserSheet />
      </div>
      <ReusableTabs tabs={tabs} onTabChange={handleTabChange} activeTab={activeTab} />
      <CasesDataTableToolbar />
      <DataTable onRowClick={handleRowClick} columns={columns} loading={isLoading} data={[]} />
      {/* {data?.data?.data.length > 0 && (
        <div className="flex justify-end pt-4">
          <TablePagination
            currentPage={currentPage}
            totalCount={data?.data.total_rows}
            pageSize={DEFAULT_PAGE_SIZE}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )} */}
    </div>
  )
}
