"use client";
import { useState, useTransition, type Dispatch, type SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ILawyerManagement } from "@/types/case";
import { requestAccountChange } from "@/features/usersRole/invitation-actions";
import { Button } from "@/components/ui/button";
export default function SuspensionForm({lawyer,setOpen}:{lawyer?:ILawyerManagement|null;sheetType?:string|null;setOpen:Dispatch<SetStateAction<boolean>>}) {
 const [reason,setReason]=useState("");const [error,setError]=useState("");const [pending,startTransition]=useTransition();const client=useQueryClient();
 return <form className="space-y-4 p-4" onSubmit={e=>{e.preventDefault();setError("");startTransition(async()=>{const r=await requestAccountChange(lawyer?.id ?? "",reason);if(!r.success){setError(r.message);return;}toast.success(r.data);await Promise.all([client.invalidateQueries({queryKey:["getLaweyersManagement"]}),client.invalidateQueries({queryKey:["getMyLawyerRequests"]})]);setOpen(false);});}}>
 <h2 className="text-xl font-semibold">Request suspension</h2><p>{lawyer?.first_name} {lawyer?.last_name} · {lawyer?.email}</p>
 <p className="text-sm">The Director General must approve this request. The lawyer remains active until then.</p>
 <label htmlFor="suspension-reason">Reason (required)</label><textarea id="suspension-reason" value={reason} onChange={e=>setReason(e.target.value)} required className="min-h-28 w-full rounded border p-2" />
 {error && <p role="alert" className="text-red-700">{error}</p>}<Button disabled={pending || !reason.trim()}>{pending?"Sending…":"Send request to the Director General"}</Button><Button type="button" variant="outline" onClick={()=>setOpen(false)}>Cancel</Button></form>;
}
