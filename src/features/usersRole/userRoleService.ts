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
}

export default usersServices;
