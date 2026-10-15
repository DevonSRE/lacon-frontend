import { axiosInstance } from "@/lib/_api/axios-config";

const detailsServices = {
  async getState(param: unknown) {
    return await axiosInstance.get("/states", {
      params: param,
    });
  },
  async getInactiveState(param: unknown) {
    return await axiosInstance.get("/states?status=inactive", {
      params: param,
    });
  },
  async getZone(param: unknown) {
    return await axiosInstance.get("/zones?status=inactive", {
      params: param,
    });
  },

  async getInActiveUser(param: unknown) {
    return await axiosInstance.get("public/user-types/inactive", {
      params: param,
    });
  },

  async getActiveUser(param: unknown) {
    return await axiosInstance.get("public/user-types/active", {
      params: param,
    });
  },
};

export default detailsServices;
