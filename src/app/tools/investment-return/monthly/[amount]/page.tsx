import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { webApplicationSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import InvestmentReturnChart from "@/components/tools/InvestmentReturnChart";
import { getScenariosForMonthly, MONTHLY_AMOUNTS } from "@/data/investment-scenarios";

export async function generateStaticParams() {
  return MONTHLY_AMOUNTS.map((a) => ({ amount: String(a) }));
}

export async function generateMetadata({ params }: { params: Promise<{ amount: string }> }): Promise<Metadata> {
  const { amount } = await params;
  const num = Number(amount);
  if (!MONTHLY_AMOUNTS.includes(num)) return {};
  return buildMetadata({
    title: `月${num}万円の積立投資シミュレーション【年利3〜7%・10〜30年】`,
    description: `毎月${num}万円を積立投資した場合のシミュレーション。年利3%・5%・7%、運用期間10年・20年・30年の全9パターンを比較。複利効果をチャートで確認。`,
    path: `/tools/investment-return/monthly/${amount}`,
  });
}

function formatYen(value: number) {
  return value.toLocaleString("ja-JP") + "円";
}

function formatMan(value: number) {
  return (value / 10_000).toLocaleString("ja-JP") + "万円";
}

export default async function MonthlyAmountPage({ params }: { params: Promise<{ amount: string }> }) {
  const { amount } = await params;
  const num = Number(amount);
  if (!MONTHLY_AMOUNTS.includes(num)) notFound();

  const scenarios = getScenariosForMonthly(num);

  // Pick the longest-duration, highest-return scenario for the main chart
  const showcaseScenario = scenarios[scenarios.length - 1];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "積立投資リターン早見表", href: "/tools/investment-return" },
          { name: `月${num}万円`, href: `/tools/investment-return/monthly/${amount}` },
        ]}
      />

      <JsonLd
        data={webApplicationSchema({
          title: `月${num}万円の積立投資シミュレーション`,
          description: `毎月${num}万円を年利3〜7%で10〜30年運用した場合のシミュレーション`,
          slug: `investment-return/monthly/${amount}`,
        })}
      />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        月{num}万円の積立投資シミュレーション
      </h1>
      <p className="text-gray-500 mb-6">
        毎月{num}万円を積立投資した場合の全9パターン（年利3%・5%・7% × 10年・20年・30年）を比較します。
        運用期間と想定年利によって、最終的な資産額がどう変わるかを確認できます。
      </p>

      {/* Summary table */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">全パターン比較表</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg)] text-left">
                <th className="px-3 py-2 border border-gray-200 font-semibold">年数</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold">年利</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">元本合計</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">運用結果</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">利益</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">利益率</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200">
                    <Link
                      href={`/tools/investment-return/${s.id}`}
                      className="text-[var(--color-primary)] hover:underline font-medium"
                    >
                      {s.years}年
                    </Link>
                  </td>
                  <td className="px-3 py-2 border border-gray-200">{s.annualReturn}%</td>
                  <td className="px-3 py-2 border border-gray-200 text-right">{formatMan(s.totalInvestment)}</td>
                  <td className="px-3 py-2 border border-gray-200 text-right font-medium">{formatMan(s.estimatedValue)}</td>
                  <td className="px-3 py-2 border border-gray-200 text-right text-green-600">+{formatMan(s.totalReturn)}</td>
                  <td className="px-3 py-2 border border-gray-200 text-right text-green-600">+{s.returnRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Chart: showcase the best-case scenario */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">
          資産推移チャート（{showcaseScenario.years}年・年利{showcaseScenario.annualReturn}%）
        </h2>
        <InvestmentReturnChart yearlyBreakdown={showcaseScenario.yearlyBreakdown} />
        <p className="text-xs text-gray-500 mt-2 text-center">
          元本{formatMan(showcaseScenario.totalInvestment)} → 評価額{formatMan(showcaseScenario.estimatedValue)}
          （利益率 +{showcaseScenario.returnRate}%）
        </p>
      </section>

      {/* Individual scenario links */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">各シナリオの詳細</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {scenarios.map((s) => (
            <Link
              key={s.id}
              href={`/tools/investment-return/${s.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-[var(--color-primary)] transition-colors"
            >
              <div className="font-medium">
                {s.years}年 × 年利{s.annualReturn}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatMan(s.totalInvestment)} → {formatMan(s.estimatedValue)}
              </div>
              <div className="text-sm text-green-600 mt-0.5">
                +{formatMan(s.totalReturn)}（+{s.returnRate}%）
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Back link */}
      <div className="text-center">
        <Link
          href="/tools/investment-return"
          className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          全パターン一覧に戻る
        </Link>
      </div>

      {/* YMYL disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-gray-500 space-y-1">
        <p>※ シミュレーション結果は過去の実績に基づく仮定であり、将来のリターンを保証するものではありません。</p>
        <p>※ 税金・手数料は考慮していません。実際の投資判断はファイナンシャルプランナー等にご相談ください。</p>
        <p>※ 出典: <a href="https://www.fsa.go.jp/policy/nisa2/" className="underline" target="_blank" rel="noopener noreferrer">金融庁 NISA特設サイト</a></p>
      </div>
    </div>
  );
}
