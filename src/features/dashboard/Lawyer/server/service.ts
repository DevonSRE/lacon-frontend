import { axiosInstance } from "@/lib/_api/axios-config";

const CaseIntakeServices = {
    async getCaseIntake(param: unknown) {
        return await axiosInstance.get("/case-intake", {
            params: param,
        });
    },

    async createCaseIntake(payload: unknown) {
        return await axiosInstance.post("/case-intake", payload);
    },
}

export default CaseIntakeServices;
