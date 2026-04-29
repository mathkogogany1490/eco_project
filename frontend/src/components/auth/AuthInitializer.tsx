'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { restoreAuth } from '@/store/slices/authSlice'

export default function AuthInitializer() {

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(restoreAuth())
    }, [dispatch])

    return null
}