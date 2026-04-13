import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { webApplicationSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { takeHomePayData } from "@/data/take-home-pay";
import TakeHomePayCompareChart from "@/components/tools/TakeHomePayCompareChart";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "年収別 手取り比較チャート 2026年版",
    description:
      "年収100万〜2000万円の手取り額と控除額をグラフで比較。年収アップによる手取りの変化がひと目でわかります。2026年最新税制対応。",
    path: "/tools/take-home-pay/compare",
  });
}

function formatYen(value: number) {
  return value.toLocaleString("ja-JP") + "円";
}

export default function TakeHomePayComparePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "手取り早見表", href: "/tools/take-home-pay" },
          { name: "比較", href: "/tools/take-home-pay/compare" },
        ]}
      />

      <JsonLd
        data={webApplicationSchema({
          title: "年収別 手取り比較チャート 2026年版",
          description:
            "年収100万〜2000万円の手取り額と控除額をグラフで比較する無料ツール",
          slug: "take-home-pay/compare",
        })}
      />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        年収別 手取り比較チャート 2026年版
      </h1>
      <p className="text-gray-500 mb-6">
        年収100万円〜2000万円の手取り額と控除額を棒グラフで比較できます。
        年収が上がるにつれて控除率がどのように変化するかを視覚的に確認できます。
      </p>

      {/* Bar chart */}
      <section className="mb-8">
        <TakeHomePayCompareChart data={takeHomePayData} />
      </section>

      {/* Comparison table */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">年収別 手取り比較表</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg)] text-left">
                <th className="px-3 py-2 border border-gray-200 font-semibold">
                  年収
                </th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">
                  手取り（年）
                </th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">
                  手取り（月）
                </th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">
                  控除合計
                </th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">
                  控除率
                </th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">
                  所得税
                </th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">
                  住民税
                </th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">
                  社会保険料
                </th>
              </tr>
            </thead>
            <tbody>
              {takeHomePayData.map((d) => {
                const incomeMan = d.annualIncome / 10_000;
                const socialTotal =
                  d.healthInsurance + d.pensionInsurance + d.employmentInsurance;
                return (
                  <tr key={incomeMan} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200">
                      <Link
                        href={`/tools/take-home-pay/${incomeMan}`}
                        className="text-[var(--color-primary)] hover:underline font-medium"
                      >
                        {incomeMan.toLocaleString("ja-JP")}万円
                      </Link>
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right">
                      {formatYen(d.annualTakeHome)}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right">
                      {formatYen(d.monthlyTakeHome)}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right text-red-600">
                      {formatYen(d.totalDeductions)}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right">
                      {d.deductionRate}%
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right">
                      {formatYen(d.incomeTax)}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right">
                      {formatYen(d.residentTax)}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right">
                      {formatYen(socialTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Back link */}
      <div className="text-center mb-8">
        <Link
          href="/tools/take-home-pay"
          className="text-[var(--color-primary)] hover:underline"
        >
          &larr; 手取り早見表に戻る
        </Link>
      </div>

      {/* YMYL disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-gray-500 space-y-1">
        <p>※ あくまで概算です。正確な金額は税理士にご相談ください。</p>
        <p>
          ※ 前提条件: 独身・扶養なし・東京都在住・協会けんぽ・2026年4月時点の税制
        </p>
        <p>
          ※ 出典:{" "}
          <a
            href="https://www.nta.go.jp/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            国税庁
          </a>
          、
          <a
            href="https://www.mhlw.go.jp/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            厚生労働省
          </a>
        </p>
      </div>
    </div>
  );
}
