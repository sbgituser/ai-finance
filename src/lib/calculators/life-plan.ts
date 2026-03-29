// Cost estimates based on Japanese public data (MEXT, MLIT, Ministry of Internal Affairs)
const MARRIAGE_COSTS: Record<string, number> = {
  "なし": 0,
  "1〜3年以内": 4500000,
  "3〜5年以内": 4500000,
  "5年以上先": 4500000,
};

const CHILDREN_EDUCATION_COSTS: Record<string, number> = {
  "0人": 0,
  "1人": 12000000,
  "2人": 24000000,
  "3人以上": 36000000,
};

const HOUSE_COSTS: Record<string, number> = {
  "なし（賃貸）": 0,
  "5年以内": 35000000,
  "5〜10年以内": 35000000,
  "10年以上先": 35000000,
};

const CAR_COSTS: Record<string, number> = {
  "なし": 0,
  "3年以内": 3000000,
  "3〜7年以内": 3000000,
  "7年以上先": 3000000,
};

const RETIREMENT_FUND_NEEDED = 20000000; // 2,000万円（老後の自己負担分の目安）

export function calculateLifePlan(values: Record<string, number | string>) {
  const currentAge = Number(values.currentAge) || 30;
  const currentSavings = Number(values.currentSavings) || 0;
  const marriage = String(values.marriage || "なし");
  const children = String(values.children || "0人");
  const house = String(values.house || "なし（賃貸）");
  const car = String(values.car || "なし");

  const marriageCost = MARRIAGE_COSTS[marriage] ?? 0;
  const educationCost = CHILDREN_EDUCATION_COSTS[children] ?? 0;
  const houseCost = HOUSE_COSTS[house] ?? 0;
  const carCost = CAR_COSTS[car] ?? 0;

  const totalEventCost = marriageCost + educationCost + houseCost + carCost;

  const yearsTo65 = Math.max(1, 65 - currentAge);
  const totalNeeded = totalEventCost + RETIREMENT_FUND_NEEDED;
  const shortfall = Math.max(0, totalNeeded - currentSavings);
  const annualSavingsNeeded = Math.round(shortfall / yearsTo65);

  // Estimate assets at 65 assuming current savings + annual savings needed invested at 0% (conservative)
  const estimatedAssets65 = currentSavings + annualSavingsNeeded * yearsTo65;

  // Gap vs total needed
  const gap = estimatedAssets65 - totalNeeded;

  const fmt = (n: number) => Math.round(n).toLocaleString("ja-JP");
  const fmtSigned = (n: number) => {
    const abs = Math.abs(Math.round(n)).toLocaleString("ja-JP");
    return n >= 0 ? `+${abs}（余裕あり）` : `-${abs}（不足）`;
  };

  return {
    totalEventCost: fmt(totalEventCost),
    educationCost: fmt(educationCost),
    annualSavingsNeeded: fmt(annualSavingsNeeded),
    estimatedAssets65: fmt(estimatedAssets65),
    gap: fmtSigned(gap),
  };
}
