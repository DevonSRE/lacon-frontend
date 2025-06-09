import React from "react";
import Image from "next/image";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
      <Image src="/loading.gif" alt={""} width={100} height={20}  className="h-10"/>
      <p className="text-black text-lg font-medium">Loading, Please wait ...</p>
    </div>
  );
};

export default LoadingScreen;

