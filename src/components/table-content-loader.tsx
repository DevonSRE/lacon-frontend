import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";

interface TableContentLoaderProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const TableContentLoader = <TData, TValue>({
  columns,
}: TableContentLoaderProps<TData, TValue>) => {
  return (
    <Table>
      <TableHeader className="h-12">
        <TableRow>
          {columns.map((_, index) => (
            <TableHead key={index}>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <TableRow className="h-16" key={rowIndex}>
            {columns.map((_, cellIndex) => (
              <TableCell key={cellIndex}>
                <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableContentLoader;
