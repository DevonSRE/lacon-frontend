import { TProbunoCaseUpdatePayload, TProbunoFormPayload } from "@/features/probunoLawyers/server/probonoSchema";
import { axiosInstance } from "@/lib/_api/axios-config";

const ProbunoService = {
    async registration(payload: TProbunoFormPayload) {
        return await axiosInstance.post("/users/probono-lawyers", payload);
    },
    async cases(payload: TProbunoFormPayload) {
        return await axiosInstance.post("/users/probono-lawyers-with-case", payload);
    },
    async casesUpdate(payload: TProbunoCaseUpdatePayload) {
        return await axiosInstance.post("/users/probono-lawyers-update-case", payload);
    },
}

export default ProbunoService;
