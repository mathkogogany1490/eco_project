'use client'

import { useEffect } from 'react'
import { OverlayViewF } from '@react-google-maps/api'
import dayjs from 'dayjs'

import type { Place } from '@/store/slices/placeSlice'

interface Props {
    place: Place
}

export default function HoveredPlaceInfo({ place }: Props) {
    useEffect(() => {
        console.log('hoveredPlace:', place)
    }, [place])

    if (!place || place.lat == null || place.lng == null) return null

    const position = { lat: place.lat, lng: place.lng }

    /* =========================
       날짜 계산 (안전)
    ========================= */
    let elapsedDays = 0
    let progressPercent = 0
    const totalDays = 60

    if (place.start_date) {
        const start = dayjs(place.start_date)
        const today = dayjs()

        if (start.isValid()) {
            elapsedDays = today.diff(start, 'day')
            progressPercent = Math.min(
                (elapsedDays / totalDays) * 100,
                100
            )
        }
    }

    return (
        <OverlayViewF
            position={position}
            mapPaneName="overlayMouseTarget"
            getPixelPositionOffset={(width, height) => ({
                x: -(width / 2),
                y: -height - 40,
            })}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    maxWidth: '260px',
                    textAlign: 'center',
                    pointerEvents: 'none',
                }}
            >
                {place.image_url && (
                    <img
                        src={place.image_url}
                        alt={place.company_name}
                        style={{
                            width: '100%',
                            maxHeight: '120px',
                            objectFit: 'contain',
                            borderRadius: '4px',
                            marginBottom: '8px',
                        }}
                    />
                )}

                <h3 style={{ margin: '0 0 4px' }}>
                    {place.company_name}
                </h3>

                {place.phone_number && (
                    <p style={{ margin: '0 0 4px' }}>
                        ☎ {place.phone_number}
                    </p>
                )}

                <p style={{ margin: '0 0 8px' }}>
                    상태: {place.blockState ?? '-'}
                </p>

                {/* Progress Bar */}
                <div
                    style={{
                        width: '100%',
                        backgroundColor: '#eee',
                        borderRadius: '4px',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: `${progressPercent}%`,
                            height: '10px',
                            backgroundColor:
                                progressPercent >= 100
                                    ? '#87d068'
                                    : '#4caf50',
                            transition: 'width 0.3s ease',
                        }}
                    />
                </div>

                {place.start_date && (
                    <small
                        style={{
                            display: 'block',
                            marginTop: '4px',
                            fontSize: '0.85em',
                            color: '#555',
                        }}
                    >
                        시작일: {place.start_date}
                        <br />
                        경과: {elapsedDays}일 / {totalDays}일
                    </small>
                )}
            </div>
        </OverlayViewF>
    )
}
