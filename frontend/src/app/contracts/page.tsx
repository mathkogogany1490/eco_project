'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchContracts } from '@/store/slices/contractSlice'

export default function ContractsPage() {
    const dispatch = useAppDispatch()
    const { items, loading } = useAppSelector((state) => state.contract)

    useEffect(() => {
        dispatch(fetchContracts())
    }, [dispatch])

    return (
        <div>
            <h1>계약관리</h1>

            {loading && <p>로딩중...</p>}

            <ul>
                {items.map((c) => (
                    <li key={c.id}>
                        <strong>{c.name}</strong> ({c.type}) - {c.company}
                    </li>
                ))}
            </ul>
        </div>
    )
}
