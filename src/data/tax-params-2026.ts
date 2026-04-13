// 2026年4月時点の税制パラメータ
// 出典: 国税庁・厚生労働省

/** 基礎控除（所得税） - 2026年改定: 48万→58万 */
export const BASIC_DEDUCTION_INCOME_TAX = 580_000;

/** 基礎控除（住民税） - 2026年改定: 43万→53万 */
export const BASIC_DEDUCTION_RESIDENT_TAX = 530_000;

/** 給与所得控除テーブル */
export function getEmploymentDeduction(annualIncome: number): number {
  if (annualIncome <= 1_625_000) return 550_000;
  if (annualIncome <= 1_800_000) return annualIncome * 0.4 - 100_000;
  if (annualIncome <= 3_600_000) return annualIncome * 0.3 + 80_000;
  if (annualIncome <= 6_600_000) return annualIncome * 0.2 + 440_000;
  if (annualIncome <= 8_500_000) return annualIncome * 0.1 + 1_100_000;
  return 1_950_000;
}

/** 所得税率（超過累進税率） */
export function getIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  let tax: number;
  if (taxableIncome <= 1_950_000) {
    tax = taxableIncome * 0.05;
  } else if (taxableIncome <= 3_300_000) {
    tax = taxableIncome * 0.10 - 97_500;
  } else if (taxableIncome <= 6_950_000) {
    tax = taxableIncome * 0.20 - 427_500;
  } else if (taxableIncome <= 9_000_000) {
    tax = taxableIncome * 0.23 - 636_000;
  } else if (taxableIncome <= 18_000_000) {
    tax = taxableIncome * 0.33 - 1_536_000;
  } else if (taxableIncome <= 40_000_000) {
    tax = taxableIncome * 0.40 - 2_796_000;
  } else {
    tax = taxableIncome * 0.45 - 4_796_000;
  }
  return Math.max(0, tax) * 1.021; // 復興特別所得税 2.1%
}

/** 税率帯の名称を取得 */
export function getTaxBracketLabel(taxableIncome: number): string {
  if (taxableIncome <= 1_950_000) return "5%";
  if (taxableIncome <= 3_300_000) return "10%";
  if (taxableIncome <= 6_950_000) return "20%";
  if (taxableIncome <= 9_000_000) return "23%";
  if (taxableIncome <= 18_000_000) return "33%";
  if (taxableIncome <= 40_000_000) return "40%";
  return "45%";
}

/** 住民税率（均等割 + 所得割 10%） */
export const RESIDENT_TAX_FLAT = 5_000; // 均等割（市区町村+都道府県）
export const RESIDENT_TAX_RATE = 0.10;

/** 社会保険料率（2026年度、本人負担分） */
export const SOCIAL_INSURANCE = {
  /** 健康保険料率（協会けんぽ 東京都、本人負担） */
  healthInsuranceRate: 0.04990,
  /** 介護保険料率（40歳以上、本人負担） */
  nursingInsuranceRate: 0.00910,
  /** 厚生年金保険料率（本人負担） */
  pensionRate: 0.09150,
  /** 厚生年金 標準報酬月額上限 */
  pensionMonthlyCap: 650_000,
  /** 雇用保険料率（一般事業、本人負担）2026年度 */
  employmentInsuranceRate: 0.006,
};

/** 年収の壁 閾値（2026年4月改定後） */
export const INCOME_WALLS = {
  /** 所得税非課税ライン（基礎控除+給与所得控除の最低額）: 103万→160万に引き上げ */
  taxFree: 1_600_000,
  /** 社会保険適用拡大（従業員51人以上企業） */
  socialInsurance106: 1_060_000,
  /** 配偶者の社会保険扶養ライン */
  dependentInsurance130: 1_300_000,
  /** 配偶者特別控除 満額ライン */
  spouseDeductionFull: 1_500_000,
  /** 新・基礎控除上限ライン */
  newBasicDeduction: 1_600_000,
  /** 配偶者特別控除 上限 */
  spouseDeductionMax: 2_010_000,
};
