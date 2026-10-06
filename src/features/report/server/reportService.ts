import { axiosInstance } from "@/lib/_api/axios-config";
import { Ipage } from "@/lib/constants";

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
    // These run in server actions (Node): only 'arraybuffer' keeps the file's bytes.
    // 'blob' or the default decodes the .xlsx as UTF-8 text and corrupts it.
    async exportAdminOverview(filters: Ipage) {
        return await axiosInstance.get("export/admin-overview", {
            params: filters,
            responseType: 'arraybuffer',
        });
    },
    async exportCaseType(filters: Ipage) {
        return await axiosInstance.get("export/admin-casetypes", {
            params: filters,
            responseType: 'arraybuffer',
        });
    },
    async exportAdminUnit(filters: any) {
        return await axiosInstance.get("export/admin-unit", {
            params: filters,
            responseType: 'arraybuffer',
        });
    },
}

export default reportServices;
