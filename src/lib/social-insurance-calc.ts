import { INCOME_WALLS } from "@/data/tax-params-2026";

export interface IncomeWallData {
  id: string;
  threshold: number;
  title: string;
  category: "tax" | "social-insurance" | "spouse";
  description: string;
  beforeReform: { threshold: number; impact: string };
  afterReform: { threshold: number; impact: string; effectiveDate: string };
  affectedPersons: string[];
  simulationParams: {
    workingHoursPerWeek: number[];
    hourlyWageRange: [number, number];
  };
  relatedWalls: string[];
  seoKeywords: string[];
}

export const incomeWalls: IncomeWallData[] = [
  {
    id: "103man",
    threshold: 103,
    title: "103万円の壁（2026年改定: 160万円）",
    category: "tax",
    description:
      "103万円の壁は、所得税がかかり始める年収ラインです。基礎控除（48万円）と給与所得控除の最低額（55万円）の合計が103万円であるため、年収103万円以下であれば所得税が非課税となっていました。2026年4月の税制改正により、基礎控除が48万円から58万円に引き上げられ、非課税ラインは160万円に拡大されます。これにより、パートやアルバイトで働く方がより多く稼いでも所得税がかからなくなります。",
    beforeReform: {
      threshold: 1_030_000,
      impact: "年収103万円を超えると所得税が発生。パート・アルバイトの就業調整の原因に。",
    },
    afterReform: {
      threshold: INCOME_WALLS.taxFree,
      impact: "非課税ラインが160万円に拡大。年間約57万円多く稼いでも所得税ゼロ。",
      effectiveDate: "2026年4月1日",
    },
    affectedPersons: ["パート主婦", "学生アルバイト", "副業会社員"],
    simulationParams: {
      workingHoursPerWeek: [10, 15, 20, 25, 30],
      hourlyWageRange: [1050, 1500],
    },
    relatedWalls: ["106man", "130man", "160man"],
    seoKeywords: ["103万の壁", "103万円の壁 改正", "103万の壁 2026", "所得税 非課税"],
  },
  {
    id: "106man",
    threshold: 106,
    title: "106万円の壁（社会保険の適用拡大）",
    category: "social-insurance",
    description:
      "106万円の壁は、一定の条件を満たすパート・アルバイトに社会保険（厚生年金・健康保険）の加入義務が生じるラインです。従業員51人以上の企業で、週20時間以上勤務、月額賃金8.8万円以上（年収約106万円）、2ヶ月以上の雇用見込みがある場合に適用されます。社会保険に加入すると手取りは減りますが、将来の年金額が増え、傷病手当金や出産手当金を受けられるメリットもあります。",
    beforeReform: {
      threshold: 1_060_000,
      impact: "従業員101人以上の企業で適用。月額賃金8.8万円以上が対象。",
    },
    afterReform: {
      threshold: 1_060_000,
      impact: "従業員51人以上の企業に拡大。より多くのパート労働者が対象に。",
      effectiveDate: "2024年10月（既に施行済み）",
    },
    affectedPersons: ["パート主婦", "学生アルバイト"],
    simulationParams: {
      workingHoursPerWeek: [20, 25, 30],
      hourlyWageRange: [1050, 1500],
    },
    relatedWalls: ["103man", "130man"],
    seoKeywords: ["106万の壁", "社会保険 パート", "106万円の壁 2026", "社会保険 適用拡大"],
  },
  {
    id: "130man",
    threshold: 130,
    title: "130万円の壁（配偶者の社会保険扶養）",
    category: "social-insurance",
    description:
      "130万円の壁は、配偶者の社会保険（健康保険）の扶養から外れるラインです。年収が130万円以上になると、自分で国民健康保険・国民年金に加入するか、勤務先の社会保険に加入する必要があります。扶養から外れると年間約20〜30万円の社会保険料が自己負担となるため、手取りが大幅に減少する「逆転現象」が起きることがあります。",
    beforeReform: {
      threshold: 1_300_000,
      impact: "年収130万円以上で配偶者の社会保険扶養から外れる。",
    },
    afterReform: {
      threshold: 1_300_000,
      impact: "閾値は変更なし。ただし繁忙期の一時的な超過は事業主の証明で扶養維持可能に。",
      effectiveDate: "2023年10月〜（時限措置を継続）",
    },
    affectedPersons: ["パート主婦", "副業会社員"],
    simulationParams: {
      workingHoursPerWeek: [20, 25, 30, 35],
      hourlyWageRange: [1050, 1800],
    },
    relatedWalls: ["106man", "150man"],
    seoKeywords: ["130万の壁", "扶養 いくらまで", "130万円の壁 2026", "社会保険 扶養"],
  },
  {
    id: "150man",
    threshold: 150,
    title: "150万円の壁（配偶者特別控除の満額ライン）",
    category: "spouse",
    description:
      "150万円の壁は、配偶者特別控除が満額（38万円）受けられる上限ラインです。配偶者の年収が150万円以下であれば、扶養する側（主に夫）が38万円の配偶者特別控除を受けられます。150万円を超えると控除額が段階的に減少し、201万円で完全にゼロになります。控除が減ると扶養者側の所得税・住民税が増加します。",
    beforeReform: {
      threshold: 1_500_000,
      impact: "配偶者の年収150万円以下で配偶者特別控除38万円が満額適用。",
    },
    afterReform: {
      threshold: 1_500_000,
      impact: "閾値は変更なし。基礎控除引き上げとの併用で実質的な手取り増効果あり。",
      effectiveDate: "変更なし",
    },
    affectedPersons: ["パート主婦"],
    simulationParams: {
      workingHoursPerWeek: [25, 30, 35],
      hourlyWageRange: [1050, 1800],
    },
    relatedWalls: ["130man", "160man", "201man"],
    seoKeywords: ["150万の壁", "配偶者特別控除", "150万円の壁", "配偶者控除 いくらまで"],
  },
  {
    id: "160man",
    threshold: 160,
    title: "160万円の壁（新・所得税非課税ライン）",
    category: "tax",
    description:
      "160万円の壁は、2026年4月の税制改正で新たに生まれるラインです。基礎控除が48万円から58万円に引き上げられることで、給与所得控除の最低額55万円と合わせた非課税ラインが103万円から160万円に拡大します（特定親族控除等の適用を含む）。これにより、パートやアルバイトの「働き控え」が大幅に緩和されると期待されています。",
    beforeReform: {
      threshold: 1_030_000,
      impact: "（旧103万円の壁）基礎控除48万円+給与所得控除55万円=103万円が非課税ライン。",
    },
    afterReform: {
      threshold: INCOME_WALLS.newBasicDeduction,
      impact: "基礎控除58万円+給与所得控除55万円+特定親族控除等=160万円が新たな非課税ライン。",
      effectiveDate: "2026年4月1日",
    },
    affectedPersons: ["パート主婦", "学生アルバイト", "副業会社員"],
    simulationParams: {
      workingHoursPerWeek: [20, 25, 30, 35],
      hourlyWageRange: [1050, 1800],
    },
    relatedWalls: ["103man", "130man", "150man"],
    seoKeywords: ["160万の壁", "160万円の壁 いつから", "年収の壁 2026 改正", "基礎控除 引き上げ"],
  },
  {
    id: "201man",
    threshold: 201,
    title: "201万円の壁（配偶者特別控除の上限）",
    category: "spouse",
    description:
      "201万円の壁は、配偶者特別控除が完全にゼロになるラインです。配偶者の年収が201万円を超えると、扶養する側は配偶者特別控除を一切受けられなくなります。150万円超〜201万円の間は段階的に控除額が減少します。なお、扶養する側の合計所得金額が1,000万円を超える場合は、配偶者特別控除は適用されません。",
    beforeReform: {
      threshold: 2_010_000,
      impact: "年収201万円超で配偶者特別控除がゼロに。",
    },
    afterReform: {
      threshold: 2_010_000,
      impact: "閾値は変更なし。税制改正による直接的な影響はないが、他の壁との組み合わせで考慮が必要。",
      effectiveDate: "変更なし",
    },
    affectedPersons: ["パート主婦"],
    simulationParams: {
      workingHoursPerWeek: [30, 35, 40],
      hourlyWageRange: [1200, 2000],
    },
    relatedWalls: ["150man", "160man"],
    seoKeywords: ["201万の壁", "配偶者特別控除 上限", "201万円の壁", "年収の壁 一覧"],
  },
];

/** 時給と週勤務時間から年収を計算 */
export function calcAnnualFromHourly(hourlyWage: number, hoursPerWeek: number): number {
  return Math.round(hourlyWage * hoursPerWeek * 52);
}

/** 年収がどの壁に該当するか判定 */
export function checkIncomeWalls(annualIncome: number): {
  wallId: string;
  title: string;
  exceeded: boolean;
  threshold: number;
}[] {
  return incomeWalls.map((wall) => ({
    wallId: wall.id,
    title: wall.title,
    exceeded: annualIncome >= wall.beforeReform.threshold,
    threshold: wall.beforeReform.threshold,
  }));
}

/** 対象者タイプ別の壁フィルタ */
export const personTypeMap: Record<string, { label: string; wallIds: string[] }> = {
  part: {
    label: "パート・主婦(夫)",
    wallIds: ["103man", "106man", "130man", "150man", "160man", "201man"],
  },
  student: {
    label: "学生アルバイト",
    wallIds: ["103man", "106man", "130man", "160man"],
  },
  sidejob: {
    label: "副業会社員",
    wallIds: ["103man", "130man", "160man"],
  },
};
