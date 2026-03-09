'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { createPlaceWithPhoto } from '@/store/slices/placeSlice'

export default function MobileUploadClient() {
    const params = useSearchParams()
    const token = params.get('token')

    const dispatch = useAppDispatch()
    const calledRef = useRef(false)

    const videoRef = useRef<HTMLVideoElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const streamRef = useRef<MediaStream | null>(null)

    const [coords, setCoords] =
        useState<GeolocationCoordinates | null>(null)
    const [photo, setPhoto] = useState<File | null>(null)

    const [loginDone, setLoginDone] = useState(false)
    const [cameraOn, setCameraOn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /* =====================================================
       1️⃣ QR 자동 로그인
    ===================================================== */
    useEffect(() => {
        if (!token) {
            setError('QR 토큰이 없습니다.')
            return
        }

        if (calledRef.current) return
        calledRef.current = true

        const qrLogin = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/qr-login`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ qr_token: token }),
                    }
                )

                if (!res.ok) throw new Error()

                const data = await res.json()
                localStorage.setItem('access_token', data.access_token)
                setLoginDone(true)
            } catch {
                setError('QR 자동 로그인 실패')
            }
        }

        qrLogin()
    }, [token])

    /* =====================================================
       2️⃣ 위치 정보
    ===================================================== */
    useEffect(() => {
        if (!loginDone) return

        navigator.geolocation.getCurrentPosition(
            (pos) => setCoords(pos.coords),
            () => setError('위치 권한을 허용해주세요')
        )
    }, [loginDone])

    /* =====================================================
       📷 카메라 ON
    ===================================================== */
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' } },
            })

            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.play()
            }
            setCameraOn(true)
        } catch {
            setError('카메라를 사용할 수 없습니다')
        }
    }

    /* =====================================================
       📸 사진 촬영
    ===================================================== */
    const takePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(video, 0, 0)

        canvas.toBlob((blob) => {
            if (!blob) return
            setPhoto(new File([blob], 'photo.jpg', { type: 'image/jpeg' }))
        }, 'image/jpeg')

        streamRef.current?.getTracks().forEach((t) => t.stop())
        setCameraOn(false)
    }

    /* =====================================================
       3️⃣ 업로드
    ===================================================== */
    const handleSubmit = async () => {
        if (!coords || !photo) {
            alert('사진과 위치 정보가 필요합니다')
            return
        }

        try {
            setLoading(true)
            const result = await dispatch(
                createPlaceWithPhoto({
                    file: photo,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    token: token!,
                })
            )

            if (createPlaceWithPhoto.fulfilled.match(result)) {
                alert('업로드 완료')
                setPhoto(null)
            } else {
                alert('업로드 실패')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>현장 위치 등록</h2>

            {!loginDone && !error && <p>QR 로그인 처리 중...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loginDone && (
                <>
                    {!cameraOn && !photo && (
                        <button
                            onClick={startCamera}
                            style={{
                                padding: '10px 16px',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                borderRadius: 8,
                                border: 'none',
                            }}
                        >
                            📷 사진 촬영
                        </button>
                    )}

                    {cameraOn && (
                        <>
                            <video
                                ref={videoRef}
                                playsInline
                                style={{ width: '100%', marginTop: 12 }}
                            />
                            <button
                                onClick={takePhoto}
                                style={{
                                    marginTop: 12,
                                    padding: '10px 16px',
                                    backgroundColor: '#0f172a',
                                    color: 'white',
                                    borderRadius: 8,
                                    border: 'none',
                                }}
                            >
                                📸 촬영
                            </button>
                        </>
                    )}

                    {photo && (
                        <>
                            <img
                                src={URL.createObjectURL(photo)}
                                alt="preview"
                                style={{ marginTop: 12, width: '100%' }}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                style={{
                                    marginTop: 16,
                                    padding: '10px 16px',
                                    backgroundColor: '#0f172a',
                                    color: 'white',
                                    borderRadius: 8,
                                    border: 'none',
                                }}
                            >
                                {loading ? '업로드 중...' : '위치 등록'}
                            </button>
                        </>
                    )}

                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </>
            )}
        </div>
    )
}
