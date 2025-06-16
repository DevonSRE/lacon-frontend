import { axiosInstance } from "@/lib/_api/axios-config";

const usersServices = {
    async getUsers(param: any) {
        return await axiosInstance.get("/users", {
            params: param,
        });
    },
    async getLawyers(param: any) {
        return await axiosInstance.get("/users/lawyers", {
            params: param,
        });
    },
    async getLawyersRequest(param: any) {
        return await axiosInstance.get("/users/lawyer-unit-request", {
            params: param,
        });
    },
    async getProbunoLawyersRequest(param: any) {
        return await axiosInstance.get("/users/probono-request", {
            params: param,
        });
    },
    async getUserType(param: any) {
        return await axiosInstance.get("/users/get-user-by-type", {
            params: param,
        });
    },
}

export default usersServices;
