'use client'

import { useEffect, useState } from 'react'
import {
    Modal,
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Popconfirm,
    Upload,
    Space,
    message,
    Progress,
} from 'antd'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import type { Place, BlockState } from '@/types/placeType'

const { Option } = Select

type PlaceFormValues = {
    company_name?: string
    phone_number?: string
    address?: string
    blockState?: BlockState
    size?: string
    count?: number
    start_date?: Dayjs
    end_date?: Dayjs
}

interface Props {
    isOpen: boolean
    place: Place
    onClose: () => void
    onSave: (payload: any) => void
    onDelete: (id: number) => void
}

export default function PlaceModal({
                                       isOpen,
                                       place,
                                       onClose,
                                       onSave,
                                       onDelete,
                                   }: Props) {

    const [form] = Form.useForm()
    const [progressPercent, setProgressPercent] = useState(0)

    /* =========================
       진행률 계산 함수
    ========================= */

    const calculateProgress = (start?: Dayjs, end?: Dayjs) => {

        if (!start || !end) return 0

        const today = dayjs()

        const total = end.diff(start, 'day')

        if (total <= 0) return 0

        const elapsed = today.diff(start, 'day')

        const percent = (elapsed / total) * 100

        return Math.min(Math.max(percent, 0), 100)
    }

    /* =========================
       초기 값 세팅
    ========================= */

    useEffect(() => {

        if (!isOpen) return

        const start = place.start_date ? dayjs(place.start_date) : undefined
        const end = place.end_date ? dayjs(place.end_date) : undefined

        form.setFieldsValue({
            company_name: place.company_name,
            phone_number: place.phone_number ?? undefined,
            blockState: place.blockState ?? undefined,
            address: place.address ?? undefined,
            size: place.size ?? undefined,
            count: place.count ?? undefined,
            start_date: start,
            end_date: end,
        })

        setProgressPercent(calculateProgress(start, end))

    }, [isOpen, place])

    /* =========================
       날짜 변경 시 진행률 계산
    ========================= */

    const handleDateChange = () => {

        const start = form.getFieldValue("start_date")
        const end = form.getFieldValue("end_date")

        setProgressPercent(calculateProgress(start, end))
    }

    /* =========================
       저장
    ========================= */

    const onFinish = (values: PlaceFormValues) => {

        const { blockState, start_date, end_date, ...rest } = values

        onSave({
            id: place.id,
            ...rest,
            block_state: blockState ?? null,
            start_date: start_date
                ? start_date.format('YYYY-MM-DD')
                : null,
            end_date: end_date
                ? end_date.format('YYYY-MM-DD')
                : null,
        })
    }

    return (
        <Modal
            open={isOpen}
            title="장소 정보 수정"
            onCancel={onClose}
            footer={null}
        >

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >

                <Form.Item
                    label="회사명"
                    name="company_name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="전화번호" name="phone_number">
                    <Input />
                </Form.Item>

                <Form.Item label="주소" name="address">
                    <Input />
                </Form.Item>

                {/* 사진 업로드 */}

                <Form.Item label="사진">
                    <Upload
                        showUploadList={false}
                        beforeUpload={async (file) => {

                            const formData = new FormData()
                            formData.append("photo", file)

                            const token = localStorage.getItem("access_token")

                            try {

                                const res = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/places/${place.id}/upload_photo/`,
                                    {
                                        method: "POST",
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                        body: formData,
                                    }
                                )
                                if (!res.ok) throw new Error()

                                message.success("사진 업로드 완료")

                            } catch {
                                message.error("사진 업로드 실패")
                            }

                            return false
                        }}
                    >
                        <Button icon={<UploadOutlined />}>
                            사진 등록
                        </Button>
                    </Upload>
                </Form.Item>

                <Space>
                    <Form.Item label="위도">
                        <Input value={place.latitude} disabled />
                    </Form.Item>

                    <Form.Item label="경도">
                        <Input value={place.longitude} disabled />
                    </Form.Item>
                </Space>

                <Form.Item
                    label="상태"
                    name="blockState"
                    rules={[{ required: true }]}
                >
                    <Select placeholder="상태 선택">
                        <Option value="반입">반입</Option>
                        <Option value="반출">반출</Option>
                        <Option value="고정">고정</Option>
                    </Select>
                </Form.Item>

                <Space>
                    <Form.Item label="사이즈" name="size">
                        <Input suffix="루베" />
                    </Form.Item>

                    <Form.Item label="개수" name="count">
                        <Input type="number" suffix="개" />
                    </Form.Item>
                </Space>

                {/* 시작일 */}

                <Form.Item label="시작일" name="start_date">
                    <DatePicker
                        style={{ width: '100%' }}
                        onChange={handleDateChange}
                    />
                </Form.Item>

                {/* 종료일 */}

                <Form.Item label="종료일" name="end_date">
                    <DatePicker
                        style={{ width: '100%' }}
                        onChange={handleDateChange}
                    />
                </Form.Item>

                {/* 진행률 */}

                <Form.Item label="진행률">
                    <Progress percent={Math.round(progressPercent)} />
                </Form.Item>

                <Space>

                    <Button type="primary" htmlType="submit">
                        저장
                    </Button>

                    <Button onClick={onClose}>
                        취소
                    </Button>

                    <Popconfirm
                        title="삭제하시겠습니까?"
                        onConfirm={() => onDelete(place.id)}
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            삭제
                        </Button>
                    </Popconfirm>

                </Space>

            </Form>
        </Modal>
    )
}