'use client'

import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'

interface Props {
    open: boolean
    onClose: () => void
}

export default function QrGenerateModal({ open, onClose }: Props) {
    const [qrUrl, setQrUrl] = useState('')
    const [origin, setOrigin] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    /** ✅ 클라이언트에서만 origin 설정 */
    useEffect(() => {
        setOrigin(window.location.origin)
    }, [])

    /** QR 생성 */
    const createQr = async () => {
        if (!origin) return

        try {
            setLoading(true)
            setError(null)
            setMessage(null)

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/qr-generate`,
                { method: 'POST' }
            )

            if (!res.ok) throw new Error()

            const data: { token: string } = await res.json()

            const uploadUrl =
                `${origin}/mobile/upload?token=${data.token}`

            setQrUrl(uploadUrl)
            setMessage('QR 코드가 생성되었습니다.')
        } catch {
            setError('QR 코드를 생성할 수 없습니다.')
        } finally {
            setLoading(false)
        }
    }

    /** 메시지 자동 제거 */
    useEffect(() => {
        if (!message) return
        const t = setTimeout(() => setMessage(null), 3000)
        return () => clearTimeout(t)
    }, [message])

    /** 모달 열릴 때 QR 생성 */
    useEffect(() => {
        if (open && origin) {
            createQr()
        }
    }, [open, origin])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl text-center">
                <h2 className="mb-4 text-xl font-bold">
                    현장 위치 등록 QR
                </h2>

                {error && (
                    <p className="mb-3 text-sm text-red-500">
                        {error}
                    </p>
                )}

                {qrUrl && (
                    <>
                        <div className="relative mx-auto w-fit bg-white p-4 rounded-lg shadow">
                            <QRCode value={qrUrl} size={220} level="H" />

                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg">
                                    <p className="text-sm font-medium">
                                        새 QR 생성 중...
                                    </p>
                                </div>
                            )}
                        </div>

                        <p className="mt-3 text-sm text-slate-500">
                            휴대폰으로 QR을 스캔하세요
                        </p>

                        {message && (
                            <p className="mt-2 text-sm text-green-600 font-medium">
                                {message}
                            </p>
                        )}

                        <div className="mt-4 flex justify-center gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(qrUrl)
                                    setMessage('URL이 복사되었습니다.')
                                }}
                                className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-100"
                            >
                                URL 복사
                            </button>

                            <button
                                onClick={createQr}
                                disabled={loading}
                                className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-100 disabled:opacity-50"
                            >
                                QR 재생성
                            </button>
                        </div>
                    </>
                )}

                <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-lg bg-slate-800 py-2 text-white hover:bg-slate-900 transition"
                >
                    닫기
                </button>
            </div>
        </div>
    )
}
