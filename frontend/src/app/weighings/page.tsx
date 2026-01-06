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
        if (form.vehicle_no.trim().length < 2) {
            alert('차량번호를 2자 이상 입력하세요')
            return
        }

        if (form.gross_weight < 0 || form.tare_weight < 0) {
            alert('중량은 0 이상이어야 합니다')
            return
        }

        if (form.gross_weight < form.tare_weight) {
            alert('총중량은 공차중량보다 크거나 같아야 합니다')
            return
        }

        dispatch(
            addAutoWeighing({
                contract_id: form.contract_id,
                vehicle_no: form.vehicle_no.trim(),
                gross_weight: form.gross_weight,
                tare_weight: form.tare_weight,
                sensor_id: 'SCALE-01',
            })
        )

        setForm((prev) => ({
            ...prev,
            vehicle_no: '',
            gross_weight: 0,
            tare_weight: 0,
        }))
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
            <h1 className="text-xl font-bold mb-6 text-gray-800">
                계량등록 (계근자)
            </h1>

            {/* 차량번호 */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    차량번호
                </label>
                <input
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="예: 12가3456"
                    value={form.vehicle_no}
                    onChange={(e) =>
                        setForm({ ...form, vehicle_no: e.target.value })
                    }
                />
            </div>

            {/* 총중량 */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    총중량 (kg)
                </label>
                <input
                    type="number"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.gross_weight}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            gross_weight: Number(e.target.value),
                        })
                    }
                />
            </div>

            {/* 공차중량 */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    공차중량 (kg)
                </label>
                <input
                    type="number"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.tare_weight}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            tare_weight: Number(e.target.value),
                        })
                    }
                />
            </div>

            {/* 실중량 */}
            <div className="mb-6 text-gray-700 font-semibold">
                실중량 : <span className="text-blue-600">{net}</span> kg
            </div>

            {/* 버튼 */}
            <button
                onClick={submit}
                disabled={loading}
                className={`w-full rounded-md bg-slate-800 py-2 text-white hover:bg-slate-900 transition
                    ${
                    loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {loading ? '등록 중...' : '계근 등록'}
            </button>
        </div>
    )
}
