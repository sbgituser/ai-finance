import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import { webApplicationSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { getTakeHomePayByIncome, allIncomeValues } from "@/data/take-home-pay";
import TakeHomePayChart from "@/components/tools/TakeHomePayChart";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return allIncomeValues.map((v) => ({ income: String(v) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ income: string }>;
}): Promise<Metadata> {
  const { income } = await params;
  const incomeNum = Number(income);
  return buildMetadata({
    title: `年収${incomeNum}万円の手取り額【2026年版】`,
    description: `年収${incomeNum}万円の手取り額・所得税・住民税・社会保険料の内訳を詳しく解説。2026年最新税制で自動計算。月額手取りや控除率もわかります。`,
    path: `/tools/take-home-pay/${income}`,
  });
}

function getFaqs(incomeMan: number) {
  return [
    {
      q: `年収${incomeMan}万円の手取りはいくらですか？`,
      a: `独身・扶養なし・東京都在住の場合、年収${incomeMan}万円の手取りは当ページの計算結果をご確認ください。所得税・住民税・社会保険料を差し引いた金額です。`,
    },
    {
      q: `年収${incomeMan}万円の税金はいくらですか？`,
      a: `年収${incomeMan}万円にかかる税金は、所得税と住民税の合計です。ページ上部の内訳表で詳しい金額をご確認いただけます。`,
    },
    {
      q: `年収${incomeMan}万円で手取りを増やす方法はありますか？`,
      a: "ふるさと納税、iDeCo（個人型確定拠出年金）、医療費控除、住宅ローン控除などの各種控除を活用することで、税負担を軽減し実質的な手取りを増やすことが可能です。",
    },
  ];
}

function formatYen(value: number) {
  return value.toLocaleString("ja-JP") + "円";
}

export default async function TakeHomePayIncomePage({
  params,
}: {
  params: Promise<{ income: string }>;
}) {
  const { income } = await params;
  const incomeMan = Number(income);
  const data = getTakeHomePayByIncome(incomeMan);

  if (!data) notFound();

  const prevIncome = incomeMan - 50 >= 100 ? incomeMan - 50 : null;
  const nextIncome = incomeMan + 50 <= 2000 ? incomeMan + 50 : null;
  const faqs = getFaqs(incomeMan);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "手取り早見表", href: "/tools/take-home-pay" },
          {
            name: `${incomeMan}万円`,
            href: `/tools/take-home-pay/${incomeMan}`,
          },
        ]}
      />

      <JsonLd
        data={webApplicationSchema({
          title: `年収${incomeMan}万円の手取り額【2026年版】`,
          description: `年収${incomeMan}万円の手取り・税金・社会保険料を自動計算`,
          slug: `take-home-pay/${incomeMan}`,
        })}
      />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-6">
        年収{incomeMan.toLocaleString("ja-JP")}万円の手取り額【2026年版】
      </h1>

      {/* Key figures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[var(--color-bg)] rounded-lg p-4 text-center border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">年間手取り</p>
          <p className="text-2xl font-bold text-[var(--color-primary)]">
            {formatYen(data.annualTakeHome)}
          </p>
        </div>
        <div className="bg-[var(--color-bg)] rounded-lg p-4 text-center border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">月間手取り</p>
          <p className="text-2xl font-bold text-[var(--color-primary)]">
            {formatYen(data.monthlyTakeHome)}
          </p>
        </div>
        <div className="bg-[var(--color-bg)] rounded-lg p-4 text-center border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">控除率</p>
          <p className="text-2xl font-bold text-[var(--color-primary)]">
            {data.deductionRate}%
          </p>
        </div>
      </div>

      {/* Pie chart */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">年収の内訳</h2>
        <TakeHomePayChart data={data} />
      </section>

      {/* Detailed breakdown */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">控除の詳細</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg)] text-left">
                <th className="px-3 py-2 border border-gray-200 font-semibold">
                  項目
                </th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">
                  年額
                </th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">
                  月額
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border border-gray-200 font-medium">
                  額面年収
                </td>
                <td className="px-3 py-2 border border-gray-200 text-right">
                  {formatYen(data.annualIncome)}
                </td>
                <td className="px-3 py-2 border border-gray-200 text-right">
                  {formatYen(data.monthlyIncome)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-3 py-2 border border-gray-200">所得税</td>
                <td className="px-3 py-2 border border-gray-200 text-right text-red-600">
                  -{formatYen(data.incomeTax)}
                </td>
                <td className="px-3 py-2 border border-gray-200 text-right text-red-600">
                  -{formatYen(Math.round(data.incomeTax / 12))}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-gray-200">住民税</td>
                <td className="px-3 py-2 border border-gray-200 text-right text-red-600">
                  -{formatYen(data.residentTax)}
                </td>
                <td className="px-3 py-2 border border-gray-200 text-right text-red-600">
                  -{formatYen(Math.round(data.residentTax / 12))}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-3 py-2 border border-gray-200">健康保険</td>
                <td className="px-3 py-2 border border-gray-200 text-right text-red-600">
                  -{formatYen(data.healthInsurance)}
                </td>
                <td className="px-3 py-2 border border-gray-200 text-right text-red-600">
                  -{formatYen(Math.round(data.healthInsurance / 12))}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-gray-200">厚生年金</td>
                <td className="px-3 py-2 border border-gray-200 text-right text-red-600">
                  -{formatYen(data.pensionInsurance)}
                </td>
                <td className="px-3 py-2 border border-gray-200 text-right text-red-600">
                  -{formatYen(Math.round(data.pensionInsurance / 12))}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-3 py-2 border border-gray-200">雇用保険</td>
                <td className="px-3 py-2 border border-gray-200 text-right text-red-600">
                  -{formatYen(data.employmentInsurance)}
                </td>
                <td className="px-3 py-2 border border-gray-200 text-right text-red-600">
                  -{formatYen(Math.round(data.employmentInsurance / 12))}
                </td>
              </tr>
              <tr className="font-bold bg-green-50">
                <td className="px-3 py-2 border border-gray-200">手取り</td>
                <td className="px-3 py-2 border border-gray-200 text-right text-[var(--color-primary)]">
                  {formatYen(data.annualTakeHome)}
                </td>
                <td className="px-3 py-2 border border-gray-200 text-right text-[var(--color-primary)]">
                  {formatYen(data.monthlyTakeHome)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Calculation breakdown */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">計算の内訳</h2>
        <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
          <p>
            <span className="font-medium">給与所得控除:</span>{" "}
            {formatYen(data.breakdown.employmentDeduction)}
          </p>
          <p>
            <span className="font-medium">基礎控除:</span>{" "}
            {formatYen(data.breakdown.basicDeduction)}
          </p>
          <p>
            <span className="font-medium">社会保険料控除:</span>{" "}
            {formatYen(data.breakdown.socialInsuranceDeduction)}
          </p>
          <p>
            <span className="font-medium">課税所得:</span>{" "}
            {formatYen(data.breakdown.taxableIncome)}
          </p>
          <p>
            <span className="font-medium">適用税率区分:</span>{" "}
            {data.breakdown.taxBracket}
          </p>
        </div>
      </section>

      {/* Assumptions */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">計算の前提条件</h2>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>独身・扶養家族なし</li>
          <li>東京都在住</li>
          <li>協会けんぽ（全国健康保険協会）加入</li>
          <li>2026年4月時点の税制・保険料率を適用</li>
          <li>配偶者控除・住宅ローン控除等の特別控除は含まない</li>
          <li>ボーナスを含む年間総支給額として計算</li>
        </ul>
      </section>

      {/* Adjacent income links */}
      <div className="flex justify-between items-center mb-8">
        {prevIncome ? (
          <Link
            href={`/tools/take-home-pay/${prevIncome}`}
            className="text-[var(--color-primary)] hover:underline"
          >
            &larr; 年収{prevIncome}万円
          </Link>
        ) : (
          <span />
        )}
        <Link
          href="/tools/take-home-pay"
          className="text-[var(--color-primary)] hover:underline"
        >
          一覧に戻る
        </Link>
        {nextIncome ? (
          <Link
            href={`/tools/take-home-pay/${nextIncome}`}
            className="text-[var(--color-primary)] hover:underline"
          >
            年収{nextIncome}万円 &rarr;
          </Link>
        ) : (
          <span />
        )}
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
