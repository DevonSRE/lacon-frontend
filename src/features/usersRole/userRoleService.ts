import { axiosInstance } from "@/lib/_api/axios-config";
import { Ipage } from "@/lib/constants";

const usersServices = {
    async getUsers(param: Ipage) {
        return await axiosInstance.get("/users", {
            params: param,
        });
    },
    async getLawyers(param: Ipage) {
        return await axiosInstance.get("/users/lawyers", {
            params: param,
        });
    },
    async getLawyersRequest(param: Ipage) {
        return await axiosInstance.get("/users/lawyer-unit-request", {
            params: param,
        });
    },
    async getProbunoLawyersRequest(param: Ipage) {
        return await axiosInstance.get("/users/probono-request", {
            params: param,
        });
    },
    async getProbunoLawyersRequestSingle(id: string) {
        return await axiosInstance.get(`/users/probono-request/${id}`);
    },
    async getUserType(param: Ipage) {
        return await axiosInstance.get("/users/get-user-by-type", {
            params: param,
        });
    },
    async GetDocumentHistory(_param: Ipage, id: string) {
        return await axiosInstance.get(`/casefile/${id}/document-history`);
    },
}

export default usersServices;
