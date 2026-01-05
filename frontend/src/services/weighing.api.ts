import api from "./api";

/**
 * 계량 생성 공통 타입
 */
export interface WeighingBase {
    contract_id: number;
    vehicle_no: string;
    gross_weight: number;
    tare_weight: number;
}

/**
 * 자동 계량 (SYSTEM)
 */
export const createAutoWeighing = async (
    data: WeighingBase,
    systemApiKey: string
) => {
    const res = await api.post("/weighings/auto", data, {
        headers: {
            "X-API-KEY": systemApiKey,
        },
    });
    return res.data;
};

/**
 * 수동 계량 (ADMIN)
 */
export const createManualWeighing = async (data: WeighingBase) => {
    const res = await api.post("/weighings", data);
    return res.data;
};
