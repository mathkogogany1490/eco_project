'use client'

import { useMemo } from 'react'
import { OverlayViewF } from '@react-google-maps/api'
import dayjs from 'dayjs'
import type { Place } from '@/types/placeType'

interface Props {
    place: Place
}

export default function HoveredPlaceInfo({ place }: Props) {

    if (!place?.latitude || !place?.longitude) return null

    const position = useMemo(() => ({
        lat: place.latitude,
        lng: place.longitude
    }), [place.latitude, place.longitude])

    /* =========================
       진행률 계산
    ========================= */
    const {
        elapsedDays,
        totalDays,
        remainingDays,
        progressPercent
    } = useMemo(() => {

        if (!place.start_date || !place.end_date) {
            return {
                elapsedDays: 0,
                totalDays: 0,
                remainingDays: 0,
                progressPercent: 0
            }
        }

        const start = dayjs(place.start_date)
        const end = dayjs(place.end_date)
        const today = dayjs()

        if (!start.isValid() || !end.isValid()) {
            return {
                elapsedDays: 0,
                totalDays: 0,
                remainingDays: 0,
                progressPercent: 0
            }
        }

        const total = end.diff(start, 'day')

        if (total <= 0) {
            return {
                elapsedDays: 0,
                totalDays: 0,
                remainingDays: 0,
                progressPercent: 0
            }
        }

        const elapsed = today.diff(start, 'day')
        const remaining = end.diff(today, 'day')

        const percent = Math.min(
            Math.max((elapsed / total) * 100, 0),
            100
        )

        return {
            elapsedDays: elapsed,
            totalDays: total,
            remainingDays: remaining,
            progressPercent: percent
        }

    }, [place.start_date, place.end_date])

    /* =========================
       진행률 색상
    ========================= */

    const progressColor = useMemo(() => {

        if (progressPercent >= 100) return '#ff4d4f'   // 완료
        if (progressPercent > 70) return '#faad14'     // 마감 임박
        return '#4caf50'                               // 정상

    }, [progressPercent])

    return (
        <OverlayViewF
            position={position}
            mapPaneName="floatPane"
            getPixelPositionOffset={(width, height) => ({
                x: -width - 20,
                y: -height / 2
            })}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    maxWidth: '260px',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    willChange: 'transform'
                }}
            >

                {/* 이미지 */}
                {place.image_url && (
                    <img
                        src={place.image_url}
                        alt={place.company_name}
                        loading="lazy"
                        style={{
                            width: '100%',
                            maxHeight: '120px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginBottom: '8px',
                        }}
                    />
                )}

                {/* 회사명 */}
                <h3 style={{ margin: '0 0 4px' }}>
                    {place.company_name}
                </h3>

                {/* 전화번호 */}
                {place.phone_number && (
                    <p style={{ margin: '0 0 4px' }}>
                        ☎ {place.phone_number}
                    </p>
                )}

                {/* 상태 */}
                <p style={{ margin: '0 0 8px' }}>
                    상태: {place.blockState ?? '-'}
                </p>

                {/* 진행률 바 */}
                <div
                    style={{
                        width: '100%',
                        backgroundColor: '#eee',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '6px'
                    }}
                >
                    <div
                        style={{
                            width: `${progressPercent}%`,
                            height: '10px',
                            backgroundColor: progressColor,
                            transition: 'width 0.2s ease'
                        }}
                    />
                </div>

                {/* 날짜 정보 */}
                {(place.start_date && place.end_date) && (
                    <small
                        style={{
                            display: 'block',
                            fontSize: '0.85em',
                            color: '#555',
                            lineHeight: '1.4'
                        }}
                    >
                        시작: {place.start_date}
                        <br />
                        종료: {place.end_date}
                        <br />
                        경과: {elapsedDays}일 / {totalDays}일
                        <br />
                        남은: {remainingDays > 0 ? remainingDays : 0}일
                    </small>
                )}

            </div>
        </OverlayViewF>
    )
}