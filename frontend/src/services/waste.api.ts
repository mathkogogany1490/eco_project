import api from "./api";

/**
 * 폐기물 단가 타입
 */
export interface WastePrice {
    id: number;
    contract_id: number;
    waste_type: string;
    transport_fee: number;
    process_fee: number;
}

/**
 * 생성 요청 타입
 */
export interface WastePriceCreate {
    waste_type: string;
    transport_fee: number;
    process_fee: number;
}

/**
 * 특정 계약의 폐기물 단가 목록 조회
 */
export const getWastePrices = async (
    contractId: number
): Promise<WastePrice[]> => {
    const res = await api.get(`/contracts/${contractId}/wastes`);
    return res.data;
};

/**
 * 폐기물 단가 생성 (ADMIN)
 */
export const createWastePrice = async (
    contractId: number,
    data: WastePriceCreate
): Promise<WastePrice> => {
    const res = await api.post(`/contracts/${contractId}/wastes`, data);
    return res.data;
};
