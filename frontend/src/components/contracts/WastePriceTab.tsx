'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchWastePrices } from '@/store/slices/wastePriceSlice'

export default function WastePriceTab({ contractId }: { contractId: number }) {
    const dispatch = useAppDispatch()
    const { items, loading } = useAppSelector((s) => s.wastePrice)

    useEffect(() => {
        dispatch(fetchWastePrices(contractId))
    }, [dispatch, contractId])

    return (
        <section>
            <h3>폐기물 및 단가</h3>

            {loading && <p>로딩중...</p>}

            <table>
                <thead>
                <tr>
                    <th>폐기물</th>
                    <th>운반비</th>
                    <th>처리비</th>
                </tr>
                </thead>
                <tbody>
                {items.map((w) => (
                    <tr key={w.id}>
                        <td>{w.waste_type}</td>
                        <td>{w.transport_fee.toLocaleString()}</td>
                        <td>{w.process_fee.toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    )
}
