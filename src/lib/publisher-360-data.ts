// Publisher 360° View - Mock Data & Types

// ==================== Types ====================

export interface Publisher {
    id: string;
    name: string;
    logo?: string;
}

export interface ContractKPIs {
    tcv: number;
    acv: number;
    tcvTrend: number; // percentage change
    acvTrend: number;
}

export interface KeyDates {
    nextRenewalDate: string;
    renewalPOAmount: number;
    vendorFiscalYearEnd: string;
    daysUntilRenewal: number;
}

export interface LicenseByBU {
    buName: string;
    activeCount: number;
    inactiveCount: number;
}

export interface Entitlement {
    id: string;
    productName: string;
    quantity: number;
    consumed: number;
    consumedPercent: number;
    status: 'Active' | 'Expiring' | 'Overage';
    expiryDate?: string;
}

export interface Contract {
    id: string;
    contractNumber: string;
    poNumber: string;
    tcv: number;
    acv: number;
    renewalDate: string;
    description: string;
    businessUnit: string;
    status: 'Active' | 'Expiring Soon' | 'Closed' | 'Draft';
    startDate: string;
    endDate: string;
    attachments?: string[];
    contactPerson?: string;
    paymentTerms?: string;
    notes?: string;
}

export interface Product {
    id: string;
    productName: string;
    infrastructure: 'On-Premise' | 'Cloud' | 'Hybrid' | string;
    infrastructureDetails?: string;
    serviceLevelObjectives: string;
    dataClassification: 'Highly Confidential' | 'Confidential' | 'Internal Use' | 'Public';
    status: 'Active' | 'Pending Review' | 'Deprecated';
}

export interface PublisherContact {
    id: string;
    name: string;
    role: string;
    email: string;
    phone?: string;
}

export interface InternalContact {
    id: string;
    name: string;
    role: string;
    email: string;
    phone?: string;
    team: 'IT' | 'GPS' | 'Financial Analysts';
}

export interface Stakeholder {
    id: string;
    name: string;
    orgBU: string;
    role: string;
    influence: 'High' | 'Medium' | 'Low';
    notes: string;
    email?: string;
}

export interface Publisher360Data {
    publisher: Publisher;
    kpis: ContractKPIs;
    keyDates: KeyDates;
    licensesByBU: LicenseByBU[];
    entitlements: Entitlement[];
    contracts: Contract[];
    products: Product[];
    publisherContacts: PublisherContact[];
    internalContacts: InternalContact[];
    stakeholders: Stakeholder[];
}

// ==================== Mock Data ====================

export const publishers: Publisher[] = [
    { id: 'oracle', name: 'Oracle' },
    { id: 'microsoft', name: 'Microsoft' },
    { id: 'salesforce', name: 'Salesforce' },
    { id: 'sap', name: 'SAP' },
    { id: 'ibm', name: 'IBM' },
];

