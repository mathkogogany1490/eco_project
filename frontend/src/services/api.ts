import axios from "axios";

/**
 * ⚠️ Next.js는 빌드 시점 env 사용
 * client에서만 console.log 권장
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
 * Request interceptor (JWT)
 */
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("access_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(
            "❌ API ERROR:",
            error.response?.data || error.message
        );
        return Promise.reject(error);
    }
);

export default api;
