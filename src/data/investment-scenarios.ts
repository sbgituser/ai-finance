import {
  generateAllInvestmentScenarios,
  getScenariosByMonthly,
  MONTHLY_AMOUNTS,
  YEARS_LIST,
  RETURN_RATES,
  type InvestmentScenario,
} from "@/lib/investment-calc";

/** 全36シナリオ（ビルド時に1回だけ計算） */
export const allScenarios: InvestmentScenario[] = generateAllInvestmentScenarios();

/** ID → シナリオ のルックアップ */
const scenarioMap = new Map<string, InvestmentScenario>(
  allScenarios.map((s) => [s.id, s]),
);

export function getScenarioById(id: string): InvestmentScenario | undefined {
  return scenarioMap.get(id);
}

/** 月額ごとのシナリオ一覧 */
export function getScenariosForMonthly(amount: number): InvestmentScenario[] {
  return getScenariosByMonthly(amount);
}

/** 同じ月額のシナリオ（自分以外） */
export function getRelatedScenarios(scenario: InvestmentScenario): InvestmentScenario[] {
  return allScenarios.filter(
    (s) => s.monthlyAmount === scenario.monthlyAmount && s.id !== scenario.id,
  );
}

export { MONTHLY_AMOUNTS, YEARS_LIST, RETURN_RATES };
