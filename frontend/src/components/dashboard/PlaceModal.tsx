'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
    Modal,
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Popconfirm,
    Upload,
    message,
    Progress,
} from 'antd'

import {
    DeleteOutlined,
    UploadOutlined,
} from '@ant-design/icons'

import { useDispatch } from 'react-redux'

import dayjs, { Dayjs } from 'dayjs'

import {
    fetchPlaces,
} from '@/store/slices/placeSlice'

import type {
    Place,
    BlockState
} from '@/types/placeType'

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

    const dispatch = useDispatch()

    const [form] = Form.useForm()

    const [progressPercent, setProgressPercent] = useState(0)

    /* =========================
       진행률 계산
    ========================= */

    const calculateProgress = (
        start?: Dayjs,
        end?: Dayjs
    ) => {

        if (!start || !end) return 0

        const today = dayjs()

        const total = end.diff(start, 'day')

        if (total <= 0) return 0

        const elapsed = today.diff(start, 'day')

        const percent = (elapsed / total) * 100

        return Math.min(
            Math.max(percent, 0),
            100
        )
    }

    /* =========================
       초기 데이터 세팅
    ========================= */

    useEffect(() => {

        if (!isOpen) return

        const start = place.start_date
            ? dayjs(place.start_date)
            : undefined

        const end = place.end_date
            ? dayjs(place.end_date)
            : undefined

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

        setProgressPercent(
            calculateProgress(start, end)
        )

    }, [isOpen, place])

    /* =========================
       날짜 변경 시 진행률 계산
    ========================= */

    const handleDateChange = () => {

        const start = form.getFieldValue('start_date')
        const end = form.getFieldValue('end_date')

        setProgressPercent(
            calculateProgress(start, end)
        )
    }

    /* =========================
       저장
    ========================= */

    const onFinish = (
        values: PlaceFormValues
    ) => {

        const {
            blockState,
            start_date,
            end_date,
            ...rest
        } = values

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
        <StyledModal
            open={isOpen}
            title="장소 정보 수정"
            onCancel={onClose}
            footer={null}
            centered
        >

            <StyledForm
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >

                {/* 회사명 + 전화번호 */}
                <InlineRow>

                    <FullItem
                        label="회사명"
                        name="company_name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </FullItem>

                    <HalfItem
                        label="전화번호"
                        name="phone_number"
                    >
                        <Input />
                    </HalfItem>

                </InlineRow>

                {/* 주소 */}
                <Form.Item
                    label="주소"
                    name="address"
                >
                    <Input />
                </Form.Item>

                {/* 사진 */}
                <Form.Item label="사진">

                    <ImageWrapper>

                        <PreviewImage
                            src={
                                place.image_url
                                    ? place.image_url.startsWith('http')
                                        ? place.image_url
                                        : `http://localhost${place.image_url}`
                                    : 'https://dummyimage.com/600x400/e5e7eb/6b7280&text=No+Image'
                            }
                            alt="place-image"
                            onError={(e) => {

                                console.log(
                                    '이미지 로드 실패:',
                                    place.image_url
                                )

                                e.currentTarget.src =
                                    'https://dummyimage.com/600x400/e5e7eb/6b7280&text=No+Image'
                            }}
                        />

                    </ImageWrapper>

                    <Upload
                        showUploadList={false}
                        beforeUpload={async (file) => {

                            const formData = new FormData()

                            formData.append(
                                'photo',
                                file
                            )

                            const token =
                                localStorage.getItem(
                                    'access_token'
                                )

                            try {

                                const res = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/places/${place.id}/upload_photo/`,
                                    {
                                        method: 'POST',
                                        headers: {
                                            Authorization:
                                                `Bearer ${token}`,
                                        },
                                        body: formData,
                                    }
                                )

                                if (!res.ok)
                                    throw new Error()

                                message.success(
                                    '사진 업로드 완료'
                                )

                                // 🔥 핵심
                                dispatch(fetchPlaces())

                            } catch {

                                message.error(
                                    '사진 업로드 실패'
                                )
                            }

                            return false
                        }}
                    >
                        <Button
                            icon={<UploadOutlined />}
                        >
                            사진 등록
                        </Button>
                    </Upload>

                </Form.Item>

                {/* 위도 / 경도 */}
                <InlineRow>

                    <HalfItem label="위도">
                        <Input
                            value={place.latitude}
                            disabled
                        />
                    </HalfItem>

                    <HalfItem label="경도">
                        <Input
                            value={place.longitude}
                            disabled
                        />
                    </HalfItem>

                </InlineRow>

                {/* 상태 / 사이즈 / 개수 */}
                <InlineRow>

                    <ThirdItem
                        label="상태"
                        name="blockState"
                        rules={[{ required: true }]}
                    >
                        <Select placeholder="상태">

                            <Option value="반입">
                                반입
                            </Option>

                            <Option value="반출">
                                반출
                            </Option>

                            <Option value="고정">
                                고정
                            </Option>

                        </Select>
                    </ThirdItem>

                    <ThirdItem
                        label="사이즈"
                        name="size"
                    >
                        <Input suffix="루베" />
                    </ThirdItem>

                    <ThirdItem
                        label="개수"
                        name="count"
                    >
                        <Input
                            type="number"
                            suffix="개"
                        />
                    </ThirdItem>

                </InlineRow>

                {/* 시작일 / 종료일 */}
                <InlineRow>

                    <HalfItem
                        label="시작일"
                        name="start_date"
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            onChange={
                                handleDateChange
                            }
                        />
                    </HalfItem>

                    <HalfItem
                        label="종료일"
                        name="end_date"
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            onChange={
                                handleDateChange
                            }
                        />
                    </HalfItem>

                </InlineRow>

                {/* 진행률 */}
                <Form.Item label="진행률">

                    <Progress
                        percent={Math.round(
                            progressPercent
                        )}
                    />

                </Form.Item>

                {/* 버튼 */}
                <ButtonRow>

                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        저장
                    </Button>

                    <Button onClick={onClose}>
                        취소
                    </Button>

                    <Popconfirm
                        title="삭제하시겠습니까?"
                        onConfirm={() =>
                            onDelete(place.id)
                        }
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                        >
                            삭제
                        </Button>
                    </Popconfirm>

                </ButtonRow>

            </StyledForm>

        </StyledModal>
    )
}

/* =====================================================
   styled-components
===================================================== */

const StyledModal = styled(Modal)`

    .ant-modal {
        top: 20px;
    }

    .ant-modal-content {

        border-radius: 18px;

        padding: 20px;

        max-height: 90vh;

        overflow: hidden;

        display: flex;
        flex-direction: column;
    }

    .ant-modal-body {

        overflow-y: auto;

        max-height: calc(90vh - 120px);

        padding-right: 4px;
    }

    .ant-modal-header {

        border-bottom: none;

        margin-bottom: 16px;
    }

    .ant-modal-title {

        font-size: 20px;

        font-weight: 700;
    }

    @media (max-width: 768px) {

        .ant-modal {
            width: 95vw !important;
            max-width: 95vw;
        }

        .ant-modal-content {
            padding: 14px;
        }
    }
`

const StyledForm = styled(Form)`
    width: 100%;
`

const InlineRow = styled.div`

    display: flex;

    gap: 12px;

    width: 100%;

    @media (max-width: 768px) {

        flex-direction: column;
    }
`

const FullItem = styled(Form.Item)`
    flex: 2;
`

const HalfItem = styled(Form.Item)`
    flex: 1;
`

const ThirdItem = styled(Form.Item)`
    flex: 1;
`

const ButtonRow = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 12px;
`

const ImageWrapper = styled.div`

    width: 100%;

    min-height: 240px;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    border-radius: 12px;

    border: 1px solid #f0f0f0;

    background: #f8f8f8;

    padding: 12px;

    margin-bottom: 12px;
`

const PreviewImage = styled.img`

    max-width: 100%;

    max-height: 260px;

    object-fit: contain;

    display: block;
`