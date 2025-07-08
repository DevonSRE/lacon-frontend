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
      router.push("/dashboard");
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
          <Image src="/loading.gif" alt={""} width={100} height={100} />
          <p className="text-gray-600 text-md font-medium flex flex-wrap  mt-4 gap-1">
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
