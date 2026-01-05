'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchContracts } from '@/store/slices/contractSlice'

export default function ContractSidebarList() {
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const { items, loading } = useAppSelector((s) => s.contract)

    const [open, setOpen] = useState(true)

    useEffect(() => {
        if (!items.length) {
            dispatch(fetchContracts())
        }
    }, [dispatch, items.length])

    return (
        <div className="mt-2">
            {/* 🔹 헤더 (메뉴와 동일한 라인/크기) */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between
                           rounded-lg px-4 py-2.5 text-sm transition
                           text-slate-300 hover:bg-slate-800 hover:text-white"
            >
                <span>계약목록</span>
                <span
                    className={`text-xs transition-transform ${
                        open ? 'rotate-90' : ''
                    }`}
                >
                    ▶
                </span>
            </button>

            {/* 🔹 리스트 */}
            <div
                className={`overflow-hidden transition-all duration-300
                    ${open ? 'max-h-[360px]' : 'max-h-0'}
                `}
            >
                {loading && (
                    <div className="px-4 py-2 text-xs text-slate-500">
                        계약 불러오는 중...
                    </div>
                )}

                <div className="space-y-1">
                    {items.map((c) => {
                        const isActive =
                            pathname === `/contracts/${c.id}`

                        return (
                            <Link
                                key={c.id}
                                href={`/contracts/${c.id}`}
                                className={`
                                    block rounded-lg px-4 py-2.5 text-sm transition
                                    ${
                                    isActive
                                        ? 'bg-indigo-600 text-white font-semibold shadow'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }
                                `}
                            >
                                {c.name}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
