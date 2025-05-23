"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useId } from "react";

export default function ReusableTabs({
  activeTab, onTabChange, tabs, tablistClassName,
}: {
  activeTab: string;
  tabs: { id: any; label: string }[];
  onTabChange: (type: string) => void;
  tablistClassName?: string;
}) {

  const uniqueId = useId();

  return (
    <Tabs
      defaultValue={activeTab}
      value={activeTab}
      onValueChange={(type) => {
        onTabChange(type);
      }}
      className="w-full"
    >
      <TabsList
        className={cn(
          "h-auto p-0 text-sm bg-transparent border-b w-full text-[#BD2B12] justify-start space-x-4 transition-colors duration-200 ",
          tablistClassName
        )}>
        {/* <div className="w-full overflow-x-auto scrollbar-hide"> */}
          {tabs.map((tab: { id: any; label: string }) => (
            <TabsTrigger key={tab.id} value={tab.id} className="relative px-0 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border- data-[state=active]:text-[#BD2B12] data-[state=active]:font-bold data-[state=active]:shadow-none text-sm text-neutral-400">
              {tab.label}
              {activeTab == tab.id && (
                <motion.div
                  layoutId={`activeTab-${uniqueId}`}
                  className="absolute -bottom-0.5 left-0 text-[#BD2B12] right-0 h-0.5 bg-[#BD2B12]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </TabsTrigger>
          ))}
        {/* </div> */}
      </TabsList>
    </Tabs>
  );
}
