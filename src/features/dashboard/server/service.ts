import { authConfig } from "@/lib/_api/auth-config";
import { CreateUserFormData } from "./type";
import { axiosInstance } from "@/lib/_api/axios-config";



const UserService = {
    async inviteUser(payload: any) {
        return await axiosInstance.post("/users", payload);
    },
    async updateLawyers(payload: any, id: string) {
        return await axiosInstance.patch(`/users/${id}`, payload);
    },
    async deleteUser(id: string) {
        return await axiosInstance.delete(`/users/${id}`);
    },
    async suspendUser(id: string) {
        return await axiosInstance.patch(`/users/${id}`, { status: "INACTIVE" });
    },

 
}

export default UserService;
