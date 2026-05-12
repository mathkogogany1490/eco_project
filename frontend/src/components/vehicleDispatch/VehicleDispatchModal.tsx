'use client'

import {
    Modal,
    Form,
    Input,
    Button,
    DatePicker,
} from 'antd'

interface Props {

    open: boolean

    onClose: () => void

    onSubmit: (values: any) => void
}

export default function VehicleDispatchModal({

                                                 open,
                                                 onClose,
                                                 onSubmit,

                                             }: Props) {

    const [form] = Form.useForm()

    return (

        <Modal
            open={open}
    onCancel={onClose}
    footer={null}
    title="배차 등록"
    >

    <Form
        form={form}
    layout="vertical"
    onFinish={onSubmit}
    >

    <Form.Item
        label="차량번호"
    name="vehicle_number"
        >
        <Input />
        </Form.Item>

        <Form.Item
    label="기사명"
    name="driver_name"
        >
        <Input />
        </Form.Item>

        <Form.Item
    label="전화번호"
    name="phone_number"
        >
        <Input />
        </Form.Item>

        <Form.Item
    label="목적지"
    name="destination"
        >
        <Input />
        </Form.Item>

        <Form.Item
    label="배차일"
    name="dispatch_date"
    >
    <DatePicker
        style={{ width: '100%' }}
    />
    </Form.Item>

    <Button
    type="primary"
    htmlType="submit"
    block
    >
    저장
    </Button>

    </Form>

    </Modal>
)
}