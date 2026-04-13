import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import { faqSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import {
  cities,
  households,
  incomes,
  getHouseholdLabel,
  getLivingCostsByHousehold,
} from "@/data/living-cost";

export async function generateStaticParams() {
  return households.map((h) => ({ type: h.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const label = getHouseholdLabel(type);
  if (label === type) return {};
  return buildMetadata({
    title: `${label}の生活費モデル【都市別・年収別】`,
    description: `${label}世帯の生活費を東京・大阪・名古屋・福岡・札幌の5都市×年収別にシミュレーション。家賃・食費・貯蓄率の違いがひと目でわかります。`,
    path: `/tools/living-cost/household/${type}`,
  });
}

const householdAdvice: Record<string, string> = {
  single:
    "一人暮らしは固定費の最適化が貯蓄の鍵。格安SIM・電力自由化・サブスク整理の3つで月1〜2万円の節約が可能です。自炊の習慣化も食費削減に効果的です。",
  couple:
    "夫婦二人暮らしは共働きなら世帯年収でゆとりが生まれます。共有の家計簿アプリで支出を見える化し、それぞれがiDeCo・新NISAを活用して資産形成を始めましょう。",
  "family-child1":
    "子ども1人の世帯は教育費の準備が重要。児童手当（月1〜1.5万円）をそのまま新NISAで積み立てると、18歳時に約300〜400万円になり大学費用の土台になります。",
  "family-child2":
    "子ども2人の世帯は支出が最も多くなる時期の見通しが大切。第一子の大学入学時に第二子が高校生になるケースが多く、教育費のピークに備えた計画的な貯蓄が必要です。",
};

export default async function HouseholdSummaryPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const label = getHouseholdLabel(type);
  const models = getLivingCostsByHousehold(type);
  if (models.length === 0) notFound();

  const faqs = [
    {
      q: `${label}の月間生活費の平均はいくらですか？`,
      a: `${label}の月間生活費は都市や年収によって異なりますが、年収500万円モデルの全都市平均で約${Math.round(models.filter((m) => m.annualIncome === 500).reduce((s, m) => s + m.totalMonthly, 0) / 5).toLocaleString("ja-JP")}円が目安です。`,
    },
    {
      q: `${label}で最も大きな支出項目は何ですか？`,
      a: "どの都市でも家賃が最大の支出項目です。手取りの25〜30%以内に抑えることで、他の支出や貯蓄にゆとりが生まれます。",
    },
    {
      q: `${label}におすすめの節約方法は？`,
      a: householdAdvice[type] ?? "固定費の見直しと先取り貯蓄の習慣化が最も効果的です。",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "生活費シミュレーター", href: "/tools/living-cost" },
          { name: `${label}の生活費`, href: `/tools/living-cost/household/${type}` },
        ]}
      />

      <JsonLd data={faqSchema(faqs)} />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        {label}の生活費モデル【都市別・年収別】
      </h1>
      <p className="text-gray-500 mb-6">
        {label}世帯の生活費を、東京・大阪・名古屋・福岡・札幌の5都市と
        年収300万・500万・700万円の組み合わせでシミュレーションしました。
      </p>

      {/* Household advice */}
      {householdAdvice[type] && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-gray-700">
          <p className="font-medium mb-1">{label}世帯の家計ポイント</p>
          <p>{householdAdvice[type]}</p>
        </div>
      )}

      {/* Models grouped by city */}
      {cities.map((c) => {
        const group = models.filter((m) => m.city === c.id);
        return (
          <section key={c.id} className="mb-8">
            <h2 className="text-lg font-bold mb-3">{c.label}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--color-bg)] text-left">
                    <th className="px-3 py-2 border border-gray-200 font-semibold">年収</th>
                    <th className="px-3 py-2 border border-gray-200 font-semibold text-right">家賃</th>
                    <th className="px-3 py-2 border border-gray-200 font-semibold text-right">食費</th>
                    <th className="px-3 py-2 border border-gray-200 font-semibold text-right">月間支出</th>
                    <th className="px-3 py-2 border border-gray-200 font-semibold text-right">貯蓄率</th>
                  </tr>
                </thead>
                <tbody>
                  {group.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border border-gray-200">
                        <Link
                          href={`/tools/living-cost/${m.id}`}
                          className="text-[var(--color-primary)] hover:underline font-medium"
                        >
                          {m.annualIncome}万円
                        </Link>
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-right">
                        {m.monthlyBudget.rent.toLocaleString("ja-JP")}円
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-right">
                        {m.monthlyBudget.food.toLocaleString("ja-JP")}円
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-right">
                        {m.totalMonthly.toLocaleString("ja-JP")}円
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-right">
                        {m.savingsRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      {/* Links to other household types */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">他の世帯タイプ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {households
            .filter((h) => h.id !== type)
            .map((h) => (
              <Link
                key={h.id}
                href={`/tools/living-cost/household/${h.id}`}
                className="block text-center px-4 py-3 bg-[var(--color-bg)] border border-gray-200 rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors font-medium"
              >
                {h.label}
              </Link>
            ))}
        </div>
      </section>

      <FAQ faqs={faqs} />

      {/* YMYL disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-gray-500 space-y-1">
        <p>※ 生活費モデルは統計データを基にした概算です。実際の支出は個人の生活スタイルにより大きく異なります。</p>
        <p>※ 出典: <a href="https://www.stat.go.jp/data/kakei/" className="underline" target="_blank" rel="noopener noreferrer">総務省 家計調査</a></p>
      </div>
    </div>
  );
}
