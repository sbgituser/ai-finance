export {
  incomeWalls,
  calcAnnualFromHourly,
  checkIncomeWalls,
  personTypeMap,
  type IncomeWallData,
} from "@/lib/social-insurance-calc";

import { incomeWalls, type IncomeWallData } from "@/lib/social-insurance-calc";

/** ID で壁を1件取得。見つからなければ undefined */
export function getWallById(id: string): IncomeWallData | undefined {
  return incomeWalls.find((w) => w.id === id);
}

/** ID 配列に該当する壁だけ返す（順序維持） */
export function getWallsByIds(ids: string[]): IncomeWallData[] {
  return ids.map((id) => incomeWalls.find((w) => w.id === id)).filter(Boolean) as IncomeWallData[];
}

/** カテゴリ日本語ラベル */
export const categoryLabel: Record<IncomeWallData["category"], string> = {
  tax: "税金",
  "social-insurance": "社会保険",
  spouse: "配偶者控除",
};

/** カテゴリ別の badge 色 */
export const categoryColor: Record<IncomeWallData["category"], string> = {
  tax: "bg-blue-100 text-blue-700",
  "social-insurance": "bg-purple-100 text-purple-700",
  spouse: "bg-pink-100 text-pink-700",
};
