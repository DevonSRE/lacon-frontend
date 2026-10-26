import { TProbunoCaseUpdatePayload, TProbunoFormPayload } from "@/features/probunoLawyers/server/probonoSchema";
import { axiosInstance, publicAxiosInstance } from "@/lib/_api/axios-config";
import { userConfig } from "@/lib/_api/user-config";

const ProbunoService = {
    async registration(payload: TProbunoFormPayload) {
        return await userConfig.post("/users/probono-lawyers", payload);
    },
    async cases(payload: unknown) {
        return await userConfig.post("/users/probono-lawyers-with-case", payload);
    },
    async casesUpdate(payload: TProbunoCaseUpdatePayload) {
        return await userConfig.post("/users/probono-lawyers-update-case", payload);
    },
    async requestReviewCode(payload: { email: string }) {
        return await userConfig.post("/users/probono-lawyers-update-case/request-code", payload);
    },
    async casesCase(payload: unknown) {
        return await axiosInstance.post("/casefile", payload);
    },
    async casesPDSSCase(payload: unknown) {
        return await axiosInstance.post("/casefile/create-pdss-case", payload);
    },

    async casesDecongestionCase(payload: unknown) {
        return await axiosInstance.post("/casefile/create-decongestion-case", payload);
    },

    async casesPerogativeCase(payload: unknown) {
        return await axiosInstance.post("/casefile/create-perogative-case", payload);
    },


    // PUBLICK API KEY
    async casesPublicCase(payload: unknown) {
        return await publicAxiosInstance.post("/casefile/create-public-case", payload);
    },
    async casesPublicPDSSCase(payload: unknown) {
        return await publicAxiosInstance.post("/casefile/create-public-pdss-case" , payload);
    },

}

export default ProbunoService;
