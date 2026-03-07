import api from "./api";
import {WastePrice, WastePriceCreate} from "@/types/type";




/**
 * 특정 계약의 폐기물 단가 목록 조회
 */
export const getWastePrices = async (
    contractId: number
): Promise<WastePrice[]> => {
    const res = await api.get(`/contracts/${contractId}/wastes/`);
    return res.data;
};

/**
 * 폐기물 단가 생성 (ADMIN)
 */
export const createWastePrice = async (
    contractId: number,
    data: WastePriceCreate
): Promise<WastePrice> => {
    const res = await api.post(`/contracts/${contractId}/wastes/`, data);
    return res.data;
};
