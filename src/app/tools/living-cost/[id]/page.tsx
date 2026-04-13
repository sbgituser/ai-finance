import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import { faqSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import LivingCostBreakdown from "@/components/tools/LivingCostBreakdown";
import {
  allLivingCostModels,
  getLivingCostById,
  getLivingCostsByCity,
  getLivingCostsByHousehold,
  cities,
  households,
  incomes,
} from "@/data/living-cost";

export async function generateStaticParams() {
  return allLivingCostModels.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const model = getLivingCostById(id);
  if (!model) return {};
  return buildMetadata({
    title: `${model.cityLabel}で${model.householdLabel}・年収${model.annualIncome}万円の生活費モデル`,
    description: `${model.cityLabel}で${model.householdLabel}・年収${model.annualIncome}万円の場合の生活費内訳。月間支出${model.totalMonthly.toLocaleString("ja-JP")}円、貯蓄率${model.savingsRate}%。家賃・食費・光熱費の詳細と節約のコツ。`,
    path: `/tools/living-cost/${id}`,
  });
}

const BUDGET_LABELS: { key: keyof typeof allLivingCostModels[0]["monthlyBudget"]; label: string }[] = [
  { key: "rent", label: "家賃" },
  { key: "food", label: "食費" },
  { key: "utilities", label: "光熱費" },
  { key: "transportation", label: "交通費" },
  { key: "communication", label: "通信費" },
  { key: "insurance", label: "保険料" },
  { key: "entertainment", label: "娯楽費" },
  { key: "savings", label: "貯蓄" },
  { key: "other", label: "その他" },
];

export default async function LivingCostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = getLivingCostById(id);
  if (!model) notFound();

  const pageTitle = `${model.cityLabel}で${model.householdLabel}・年収${model.annualIncome}万円の生活費モデル`;

  // 同じ都市・世帯の別年収
  const sameGroup = allLivingCostModels.filter(
    (m) => m.city === model.city && m.household === model.household && m.id !== model.id,
  );

  // 同じ世帯・年収の別都市
  const sameBudget = allLivingCostModels.filter(
    (m) => m.household === model.household && m.annualIncome === model.annualIncome && m.id !== model.id,
  );

  const faqs = [
    {
      q: `${model.cityLabel}で${model.householdLabel}の平均的な家賃はいくらですか？`,
      a: `${model.cityLabel}の${model.householdLabel}向け物件の家賃目安は月${model.monthlyBudget.rent.toLocaleString("ja-JP")}円前後です。エリアや築年数によって大きく変わりますので、手取りの30%以内を目安にしましょう。`,
    },
    {
      q: `年収${model.annualIncome}万円で貯蓄はできますか？`,
      a: `年収${model.annualIncome}万円・${model.householdLabel}の場合、月${model.monthlyBudget.savings.toLocaleString("ja-JP")}円（貯蓄率${model.savingsRate}%）の貯蓄が可能です。先取り貯蓄を自動化することで確実に貯められます。`,
    },
    {
      q: `${model.cityLabel}で生活費を抑えるコツはありますか？`,
      a: model.tips[0],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "生活費シミュレーター", href: "/tools/living-cost" },
          { name: `${model.cityLabel}`, href: `/tools/living-cost/city/${model.city}` },
          { name: pageTitle, href: `/tools/living-cost/${id}` },
        ]}
      />

      <JsonLd data={faqSchema(faqs)} />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">{pageTitle}</h1>
      <p className="text-gray-500 mb-6">
        {model.cityLabel}で{model.householdLabel}、年収{model.annualIncome}万円の場合の
        月間生活費モデルです。家賃・食費・光熱費など9カテゴリの内訳と貯蓄率を確認できます。
      </p>

      {/* Key figures */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--color-bg)] border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">年収</div>
          <div className="text-lg font-bold text-[var(--color-primary)]">
            {model.annualIncome}万円
          </div>
        </div>
        <div className="bg-[var(--color-bg)] border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">月間支出合計</div>
          <div className="text-lg font-bold text-[var(--color-primary)]">
            {model.totalMonthly.toLocaleString("ja-JP")}円
          </div>
        </div>
        <div className="bg-[var(--color-bg)] border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">月間貯蓄額</div>
          <div className="text-lg font-bold text-[var(--color-accent)]">
            {model.monthlyBudget.savings.toLocaleString("ja-JP")}円
          </div>
        </div>
        <div className="bg-[var(--color-bg)] border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">貯蓄率</div>
          <div className="text-lg font-bold text-[var(--color-accent)]">
            {model.savingsRate}%
          </div>
        </div>
      </div>

      {/* Pie chart */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">支出内訳グラフ</h2>
        <LivingCostBreakdown monthlyBudget={model.monthlyBudget} />
      </section>

      {/* Budget table */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">月間支出の詳細</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg)] text-left">
                <th className="px-3 py-2 border border-gray-200 font-semibold">カテゴリ</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">月額</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">割合</th>
              </tr>
            </thead>
            <tbody>
              {BUDGET_LABELS.map(({ key, label }) => {
                const val = model.monthlyBudget[key];
                const pct = ((val / model.totalMonthly) * 100).toFixed(1);
                return (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-medium">{label}</td>
                    <td className="px-3 py-2 border border-gray-200 text-right">
                      {val.toLocaleString("ja-JP")}円
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right">{pct}%</td>
                  </tr>
                );
              })}
              <tr className="bg-gray-50 font-bold">
                <td className="px-3 py-2 border border-gray-200">合計</td>
                <td className="px-3 py-2 border border-gray-200 text-right">
                  {model.totalMonthly.toLocaleString("ja-JP")}円
                </td>
                <td className="px-3 py-2 border border-gray-200 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">節約のコツ</h2>
        <ul className="space-y-2">
          {model.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Related: same city & household, different income */}
      {sameGroup.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">
            {model.cityLabel}・{model.householdLabel}の別年収モデル
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sameGroup.map((m) => (
              <Link
                key={m.id}
                href={`/tools/living-cost/${m.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-[var(--color-primary)] transition-colors"
              >
                <div className="font-medium">年収{m.annualIncome}万円</div>
                <div className="text-sm text-gray-500">
                  月間支出 {m.totalMonthly.toLocaleString("ja-JP")}円 / 貯蓄率 {m.savingsRate}%
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related: same household & income, different city */}
      {sameBudget.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">
            {model.householdLabel}・年収{model.annualIncome}万円の他都市モデル
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sameBudget.map((m) => (
              <Link
                key={m.id}
                href={`/tools/living-cost/${m.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-[var(--color-primary)] transition-colors"
              >
                <div className="font-medium">{m.cityLabel}</div>
                <div className="text-sm text-gray-500">
                  月間支出 {m.totalMonthly.toLocaleString("ja-JP")}円 / 貯蓄率 {m.savingsRate}%
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FAQ faqs={faqs} />

      {/* YMYL disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-gray-500 space-y-1">
        <p>※ 生活費モデルは統計データを基にした概算です。実際の支出は個人の生活スタイルにより大きく異なります。</p>
        <p>※ 出典: <a href="https://www.stat.go.jp/data/kakei/" className="underline" target="_blank" rel="noopener noreferrer">総務省 家計調査</a></p>
      </div>
    </div>
  );
}
