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
    async getAdminReport(filters: any) {
        return await axiosInstance.get("analytics/admin", {
            params: filters,
        });
    },
    async getunitheadReport(filters: any) {
        return await axiosInstance.get("analytics/department-report", {
            params: filters,
        });
    },
    async getAllUnit(filters: any) {
        return await axiosInstance.get("analytics/admin-unit", {
            params: filters,
        });
    },
    async getLaconLAwyer(filters: any) {
        return await axiosInstance.get("users/lacon-lawyers", {
            params: filters,
        });
    },
    async exportAdminOverview() {
        return await axiosInstance.get("export/admin-overview", {
            responseType: 'blob' // Important for file downloads
        });
    },
    async exportCaseType() {
        return await axiosInstance.get("export/casetypes");
    },
    async exportAdminUnit(filters: any) {
        return await axiosInstance.get("export/admin-unit", {
            params: filters,
        });
    },
}

export default reportServices;
