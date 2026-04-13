import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import { webApplicationSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { allScenarios, MONTHLY_AMOUNTS } from "@/data/investment-scenarios";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "積立投資リターン早見表【複利シミュレーション】",
    description:
      "月1万〜10万円の積立投資を年利3〜7%で10〜30年運用した場合のリターンを36パターンで一覧比較。複利効果がひと目でわかる無料シミュレーション。",
    path: "/tools/investment-return",
  });
}

const faqs = [
  {
    q: "複利とは何ですか？",
    a: "複利とは、元本だけでなく過去に得た利益にも利息がつく仕組みです。運用期間が長いほど雪だるま式に資産が増える「複利効果」が期待できます。",
  },
  {
    q: "年利3%・5%・7%は現実的ですか？",
    a: "全世界株式インデックスの過去20年間の平均リターンは年利6〜7%程度です。債券を含むバランス型であれば3〜5%が目安とされています。ただし将来のリターンを保証するものではありません。",
  },
  {
    q: "新NISAのつみたて投資枠はいくらですか？",
    a: "2024年から始まった新NISAでは、つみたて投資枠が年間120万円（月10万円）に拡大されました。非課税保有限度額は1,800万円です。",
  },
  {
    q: "積立投資と一括投資、どちらが有利ですか？",
    a: "理論的には一括投資の期待リターンが高いですが、積立投資はドルコスト平均法により購入単価を平準化できるため、リスクを抑えたい方に向いています。",
  },
  {
    q: "このシミュレーションに税金は含まれていますか？",
    a: "いいえ、税金・手数料は含まれていません。NISA口座を利用すれば運用益が非課税になりますが、課税口座では利益に約20.315%の税金がかかります。",
  },
];

function formatYen(value: number) {
  return value.toLocaleString("ja-JP") + "円";
}

function formatMan(value: number) {
  return (value / 10_000).toLocaleString("ja-JP") + "万円";
}

export default function InvestmentReturnHubPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "積立投資リターン早見表", href: "/tools/investment-return" },
        ]}
      />

      <JsonLd
        data={webApplicationSchema({
          title: "積立投資リターン早見表【複利シミュレーション】",
          description:
            "月1万〜10万円の積立投資を年利3〜7%で10〜30年運用した場合のリターンを36パターンで比較",
          slug: "investment-return",
        })}
      />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        積立投資リターン早見表【複利シミュレーション】
      </h1>
      <p className="text-gray-500 mb-6">
        毎月の積立額・運用年数・想定年利を組み合わせた36パターンの複利シミュレーション結果を一覧で確認できます。
        長期・積立・分散投資による複利効果を実感してください。
        各行をクリックすると、年次推移チャートや詳細な内訳を確認できます。
      </p>

      {/* Monthly amount groups */}
      {MONTHLY_AMOUNTS.map((amount) => {
        const scenarios = allScenarios.filter((s) => s.monthlyAmount === amount);
        return (
          <section key={amount} className="mb-10">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              月{amount}万円の積立
              <Link
                href={`/tools/investment-return/monthly/${amount}`}
                className="text-sm font-normal text-[var(--color-primary)] hover:underline"
              >
                まとめページへ →
              </Link>
            </h2>
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
        );
      })}

      {/* Links to monthly summary pages */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">月額別まとめページ</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MONTHLY_AMOUNTS.map((amount) => (
            <Link
              key={amount}
              href={`/tools/investment-return/monthly/${amount}`}
              className="block p-4 bg-[var(--color-bg)] border border-gray-200 rounded-lg text-center hover:border-[var(--color-primary)] transition-colors"
            >
              <span className="text-lg font-bold text-[var(--color-primary)]">月{amount}万円</span>
              <span className="block text-xs text-gray-500 mt-1">全パターン比較</span>
            </Link>
          ))}
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
