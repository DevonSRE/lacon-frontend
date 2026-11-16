"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Dropdown } from "../ui/dropdown/Dropdown";
import { getNotifications } from "@/features/notifications/notifications";
import { timeAgo } from "@/features/notifications/when";

/**
 * The bell.
 *
 * This was a template stub: the dot was hard-coded on, the list held nothing
 * but commented-out example rows, and nothing was ever fetched, so the panel
 * opened empty with no message while the bell claimed there was something to
 * read (QA 2026-11-01 run 4, 13 Nov, row 51).
 *
 * The dot now means what the API calls `waiting`: there is something here that
 * is still yours to act on. Items that merely happened are listed without
 * lighting it.
 */
export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => await getNotifications(),
    // The bell is read at a glance and the feed is derived, not stored, so a
    // minute-old answer is fine and costs the API nothing.
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  const feed = data?.success ? data.data : undefined;
  const items = feed?.items ?? [];
  const waiting = feed?.waiting ?? 0;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={waiting > 0 ? `Notifications, ${waiting} waiting for you` : "Notifications"}
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={() => setIsOpen(open => !open)}
      >
        {waiting > 0 && (
          <span className="absolute right-0 top-0.5 z-10 flex h-2 w-2 rounded-full bg-orange-400">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute -right-[240px] mt-[17px] flex max-h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notifications</h5>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setIsOpen(false)}
            className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Whatever the answer is, the panel says something. It used to say
            nothing at all. */}
        {isLoading ? (
          <p className="px-2 py-6 text-center text-sm text-gray-500">Loading…</p>
        ) : data && !data.success ? (
          <p className="px-2 py-6 text-center text-sm text-red-600">{data.message}</p>
        ) : items.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No notifications yet.
          </p>
        ) : (
          <ul className="flex flex-col overflow-y-auto custom-scrollbar">
            {items.map(item => (
              <li key={item.id}>
                <Link
                  href={item.link}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col gap-1 rounded-lg border-b border-gray-100 p-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
                  <span className="flex items-start gap-2">
                    {item.needs_you && (
                      <span
                        aria-hidden
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-400"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {item.title}
                    </span>
                  </span>
                  {item.detail && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</span>
                  )}
                  <span className="flex items-center gap-2 text-xs text-gray-400">
                    {item.reference && (
                      <>
                        <span>{item.reference}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-400" />
                      </>
                    )}
                    <span>{timeAgo(item.at)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Dropdown>
    </div>
  );
}
