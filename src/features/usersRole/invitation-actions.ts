"use server";

import { isAxiosError } from "axios";
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

/**
 * Accounts that were invited and have never signed in.
 *
 * Routing wants an ACTIVE holder, so an office held by one of these is an
 * office with nobody in it: cases filed to it are stored unrouted and wait in
 * the Director General's queue. The queue showed the cases and never the
 * person, so nothing said that one unaccepted invitation was the reason
 * (QA 2026-11-01, item 20).
 */
export type PendingInvitation = {
  id: string;
  name: string;
  email: string;
  user_type: string;
  place: string;
  invited_at: string;
  days_waiting: number;
  invite_expired: boolean;
  cases_waiting: number;
};

type Answer<T> = { success: true; data: T } | { success: false; message: string };

function said(error: unknown, fallback: string): { success: false; message: string } {
  if (isAxiosError(error)) {
    if (error.response?.status === 403) return { success: false, message: "Only the Director General and the admins can do this." };
    const body = error.response?.data as { message?: string; data?: { error?: string } } | undefined;
    return { success: false, message: body?.data?.error || body?.message || fallback };
  }
  return { success: false, message: fallback };
}

export async function getPendingInvitations(): Promise<Answer<PendingInvitation[]>> {
  try {
    const response = await axiosInstance.get("/users/pending-invitations");
    const rows = response.data?.data;
    return { success: true, data: Array.isArray(rows) ? rows : [] };
  } catch (error) {
    return said(error, "The invitations could not be loaded.");
  }
}

export async function resendInvitation(userId: string): Promise<Answer<string>> {
  if (!z.uuid().safeParse(userId).success) return { success: false, message: "That is not an account." };
  try {
    const response = await axiosInstance.post(`/users/${userId}/resend-invitation`);
    return { success: true, data: response.data?.message || "A new invitation is on its way" };
  } catch (error) {
    return said(error, "The invitation could not be sent.");
  }
}

export async function getHeldCases(userId: string): Promise<Answer<number>> {
 if(!z.uuid().safeParse(userId).success) return {success:false,message:"Invalid account."};
 try {const res=await axiosInstance.get(`/users/${userId}`);return {success:true,data:res.data.data.held_cases ?? 0};} catch(error){return said(error,"Could not check this account's cases.");}
}

export async function requestAccountChange(userId: string, reason: string) : Promise<Answer<string>> {
 if(!z.uuid().safeParse(userId).success || !reason.trim()) return {success:false,message:"Choose an account and give a reason."};
 try {await axiosInstance.post("/users/lawyer-unit-request",{action:"DEACTIVATE",lawyer_id:userId,reason:reason.trim()});return {success:true,data:"Suspension requested. The account stays active until the Director General decides."};}catch(error){return said(error,"The request could not be sent.");}
}
export async function getPendingAccountRequests(): Promise<Answer<Array<{ID:string;LawyerName:string;LawyerEmail:string;Status:string;Action:string}>>> {
 try {const rows=[];for(let page=1;;page++){const res=await axiosInstance.get("/users/lawyer-unit-request",{params:{page,size:100}});const data=res.data.data;rows.push(...(data.data ?? []));if(page >= (data.total_pages || 1))break;}return {success:true,data:rows.filter(r=>r.Status==="PENDING" && r.Action==="ADD")};}catch(error){return said(error,"Pending requests could not be loaded.");}
}
