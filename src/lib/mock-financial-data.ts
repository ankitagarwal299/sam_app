/**
 * Utility to generate deterministic mock financial data based on PO ID.
 * This ensures that the same PO ID always gets the same data.
 */

export interface MonthlyForecast {
    id: string;
    poId: string;
    year: number;
    month: number;
    quarter: number;
    fiscalYear: string;
    period: string;
    periodLabel: string;
    forecastAmount: number;
    actualAmount: number | null;
    commitAmount: number;
    variance: number;
    status: 'locked' | 'draft';
    basis: 'approved' | 'auto';
    lastModified: string;
    modifiedBy: string;
}

export interface QuarterData {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
}

export interface POFinancials {
    poNumber: string;
    forecast: Record<string, QuarterData>;
    commit: Record<string, QuarterData>;
    actuals: Record<string, QuarterData>;
    liability: Record<string, QuarterData>;
    uplift: {
        price: number;
        volume: number;
        expansion: number;
    };
    monthlyData: MonthlyForecast[];
}

const QUARTERS = ['2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3', '2026-Q4'];

// Simple hash function to get a seed from the PO ID
const getSeedFromPOId = (poId: string) => {
    let hash = 0;
    for (let i = 0; i < poId.length; i++) {
        const char = poId.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

export const generatePOFinancials = (poId: string): POFinancials => {
    const seed = getSeedFromPOId(poId);

    // Use the seed to generate base amounts
    const baseAmount = (seed % 500000) + 100000; // Between 100k and 600k
    const monthlyAmount = baseAmount / 12;

    const monthlyData: MonthlyForecast[] = [];
    const startDate = new Date('2025-08-01');

    for (let i = 0; i < 72; i++) {
        const currentDate = new Date(startDate);
        currentDate.setMonth(startDate.getMonth() + i);

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        // Calculate Fiscal Year (Starts in August)
        const fiscalYearNum = month >= 8 ? year + 1 : year;
        const fiscalYear = `FY${fiscalYearNum.toString().slice(2)}`;

        // Calculate Fiscal Quarter (Aug-Oct=Q1, Nov-Jan=Q2, Feb-Apr=Q3, May-Jul=Q4)
        const fiscalMonthIndex = (month + 12 - 8) % 12;
        const quarter = Math.floor(fiscalMonthIndex / 3) + 1;

        // Deterministic variance for each month
        const monthVariance = ((seed + i) % 1000) - 500;

        monthlyData.push({
            id: `${poId}-${i.toString().padStart(3, '0')}`,
            poId,
            year,
            month,
            quarter,
            fiscalYear,
            period: `${year}-${month.toString().padStart(2, '0')}`,
            periodLabel: currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
            forecastAmount: monthlyAmount + monthVariance,
            actualAmount: i < 6 ? monthlyAmount + monthVariance + ((seed % 200) - 100) : null,
            commitAmount: monthlyAmount * 0.95 + (monthVariance * 0.8),
            variance: i < 6 ? (seed % 10) - 5 : 0,
            status: i < 6 ? 'locked' : 'draft',
            basis: i < 36 ? 'approved' : 'auto',
            lastModified: new Date().toISOString(),
            modifiedBy: 'system'
        });
    }

    // Helper to aggregate monthly data into quarters
    const aggregateToQuarters = (key: 'forecastAmount' | 'commitAmount' | 'actualAmount') => {
        const result: Record<string, QuarterData> = {};
        monthlyData.forEach(m => {
            if (!result[m.fiscalYear]) {
                result[m.fiscalYear] = { q1: 0, q2: 0, q3: 0, q4: 0 };
            }
            const val = m[key] || 0;
            if (m.quarter === 1) result[m.fiscalYear].q1 += val;
            else if (m.quarter === 2) result[m.fiscalYear].q2 += val;
            else if (m.quarter === 3) result[m.fiscalYear].q3 += val;
            else if (m.quarter === 4) result[m.fiscalYear].q4 += val;
        });
        return result;
    };

    return {
        poNumber: poId,
        forecast: aggregateToQuarters('forecastAmount'),
        commit: aggregateToQuarters('commitAmount'),
        actuals: aggregateToQuarters('actualAmount'),
        liability: aggregateToQuarters('forecastAmount'), // Simplified for now
        uplift: {
            price: (seed % 5) + 2,
            volume: (seed % 3) + 1,
            expansion: (seed % 4),
        },
        monthlyData
    };
};

export const getQuartersList = () => QUARTERS;
