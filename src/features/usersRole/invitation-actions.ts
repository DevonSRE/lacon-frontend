"use server";

import { z } from "zod";
import { axiosInstance } from "@/lib/_api/axios-config";

type CenterOption = { id: string; title: string; state_id: string };

export async function getInvitationCenters(stateId: string): Promise<
  { success: true; data: CenterOption[] } | { success: false; message: string }
> {
  if (!z.uuid().safeParse(stateId).success) return { success: false, message: "Choose a state first." };
  try {
    // The standard centers list does not filter by state. Read all pages and
    // filter by the actual state UUID, without the legacy inactive GET that writes data.
    const options: CenterOption[] = [];
    let page = 1;
    let totalPages = 1;
    do {
      const response = await axiosInstance.get("/centers", { params: { page, size: 100 } });
      const result = response.data?.data;
      if (response.data?.success === false || !Array.isArray(result?.data) || !Number.isInteger(result.total_pages) || result.total_pages < 1) {
        throw new Error("Invalid centre response");
      }
      totalPages = result.total_pages;
      for (const center of result.data) {
        if (center.state_id === stateId && z.uuid().safeParse(center.id).success && typeof center.title === "string") {
          options.push({ id: center.id, title: center.title, state_id: center.state_id });
        }
      }
      page++;
    } while (page <= totalPages);
    return { success: true, data: options.sort((a, b) => a.title.localeCompare(b.title)) };
  } catch {
    return { success: false, message: "Could not load centres. Please try again." };
  }
}
