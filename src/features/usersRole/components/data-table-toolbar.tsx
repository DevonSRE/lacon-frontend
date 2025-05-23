"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CasesDataTableToolbar() {
  return (
    <div className="flex items-center border rounded-md p-4 mt-6 justify-between">
      <div className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral" />
          <Input
            type="search"
            autoComplete="off"
            data-form-type="other"
            placeholder="search"
            className="pl-9  md:w-[100px] lg:w-[400px]"
          />
        </div>
      </div>

      <section className="flex gap-3">
        <Button variant="outline" className="text-sm"> Filter</Button>
      </section>
    </div>
  );
}
