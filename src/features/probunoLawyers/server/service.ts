import { TProbunoCaseUpdatePayload, TProbunoFormPayload } from "@/features/probunoLawyers/server/probonoSchema";
import { axiosInstance, publicAxiosInstance } from "@/lib/_api/axios-config";
import { userConfig } from "@/lib/_api/user-config";

const ProbunoService = {
    async registration(payload: TProbunoFormPayload) {
        return await userConfig.post("/users/probono-lawyers", payload);
    },
    async cases(payload: any) {
        return await userConfig.post("/users/probono-lawyers-with-case", payload);
    },
    async casesUpdate(payload: any) {
        return await userConfig.post("/users/probono-lawyers-update-case", payload);
    },
    async casesPublicCase(payload: any) {
        return await publicAxiosInstance.post("/casefile/create-public-case", payload);
    },
    async casesDecongestionCase(payload: any) {
        return await axiosInstance.post("/casefile/create-decongestion-case", payload);
    },
    async casesPDSSCase(payload: any) {
        return await axiosInstance.post("/casefile/create-pdss-case", payload);
    },
    async casesPerogativeCase(payload: any) {
        return await axiosInstance.post("/casefile/create-perogative-case", payload);
    },
}

export default ProbunoService;
