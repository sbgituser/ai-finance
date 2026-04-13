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
  getCityLabel,
  getLivingCostsByCity,
} from "@/data/living-cost";

export async function generateStaticParams() {
  return cities.map((c) => ({ city: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const label = getCityLabel(city);
  if (label === city) return {};
  return buildMetadata({
    title: `${label}の生活費モデル【世帯別・年収別】`,
    description: `${label}で一人暮らし・夫婦・子育て世帯の生活費を年収別にシミュレーション。家賃・食費・光熱費の内訳と貯蓄率がわかります。`,
    path: `/tools/living-cost/city/${city}`,
  });
}

const cityAdvice: Record<string, string> = {
  tokyo:
    "東京は全国で最も家賃が高い都市です。23区内でも城東・城北エリアは比較的手頃。通勤時間との兼ね合いで最適な立地を選びましょう。",
  osaka:
    "大阪は東京に次ぐ大都市ですが、家賃は2〜3割安め。梅田・難波へのアクセスが良い北摂・堺エリアがコスパに優れています。",
  nagoya:
    "名古屋は車社会のため交通費（ガソリン・駐車場）が他都市より高くなる傾向。その分家賃は抑えめで、全体の生活費バランスは良好です。",
  fukuoka:
    "福岡は主要都市の中でも生活費が低く、特に家賃と食費が安いのが魅力。新鮮な海産物が安く手に入り、自炊派には最高の環境です。",
  sapporo:
    "札幌は家賃が全国的にも安い水準ですが、冬の暖房費（灯油・ガス）が大きな支出に。年間の光熱費を平準化して考えることが重要です。",
};

export default async function CitySummaryPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const label = getCityLabel(city);
  const models = getLivingCostsByCity(city);
  if (models.length === 0) notFound();

  const faqs = [
    {
      q: `${label}の一人暮らしの生活費はいくらですか？`,
      a: `${label}の一人暮らし・年収500万円モデルでは月間支出約${models.find((m) => m.household === "single" && m.annualIncome === 500)?.totalMonthly.toLocaleString("ja-JP")}円が目安です。家賃が最大の支出項目になります。`,
    },
    {
      q: `${label}は他の都市と比べて生活費は高いですか？`,
      a: cityAdvice[city] ?? `${label}の生活費は都市の規模や立地によって大きく異なります。`,
    },
    {
      q: `${label}で子育て世帯に必要な年収はいくらですか？`,
      a: `${label}で夫婦+子ども1人の場合、年収500万円以上あると貯蓄も含めて余裕のある生活ができます。年収300万円でも工夫次第で生活は可能ですが、貯蓄率は低くなります。`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "生活費シミュレーター", href: "/tools/living-cost" },
          { name: `${label}の生活費`, href: `/tools/living-cost/city/${city}` },
        ]}
      />

      <JsonLd data={faqSchema(faqs)} />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        {label}の生活費モデル【世帯別・年収別】
      </h1>
      <p className="text-gray-500 mb-6">
        {label}で暮らす場合の生活費を、世帯タイプ（一人暮らし・夫婦・子育て）と
        年収（300万・500万・700万円）の組み合わせでシミュレーションしました。
      </p>

      {/* City advice */}
      {cityAdvice[city] && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
          <p className="font-medium mb-1">{label}の生活費ポイント</p>
          <p>{cityAdvice[city]}</p>
        </div>
      )}

      {/* Models grouped by household */}
      {households.map((h) => {
        const group = models.filter((m) => m.household === h.id);
        return (
          <section key={h.id} className="mb-8">
            <h2 className="text-lg font-bold mb-3">{h.label}</h2>
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

      {/* Links to other cities */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">他の都市の生活費</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cities
            .filter((c) => c.id !== city)
            .map((c) => (
              <Link
                key={c.id}
                href={`/tools/living-cost/city/${c.id}`}
                className="block text-center px-4 py-3 bg-[var(--color-bg)] border border-gray-200 rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors font-medium"
              >
                {c.label}
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
