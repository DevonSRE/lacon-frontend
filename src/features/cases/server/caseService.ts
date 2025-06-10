import { axiosInstance } from "@/lib/_api/axios-config";

const casesServices = {
    async getCases(param: any) {
        return await axiosInstance.get("/casefile", {
            params: param,
        });
    },
    async AssignCases(payload: any) {
        return await axiosInstance.post("/admin/casefile/case-assignment", payload);
    },
}

export default casesServices;
