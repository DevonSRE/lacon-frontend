'use client';
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden">
      {/* Main Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* Animated Error Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800/30">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-red-700 dark:text-red-400">
            PAGE NOT FOUND
          </span>
        </div>

        {/* Enhanced Title with Gradient */}
        <h1 className="mb-8 text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-gray-300 dark:to-white md:text-8xl">
          404
        </h1>

        {/* Enhanced Description */}
        <div className="mb-10 space-y-2">
          <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
            Oops! Page Not Found
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            The page you&apos;re looking for seems to have wandered off into the digital void.
            Don&apos;t worry, it happens to the best of us!
          </p>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:focus:ring-offset-gray-900"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Go Back
          </button>
        </div>

        <p className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Use the home page to continue browsing LACON services.
        </p>
      </div>

      {/* Enhanced Footer */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} • Made with{" "}
          <span className="text-red-500 animate-pulse">♥</span>
        </p>
      </footer>
    </div>
  );
}
