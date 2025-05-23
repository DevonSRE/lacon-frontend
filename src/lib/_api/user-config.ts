import axios from "axios"
import { NEXT_BASE_URL } from "../constants"

const userConfig = axios.create({
  baseURL: NEXT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})


userConfig.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }

      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export { userConfig }
