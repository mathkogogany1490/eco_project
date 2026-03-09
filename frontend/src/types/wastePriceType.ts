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

export interface WastePriceState {
    items: WastePrice[];
    loading: boolean;
}

/**
 * 생성 요청 타입
 */
export interface WastePriceCreate {
    waste_type: string;
    transport_fee: number;
    process_fee: number;
}