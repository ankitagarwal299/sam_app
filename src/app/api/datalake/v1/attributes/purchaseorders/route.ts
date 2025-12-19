import { NextResponse } from 'next/server';

// In-memory mock data to handle updates during the session
const purchaseOrderRows: any[][] = [
    [
        { "key": "VENDOR_NAME", "value": "TECHNOLOGY LLC", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Tech Refresh 2025", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "FISCAL_YEAR", "value": "2024", "name": "Fiscal Year", "type": "INTEGER", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-001", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "123.123", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "SOFTWARE_PUBLISHER", "value": "TECHNOLOGY LLC", "name": "Software Publisher", "type": "STRING", "readOnly": false },
        { "key": "SOFTWARE_TITLE", "value": "Management Software", "name": "Software Title", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "323232", "name": "Department Number", "type": "INTEGER", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Stark", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "FUNDING_SOURCE", "value": "Part of Commit", "name": "Funding Source", "type": "STRING", "readOnly": false },
        { "key": "KNOWN_CHANGE", "value": "New Purchase", "name": "Known Change", "type": "STRING", "readOnly": false },
        { "key": "TIER", "value": "Silver", "name": "Tier", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "RENEWAL_COMPLETE", "value": "Completed", "name": "Deal Status", "type": "STRING", "readOnly": true },
        { "key": "OPPORTUNITY_STATUS", "value": "Completed", "name": "Opportunity Status", "type": "STRING", "readOnly": true },
        { "key": "EXPECTED_BASELINE_AMOUNT", "value": 0.0, "name": "Baseline for < 300K PO's", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/08/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2028/07/31 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Thor", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_CONTROLLER_NAME", "value": "brucee", "name": "Finance Controller", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Steve Rogers", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "CENTRAL_NONCENTRAL_SW", "value": "Central Software", "name": "Central / Non-Central SW", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "peter", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_REQUESTER", "value": "Natasha", "name": "PO Requester", "type": "STRING", "readOnly": true },
        { "key": "REQUESTER_ID", "value": "232323", "name": "Requester Id", "type": "STRING", "readOnly": false },
        { "key": "PR_NUMBER", "value": "PR1111222", "name": "PR Number", "type": "STRING", "readOnly": false },
        { "key": "CONTRACT_NEGOTIATOR", "value": "Tony", "name": "Contract Negotiator", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "GL_ACCOUNT", "value": "GL-123456", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "EXPENSE_CATEGORY", "value": "Software", "name": "Expense Category", "type": "STRING", "readOnly": false },
        { "key": "COST_POOL", "value": "IT Ops", "name": "Cost Pool", "type": "STRING", "readOnly": false },
        { "key": "SW_USAGE_CATEGORY", "value": "Internal", "name": "SW Usage Category", "type": "STRING", "readOnly": false },
        { "key": "SW_CATEGORY", "value": "SaaS", "name": "SW Category", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL04_NAME", "value": "Banner", "name": "Level 4 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL05_NAME", "value": "Romanoff", "name": "Level 5 Leader", "type": "STRING", "readOnly": false },
        { "key": "BUSINESS_OWNER", "value": "Clint", "name": "Business Owner", "type": "STRING", "readOnly": false },
        { "key": "BIZ_OPS_OWNER", "value": "Coulson", "name": "Biz Ops Owner", "type": "STRING", "readOnly": false },
        { "key": "OPPORTUNITY_CONTACT", "value": "Hill", "name": "Opportunity Contact", "type": "STRING", "readOnly": false },
        { "key": "COMPETITIVE_SOFTWARE", "value": "None", "name": "Competitive Software", "type": "STRING", "readOnly": false },
        { "key": "REDUNDANT_SOFTWARE", "value": "No", "name": "Redundant Software", "type": "STRING", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "MICROSOFT", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Azure Enterprise Agreement", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "FISCAL_YEAR", "value": "2023", "name": "Fiscal Year", "type": "INTEGER", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-002", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "500000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "SOFTWARE_TITLE", "value": "Azure Enterprise", "name": "Software Title", "type": "STRING", "readOnly": false },
        { "key": "PO_START_DATE", "value": "2025/01/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/01/01 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Tony Stark", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "RENEWAL_COMPLETE", "value": "In Progress", "name": "Deal Status", "type": "STRING", "readOnly": true },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Odin", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Loki", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "COGS", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "satya", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-999000", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "998877", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "AMAZON WEB SERVICES", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "AWS Cloud Hosting", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "FISCAL_YEAR", "value": "2022", "name": "Fiscal Year", "type": "INTEGER", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-003", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "750000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/06/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/05/31 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Odin", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Thor", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "andy", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Natasha Romanoff", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-AWS-01", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "1001", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "SALESFORCE", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "CRM Licenses", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "FISCAL_YEAR", "value": "2025", "name": "Fiscal Year", "type": "INTEGER", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-004", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "300000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/02/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/01/31 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Freya", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Baldur", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "marc", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Bruce Banner", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-SF-02", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "2002", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "ORACLE", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Database Support", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "FISCAL_YEAR", "value": "2021", "name": "Fiscal Year", "type": "INTEGER", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-005", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "150000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/03/15 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/03/14 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Odin", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Loki", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "COGS", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "larry", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Wanda Maximoff", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-ORA-03", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "3003", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "ADOBE", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Creative Cloud", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "FISCAL_YEAR", "value": "2020", "name": "Fiscal Year", "type": "INTEGER", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-006", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "50000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/01/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2025/12/31 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Freya", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Heimdall", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "shantanu", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Vision", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-ADB-04", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "4004", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "ZOOM", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Video Conferencing", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-007", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "25000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/07/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/06/30 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Thor", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Sif", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "eric", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Clint Barton", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-ZOOM-05", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "5005", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "SLACK", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Messaging Platform", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-008", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "45000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/04/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/03/31 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Odin", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Thor", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "stewart", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Sam Wilson", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-SLACK-06", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "6006", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "GITHUB", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Enterprise Licenses", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "FISCAL_YEAR", "value": "2026", "name": "Fiscal Year", "type": "INTEGER", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-009", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "80000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/08/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/07/31 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Thor", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Loki", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "COGS", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "thomas", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Bucky Barnes", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-GIT-07", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "7007", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "ATLASSIAN", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Jira & Confluence", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "FISCAL_YEAR", "value": "2026", "name": "Fiscal Year", "type": "INTEGER", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-010", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "95000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/05/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/04/30 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Odin", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Heimdall", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "mike", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Scott Lang", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-ATLAS-08", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "8008", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "DATADOG", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Monitoring Service", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-011", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "60000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/09/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/08/31 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Thor", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Loki", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "COGS", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "olivier", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Hope van Dyne", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-DDOG-09", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "9009", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "SPLUNK", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Log Management", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-012", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "110000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/11/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/10/31 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Odin", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Heimdall", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "doug", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "T'Challa", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-SPL-10", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "1010", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "SNOWFLAKE", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Data Warehouse", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "FISCAL_YEAR", "value": "2026", "name": "Fiscal Year", "type": "INTEGER", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-013", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "200000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/02/15 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/02/14 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Freya", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Sif", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "COGS", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "frank", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Stephen Strange", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-SNOW-11", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "1111", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "MIGNOW", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "UI Components", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-014", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "15000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/03/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/02/28 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Thor", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Thor", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "corbin", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Peter Parker", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-FIG-12", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "1212", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "NOTION", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Documentation Tool", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-015", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "12000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/06/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/05/31 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Odin", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Loki", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "ivan", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": null, "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Carol Danvers", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-NOT-13", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "1313", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "LINEAR", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Issue Tracking", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-016", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "18000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/01/15 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/01/14 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Freya", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Heimdall", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "karri", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": "Ignored", "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Arthur Curry", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-LIN-14", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "1414", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "VERCEL", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Frontend Deployment", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-017", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "40000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/08/15 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/08/14 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Thor", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Sif", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "COGS", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "guillermo", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": "Ignored", "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Diana Prince", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-VER-15", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "1515", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "SENTRY", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Error Tracking", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-018", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "15000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/02/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/01/31 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Odin", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Thor", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "david", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": "Active", "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Barry Allen", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-SEN-16", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "1616", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "AUTH0", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "Authentication", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-019", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "28000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/11/15 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/11/14 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Freya", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Baldur", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "OPEX", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "eugenio", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": "Active", "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Victor Stone", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-AUTH-17", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "1717", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ],
    [
        { "key": "VENDOR_NAME", "value": "TWILIO", "name": "Vendor Name", "type": "STRING", "readOnly": true },
        { "key": "PO_DESCRIPTION", "value": "SMS Gateway", "name": "PO Description", "type": "STRING", "readOnly": false },
        { "key": "PO_NUMBER", "value": "PO-020", "name": "PO Number", "type": "STRING", "readOnly": true },
        { "key": "TOTAL_AMOUNT_USD", "value": "22000.00", "name": "PO Amount", "type": "CURRENCY", "readOnly": true },
        { "key": "PO_START_DATE", "value": "2025/12/01 00:00:00", "name": "Start Date", "type": "DATETIME", "readOnly": false },
        { "key": "PO_END_DATE", "value": "2026/11/30 00:00:00", "name": "End Date", "type": "DATETIME", "readOnly": false },
        { "key": "NODE_LEVEL02_NAME_HIER", "value": "Thor", "name": "Level 2 Leader", "type": "STRING", "readOnly": false },
        { "key": "NODE_LEVEL03_NAME", "value": "Loki", "name": "Level 3 Leader", "type": "STRING", "readOnly": false },
        { "key": "COGS_OR_OPEX", "value": "COGS", "name": "Expense Type", "type": "STRING", "readOnly": false },
        { "key": "PRODUCT_OWNER", "value": "jeff", "name": "Product Owner", "type": "STRING", "readOnly": false },
        { "key": "PO_STATUS", "value": "Active", "name": "PO Status", "type": "STRING", "readOnly": true },
        { "key": "FINANCIAL_ANALYST_NAME", "value": "Hal Jordan", "name": "Financial Analyst", "type": "STRING", "readOnly": false },
        { "key": "GL_ACCOUNT", "value": "GL-TWIL-18", "name": "GL Account", "type": "STRING", "readOnly": false },
        { "key": "FINANCIAL_DEPARTMENT_CODE", "value": "1818", "name": "Department Number", "type": "INTEGER", "readOnly": false }
    ]
];

export async function POST() {
    return NextResponse.json({
        "correlationId": "xxxx-xx-xxx-xxxxx-xxxxx",
        "statusCode": 200,
        "statusReason": "OK",
        "success": true,
        "status": "OK",
        "purchaseOrderRows": purchaseOrderRows
    });
}

export async function PATCH(request: Request) {
    const { poNumber, updates, status } = await request.json();

    const rowIndex = purchaseOrderRows.findIndex(row =>
        row.find(field => field.key === 'PO_NUMBER' && field.value === poNumber)
    );

    if (rowIndex === -1) {
        return NextResponse.json({ success: false, message: 'PO not found' }, { status: 404 });
    }

    // Handle generic updates if provided
    if (updates && typeof updates === 'object') {
        Object.keys(updates).forEach(key => {
            const field = purchaseOrderRows[rowIndex].find(f => f.key === key);
            if (field) {
                // Determine if we need to parse the value (e.g. for numbers)
                // For simplicity in this mock, we'll trust the input or cast slightly
                field.value = updates[key];
            } else {
                // Optionally create the field if it doesn't exist (mock data flexibility)
                // For now, we only update existing fields to avoid polluting schema
            }
        });
    }

    // Handle specific status update (backward compatibility or specific logic)
    if (status) {
        const statusField = purchaseOrderRows[rowIndex].find(field => field.key === 'PO_STATUS');
        if (statusField) {
            statusField.value = status;
        } else {
            purchaseOrderRows[rowIndex].push({ "key": "PO_STATUS", "value": status, "name": "PO Status", "type": "STRING", "readOnly": true });
        }
    }

    return NextResponse.json({ success: true });
}
