export interface YearlyData {
  year: number;
  invested: number;
  value: number;
  profit: number;
}

export interface InvestmentScenario {
  id: string;
  monthlyAmount: number;
  years: number;
  annualReturn: number;
  totalInvestment: number;
  estimatedValue: number;
  totalReturn: number;
  returnRate: number;
  yearlyBreakdown: YearlyData[];
}

/**
 * 積立投資の複利計算
 * @param monthlyAmountMan 月額（万円）
 * @param years 積立年数
 * @param annualReturnPct 年利（%）
 */
export function calculateInvestment(
  monthlyAmountMan: number,
  years: number,
  annualReturnPct: number
): InvestmentScenario {
  const monthlyAmount = monthlyAmountMan * 10_000;
  const monthlyRate = annualReturnPct / 100 / 12;
  const yearlyBreakdown: YearlyData[] = [];

  let currentValue = 0;
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      currentValue = (currentValue + monthlyAmount) * (1 + monthlyRate);
    }
    const invested = monthlyAmount * 12 * y;
    yearlyBreakdown.push({
      year: y,
      invested,
      value: Math.round(currentValue),
      profit: Math.round(currentValue - invested),
    });
  }

  const totalInvestment = monthlyAmount * 12 * years;
  const estimatedValue = Math.round(currentValue);
  const totalReturn = estimatedValue - totalInvestment;
  const returnRate = Math.round((totalReturn / totalInvestment) * 1000) / 10;

  const id = `monthly-${monthlyAmountMan}man-${years}year-${annualReturnPct}pct`;

  return {
    id,
    monthlyAmount: monthlyAmountMan,
    years,
    annualReturn: annualReturnPct,
    totalInvestment,
    estimatedValue,
    totalReturn,
    returnRate,
    yearlyBreakdown,
  };
}

/** 全パターン生成 */
export function generateAllInvestmentScenarios(): InvestmentScenario[] {
  const monthlyAmounts = [1, 3, 5, 10];
  const yearsList = [10, 20, 30];
  const returns = [3, 5, 7];
  const scenarios: InvestmentScenario[] = [];

  for (const m of monthlyAmounts) {
    for (const y of yearsList) {
      for (const r of returns) {
        scenarios.push(calculateInvestment(m, y, r));
      }
    }
  }
  return scenarios;
}

/** 月額別にシナリオをグルーピング */
export function getScenariosByMonthly(amount: number): InvestmentScenario[] {
  return generateAllInvestmentScenarios().filter((s) => s.monthlyAmount === amount);
}

export const MONTHLY_AMOUNTS = [1, 3, 5, 10];
export const YEARS_LIST = [10, 20, 30];
export const RETURN_RATES = [3, 5, 7];
