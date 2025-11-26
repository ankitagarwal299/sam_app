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
                { "key": "VENDOR_NAME", "value": "TECHNOLOGY LLC", "name": "Vendor Name", "type": "STRING", "readOnly": true },
                { "key": "VENDOR_ID", "value": "23", "name": "Vendor Id", "type": "INTEGER", "readOnly": true },
                { "key": "FISCAL_YEAR", "value": "2026", "name": "Fiscal Year", "type": "INTEGER", "readOnly": false },
                { "key": "PO_NUMBER", "value": "TEST1", "name": "PO Number", "type": "STRING", "readOnly": true },
                { "key": "TOTAL_AMOUNT_USD", "value": "123.123", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
                { "key": "NODE_LEVEL05_NAME", "value": "Robert", "name": "Level 5 Leader", "type": "STRING", "readOnly": false },
                { "key": "NODE_LEVEL04_NAME", "value": "Rodhey", "name": "Level 4 Leader", "type": "STRING", "readOnly": false },
                { "key": "SOFTWARE_PUBLISHER", "value": "TECHNOLOGY LLC", "name": "Software Publisher", "type": "STRING", "readOnly": false },
                { "key": "SOFTWARE_TITLE", "value": "Management Software", "name": "Software Title", "type": "STRING", "readOnly": false },
                { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "323232", "name": "Department Number", "type": "INTEGER", "readOnly": false },
                { "key": "NODE_LEVEL03_NAME", "value": "Stark", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
                { "key": "FUNDING_SOURCE", "value": "Part of Commit", "name": "Funding Source", "type": "STRING", "readOnly": false },
                { "key": "KNOWN_CHANGE", "value": "New Purchase", "name": "Known Change", "type": "STRING", "readOnly": false },
                { "key": "TIER", "value": "Silver", "name": "Tier", "type": "STRING", "readOnly": false },
                { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "COGS / OPEX", "type": "STRING", "readOnly": false },
                { "key": "RENEWAL_COMPLETE", "value": "Completed", "name": "Deal Status", "type": "STRING", "readOnly": true },
                { "key": "OPPORTUNITY_STATUS", "value": "Completed", "name": "Opportunity Status", "type": "STRING", "readOnly": true },
                { "key": "EXPECTED_BASELINE_AMOUNT", "value": 0.0, "name": "Baseline for < 300K PO's", "type": "CURRENCY", "readOnly": true },
                { "key": "PO_START_DATE", "value": "2025/08/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
                { "key": "PO_END_DATE", "value": "2028/07/31 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
                { "key": "NODE_LEVEL02_NAME_HIER", "value": "Thor", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
                { "key": "FINANCIAL_CONTROLLER_NAME", "value": "brucee", "name": "Finance Controller", "type": "STRING", "readOnly": false },
                { "key": "FINANCIAL_ANALYST_NAME", "value": "steve", "name": "Budget FA", "type": "STRING", "readOnly": false },
                { "key": "NODE_LEVEL04_NAME_PL_HIER", "value": "G&A", "name": "PL Level4 Name", "type": "STRING", "readOnly": false },
                { "key": "CENTRAL_NONCENTRAL_SW", "value": "Central Software", "name": "Central / Non-Central SW", "type": "STRING", "readOnly": false },
                { "key": "PRODUCT_OWNER", "value": "peter", "name": "Product Owner", "type": "STRING", "readOnly": false },
                { "key": "PO_REQUESTER", "value": "Natasha", "name": "PO Requester", "type": "STRING", "readOnly": true },
                { "key": "REQUESTER_ID", "value": "232323", "name": "Requester Id", "type": "STRING", "readOnly": false },
                { "key": "PR_NUMBER", "value": "PR1111222", "name": "PR Number", "type": "STRING", "readOnly": false },
                { "key": "FINANCE_LEADER_L2", "value": "T.Challa", "name": "Finance Leader L2", "type": "STRING", "readOnly": true },
                { "key": "FINANCE_LEADER_L3", "value": "Banner", "name": "Finance Leader L3", "type": "STRING", "readOnly": true },
                { "key": "FINANCE_LEADER_L4", "value": "stephen", "name": "Finance Leader L4", "type": "STRING", "readOnly": true },
                { "key": "FINANCE_LEADER_L5", "value": "Robert", "name": "Finance Leader L5", "type": "STRING", "readOnly": true },
                { "key": "CONTRACT_NEGOTIATOR", "value": "Tony", "name": "Contract Negotiator", "type": "STRING", "readOnly": false },
                { "key": "NODE_LEVEL06_NAME", "value": "Roger", "name": "Level 6 Leader", "type": "STRING", "readOnly": false }
            ],
            [
                { "key": "VENDOR_NAME", "value": "MICROSOFT", "name": "Vendor Name", "type": "STRING", "readOnly": true },
                { "key": "VENDOR_ID", "value": "99", "name": "Vendor Id", "type": "INTEGER", "readOnly": true },
                { "key": "FISCAL_YEAR", "value": "2026", "name": "Fiscal Year", "type": "INTEGER", "readOnly": false },
                { "key": "PO_NUMBER", "value": "PO-MS-001", "name": "PO Number", "type": "STRING", "readOnly": true },
                { "key": "TOTAL_AMOUNT_USD", "value": "500000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
                { "key": "SOFTWARE_TITLE", "value": "Azure Enterprise", "name": "Software Title", "type": "STRING", "readOnly": false },
                { "key": "PO_START_DATE", "value": "2025/01/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
                { "key": "PO_END_DATE", "value": "2026/01/01 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
                { "key": "FINANCIAL_ANALYST_NAME", "value": "steve", "name": "Budget FA", "type": "STRING", "readOnly": false },
                { "key": "RENEWAL_COMPLETE", "value": "In Progress", "name": "Deal Status", "type": "STRING", "readOnly": true }
            ]
        ]
    };

    return NextResponse.json(data);
}
