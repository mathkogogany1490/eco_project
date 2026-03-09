import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { login, register } from "@/services/auth.api"
import {
    AuthState,
    LoginResponse,
    RegisterResponse,
    LoginRequest,
    RegisterRequest
} from "@/types/authType"

const initialState: AuthState = {
    token: null,
    role: null,
    loading: false,
    error: null,
}

// =========================
// 로그인
// =========================
export const loginThunk = createAsyncThunk<
    LoginResponse,
    LoginRequest
>(
    "auth/login",
    async (data) => {
        const res = await login(data)
        return res
    }
)

// =========================
// 회원가입
// =========================
export const registerThunk = createAsyncThunk<
    RegisterResponse,
    RegisterRequest
>(
    "auth/register",
    async (data) => {
        const res = await register(data)
        return res
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        logout(state) {
            state.token = null
            state.role = null

            if (typeof window !== "undefined") {
                localStorage.removeItem("access_token")
                localStorage.removeItem("role")
            }
        },

        // 새로고침 시 localStorage → Redux 복구
        restoreAuth(state) {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("access_token")
                const role = localStorage.getItem("role")

                state.token = token
                state.role = role
            }
        },
    },

    extraReducers: (builder) => {

        builder

            // LOGIN
            .addCase(loginThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(loginThunk.fulfilled, (state, action) => {

                state.loading = false
                state.token = action.payload.access_token
                state.role = action.payload.role

                if (typeof window !== "undefined") {
                    localStorage.setItem(
                        "access_token",
                        action.payload.access_token
                    )
                    localStorage.setItem("role", action.payload.role)
                }
            })

            .addCase(loginThunk.rejected, (state) => {
                state.loading = false
                state.error = "Login failed"
            })

            // REGISTER
            .addCase(registerThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(registerThunk.fulfilled, (state) => {
                state.loading = false
            })

            .addCase(registerThunk.rejected, (state) => {
                state.loading = false
                state.error = "Register failed"
            })
    },
})

export const { logout, restoreAuth } = authSlice.actions
export default authSlice.reducer