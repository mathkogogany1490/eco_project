'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchWastePrices } from '@/store/slices/wastePriceSlice'

export default function WastePriceTab({ contractId }: { contractId: number }) {
    const dispatch = useAppDispatch()
    const { items, loading } = useAppSelector((s) => s.wastePrice)

    useEffect(() => {
        if (!contractId) return
        dispatch(fetchWastePrices(contractId))
    }, [dispatch, contractId])

    return (
        <section>
            <h3 className="font-semibold mb-3">폐기물 및 단가</h3>

            {loading && (
                <p className="text-sm text-gray-500 mb-2">로딩중...</p>
            )}

            {!loading && items.length === 0 && (
                <p className="text-sm text-gray-500">
                    등록된 폐기물 단가가 없습니다.
                </p>
            )}

            {!loading && items.length > 0 && (
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-3 py-2">폐기물</th>
                        <th className="border px-3 py-2 text-right">
                            운반비
                        </th>
                        <th className="border px-3 py-2 text-right">
                            처리비
                        </th>
                        <th className="border px-3 py-2 text-right">
                            합계
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((w) => (
                        <tr key={w.id}>
                            <td className="border px-3 py-2">
                                {w.waste_type}
                            </td>
                            <td className="border px-3 py-2 text-right">
                                {w.transport_fee.toLocaleString()}
                            </td>
                            <td className="border px-3 py-2 text-right">
                                {w.process_fee.toLocaleString()}
                            </td>
                            <td className="border px-3 py-2 text-right font-medium">
                                {(
                                    w.transport_fee +
                                    w.process_fee
                                ).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </section>
    )
}
