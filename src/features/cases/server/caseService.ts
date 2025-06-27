import { axiosInstance } from "@/lib/_api/axios-config";

const casesServices = {
    async getCases(param: any) {
        return await axiosInstance.get("/casefile", {
            params: param,
        });
    },
    async getEvents(param: any, id: string) {
        return await axiosInstance.get(`/users/${id}/events`, {
            params: param,
        });
    },
    async AssignCases(payload: any) {
        return await axiosInstance.patch("/admin/casefile/case-assignment", payload);
    },
    async UpdateCasesFile(payload: any, id: string) {
        console.log(`/admin/casefile/${id}/case-update`);
        return await axiosInstance.post(`/admin/casefile/${id}/case-update`, payload);
    },
    async UploadeDocument(payload: any, id: string) {
        return await axiosInstance.post(`/casefile/${id}/document-upload`, payload);
    },
}

export default casesServices;
