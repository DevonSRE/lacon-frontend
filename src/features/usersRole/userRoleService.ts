import { axiosInstance } from "@/lib/_api/axios-config";
import { GetDocumentHistory } from "./userRoleAction";

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
    async getProbunoLawyersRequestSingle(id: string) {
        return await axiosInstance.get(`/users/probono-request/${id}`);
    },
    async getUserType(param: any) {
        return await axiosInstance.get("/users/get-user-by-type", {
            params: param,
        });
    },
    async GetDocumentHistory(param: any, id: string) {
        return await axiosInstance.get(`/casefile/${id}/document-history`);
    },
}

export default usersServices;
