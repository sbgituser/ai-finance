import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import { webApplicationSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import InvestmentReturnChart from "@/components/tools/InvestmentReturnChart";
import { allScenarios, getScenarioById, getRelatedScenarios } from "@/data/investment-scenarios";

export async function generateStaticParams() {
  return allScenarios.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const s = getScenarioById(id);
  if (!s) return {};
  const title = `月${s.monthlyAmount}万円×${s.years}年×年利${s.annualReturn}%の積立投資シミュレーション`;
  return buildMetadata({
    title,
    description: `毎月${s.monthlyAmount}万円を年利${s.annualReturn}%で${s.years}年間積立投資した場合、元本${(s.totalInvestment / 10_000).toLocaleString("ja-JP")}万円が約${(s.estimatedValue / 10_000).toLocaleString("ja-JP")}万円に。複利効果を詳しく解説。`,
    path: `/tools/investment-return/${id}`,
  });
}

function formatYen(value: number) {
  return value.toLocaleString("ja-JP") + "円";
}

function formatMan(value: number) {
  return (value / 10_000).toLocaleString("ja-JP") + "万円";
}

export default async function InvestmentScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getScenarioById(id);
  if (!s) notFound();

  const related = getRelatedScenarios(s);
  const annualInvestment = s.monthlyAmount * 12;
  const nisaLimit = 120; // 新NISA つみたて投資枠: 年120万円
  const isWithinNisa = annualInvestment <= nisaLimit;

  const faqs = [
    {
      q: `月${s.monthlyAmount}万円の積立を${s.years}年続けるといくらになりますか？`,
      a: `年利${s.annualReturn}%で運用した場合、元本${formatMan(s.totalInvestment)}が約${formatMan(s.estimatedValue)}になります。運用益は約${formatMan(s.totalReturn)}（利益率${s.returnRate}%）です。`,
    },
    {
      q: `年利${s.annualReturn}%は現実的ですか？`,
      a: s.annualReturn <= 5
        ? `年利${s.annualReturn}%はバランス型ファンドや債券を組み合わせたポートフォリオで十分に達成可能な水準とされています。ただし将来のリターンを保証するものではありません。`
        : `年利${s.annualReturn}%は全世界株式インデックスの長期平均リターンに近い水準ですが、短期的には大きく変動する可能性があります。リスク許容度に応じたポートフォリオ設計が重要です。`,
    },
    {
      q: "この結果はNISAで非課税になりますか？",
      a: isWithinNisa
        ? `月${s.monthlyAmount}万円（年${annualInvestment}万円）は新NISAのつみたて投資枠（年120万円）の範囲内です。NISA口座で運用すれば運用益${formatMan(s.totalReturn)}が非課税になります。`
        : `月${s.monthlyAmount}万円（年${annualInvestment}万円）は新NISAのつみたて投資枠（年120万円）を超えています。超過分は課税口座での運用となり、利益に約20.315%の税金がかかります。`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "積立投資リターン早見表", href: "/tools/investment-return" },
          {
            name: `月${s.monthlyAmount}万円×${s.years}年×${s.annualReturn}%`,
            href: `/tools/investment-return/${s.id}`,
          },
        ]}
      />

      <JsonLd
        data={webApplicationSchema({
          title: `月${s.monthlyAmount}万円×${s.years}年×年利${s.annualReturn}%の積立投資シミュレーション`,
          description: `毎月${s.monthlyAmount}万円を年利${s.annualReturn}%で${s.years}年間積立投資した場合の複利シミュレーション`,
          slug: `investment-return/${s.id}`,
        })}
      />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        月{s.monthlyAmount}万円×{s.years}年×年利{s.annualReturn}%の積立投資シミュレーション
      </h1>
      <p className="text-gray-500 mb-6">
        毎月{s.monthlyAmount}万円を年利{s.annualReturn}%で{s.years}年間、複利運用した場合のシミュレーション結果です。
      </p>

      {/* Key figures */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--color-bg)] rounded-lg p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">元本合計</div>
          <div className="text-lg font-bold">{formatMan(s.totalInvestment)}</div>
        </div>
        <div className="bg-[var(--color-bg)] rounded-lg p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">運用結果</div>
          <div className="text-lg font-bold text-[var(--color-primary)]">{formatMan(s.estimatedValue)}</div>
        </div>
        <div className="bg-[var(--color-bg)] rounded-lg p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">利益</div>
          <div className="text-lg font-bold text-green-600">+{formatMan(s.totalReturn)}</div>
        </div>
        <div className="bg-[var(--color-bg)] rounded-lg p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">利益率</div>
          <div className="text-lg font-bold text-green-600">+{s.returnRate}%</div>
        </div>
      </div>

      {/* Chart */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">資産推移チャート</h2>
        <InvestmentReturnChart yearlyBreakdown={s.yearlyBreakdown} />
      </section>

      {/* Year-by-year breakdown */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">年次推移テーブル</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg)] text-left">
                <th className="px-3 py-2 border border-gray-200 font-semibold">年数</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">元本累計</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">評価額</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">運用益</th>
              </tr>
            </thead>
            <tbody>
              {s.yearlyBreakdown.map((d) => (
                <tr key={d.year} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200">{d.year}年目</td>
                  <td className="px-3 py-2 border border-gray-200 text-right">{formatYen(d.invested)}</td>
                  <td className="px-3 py-2 border border-gray-200 text-right font-medium">{formatYen(d.value)}</td>
                  <td className="px-3 py-2 border border-gray-200 text-right text-green-600">
                    +{formatYen(d.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* NISA comparison */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">新NISA つみたて投資枠との比較</h2>
        <div className="bg-[var(--color-bg)] rounded-lg p-5 space-y-3 text-sm">
          <p>
            新NISAのつみたて投資枠は<strong>年間120万円（月10万円）</strong>まで非課税で投資できます。
            非課税保有限度額は1,800万円です。
          </p>
          {isWithinNisa ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 font-medium">
                このシナリオ（月{s.monthlyAmount}万円 = 年{annualInvestment}万円）は、
                つみたて投資枠の範囲内です。
              </p>
              <p className="text-green-600 mt-1">
                NISA口座で運用すれば、運用益{formatMan(s.totalReturn)}が全額非課税になります。
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-orange-700 font-medium">
                このシナリオ（月{s.monthlyAmount}万円 = 年{annualInvestment}万円）は、
                つみたて投資枠（年120万円）を超えています。
              </p>
              <p className="text-orange-600 mt-1">
                超過分の年{annualInvestment - nisaLimit}万円は課税口座での運用となり、
                利益に約20.315%の税金がかかります。
                成長投資枠（年240万円）との併用も検討してください。
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Related scenarios */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">月{s.monthlyAmount}万円の他のシナリオ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {related.map((r) => (
            <Link
              key={r.id}
              href={`/tools/investment-return/${r.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-[var(--color-primary)] transition-colors"
            >
              <div className="font-medium">
                {r.years}年 × 年利{r.annualReturn}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatMan(r.totalInvestment)} → {formatMan(r.estimatedValue)}{" "}
                <span className="text-green-600">(+{r.returnRate}%)</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            href={`/tools/investment-return/monthly/${s.monthlyAmount}`}
            className="text-[var(--color-primary)] hover:underline text-sm"
          >
            月{s.monthlyAmount}万円のまとめページへ →
          </Link>
        </div>
      </section>

      <FAQ faqs={faqs} />

      {/* YMYL disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-gray-500 space-y-1">
        <p>※ シミュレーション結果は過去の実績に基づく仮定であり、将来のリターンを保証するものではありません。</p>
        <p>※ 税金・手数料は考慮していません。実際の投資判断はファイナンシャルプランナー等にご相談ください。</p>
        <p>※ 出典: <a href="https://www.fsa.go.jp/policy/nisa2/" className="underline" target="_blank" rel="noopener noreferrer">金融庁 NISA特設サイト</a></p>
      </div>
    </div>
  );
}
