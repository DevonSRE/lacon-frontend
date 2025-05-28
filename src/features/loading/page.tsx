'use client'
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Icons } from "@/icons/icons";
import Image from "next/image";


export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [router]);

  const text = "Fetching User Roles and Permissions…";
  const words = ["Fetching", "User", "Roles", "and", "Permissions…"];
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= words.length) return 0;
        return prev + 1;
      });
    }, 500); // 500ms delay between words

    return () => clearInterval(interval);
  }, [words.length]);


  return (
    <>
      <Head>
        <title>Fetching User Roles...</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen  text-center">
        {/* Logo & Title */}
        <div className="absolute top-16 flex items-center gap-2">
          <img src="/logo.png" alt="LACON Logo" className="h-8 w-8" />
          <span className="font-semibold text-lg text-gray-700">
            LACON Case Management System
          </span>
        </div>

        {/* Top Wave Decoration */}
        <div className="absolute top-0 z-100 w-full overflow-hidden leading-none">
          {/* <Icons.ToppatterIcon  className="w-full" /> */}
        </div>

        {/* Spinner & Text */}
        <div className="flex flex-col items-center">
          {/* <div className="animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-[#000] h-12 w-12 mb-4"></div> */}
          <Image src="/loading.gif" alt={""} width={200} height={50} />
          <p className="text-gray-600 text-sm font-medium flex flex-wrap gap-1">
            {words.map((word, index) => (
              <span
                key={index}
                className={`transition-opacity duration-300 ${index < visibleCount ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                {word}
              </span>
            ))}
          </p>

        </div>
      </div>
    </>
  );
}
