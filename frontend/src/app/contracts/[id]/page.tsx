'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchContracts } from '@/store/slices/contractSlice'
import WastePriceTab from '@/components/contracts/WastePriceTab'

const tabs = [
    { key: '계약정보', label: '계약정보' },
    { key: '폐기물/단가', label: '폐기물/단가' },
    { key: '연락처', label: '연락처' },
    { key: '특이사항', label: '특이사항' },
] as const

type Tab = (typeof tabs)[number]['key']

export default function ContractDetailPage() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const { id } = useParams()
    const contractId = Number(id)

    const dispatch = useAppDispatch()
    const { items } = useAppSelector((s) => s.contract)
    const contract = items.find((c) => c.id === contractId)

    const [active, setActive] = useState<Tab>('계약정보')

    useEffect(() => {
        if (!items.length) {
            dispatch(fetchContracts())
        }
    }, [dispatch, items.length])

    if (!mounted) return null
    if (!contract) return <p className="p-6">계약 정보를 불러오는 중...</p>

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
            <h1 className="text-xl font-bold mb-6">
                계약 상세 #{contract.id}
            </h1>

            {/* 🔹 버튼형 탭 */}
            <div className="flex border-b mb-6 gap-1">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setActive(t.key)}
                        className={`px-4 py-2 text-sm font-medium rounded-t
                            ${
                            active === t.key
                                ? 'bg-blue-50 text-blue-600 border border-b-0 border-blue-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                        `}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* 🔹 탭 콘텐츠 */}
            {active === '계약정보' && (
                <section className="mt-4">
                    <h3 className="font-semibold mb-3">기본 계약 정보</h3>
                    <table className="w-full border text-sm">
                        <tbody>
                        <tr>
                            <th className="w-1/4 bg-gray-50 border px-3 py-2 text-left">
                                계약명
                            </th>
                            <td className="border px-3 py-2">
                                {contract.name}
                            </td>
                        </tr>
                        <tr>
                            <th className="bg-gray-50 border px-3 py-2 text-left">
                                구분
                            </th>
                            <td className="border px-3 py-2">
                                {contract.type}
                            </td>
                        </tr>
                        <tr>
                            <th className="bg-gray-50 border px-3 py-2 text-left">
                                발주처
                            </th>
                            <td className="border px-3 py-2">
                                {contract.company}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </section>
            )}

            {active === '폐기물/단가' && (
                <section className="mt-4">
                    <WastePriceTab contractId={contractId} />
                </section>
            )}

            {active === '연락처' && (
                <section className="mt-4">
                    <h3 className="font-semibold mb-3">연락처</h3>
                    <table className="w-full border text-sm">
                        <tbody>
                        <tr>
                            <th className="w-1/4 bg-gray-50 border px-3 py-2 text-left">
                                담당자
                            </th>
                            <td className="border px-3 py-2">
                                (추후 구현)
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </section>
            )}

            {active === '특이사항' && (
                <section className="mt-4">
                    <h3 className="font-semibold mb-3">특이사항</h3>
                    <div className="border p-4 text-sm text-gray-700">
                        메모 및 주의사항 (추후 구현)
                    </div>
                </section>
            )}
        </div>
    )
}
