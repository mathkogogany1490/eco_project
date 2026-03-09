'use client'

import { Suspense } from 'react'
import MobileUploadClient from '@/components/mobile/MobileUploadClient'

export default function Page() {
    return (
        <Suspense fallback={<div style={{ padding: 20 }}>로딩 중...</div>}>
            <MobileUploadClient />
        </Suspense>
    )
}
