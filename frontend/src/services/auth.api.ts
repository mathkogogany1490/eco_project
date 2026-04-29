import api from "./api"
import {
    LoginResponse,
    RegisterResponse,
    LoginRequest,
    RegisterRequest
} from "@/types/authType"

import axios from "axios"

export const login = async (
    data: LoginRequest
): Promise<LoginResponse> => {

    try {

        const res = await api.post<LoginResponse>(
            "/auth/login/",
            data
        )

        return res.data

    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            console.error(
                "❌ Login API Error:",
                error.response?.data || error.message
            )
        } else {
            console.error("❌ Unknown Error:", error)
        }

        throw error
    }
}


export const register = async (
    data: RegisterRequest
): Promise<RegisterResponse> => {

    try {

        const res = await api.post<RegisterResponse>(
            "/auth/register/",
            data
        )

        return res.data

    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            console.error(
                "❌ Register API Error:",
                error.response?.data || error.message
            )
        } else {
            console.error("❌ Unknown Error:", error)
        }

        throw error
    }
}