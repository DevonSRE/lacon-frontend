import React from "react";

export default function SuspenseLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black mb-4"></div>
      <p className="text-black text-lg font-medium">Loading, Please wait ...</p>
    </div>
  );
}