const oracleData: Publisher360Data = {
    publisher: { id: 'oracle', name: 'Oracle' },
    kpis: {
        tcv: 2500000,
        acv: 850000,
        tcvTrend: 12,
        acvTrend: 8,
    },
    keyDates: {
        nextRenewalDate: '2025-03-15',
        renewalPOAmount: 1200000,
        vendorFiscalYearEnd: '2025-08-31',
        daysUntilRenewal: 59,
    },
    licensesByBU: [
        { buName: 'Finance', activeCount: 320, inactiveCount: 20 },
        { buName: 'Engineering', activeCount: 450, inactiveCount: 15 },
        { buName: 'HR', activeCount: 180, inactiveCount: 5 },
        { buName: 'Sales', activeCount: 275, inactiveCount: 12 },
        { buName: 'Marketing', activeCount: 125, inactiveCount: 8 },
    ],
    entitlements: [
        { id: 'e1', productName: 'Oracle Database Enterprise', quantity: 500, consumed: 390, consumedPercent: 78, status: 'Active' },
        { id: 'e2', productName: 'Oracle Cloud Infrastructure', quantity: 1000, consumed: 450, consumedPercent: 45, status: 'Active' },
        { id: 'e3', productName: 'Oracle Analytics Cloud', quantity: 200, consumed: 184, consumedPercent: 92, status: 'Overage', expiryDate: '2025-02-28' },
        { id: 'e4', productName: 'Oracle Integration Cloud', quantity: 150, consumed: 120, consumedPercent: 80, status: 'Active' },
        { id: 'e5', productName: 'Oracle WebLogic Server', quantity: 50, consumed: 42, consumedPercent: 84, status: 'Expiring', expiryDate: '2025-04-15' },
    ],
    contracts: [
        {
            id: 'c1',
            contractNumber: 'CON-2023-001',
            poNumber: 'PO-98765',
            tcv: 1500000,
            acv: 500000,
            renewalDate: '2025-03-15',
            description: 'Oracle Database Enterprise Edition - 3 Year Agreement',
            businessUnit: 'IT Services',
            status: 'Active',
            startDate: '2023-03-15',
            endDate: '2026-03-14',
            attachments: ['Master_Agreement.pdf', 'SOW_2023.pdf'],
            contactPerson: 'Sarah Jenkins',
            paymentTerms: 'Net 30',
            notes: 'Annual true-up scheduled for Q1 2025',
        },
        {
            id: 'c2',
            contractNumber: 'CON-2022-045',
            poNumber: 'PO-87654',
            tcv: 750000,
            acv: 250000,
            renewalDate: '2025-02-28',
            description: 'Oracle Cloud Infrastructure Services',
            businessUnit: 'Engineering',
            status: 'Expiring Soon',
            startDate: '2022-03-01',
            endDate: '2025-02-28',
            paymentTerms: 'Net 45',
            notes: 'Renewal negotiation in progress',
        },
        {
            id: 'c3',
            contractNumber: 'CON-2024-012',
            poNumber: 'PO-76543',
            tcv: 200000,
            acv: 100000,
            renewalDate: '2026-01-15',
            description: 'Oracle Analytics Cloud - Department License',
            businessUnit: 'Finance',
            status: 'Active',
            startDate: '2024-01-15',
            endDate: '2026-01-14',
        },
        {
            id: 'c4',
            contractNumber: 'CON-2021-089',
            poNumber: 'PO-65432',
            tcv: 50000,
            acv: 0,
            renewalDate: '2024-12-31',
            description: 'Oracle WebLogic Server - Legacy Support',
            businessUnit: 'IT Services',
            status: 'Closed',
            startDate: '2021-01-01',
            endDate: '2024-12-31',
        },
    ],
    products: [
        {
            id: 'p1',
            productName: 'Oracle Database Enterprise Edition',
            infrastructure: 'Hybrid',
            infrastructureDetails: 'On-Premise + Oracle Cloud',
            serviceLevelObjectives: '99.99% uptime, 4hr RTO, 1hr RPO, 24/7 Premium Support',
            dataClassification: 'Confidential',
            status: 'Active',
        },
        {
            id: 'p2',
            productName: 'Oracle Cloud Infrastructure (OCI)',
            infrastructure: 'Cloud',
            infrastructureDetails: 'Oracle Cloud (OCI)',
            serviceLevelObjectives: '99.9% availability, 24/7 support, Monthly SLA reports',
            dataClassification: 'Internal Use',
            status: 'Active',
        },
        {
            id: 'p3',
            productName: 'Oracle Analytics Cloud',
            infrastructure: 'Cloud',
            infrastructureDetails: 'Oracle Cloud',
            serviceLevelObjectives: '99.5% uptime, Business hours support, Quarterly reviews',
            dataClassification: 'Highly Confidential',
            status: 'Active',
        },
        {
            id: 'p4',
            productName: 'Oracle Integration Cloud',
            infrastructure: 'Cloud',
            serviceLevelObjectives: '99.9% availability, API rate limits: 10K/min',
            dataClassification: 'Internal Use',
            status: 'Active',
        },
        {
            id: 'p5',
            productName: 'Oracle WebLogic Server',
            infrastructure: 'On-Premise',
            infrastructureDetails: 'Data Center - US East',
            serviceLevelObjectives: '99.9% uptime, Extended support until 2025',
            dataClassification: 'Public',
            status: 'Deprecated',
        },
    ],
    publisherContacts: [
        { id: 'pc1', name: 'Sarah Jenkins', role: 'Account Executive', email: 'sarah.jenkins@oracle.com', phone: '+1-555-0101' },
        { id: 'pc2', name: 'Michael Chen', role: 'Technical Account Manager', email: 'michael.chen@oracle.com', phone: '+1-555-0102' },
        { id: 'pc3', name: 'Emily Davis', role: 'Customer Success Manager', email: 'emily.davis@oracle.com', phone: '+1-555-0103' },
    ],
    internalContacts: [
        { id: 'ic1', name: 'David Lee', role: 'Lead Systems Architect', email: 'david.lee@enterprise.com', team: 'IT' },
        { id: 'ic2', name: 'Amanda White', role: 'Integration Specialist', email: 'amanda.white@enterprise.com', team: 'IT' },
        { id: 'ic3', name: 'Robert Brown', role: 'Global Partner Solutions', email: 'robert.brown@enterprise.com', team: 'GPS' },
        { id: 'ic4', name: 'Lisa Garcia', role: 'Solutions Engineer', email: 'lisa.garcia@enterprise.com', team: 'GPS' },
        { id: 'ic5', name: 'Kevin Wilson', role: 'Senior Financial Analyst', email: 'kevin.wilson@enterprise.com', team: 'Financial Analysts' },
        { id: 'ic6', name: 'Jessica Kim', role: 'Billing Specialist', email: 'jessica.kim@enterprise.com', team: 'Financial Analysts' },
    ],
    stakeholders: [
        { id: 's1', name: 'Dr. Alan Grant', orgBU: 'Sales / North America', role: 'VP of Global Sales', influence: 'High', notes: 'Key decision maker for upcoming renewal, scheduled for quarterly review...', email: 'alan.grant@enterprise.com' },
        { id: 's2', name: 'Maria Rodriguez', orgBU: 'Product / Platform', role: 'Director of Product Management', influence: 'Medium', notes: 'Interested in new API integration, requested demo for next month...', email: 'maria.rodriguez@enterprise.com' },
        { id: 's3', name: 'Thomas Anderson', orgBU: 'Legal / Compliance', role: 'General Counsel', influence: 'High', notes: 'Reviewing contract terms, addressing data privacy concerns...', email: 'thomas.anderson@enterprise.com' },
        { id: 's4', name: 'Sophie Laurent', orgBU: 'Marketing / Brand', role: 'CMO', influence: 'Low', notes: 'Focused on brand alignment and upcoming marketing campaigns...', email: 'sophie.laurent@enterprise.com' },
    ],
};

