"use server";

import { axiosInstance } from "@/lib/_api/axios-config";
import { isAxiosError } from "axios";

/**
 * What has happened to the signed-in person (QA 2026-11-01 run 4, 13 Nov,
 * row 51).
 *
 * The panel opened empty with no message while the bell showed an unread dot:
 * the dropdown was a template stub with its example rows commented out, the dot
 * was hard-coded on, and no endpoint existed. The API now reads the feed from
 * the records the system already keeps, and `waiting` is what the dot means —
 * there is something here for you.
 */
export type NotificationItem = {
  id: string;
  kind: string;
  title: string;
  detail: string;
  reference?: string;
  link: string;
  at: string;
  needs_you: boolean;
};

export type NotificationFeed = { items: NotificationItem[]; waiting: number };

export async function getNotifications(): Promise<
  { success: true; data: NotificationFeed } | { success: false; message: string }
> {
  try {
    const response = await axiosInstance.get("/notifications");
    const feed = response.data?.data;
    return {
      success: true,
      data: {
        items: Array.isArray(feed?.items) ? feed.items : [],
        waiting: typeof feed?.waiting === "number" ? feed.waiting : 0,
      },
    };
  } catch (error) {
    if (isAxiosError(error)) {
      const body = error.response?.data as { message?: string } | undefined;
      return { success: false, message: body?.message || "Notifications could not be loaded." };
    }
    return { success: false, message: "Notifications could not be loaded." };
  }
}
