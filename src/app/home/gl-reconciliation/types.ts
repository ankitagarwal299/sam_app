export interface LinkedTransaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    glCode: string;
    postedBy: string;
    deptCode: string;
    fiscalQuarter: string;
    fiscalPeriod: string;
    transactionType: string;
    poNumber?: string;
}

export interface AssetDepreciation {
    id: string;
    assetId: string;
    assetName: string;
    depreciationAmount: number;
    period: string;
    accumulatedDepreciation: number;
    netBookValue: number;
}

export interface QuarterlyData {
    actual: number;
    commit: number;
    forecast: number;
}

export interface YearlyPoFinancial {
    poNumber: string;
    vendor: string;
    project: string;
    department: string;
    quarters: {
        Q1: QuarterlyData;
        Q2: QuarterlyData;
        Q3: QuarterlyData;
        Q4: QuarterlyData;
    };
    totalAmount: number;
}

export interface GLReconciliationRecord {
    id: string;
    deptLevel2: string;
    deptLevel3: string;
    deptLevel4: string;
    deptLevel5: string;
    deptNumber: string;
    fiscalYear: string;
    fiscalQuarter: string;
    fiscalMonth: string;
    actualAmount: number;
    linkedTransactions: LinkedTransaction[];
    assetDepreciations: AssetDepreciation[];
    yearlyPoFinancials: YearlyPoFinancial[];
}
