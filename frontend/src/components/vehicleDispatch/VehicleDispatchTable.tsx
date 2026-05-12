'use client'

import { Table } from 'antd'

interface Props {
    data: any[]
}

export default function VehicleDispatchTable({
                                                 data,
                                             }: Props) {

    const columns = [

        {
            title: '차량번호',
            dataIndex: 'vehicle_number',
        },

        {
            title: '기사명',
            dataIndex: 'driver_name',
        },

        {
            title: '전화번호',
            dataIndex: 'phone_number',
        },

        {
            title: '목적지',
            dataIndex: 'destination',
        },

        {
            title: '배차일',
            dataIndex: 'dispatch_date',
        },
    ]

    return (

        <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={false}
        />
    )
}