'use client'

import { useEffect, useState } from 'react'
import { useAppSelector } from '@/store/hooks'

export default function AuthGuard({
                                      children,
                                  }: {
    children: React.ReactNode
}) {

    const { role } = useAppSelector((state) => state.auth)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // hydration 문제 방지
    if (!mounted) return null

    // 로그인 여부와 상관없이 페이지는 보여줌
    return <>{children}</>
}