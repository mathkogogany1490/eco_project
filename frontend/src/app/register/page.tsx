'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { registerThunk } from '@/store/slices/authSlice'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {

    const dispatch = useAppDispatch()
    const router = useRouter()

    const { loading, error } = useAppSelector((state) => state.auth)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submit = async () => {

        try {

            await dispatch(
                registerThunk({
                    username,
                    email,
                    password
                })
            ).unwrap()

            alert("회원가입 성공")

            router.push('/')

        } catch (err) {

            console.error("Register failed:", err)

        }

    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">

            <div className="w-[380px] rounded-xl bg-white p-6 shadow-xl">

                <h2 className="mb-4 text-center text-xl font-bold">
                    회원가입
                </h2>

                <input
                    className="w-full mb-3 border rounded px-3 py-2"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    className="w-full mb-3 border rounded px-3 py-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full mb-3 border rounded px-3 py-2"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                    <p className="text-red-500 text-sm mb-2">
                        {error}
                    </p>
                )}

                <button
                    onClick={submit}
                    className="w-full bg-indigo-600 text-white py-2 rounded"
                >
                    {loading ? "가입 중..." : "회원가입"}
                </button>

            </div>

        </div>
    )
}