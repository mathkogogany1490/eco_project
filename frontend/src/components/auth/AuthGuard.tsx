'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'

export default function AuthGuard({
                                      children,
                                  }: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { role } = useAppSelector((state) => state.auth)

    useEffect(() => {
        if (!role) {
            router.replace('/') // 공개 페이지 or 홈
        }
    }, [role, router])

    if (!role) return null

    return <>{children}</>
}
