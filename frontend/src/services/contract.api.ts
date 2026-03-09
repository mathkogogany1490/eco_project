import api from "./api";
import { Contract } from "@/types/contractType";

export const getContracts = async (): Promise<Contract[]> => {
    const res = await api.get<Contract[]>("/contracts/");
    return res.data;
};
