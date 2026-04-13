import {
  generateAllTakeHomePayData,
  getAllIncomeValues,
  type TakeHomePayResult,
} from "@/lib/tax-calc";

/** 全年収パターンの手取りデータ（100万〜2000万、50万刻み） */
export const takeHomePayData: TakeHomePayResult[] = generateAllTakeHomePayData();

/** 年収（万円）でデータを検索 */
export function getTakeHomePayByIncome(
  incomeMan: number,
): TakeHomePayResult | undefined {
  return takeHomePayData.find(
    (d) => d.annualIncome === incomeMan * 10_000,
  );
}

/** 全年収値（万円）のリスト */
export const allIncomeValues: number[] = getAllIncomeValues();
