'use client'

import { useEffect } from 'react'
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
} from 'antd'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import type { Place, BlockState } from '@/store/slices/placeSlice'

const { Option } = Select

/* =========================
   수정 전용 Form 타입
========================= */
type PlaceFormValues = {
    company_name?: string
    phone_number?: string
    address?: string
    blockState?: BlockState
    size?: string
    count?: number
    start_date?: Dayjs
}

interface Props {
    isOpen: boolean
    place: Place
    onClose: () => void
    onSave: (payload: {
        id: number
        company_name?: string
        phone_number?: string
        address?: string
        block_state?: BlockState
        size?: string
        count?: number
        start_date?: string
    }) => void
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

    /* =========================
       초기 값 세팅
    ========================= */
    useEffect(() => {
        if (!isOpen) return

        form.setFieldsValue({
            company_name: place.company_name,
            phone_number: place.phone_number ?? undefined,
            blockState: place.blockState ?? undefined,
            address: place.address ?? undefined,
            size: place.size ?? undefined,
            count: place.count ?? undefined,
            start_date: place.start_date
                ? dayjs(place.start_date)
                : undefined,
        })
    }, [isOpen, place, form])

    /* =========================
       저장 (PATCH payload 정제)
    ========================= */
    const onFinish = (values: PlaceFormValues) => {
        const { blockState, start_date, ...rest } = values

        onSave({
            id: place.id,
            ...rest,
            block_state: blockState,
            start_date: start_date
                ? start_date.format('YYYY-MM-DD')
                : undefined,
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

                {/* 📸 사진 버튼 (PC 비활성) */}
                <Form.Item label="사진">
                    <Upload
                        showUploadList={false}
                        beforeUpload={() => {
                            message.info(
                                '사진은 모바일에서만 업로드할 수 있습니다.'
                            )
                            return false
                        }}
                    >
                        <Button icon={<UploadOutlined />}>
                            사진 등록 (모바일 전용)
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
                    rules={[
                        { required: true, message: '상태를 선택하세요' },
                    ]}
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

                <Form.Item label="시작일" name="start_date">
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Space>
                    <Button type="primary" htmlType="submit">
                        저장
                    </Button>
                    <Button onClick={onClose}>취소</Button>

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
