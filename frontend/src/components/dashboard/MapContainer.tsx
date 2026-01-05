'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
} from '@react-google-maps/api'
import PlaceModal from '@/components/dashboard/PlaceModal'
import HoveredPlaceInfo from '@/components/dashboard/HoveredPlaceInfo'
import { message } from 'antd'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    fetchPlaces,
    updatePlace,
    deletePlace,
} from '@/store/slices/placeSlice'
import type { Place } from '@/store/slices/placeSlice'

/* =========================
   Map 기본 설정
========================= */
const containerStyle = {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
}

const initialCenter = {
    lat: 37.5665,
    lng: 126.978,
}

export default function MapContainer() {
    const dispatch = useAppDispatch()
    const { items, status, error } = useAppSelector(
        (state) => state.place
    )

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey:
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ['marker', 'places'],
    })

    const [map, setMap] =
        useState<google.maps.Map | null>(null)
    const [selectedPlace, setSelectedPlace] =
        useState<Place | null>(null)
    const [hoveredPlace, setHoveredPlace] =
        useState<Place | null>(null)

    /* =========================
       장소 목록 로딩
    ========================= */
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPlaces())
        }
    }, [status, dispatch])

    /* =========================
       Map Load 시 Bounds 설정
    ========================= */
    const onLoad = useCallback(
        (mapInstance: google.maps.Map) => {
            if (items.length > 0) {
                const bounds =
                    new google.maps.LatLngBounds()

                items.forEach((place) => {
                    if (
                        typeof place.latitude === 'number' &&
                        typeof place.longitude === 'number'
                    ) {
                        bounds.extend({
                            lat: place.latitude,
                            lng: place.longitude,
                        })
                    }
                })

                mapInstance.fitBounds(bounds)
            }

            setMap(mapInstance)
        },
        [items]
    )

    /* =========================
       Marker 아이콘 (isLoaded 이후)
    ========================= */
    const markerIcon = useMemo(() => {
        if (!isLoaded || !window.google) return undefined

        return (place: Place) => ({
            path: window.google.maps.SymbolPath
                .FORWARD_CLOSED_ARROW,
            scale: 7,
            fillColor:
                place.blockState === '반입'
                    ? '#32CD32'
                    : place.blockState === '반출'
                        ? '#FF4500'
                        : place.blockState === '고정'
                            ? '#00BFFF'
                            : '#FFD700',
            fillOpacity: 1,
            strokeWeight: 1,
        })
    }, [isLoaded])

    /* =========================
       로딩 / 에러 처리
    ========================= */
    if (status === 'loading')
        return <div>지도 로딩 중...</div>

    if (status === 'failed')
        return <div>에러: {error}</div>

    if (!isLoaded) return null

    /* =========================
       Render
    ========================= */
    return (
        <>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={initialCenter}
                zoom={11}
                onLoad={onLoad}
            >
                {items
                    .filter(
                        (p) =>
                            typeof p.latitude === 'number' &&
                            typeof p.longitude === 'number'
                    )
                    .map((place) => (
                        <Marker
                            key={place.id}
                            position={{
                                lat: place.latitude,
                                lng: place.longitude,
                            }}
                            onClick={() =>
                                setSelectedPlace(place)
                            }
                            onMouseOver={() =>
                                setHoveredPlace(place)
                            }
                            onMouseOut={() =>
                                setHoveredPlace(null)
                            }
                            icon={
                                markerIcon
                                    ? markerIcon(place)
                                    : undefined
                            }
                        />
                    ))}

                {hoveredPlace && (
                    <HoveredPlaceInfo
                        place={hoveredPlace}
                    />
                )}
            </GoogleMap>

            {selectedPlace && (
                <PlaceModal
                    isOpen
                    place={selectedPlace}
                    onClose={() =>
                        setSelectedPlace(null)
                    }
                    onSave={async (data) => {
                        await dispatch(
                            updatePlace(data)
                        ).unwrap()
                        message.success(
                            '수정되었습니다'
                        )
                        setSelectedPlace(null)
                    }}
                    onDelete={async (id) => {
                        await dispatch(
                            deletePlace(id)
                        ).unwrap()
                        message.success(
                            '삭제되었습니다'
                        )
                        setSelectedPlace(null)
                        setHoveredPlace(null)
                    }}
                />
            )}
        </>
    )
}
