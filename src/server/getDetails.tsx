import { axiosInstance } from "@/lib/_api/axios-config";

const detailsServices = {
    async getState(param: any) {
        return await axiosInstance.get("/states", {
            params: param,
        });
    },
    async getZone(param: any) {
        return await axiosInstance.get("/zones", {
            params: param,
        });
    },

      async getActiveUser(param: any) {
        return await axiosInstance.get("public/user-types/inactive", {
            params: param,
        });
    },

}

export default detailsServices;
