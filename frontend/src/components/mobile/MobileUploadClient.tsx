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

    const [coords, setCoords] = useState<any>(null)

    // ==================================================
    // 🔥 이미지
    // ==================================================
    const [photo, setPhoto] =
        useState<File | null>(null)

    // ==================================================
    // 🔥 오디오
    // ==================================================
    const [audio, setAudio] =
        useState<File | null>(null)

    const [loginDone, setLoginDone] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState<string | null>(null)

    /* ==================================================
       QR 로그인
    ================================================== */
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
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/qr-login/`,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json',
                        },

                        body: JSON.stringify({
                            qr_token: token
                        }),
                    }
                )

                const data = await res.json()

                if (!res.ok) {

                    throw new Error(
                        data.detail ||
                        'QR 로그인 실패'
                    )
                }

                localStorage.setItem(
                    'access_token',
                    data.access_token
                )

                setLoginDone(true)

            } catch (err) {

                console.error(err)

                setError(
                    'QR 자동 로그인 실패'
                )
            }
        }

        qrLogin()

    }, [token])

    /* ==================================================
       위치
    ================================================== */
    useEffect(() => {

        if (!loginDone) return

        navigator.geolocation.getCurrentPosition(

            (pos) => setCoords(pos.coords),

            () => setError(
                '위치 권한을 허용해주세요'
            )
        )

    }, [loginDone])

    /* ==================================================
       파일 선택
    ================================================== */
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0]

        if (!file) return

        // ==================================================
        // 이미지
        // ==================================================
        if (
            file.type.startsWith('image/')
        ) {

            setPhoto(file)

            return
        }

        // ==================================================
        // 오디오
        // ==================================================
        if (
            file.type.startsWith('audio/')
        ) {

            setAudio(file)

            return
        }
    }

    /* ==================================================
       업로드
    ================================================== */
    const handleSubmit = async () => {

        if (!coords) {

            alert(
                '위치 정보가 필요합니다'
            )

            return
        }

        if (!photo && !audio) {

            alert(
                '사진 또는 음성 파일을 선택하세요'
            )

            return
        }

        try {

            setLoading(true)

            const result = await dispatch(

                createPlaceWithPhoto({

                    // ==================================================
                    // 🔥 이미지
                    // ==================================================
                    file: photo,

                    // ==================================================
                    // 🔥 오디오
                    // ==================================================
                    audio,

                    latitude:
                    coords.latitude,

                    longitude:
                    coords.longitude,

                    token,
                })
            )

            if (
                createPlaceWithPhoto
                    .fulfilled
                    .match(result)
            ) {

                alert(
                    '업로드 완료'
                )

                setPhoto(null)

                setAudio(null)

            } else {

                alert(
                    '업로드 실패'
                )
            }

        } finally {

            setLoading(false)
        }
    }

    return (

        <div
            style={{
                padding: 20
            }}
        >

            <h2>
                현장 위치 등록
            </h2>

            {!loginDone && !error && (
                <p>
                    QR 로그인 처리 중...
                </p>
            )}

            {error && (
                <p style={{
                    color: 'red'
                }}>
                    {error}
                </p>
            )}

            {loginDone && (
                <>

                    {/* ==================================================
                       파일 선택
                    ================================================== */}
                    <input
                        type="file"

                        // 🔥 이미지 + 오디오 허용
                        accept="image/*,audio/*"

                        onChange={handleFileChange}

                        style={{
                            marginTop: 20,
                            width: '90%',
                            maxWidth: 400,
                            padding: 12,
                            fontSize: 16,
                            borderRadius: 10,
                            border: '1px solid #ccc',
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    />

                    {/* ==================================================
                       이미지 미리보기
                    ================================================== */}
                    {photo && (

                        <img
                            src={URL.createObjectURL(photo)}

                            alt="preview"

                            style={{
                                width: '100%',
                                marginTop: 10,
                                borderRadius: 10
                            }}
                        />
                    )}

                    {/* ==================================================
                       오디오 표시
                    ================================================== */}
                    {audio && (

                        <div
                            style={{
                                marginTop: 15,
                                padding: 10,
                                border: '1px solid #ddd',
                                borderRadius: 10
                            }}
                        >

                            <p>
                                🎤 {audio.name}
                            </p>

                            <audio
                                controls
                                src={URL.createObjectURL(audio)}
                                style={{
                                    width: '100%'
                                }}
                            />
                        </div>
                    )}

                    {/* ==================================================
                       업로드 버튼
                    ================================================== */}
                    {(photo || audio) && (

                        <button

                            onClick={handleSubmit}

                            style={{
                                marginTop: 20,
                                width: '90%',
                                maxWidth: 400,
                                padding: '16px 0',
                                fontSize: 18,
                                fontWeight: 'bold',
                                borderRadius: 12,
                                border: 'none',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                        >

                            {loading
                                ? '업로드 중...'
                                : '📍 위치 등록'}

                        </button>
                    )}
                </>
            )}
        </div>
    )
}