'use client'

import { useMemo } from 'react'
import styled from 'styled-components'
import { OverlayViewF } from '@react-google-maps/api'
import dayjs from 'dayjs'

import type { Place } from '@/types/placeType'

interface Props {
    place: Place
}

export default function HoveredPlaceInfo({
                                             place
                                         }: Props) {

    if (
        !place?.latitude ||
        !place?.longitude
    ) {
        return null
    }

    const position = {
        lat: place.latitude,
        lng: place.longitude
    }

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

        if (progressPercent >= 100) {
            return '#ef4444'
        }

        if (progressPercent > 70) {
            return '#f59e0b'
        }

        return '#22c55e'

    }, [progressPercent])

    /* =========================================================
       핵심
       현재 화면 중심 기준으로 동적 위치 계산
    ========================================================= */

    const getPixelPositionOffset = (
        width: number,
        height: number
    ) => {

        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2

        /* =========================================
           현재 마우스 위치 기준
        ========================================= */

        const mouseX =
            window.event instanceof MouseEvent
                ? window.event.clientX
                : centerX

        const mouseY =
            window.event instanceof MouseEvent
                ? window.event.clientY
                : centerY

        /* =========================================
           가로 방향
        ========================================= */

        let x = 20

        // 오른쪽이면 왼쪽 표시
        if (mouseX > centerX) {

            x = -width - 20
        }

        // 왼쪽이면 오른쪽 표시
        else {

            x = 20
        }

        /* =========================================
           세로 방향
        ========================================= */

        let y = 20

        // 아래쪽이면 위 표시
        if (mouseY > centerY) {

            y = -height - 20
        }

        // 위쪽이면 아래 표시
        else {

            y = 20
        }

        return {
            x,
            y
        }
    }

    return (

        <OverlayViewF
            position={position}
            mapPaneName="floatPane"
            getPixelPositionOffset={getPixelPositionOffset}
        >

            <BalloonContainer>

                {/* 이미지 */}

                <ImageWrapper>

                    <PreviewImage
                        src={
                            place.image_url
                                ? place.image_url.startsWith('http')
                                    ? place.image_url
                                    : `http://localhost${place.image_url}`
                                : 'https://dummyimage.com/300x180/e5e7eb/6b7280&text=No+Image'
                        }
                        alt="place-image"
                        loading="lazy"
                        onError={(e) => {

                            e.currentTarget.src =
                                'https://dummyimage.com/300x180/e5e7eb/6b7280&text=No+Image'
                        }}
                    />

                </ImageWrapper>

                {/* 회사명 */}

                <TopRow>

                    <CompanyName>
                        {place.company_name || '-'}
                    </CompanyName>

                    <PhoneNumber>
                        ☎ {place.phone_number || '-'}
                    </PhoneNumber>

                </TopRow>

                {/* 상태 */}

                <InlineRow>

                    <InfoText>
                        상태 {place.blockState || '-'}
                    </InfoText>

                    <InfoText>
                        사이즈 {place.size || '-'}
                    </InfoText>

                    <InfoText>
                        개수 {place.count || '-'}
                    </InfoText>

                </InlineRow>

                {/* 날짜 */}

                <InlineRow>

                    <InfoText>
                        시작 {place.start_date || '-'}
                    </InfoText>

                    <InfoText>
                        종료 {place.end_date || '-'}
                    </InfoText>

                </InlineRow>

                {/* 진행률 */}

                <ProgressWrapper>

                    <ProgressBar
                        style={{
                            width: `${progressPercent}%`,
                            background: progressColor
                        }}
                    />

                </ProgressWrapper>

                {/* 하단 */}

                <BottomRow>

                    <span>
                        {elapsedDays}일 / {totalDays}일
                    </span>

                    <span>
                        남은 {remainingDays > 0 ? remainingDays : 0}일
                    </span>

                </BottomRow>

                {/* 꼬리 */}

                <Tail />

            </BalloonContainer>

        </OverlayViewF>
    )
}

/* =========================================================
   styled-components
========================================================= */

const BalloonContainer = styled.div`

    position: relative;

    width: 280px;

    background: white;

    border-radius: 16px;

    padding: 12px;

    box-shadow:
            0 10px 30px rgba(0,0,0,0.15);

    border: 1px solid #e5e7eb;

    z-index: 99999;
`

const Tail = styled.div`

    position: absolute;

    bottom: -8px;

    left: 24px;

    width: 16px;

    height: 16px;

    background: white;

    border-right: 1px solid #e5e7eb;

    border-bottom: 1px solid #e5e7eb;

    transform: rotate(45deg);
`

const ImageWrapper = styled.div`

    width: 100%;

    height: 160px;

    overflow: hidden;

    border-radius: 12px;

    background: #f3f4f6;

    margin-bottom: 10px;
`

const PreviewImage = styled.img`

    width: 100%;

    height: 100%;

    object-fit: cover;
`

const TopRow = styled.div`

    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 10px;

    margin-bottom: 8px;
`

const CompanyName = styled.div`

    font-size: 16px;

    font-weight: 700;

    color: #111827;

    line-height: 1.3;
`

const PhoneNumber = styled.div`

    font-size: 13px;

    color: #6b7280;

    white-space: nowrap;
`

const InlineRow = styled.div`

    display: flex;

    flex-wrap: wrap;

    gap: 10px;

    margin-bottom: 8px;
`

const InfoText = styled.div`

    font-size: 12px;

    color: #6b7280;
`

const ProgressWrapper = styled.div`

    width: 100%;

    height: 8px;

    background: #f3f4f6;

    border-radius: 999px;

    overflow: hidden;

    margin-top: 8px;

    margin-bottom: 8px;
`

const ProgressBar = styled.div`

    height: 100%;

    transition: width 0.2s ease;
`

const BottomRow = styled.div`

    display: flex;

    justify-content: space-between;

    font-size: 11px;

    color: #9ca3af;
`