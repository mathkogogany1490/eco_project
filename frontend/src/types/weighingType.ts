
/**
 * 계량 생성 공통 타입
 */
export interface WeighingBase {
    contract_id: number;
    vehicle_no: string;
    gross_weight: number;
    tare_weight: number;
    sensor_id?: string;
}


export interface ManualWeighingPayload {
    contract_id: number;
    vehicle_no: string;
    gross_weight: number;
    tare_weight: number;
}

export interface AutoWeighingPayload extends ManualWeighingPayload {
    sensor_id: string;
}