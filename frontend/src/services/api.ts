import axios from "axios";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {

        if (typeof window !== "undefined") {
            const token = localStorage.getItem("access_token");

            console.log("🔑 요청 토큰:", token);

            if (token) {
                // 🔥 타입 무시하고 강제 주입 (가장 안정)
                (config.headers as any)["Authorization"] = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;