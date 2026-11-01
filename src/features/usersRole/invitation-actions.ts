"use server";

import { z } from "zod";
import { axiosInstance } from "@/lib/_api/axios-config";

type CenterOption = { id: string; title: string; state_id: string };

export async function getInvitationCenters(stateId: string): Promise<
  { success: true; data: CenterOption[] } | { success: false; message: string }
> {
  if (!z.uuid().safeParse(stateId).success) return { success: false, message: "Choose a state first." };
  try {
    // /centers filters on state_id server-side, so ask for the one state
    // instead of downloading every page and filtering in the browser. The
    // parameter takes an id; a state *name* is now refused rather than
    // answered with an empty page (QA 2026-11-01, item 1).
    //
    // The loop stays because the page size is the API's promise, not ours: a
    // state with more centres than one page would otherwise lose the rest. It
    // runs once for every state in the data today. The legacy inactive GET is
    // still avoided here — it writes data.
    const options: CenterOption[] = [];
    let page = 1;
    let totalPages = 1;
    do {
      const response = await axiosInstance.get("/centers", { params: { page, size: 100, state: stateId } });
      const result = response.data?.data;
      if (response.data?.success === false || !Array.isArray(result?.data) || !Number.isInteger(result.total_pages) || result.total_pages < 1) {
        throw new Error("Invalid centre response");
      }
      totalPages = result.total_pages;
      for (const center of result.data) {
        if (z.uuid().safeParse(center.id).success && typeof center.title === "string") {
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
