import { NextResponse } from 'next/server';

export async function POST() {
    const data = {
        "correlationId": "xxxx-xx-xxx-xxxxx-xxxxx",
        "statusCode": 200,
        "statusReason": "OK",
        "success": true,
        "status": "OK",
        "purchaseOrderRows": [
            [
                {
                    "id": "58e479b1-266d-4121-9165-9d337b4ca700",
                    "createdBy": "abc",
                    "createdDate": "2023-04-11T06:14:26.405+00:00",
                    "modifiedBy": "abc",
                    "modifiedDate": "2023-06-13T06:53:24.743+00:00",
                    "key": "VENDOR_NAME",
                    "name": "Vendor Name",
                    "type": "STRING",
                    "list": false,
                    "indexed": false,
                    "required": true,
                    "readOnly": true,
                    "value": "TECHNOLOGY LLC",
                    "sourceTemplate": "itam_snowflake_purchase_order_row_item"
                },
                {
                    "id": "58e479b1-266d-4121-9165-9d337b4ca700",
                    "createdBy": "abc",
                    "createdDate": "2023-04-11T06:19:35.270+00:00",
                    "modifiedBy": "abc",
                    "modifiedDate": "2023-05-31T06:53:29.751+00:00",
                    "key": "VENDOR_ID",
                    "name": "Vendor Id",
                    "type": "INTEGER",
                    "list": false,
                    "indexed": false,
                    "required": true,
                    "readOnly": true,
                    "value": "23",
                    "sourceTemplate": "itam_snowflake_purchase_order_row_item"
                },
                {
                    "id": "58e479b1-266d-4121-9165-9d337b4ca700",
                    "createdBy": "abc",
                    "createdDate": "2023-04-11T06:21:56.567+00:00",
                    "modifiedBy": "abc",
                    "modifiedDate": "2023-05-31T06:53:56.742+00:00",
                    "key": "FISCAL_YEAR",
                    "name": "Fiscal Year",
                    "type": "INTEGER",
                    "list": false,
                    "indexed": false,
                    "required": true,
                    "readOnly": false,
                    "value": "2026",
                    "sourceTemplate": "itam_snowflake_purchase_order_row_item"
                },
                {
                    "id": "58e479b1-266d-4121-9165-9d337b4ca700",
                    "createdBy": "abc",
                    "createdDate": "2023-04-11T06:22:50.339+00:00",
                    "modifiedBy": "abc",
                    "modifiedDate": "2023-05-31T06:54:10.633+00:00",
                    "key": "PO_NUMBER",
                    "name": "PO Number",
                    "type": "STRING",
                    "list": false,
                    "indexed": false,
                    "required": false,
                    "readOnly": true,
                    "value": "TEST1",
                    "sourceTemplate": "itam_snowflake_purchase_order_row_item"
                },
                {
                    "id": "0b20caf0-c9d9-477c-8374-56c2a2a08e1a",
                    "createdBy": "abc",
                    "createdDate": "2023-04-11T06:26:35.378+00:00",
                    "modifiedBy": "abc",
                    "modifiedDate": "2023-06-02T05:41:49.010+00:00",
                    "key": "TOTAL_AMOUNT_USD",
                    "name": "PO Amount",
                    "type": "CURRENCY",
                    "list": false,
                    "indexed": false,
                    "required": false,
                    "readOnly": true,
                    "value": "123.123",
                    "sourceTemplate": "itam_snowflake_purchase_order_row_item"
                }
            ]
        ]
    };

    return NextResponse.json(data);
}
