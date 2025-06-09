import React from "react";
import Image from "next/image";


export default function SuspenseLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
      <Image src="/loading.gif" alt={""} width={150} height={40} />
      <p className="text-black text-lg font-medium">Loading, Please wait ...</p>
    </div>
  );
}
