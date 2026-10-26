import { CreateUserFormData } from "./type";
import { axiosInstance } from "@/lib/_api/axios-config";



const UserService = {
    async inviteUser(payload: CreateUserFormData) {
        return await axiosInstance.post("/users", payload);
    },
    async updateLawyers(payload: unknown, id: string) {
        return await axiosInstance.patch(`/users/${id}`, payload);
    },
    async deleteUser(id: string) {
        return await axiosInstance.delete(`/users/${id}`);
    },
    async suspendUser(id: string) {
        return await axiosInstance.patch(`/users/${id}`, { status: "INACTIVE" });
    },
    async ActivateUser(id: string) {
        return await axiosInstance.patch(`/users/${id}`, { status: "ACTIVE" });
    },
    // A field office asks the DG for an account change; nothing is created until
    // the DG approves it.
    async requestUser(payload: unknown) {
        return await axiosInstance.post("/users/lawyer-unit-request", payload);
    },
    async apporveUser(payload: unknown, id: string) {
        return await axiosInstance.post(`/users/lawyer-unit-request/${id}/approve`, payload);
    },

    async rejectUser(payload: unknown, id: string) {
        return await axiosInstance.post(`/users/lawyer-unit-request/${id}/reject`, payload);
    },

}

export default UserService;
