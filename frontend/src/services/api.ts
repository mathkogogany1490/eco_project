import axios from "axios";

/**
 * Next.js 환경변수
 */
const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

if (typeof window !== "undefined") {
    console.log("✅ API BASE URL =", BASE_URL);
}

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

/**
 * 🔐 Request Interceptor (JWT 자동 추가)
 */
api.interceptors.request.use(
    (config) => {

        if (typeof window !== "undefined") {

            const token = localStorage.getItem("access_token");

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }

        }

        return config;

    },
    (error) => Promise.reject(error)
);

/**
 * 🔥 Response Interceptor
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response) {

            console.error("❌ API ERROR STATUS:", error.response.status);
            console.error("❌ API ERROR DATA:", error.response.data);

            if (error.response.status === 401) {

                console.warn("⚠️ Unauthorized - Token Removed");

                if (typeof window !== "undefined") {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("role");
                }

            }

        } else {

            console.error("❌ API NETWORK ERROR:", error.message);

        }

        return Promise.reject(error);
    }
);

export default api;