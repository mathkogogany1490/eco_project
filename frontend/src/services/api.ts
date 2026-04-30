import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
    timeout: 10000,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {

        if (typeof window !== "undefined") {
            const token =
                localStorage.getItem("access") ||
                localStorage.getItem("access_token");

            if (token) {
                config.headers.set("Authorization", `Bearer ${token}`);
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;