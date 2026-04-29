'use client'

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

export default function MapTestPage() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey:
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    })

    if (!isLoaded) return <div>로딩 중...</div>

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <GoogleMap
                mapContainerStyle={{
                    width: '100%',
                    height: '100%',
                }}
                center={{ lat: 37.5665, lng: 126.978 }}
                zoom={12}
            />
        </div>
    )
}
