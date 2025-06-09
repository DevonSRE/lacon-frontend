import { axiosInstance } from "@/lib/_api/axios-config";

const reportServices = {
    async getOverview(filters: any) {
        return await axiosInstance.get("/analytics/admin-overview", {
            params: filters,
        });
    },
    async getReportCaseType(filters: any) {
        return await axiosInstance.get("/analytics/admin-casetype", {
            params: filters,
        });
    },
    async getReportAdminLawyer(filters: any) {
        return await axiosInstance.get("/analytics/admin-lawyer", {
            params: filters,
        });
    },
    async getReportDemography(filters: any) {
        return await axiosInstance.get("analytics/admin-demography", {
            params: filters,
        });
    },
}

export default reportServices;
