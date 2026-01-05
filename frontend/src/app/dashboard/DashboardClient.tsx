'use client'

import dynamic from 'next/dynamic'

// Map은 반드시 SSR 차단
const MapContainer = dynamic(
    () => import('@/components/dashboard/MapContainer'),
    { ssr: false }
)

export default function DashboardClient() {
    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-4">
                대시보드
            </h1>

            <div className="flex-1 rounded-lg overflow-hidden border">
                <MapContainer />
            </div>
        </div>
    )
}
