import {
  BASIC_DEDUCTION_INCOME_TAX,
  BASIC_DEDUCTION_RESIDENT_TAX,
  getEmploymentDeduction,
  getIncomeTax,
  getTaxBracketLabel,
  RESIDENT_TAX_FLAT,
  RESIDENT_TAX_RATE,
  SOCIAL_INSURANCE,
} from "@/data/tax-params-2026";

export interface TakeHomePayResult {
  annualIncome: number;
  monthlyIncome: number;
  incomeTax: number;
  residentTax: number;
  healthInsurance: number;
  pensionInsurance: number;
  employmentInsurance: number;
  totalDeductions: number;
  annualTakeHome: number;
  monthlyTakeHome: number;
  deductionRate: number;
  breakdown: {
    basicDeduction: number;
    employmentDeduction: number;
    socialInsuranceDeduction: number;
    taxableIncome: number;
    taxBracket: string;
  };
}

/**
 * 年収から手取りを計算（独身・扶養なし・東京都・2026年税制）
 * @param annualIncomeMan 年収（万円）
 */
export function calculateTakeHomePay(annualIncomeMan: number): TakeHomePayResult {
  const annualIncome = annualIncomeMan * 10_000;
  const monthlyIncome = annualIncome / 12;

  // 社会保険料（年額）
  const monthlyHealth = monthlyIncome * SOCIAL_INSURANCE.healthInsuranceRate;
  const cappedMonthly = Math.min(monthlyIncome, SOCIAL_INSURANCE.pensionMonthlyCap);
  const monthlyPension = cappedMonthly * SOCIAL_INSURANCE.pensionRate;
  const monthlyEmployment = monthlyIncome * SOCIAL_INSURANCE.employmentInsuranceRate;

  const healthInsurance = Math.round(monthlyHealth * 12);
  const pensionInsurance = Math.round(monthlyPension * 12);
  const employmentInsurance = Math.round(monthlyEmployment * 12);
  const socialInsuranceTotal = healthInsurance + pensionInsurance + employmentInsurance;

  // 給与所得控除
  const employmentDeduction = getEmploymentDeduction(annualIncome);

  // 所得税
  const taxableIncome = Math.max(
    0,
    annualIncome - employmentDeduction - BASIC_DEDUCTION_INCOME_TAX - socialInsuranceTotal
  );
  const incomeTax = Math.round(getIncomeTax(taxableIncome));

  // 住民税
  const residentTaxableIncome = Math.max(
    0,
    annualIncome - employmentDeduction - BASIC_DEDUCTION_RESIDENT_TAX - socialInsuranceTotal
  );
  const residentTax = Math.max(
    RESIDENT_TAX_FLAT,
    Math.round(residentTaxableIncome * RESIDENT_TAX_RATE + RESIDENT_TAX_FLAT)
  );

  const totalDeductions = incomeTax + residentTax + socialInsuranceTotal;
  const annualTakeHome = annualIncome - totalDeductions;

  return {
    annualIncome,
    monthlyIncome: Math.round(monthlyIncome),
    incomeTax,
    residentTax,
    healthInsurance,
    pensionInsurance,
    employmentInsurance,
    totalDeductions,
    annualTakeHome,
    monthlyTakeHome: Math.round(annualTakeHome / 12),
    deductionRate: Math.round((totalDeductions / annualIncome) * 1000) / 10,
    breakdown: {
      basicDeduction: BASIC_DEDUCTION_INCOME_TAX,
      employmentDeduction: Math.round(employmentDeduction),
      socialInsuranceDeduction: socialInsuranceTotal,
      taxableIncome: Math.round(taxableIncome),
      taxBracket: getTaxBracketLabel(taxableIncome),
    },
  };
}

/** 全年収パターンの手取りデータを生成（100万〜2000万、50万刻み） */
export function generateAllTakeHomePayData(): TakeHomePayResult[] {
  const results: TakeHomePayResult[] = [];
  for (let income = 100; income <= 2000; income += 50) {
    results.push(calculateTakeHomePay(income));
  }
  return results;
}

/** 年収（万円）リストを生成 */
export function getAllIncomeValues(): number[] {
  const values: number[] = [];
  for (let i = 100; i <= 2000; i += 50) {
    values.push(i);
  }
  return values;
}
