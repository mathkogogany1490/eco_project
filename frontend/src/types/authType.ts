export interface LoginResponse {
    access_token: string
    token_type: string
    role: string
}

export interface RegisterResponse {
    message: string
}

export interface LoginRequest {
    username: string
    password: string
}

export interface RegisterRequest {
    username: string
    email: string
    password: string
}

export interface AuthState {
    token: string | null
    role: string | null
    loading: boolean
    error: string | null
}