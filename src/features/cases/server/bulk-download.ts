"use server";
import { axiosInstance } from "@/lib/_api/axios-config";
import { toDownload } from "@/features/report/server/to-download";

export async function downloadBulkTemplate() {
 try {const r=await axiosInstance.get("/casefile/bulk-template",{responseType:"arraybuffer"});return toDownload({data:r.data,headers:r.headers as Record<string,unknown>},"lacon-bulk-cases-template.xlsx");}catch(e){return {success:false as const,status:500,message:"The template could not be downloaded."};}
}
