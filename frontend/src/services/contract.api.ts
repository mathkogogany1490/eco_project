import api from "./api";

export const getContracts = async () => {
    const res = await api.get("/contracts");
    return res.data;
};