const microsoftData: Publisher360Data = {
    publisher: { id: 'microsoft', name: 'Microsoft' },
    kpis: {
        tcv: 4200000,
        acv: 1400000,
        tcvTrend: 15,
        acvTrend: 10,
    },
    keyDates: {
        nextRenewalDate: '2025-06-30',
        renewalPOAmount: 1600000,
        vendorFiscalYearEnd: '2025-06-30',
        daysUntilRenewal: 166,
    },
    licensesByBU: [
        { buName: 'All Departments', activeCount: 2500, inactiveCount: 150 },
        { buName: 'Engineering', activeCount: 800, inactiveCount: 25 },
        { buName: 'Finance', activeCount: 400, inactiveCount: 10 },
    ],
    entitlements: [
        { id: 'me1', productName: 'Microsoft 365 E5', quantity: 2500, consumed: 2350, consumedPercent: 94, status: 'Active' },
        { id: 'me2', productName: 'Azure Reserved Instances', quantity: 500, consumed: 480, consumedPercent: 96, status: 'Active' },
        { id: 'me3', productName: 'Power BI Pro', quantity: 300, consumed: 285, consumedPercent: 95, status: 'Active' },
    ],
    contracts: [
        {
            id: 'mc1',
            contractNumber: 'EA-2022-MS-001',
            poNumber: 'PO-MS-12345',
            tcv: 4200000,
            acv: 1400000,
            renewalDate: '2025-06-30',
            description: 'Microsoft Enterprise Agreement - 3 Year',
            businessUnit: 'Enterprise IT',
            status: 'Active',
            startDate: '2022-07-01',
            endDate: '2025-06-30',
        },
    ],
    products: [
        {
            id: 'mp1',
            productName: 'Microsoft 365 E5',
            infrastructure: 'Cloud',
            serviceLevelObjectives: '99.9% uptime SLA, 24/7 support',
            dataClassification: 'Confidential',
            status: 'Active',
        },
        {
            id: 'mp2',
            productName: 'Microsoft Azure',
            infrastructure: 'Cloud',
            serviceLevelObjectives: '99.99% availability for premium tier',
            dataClassification: 'Highly Confidential',
            status: 'Active',
        },
    ],
    publisherContacts: [
        { id: 'mpc1', name: 'John Smith', role: 'Enterprise Account Manager', email: 'john.smith@microsoft.com' },
        { id: 'mpc2', name: 'Jane Doe', role: 'Technical Solutions Specialist', email: 'jane.doe@microsoft.com' },
    ],
    internalContacts: [
        { id: 'mic1', name: 'Chris Johnson', role: 'M365 Administrator', email: 'chris.johnson@enterprise.com', team: 'IT' },
        { id: 'mic2', name: 'Pat Williams', role: 'Azure Architect', email: 'pat.williams@enterprise.com', team: 'IT' },
    ],
    stakeholders: [
        { id: 'ms1', name: 'Alex Turner', orgBU: 'IT / Infrastructure', role: 'CIO', influence: 'High', notes: 'Executive sponsor for cloud transformation' },
    ],
};

// Map of all publisher data
export const publisherDataMap: Record<string, Publisher360Data> = {
    oracle: oracleData,
    microsoft: microsoftData,
};

// Helper function to get publisher data
export function getPublisher360Data(publisherId: string): Publisher360Data | null {
    return publisherDataMap[publisherId] || null;
}

// Helper to format currency
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

// Helper to format date
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
