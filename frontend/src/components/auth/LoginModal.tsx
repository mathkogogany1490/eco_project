'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginThunk } from '@/store/slices/authSlice'
import { useRouter } from 'next/navigation'

interface Props {
    open: boolean
    onClose: () => void
}

export default function LoginModal({ open, onClose }: Props) {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const { loading, error } = useAppSelector((state) => state.auth)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    if (!open) return null

    const submit = async () => {
        const res = await dispatch(loginThunk({ username, password }))

        if (loginThunk.fulfilled.match(res)) {
            onClose()
            router.push('/dashboard')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[360px] rounded-xl bg-white p-6 shadow-xl opacity-100">
                <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
                    로그인
                </h2>

                <input
                    className="
                        w-full mb-3 rounded-lg border border-gray-300
                        px-3 py-2 text-gray-900
                        placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                    "
                    placeholder="ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                />

                <input
                    type="password"
                    className="
                        w-full mb-3 rounded-lg border border-gray-300
                        px-3 py-2 text-gray-900
                        placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                    "
                    placeholder="PW"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />

                {error && (
                    <p className="mb-2 text-sm text-red-500">
                        {error}
                    </p>
                )}

                <button
                    onClick={submit}
                    disabled={loading}
                    className="
                        w-full rounded-lg bg-indigo-600 py-2 text-white
                        hover:bg-indigo-700 transition
                        disabled:cursor-not-allowed disabled:opacity-60
                    "
                >
                    {loading ? '로그인 중...' : '로그인'}
                </button>

                <button
                    onClick={onClose}
                    disabled={loading}
                    className="
                        mt-3 w-full rounded-lg border border-gray-300
                        py-2 text-sm text-gray-700
                        hover:bg-slate-100 transition
                        disabled:cursor-not-allowed disabled:opacity-60
                    "
                >
                    취소
                </button>
            </div>
        </div>
    )
}
