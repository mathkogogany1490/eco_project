'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchContracts } from '@/store/slices/contractSlice'
import WastePriceTab from '@/components/contracts/WastePriceTab'

const tabs = ['계약정보', '폐기물/단가', '연락처', '특이사항'] as const
type Tab = typeof tabs[number]

export default function ContractDetailPage() {
    /* 🔥 hydration guard */
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

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

    /* ⛔ 서버/클라이언트 렌더 불일치 방지 */
    if (!mounted) {
        return null
    }

    if (!contract) {
        return <p>계약 정보를 불러오는 중...</p>
    }

    return (
        <div>
            <h1>계약 상세 #{contract.id}</h1>

            {/* 탭 헤더 */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {tabs.map((t) => (
                    <button
                        key={t}
                        onClick={() => setActive(t)}
                        style={{
                            padding: '8px 12px',
                            borderBottom:
                                active === t
                                    ? '2px solid #2563eb'
                                    : '2px solid transparent',
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* 탭 콘텐츠 */}
            {active === '계약정보' && (
                <section>
                    <h3>기본 계약 정보</h3>
                    <p>계약명: {contract.name}</p>
                    <p>구분: {contract.type}</p>
                    <p>발주처: {contract.company}</p>
                </section>
            )}

            {active === '폐기물/단가' && (
                <WastePriceTab contractId={contractId} />
            )}

            {active === '연락처' && (
                <section>
                    <h3>연락처 정보</h3>
                    <p>담당자 연락처 (추후 구현)</p>
                </section>
            )}

            {active === '특이사항' && (
                <section>
                    <h3>특이사항</h3>
                    <p>메모 및 주의사항 (추후 구현)</p>
                </section>
            )}
        </div>
    )
}
