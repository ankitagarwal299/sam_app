import { NextResponse } from 'next/server';

export async function POST() {
    const data = {
        "correlationId": "xxxxx-xx-xx-xx-xxxxx",
        "statusCode": 200,
        "statusReason": "OK",
        "success": true,
        "status": "OK",
        "purchaseOrderRows": [
            {
                "Department Number": 123123,
                "Vendor Name": [
                    " LLC"
                ],
                "Vendor ID": [
                    232323
                ],
                "PO": "TEST2",
                "Funding Source": null,
                "Cogs Or Opex": "OPEX",
                "Known Change": "New Purchase",
                "Business Owner": "Robert",
                "Finance Controller": "Rhody",
                "Software Title": "Cloud Services",
                "PO Start Date": 1689552000000,
                "PO End Date": 1695772800000,
                "PO Amount": 12.0
            },
            {
                "Department Number": 54545454,
                "Vendor Name": [
                    "LLC"
                ],
                "Vendor ID": [
                    232323
                ],
                "PO": "TEST4",
                "Funding Source": "Part of Commit",
                "Cogs Or Opex": "OPEX",
                "Known Change": "New Purchase",
                "Primary Contact": "Peter",
                "Product Owner": "Natasha",
                "Business Owner": "Bruce",
                "Finance Controller": "Steve",
                "Software Title": "SAP",
                "PO Start Date": 1643241600000,
                "PO End Date": 1758855600000,
                "PO Amount": 123.0
            }
        ]
    };

    return NextResponse.json(data);
}
