/* ------------------------------------------------------------------ */
/*  生活費シミュレーター — 都市×世帯×年収 60パターン                   */
/*  出典: 総務省 家計調査 (https://www.stat.go.jp/data/kakei/)         */
/* ------------------------------------------------------------------ */

export interface MonthlyBudget {
  rent: number;
  food: number;
  utilities: number;
  transportation: number;
  communication: number;
  insurance: number;
  entertainment: number;
  savings: number;
  other: number;
}

export interface LivingCostModel {
  id: string;
  city: string;
  cityLabel: string;
  household: string;
  householdLabel: string;
  annualIncome: number; // 万円
  monthlyBudget: MonthlyBudget;
  totalMonthly: number;
  savingsRate: number; // %
  tips: string[];
}

/* ---------- 定数 ---------- */

export const cities = [
  { id: "tokyo", label: "東京" },
  { id: "osaka", label: "大阪" },
  { id: "nagoya", label: "名古屋" },
  { id: "fukuoka", label: "福岡" },
  { id: "sapporo", label: "札幌" },
] as const;

export const households = [
  { id: "single", label: "一人暮らし" },
  { id: "couple", label: "夫婦二人" },
  { id: "family-child1", label: "夫婦+子1人" },
  { id: "family-child2", label: "夫婦+子2人" },
] as const;

export const incomes = [300, 500, 700] as const;

export type CityId = (typeof cities)[number]["id"];
export type HouseholdId = (typeof households)[number]["id"];
export type IncomeLevel = (typeof incomes)[number];

/* ---------- 家賃ベース (万円 / 月) ---------- */
// 都市 × 世帯 の家賃目安（統計ベース概算）
const rentBase: Record<CityId, Record<HouseholdId, number>> = {
  tokyo:   { single: 75000, couple: 120000, "family-child1": 145000, "family-child2": 165000 },
  osaka:   { single: 55000, couple: 85000,  "family-child1": 105000, "family-child2": 120000 },
  nagoya:  { single: 52000, couple: 80000,  "family-child1": 100000, "family-child2": 115000 },
  fukuoka: { single: 48000, couple: 72000,  "family-child1": 90000,  "family-child2": 105000 },
  sapporo: { single: 42000, couple: 65000,  "family-child1": 82000,  "family-child2": 95000  },
};

/* ---------- 食費ベース ---------- */
const foodBase: Record<HouseholdId, number> = {
  single: 35000,
  couple: 55000,
  "family-child1": 70000,
  "family-child2": 85000,
};

/* ---------- 光熱費ベース ---------- */
const utilitiesBase: Record<HouseholdId, number> = {
  single: 10000,
  couple: 16000,
  "family-child1": 20000,
  "family-child2": 24000,
};

/* ---------- 交通費ベース ---------- */
const transportBase: Record<CityId, Record<HouseholdId, number>> = {
  tokyo:   { single: 12000, couple: 18000, "family-child1": 20000, "family-child2": 22000 },
  osaka:   { single: 10000, couple: 15000, "family-child1": 18000, "family-child2": 20000 },
  nagoya:  { single: 15000, couple: 22000, "family-child1": 25000, "family-child2": 28000 },
  fukuoka: { single: 12000, couple: 18000, "family-child1": 22000, "family-child2": 25000 },
  sapporo: { single: 10000, couple: 16000, "family-child1": 20000, "family-child2": 23000 },
};

/* ---------- 通信費ベース ---------- */
const commBase: Record<HouseholdId, number> = {
  single: 8000,
  couple: 12000,
  "family-child1": 14000,
  "family-child2": 16000,
};

/* ---------- 保険料ベース ---------- */
const insuranceBase: Record<HouseholdId, number> = {
  single: 5000,
  couple: 12000,
  "family-child1": 18000,
  "family-child2": 22000,
};

/* ---------- 娯楽費ベース ---------- */
const entertainmentBase: Record<HouseholdId, number> = {
  single: 20000,
  couple: 25000,
  "family-child1": 22000,
  "family-child2": 20000,
};

/* ---------- 年収による補正 ---------- */
// 年収が高いほど食費・娯楽は増加、家賃も若干上がる
function incomeMultiplier(income: IncomeLevel): { rent: number; food: number; entertainment: number; other: number } {
  switch (income) {
    case 300: return { rent: 0.9, food: 0.9, entertainment: 0.8, other: 0.85 };
    case 500: return { rent: 1.0, food: 1.0, entertainment: 1.0, other: 1.0 };
    case 700: return { rent: 1.15, food: 1.1, entertainment: 1.3, other: 1.2 };
  }
}

/* ---------- 貯蓄率目安 ---------- */
function targetSavingsRate(income: IncomeLevel, household: HouseholdId): number {
  const base: Record<IncomeLevel, number> = { 300: 8, 500: 15, 700: 22 };
  const adj: Record<HouseholdId, number> = {
    single: 3,
    couple: 0,
    "family-child1": -3,
    "family-child2": -5,
  };
  return Math.max(3, base[income] + adj[household]);
}

