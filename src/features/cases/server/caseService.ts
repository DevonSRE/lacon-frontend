import { axiosInstance } from "@/lib/_api/axios-config";

const casesServices = {
    async getCases(param: any) {
        return await axiosInstance.get("/cases", {
            params: param,
        });
    },
}

export default casesServices;
