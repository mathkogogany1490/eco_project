import api from "./api";

export const login = async (username: string, password: string) => {
    const res = await api.post("/auth/login", { username, password });
    localStorage.setItem("access_token", res.data.access_token);
    return res.data;
};
