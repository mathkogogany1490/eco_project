'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addAutoWeighing } from '@/store/slices/weighingSlice'

export default function WeighingPage() {
    const dispatch = useAppDispatch()
    const { loading } = useAppSelector((s) => s.weighing)

    const [form, setForm] = useState({
        contract_id: 1,
        vehicle_no: '',
        gross_weight: 0,
        tare_weight: 0,
    })

    const net = form.gross_weight - form.tare_weight

    const submit = () => {
        dispatch(
            addAutoWeighing({
                data: {
                    contract_id: form.contract_id,
                    vehicle_no: form.vehicle_no,
                    gross_weight: form.gross_weight,
                    tare_weight: form.tare_weight,
                },
                systemApiKey: process.env.NEXT_PUBLIC_SYSTEM_API_KEY!,
            })
        )

        setForm({
            ...form,
            vehicle_no: '',
            gross_weight: 0,
            tare_weight: 0,
        })
    }

    return (
        <div style={{ maxWidth: 400 }}>
            <h1>계량등록 (계근자)</h1>

            <input
                placeholder="차량번호"
                value={form.vehicle_no}
                onChange={(e) =>
                    setForm({ ...form, vehicle_no: e.target.value })
                }
            />

            <input
                type="number"
                placeholder="총중량"
                value={form.gross_weight}
                onChange={(e) =>
                    setForm({ ...form, gross_weight: Number(e.target.value) })
                }
            />

            <input
                type="number"
                placeholder="공차중량"
                value={form.tare_weight}
                onChange={(e) =>
                    setForm({ ...form, tare_weight: Number(e.target.value) })
                }
            />

            <p>실중량: {net}</p>

            <button onClick={submit} disabled={loading || net <= 0}>
                {loading ? '등록 중...' : '계근 등록'}
            </button>
        </div>
    )
}