/* ---------- 節約Tips ---------- */
const tipsByCity: Record<CityId, string[]> = {
  tokyo: [
    "家賃は手取りの30%以内に抑えましょう。23区外や埼玉・千葉も検討を。",
    "都営・メトロの定期券割引やバス乗り換え割引を活用しましょう。",
    "スーパーの閉店前セールや業務スーパーの活用で食費を削減できます。",
  ],
  osaka: [
    "大阪は東京より家賃相場が2〜3割安め。その分を貯蓄に回しましょう。",
    "商店街やスーパー玉出など格安店を活用すると食費を大幅に削減できます。",
    "PiTaPa のマイスタイル機能で通勤交通費を最適化しましょう。",
  ],
  nagoya: [
    "名古屋は車社会。維持費を含めた交通費の見直しが節約の鍵です。",
    "郊外の大型ショッピングモールでまとめ買いが食費節約に効果的です。",
    "駐車場付き物件を選ぶと別途駐車場代を節約できます。",
  ],
  fukuoka: [
    "福岡は主要都市の中でも家賃が安め。コスパの高い生活が可能です。",
    "天神・博多エリア以外なら家賃をさらに抑えられます。",
    "地元の新鮮な食材が安く手に入るため、自炊で食費を大幅に節約できます。",
  ],
  sapporo: [
    "冬の暖房費が大きな支出。断熱性の高い物件選びが重要です。",
    "灯油代は10月に早めにまとめ買いすると割安になります。",
    "札幌は夏涼しいのでエアコン不要の物件も多く、夏の光熱費を抑えられます。",
  ],
};

const tipsByHousehold: Record<HouseholdId, string[]> = {
  single: [
    "一人暮らしは固定費の見直しが最も効果的。格安SIMで通信費を半額に。",
    "ふるさと納税を活用すると実質的な食費削減になります。",
    "サブスク契約を定期的に見直し、使っていないサービスを解約しましょう。",
  ],
  couple: [
    "共働きの場合、それぞれiDeCoやNISAを活用して税制優遇を最大化しましょう。",
    "食費は週に一度のまとめ買い＋作り置きで無駄を減らせます。",
    "保険は夫婦で重複する保障がないか見直しましょう。",
  ],
  "family-child1": [
    "子育て世帯向けの自治体助成制度（医療費・保育料）を確認しましょう。",
    "学資保険よりもジュニアNISAや新NISAの方が運用効率が良い場合があります。",
    "子ども服やベビー用品はフリマアプリやリサイクルショップを活用しましょう。",
  ],
  "family-child2": [
    "子ども2人の教育費は早めの準備が重要。新NISAで積立投資を始めましょう。",
    "多子世帯向けの割引制度（JR運賃・自治体サービス）を積極的に利用しましょう。",
    "食費は生協の宅配やコストコのまとめ買いで単価を下げられます。",
  ],
};

/* ---------- モデル生成 ---------- */

function buildModel(
  cityId: CityId,
  householdId: HouseholdId,
  income: IncomeLevel,
): LivingCostModel {
  const cityObj = cities.find((c) => c.id === cityId)!;
  const hhObj = households.find((h) => h.id === householdId)!;
  const mul = incomeMultiplier(income);

  const monthlyNet = Math.round((income * 10000 * 0.78) / 12); // 概算手取り月額
  const savingsRate = targetSavingsRate(income, householdId);
  const savingsAmount = Math.round(monthlyNet * savingsRate / 100);

  const rent = Math.round(rentBase[cityId][householdId] * mul.rent);
  const food = Math.round(foodBase[householdId] * mul.food);
  const utilities = utilitiesBase[householdId];
  const transportation = transportBase[cityId][householdId];
  const communication = commBase[householdId];
  const insurance = insuranceBase[householdId];
  const entertainment = Math.round(entertainmentBase[householdId] * mul.entertainment);

  const subtotal = rent + food + utilities + transportation + communication + insurance + entertainment + savingsAmount;
  const other = Math.max(5000, monthlyNet - subtotal);
  const totalMonthly = rent + food + utilities + transportation + communication + insurance + entertainment + savingsAmount + other;

  // Pick tips: 1 city-specific, 1 household-specific, 1 general
  const tips = [
    tipsByCity[cityId][income === 300 ? 0 : income === 500 ? 1 : 2],
    tipsByHousehold[householdId][income === 300 ? 0 : income === 500 ? 1 : 2],
    `月${savingsAmount.toLocaleString("ja-JP")}円（貯蓄率${savingsRate}%）の先取り貯蓄を自動振替で習慣化しましょう。`,
  ];

  return {
    id: `${cityId}-${householdId}-${income}`,
    city: cityId,
    cityLabel: cityObj.label,
    household: householdId,
    householdLabel: hhObj.label,
    annualIncome: income,
    monthlyBudget: {
      rent,
      food,
      utilities,
      transportation,
      communication,
      insurance,
      entertainment,
      savings: savingsAmount,
      other,
    },
    totalMonthly,
    savingsRate,
    tips,
  };
}

/* ---------- 全60モデル ---------- */

export const allLivingCostModels: LivingCostModel[] = cities.flatMap((c) =>
  households.flatMap((h) => incomes.map((i) => buildModel(c.id, h.id, i))),
);

/* ---------- ルックアップ ---------- */

export function getLivingCostById(id: string): LivingCostModel | undefined {
  return allLivingCostModels.find((m) => m.id === id);
}

export function getLivingCostsByCity(cityId: string): LivingCostModel[] {
  return allLivingCostModels.filter((m) => m.city === cityId);
}

export function getLivingCostsByHousehold(householdId: string): LivingCostModel[] {
  return allLivingCostModels.filter((m) => m.household === householdId);
}

export function getCityLabel(cityId: string): string {
  return cities.find((c) => c.id === cityId)?.label ?? cityId;
}

export function getHouseholdLabel(householdId: string): string {
  return households.find((h) => h.id === householdId)?.label ?? householdId;
}
