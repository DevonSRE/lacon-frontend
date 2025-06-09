import { axiosInstance } from "@/lib/_api/axios-config";

const usersServices = {
    async getState(param: any) {
        return await axiosInstance.get("/users", {
            params: param,
        });
    },
}

export default usersServices;
