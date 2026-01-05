import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login } from '@/services/auth.api'

export interface AuthState {
    token: string | null
    role: string | null
    loading: boolean
    error: string | null
}

const initialState: AuthState = {
    token:
        typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null,
    role:
        typeof window !== 'undefined'
            ? localStorage.getItem('role')
            : null,
    loading: false,
    error: null,
}

// =========================
// 로그인 Thunk
// =========================
export const loginThunk = createAsyncThunk<
    { access_token: string; role: string },
    { username: string; password: string }
>('auth/login', async ({ username, password }) => {
    return await login(username, password)
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null
            state.role = null
            localStorage.removeItem('token')
            localStorage.removeItem('role')
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.access_token
                state.role = action.payload.role

                // 🔥 로그인 유지 핵심
                localStorage.setItem(
                    'token',
                    action.payload.access_token
                )
                localStorage.setItem(
                    'role',
                    action.payload.role
                )
            })
            .addCase(loginThunk.rejected, (state) => {
                state.loading = false
                state.error = 'Login failed'
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
