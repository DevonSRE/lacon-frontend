"use server";
import { axiosInstance } from "@/lib/_api/axios-config";
import { toDownload } from "@/features/report/server/to-download";
import { z } from "zod";
export async function downloadDesignationLetter(id:string){
 if(!z.uuid().safeParse(id).success)return {success:false as const,message:"Invalid application."};
 try {const r=await axiosInstance.get(`/users/probono-request/${id}/designation-letter`,{responseType:"arraybuffer"});return toDownload({data:r.data,headers:r.headers as Record<string,unknown>},"LACON-Letter-of-Designation.pdf");}catch{return {success:false as const,message:"The letter could not be downloaded."};}
}
