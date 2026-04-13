import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import { webApplicationSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { takeHomePayData } from "@/data/take-home-pay";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "年収別 手取り早見表 2026年版",
    description:
      "年収100万〜2000万円の手取り額を一覧表示。所得税・住民税・社会保険料を自動計算し、手取り月額・控除率がひと目でわかります。2026年最新税制対応。",
    path: "/tools/take-home-pay",
  });
}

const faqs = [
  {
    q: "手取りとは何ですか？",
    a: "手取りとは、額面の年収から所得税・住民税・社会保険料（健康保険・厚生年金・雇用保険）を差し引いた、実際に受け取れる金額のことです。",
  },
  {
    q: "手取り額はどのように計算していますか？",
    a: "2026年4月時点の税制に基づき、給与所得控除・基礎控除・社会保険料控除を適用して所得税と住民税を算出し、社会保険料と合算して年収から差し引いています。",
  },
  {
    q: "この計算の前提条件は何ですか？",
    a: "独身・扶養家族なし・東京都在住・協会けんぽ加入を前提としています。配偶者控除や扶養控除、住宅ローン控除などは含まれていません。",
  },
  {
    q: "年収が上がると手取り率は下がりますか？",
    a: "はい。日本の所得税は累進課税のため、年収が上がるほど税率が上がり、手取り率（手取り÷年収）は低下する傾向があります。年収500万円で約78%、年収1000万円で約72%が目安です。",
  },
  {
    q: "ボーナスは含まれていますか？",
    a: "年収にはボーナスを含む総支給額を想定しています。ボーナスの有無や回数は手取り額に大きく影響しませんが、社会保険料の端数処理で若干の差が生じる場合があります。",
  },
];

export default function TakeHomePayHubPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "手取り早見表", href: "/tools/take-home-pay" },
        ]}
      />

      <JsonLd
        data={webApplicationSchema({
          title: "年収別 手取り早見表 2026年版",
          description:
            "年収100万〜2000万円の手取り額・控除率を一覧表示する無料ツール",
          slug: "take-home-pay",
        })}
      />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        年収別 手取り早見表 2026年版
      </h1>
      <p className="text-gray-500 mb-6">
        年収100万円〜2000万円まで50万円刻みで、手取り額・月収・控除率を一覧にまとめました。
        2026年4月時点の最新税制（所得税・住民税）と社会保険料率に基づいて計算しています。
        各年収をクリックすると、税金・保険料の内訳を詳しく確認できます。
      </p>

      {/* Summary table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--color-bg)] text-left">
              <th className="px-3 py-2 border border-gray-200 font-semibold">年収</th>
              <th className="px-3 py-2 border border-gray-200 font-semibold text-right">
                手取り（年）
              </th>
              <th className="px-3 py-2 border border-gray-200 font-semibold text-right">
                手取り（月）
              </th>
              <th className="px-3 py-2 border border-gray-200 font-semibold text-right">
                控除率
              </th>
            </tr>
          </thead>
          <tbody>
            {takeHomePayData.map((d) => {
              const incomeMan = d.annualIncome / 10_000;
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
                    {d.annualTakeHome.toLocaleString("ja-JP")}円
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right">
                    {d.monthlyTakeHome.toLocaleString("ja-JP")}円
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right">
                    {d.deductionRate}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Compare link */}
      <div className="mt-6 text-center">
        <Link
          href="/tools/take-home-pay/compare"
          className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          年収別の手取りを比較する
        </Link>
      </div>

      <FAQ faqs={faqs} />

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
