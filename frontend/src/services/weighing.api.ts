import api from "./api";
import {WeighingBase} from '@/types/type'
import { AutoWeighingPayload } from "@/types/weighingType"


/**
 * 🔥 수동 계량 (ADMIN 전용)
 */
export const createManualWeighing = async (
    data: WeighingBase
) => {
    const res = await api.post(
        "/weighings/manual/",
        data
    );

    return res.data;
};



export const createAutoWeighing = async (
    data: AutoWeighingPayload
) => {
    const res = await api.post("/weighing/auto/", data)
    return res.data
}