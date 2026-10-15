import { axiosInstance } from "@/lib/_api/axios-config";

const casesServices = {
    async getCases(param: unknown) {
        return await axiosInstance.get("/casefile", {
            params: param,
        });
    },
    async getEvents(param: unknown, id: string) {
        return await axiosInstance.get(`/users/${id}/events`, {
            params: param,
        });
    },
    async AssignCases(payload: unknown) {
        return await axiosInstance.patch("/admin/casefile/case-assignment", payload);
    },
    async UpdateCasesFile(payload: unknown, id: string) {
        return await axiosInstance.post(`/admin/casefile/${id}/case-update`, payload);
    },
    async UploadeDocument(payload: unknown, id: string) {
        return await axiosInstance.post(`/casefile/${id}/document-upload`, payload);
    },
}

export default casesServices;
