import { axiosInstance } from "@/lib/_api/axios-config";


const UService = {
    async acceptReject(payload: any, id: string) {
        return await axiosInstance.post(`/users/probono-request/${id}`, payload);
    },

}

export default UService;
