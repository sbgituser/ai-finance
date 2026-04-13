import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import { buildMetadata } from "@/lib/seo";
import {
  personTypeMap,
  getWallsByIds,
  categoryLabel,
  categoryColor,
} from "@/data/income-walls";

const typeKeys = ["part", "student", "sidejob"] as const;

export async function generateStaticParams() {
  return typeKeys.map((type) => ({ type }));
}

/** タイプ別のアドバイス */
const adviceMap: Record<string, string> = {
  part: "パート・主婦(夫)の方は、配偶者の社会保険扶養（130万円の壁）と配偶者特別控除（150万円・201万円の壁）の影響が大きいです。2026年改正で所得税非課税ラインが160万円に拡大されますが、社会保険の壁は変わらないため、130万円前後で働く場合は注意が必要です。世帯全体の手取りを最大化するには、壁を大きく超えて働くか、壁の内側に収めるかを検討しましょう。",
  student:
    "学生アルバイトの方は、親の扶養控除に影響する103万円（2026年以降は160万円）の壁が最も重要です。また、勤務先の規模によっては106万円の壁（社会保険の適用拡大）にも注意が必要です。勤労学生控除を適用すれば自分の所得税は130万円まで非課税ですが、親の扶養控除が外れると親の税負担が増える点に注意してください。",
  sidejob:
    "副業をしている会社員の方は、本業と副業の合算年収で壁を判定する必要があります。本業で社会保険に加入していれば、106万円・130万円の壁は主に副業単体での影響は限定的です。ただし、配偶者がいる場合は配偶者の年収が壁を超えないかも確認しましょう。また、副業の所得形態（給与 or 事業/雑所得）によって計算方法が異なるため、詳しくは税理士にご相談ください。",
};

/** タイプ別の FAQ */
const faqMap: Record<string, { q: string; a: string }[]> = {
  part: [
    {
      q: "パートで130万円の壁を超えたらどうなりますか？",
      a: "配偶者の社会保険の扶養から外れ、自分で国民健康保険・国民年金に加入するか、勤務先の社会保険に加入する必要があります。年間約20〜30万円の自己負担が発生するため、手取りが一時的に減少します。",
    },
    {
      q: "2026年改正でパートの働き方はどう変わりますか？",
      a: "所得税非課税ラインが103万円から160万円に拡大されるため、税金面ではより多く稼げるようになります。ただし社会保険の壁（106万・130万）は変わらないため、社会保険料の負担には引き続き注意が必要です。",
    },
    {
      q: "世帯手取りが最大になる年収はいくらですか？",
      a: "世帯構成や配偶者の年収によって異なりますが、一般的には130万円未満に抑えるか、160万円以上しっかり稼ぐかが手取り最大化のポイントです。130万〜160万円の間は社会保険料負担で手取りが逆転する可能性があります。",
    },
  ],
  student: [
    {
      q: "学生バイトで親の扶養を外れるラインは？",
      a: "2026年改正後は年収160万円を超えると親の扶養控除（特定親族控除等）に影響が出る可能性があります。改正前は103万円がラインでした。親の税負担が増える点を考慮しましょう。",
    },
    {
      q: "勤労学生控除とは何ですか？",
      a: "合計所得金額が75万円以下（給与収入で130万円以下）の学生が受けられる控除で、27万円が所得から差し引かれます。自分自身の所得税が非課税になるラインが広がりますが、親の扶養控除には影響しません。",
    },
    {
      q: "学生で106万円の壁に引っかかることはありますか？",
      a: "従業員51人以上の企業で週20時間以上・月額8.8万円以上で2ヶ月以上の雇用見込みがある場合は、学生でも社会保険に加入する必要があります。飲食チェーンなど大企業でのバイトは要注意です。",
    },
  ],
  sidejob: [
    {
      q: "副業の収入はどの壁に影響しますか？",
      a: "副業が給与所得の場合は本業と合算して年収の壁を判定します。雑所得や事業所得の場合は計算方法が異なります。本業で社会保険に加入済みなら、106万・130万の壁は主に副業単体では影響しにくいです。",
    },
    {
      q: "副業で20万円以下なら確定申告は不要？",
      a: "給与所得者で副業の所得（収入-経費）が20万円以下の場合、所得税の確定申告は不要ですが、住民税の申告は必要です。年収の壁とは別の論点ですのでご注意ください。",
    },
    {
      q: "配偶者の年収が壁を超えた場合の影響は？",
      a: "ご自身が副業で稼いでいる場合でも、配偶者の年収が壁を超えれば配偶者控除・社会保険扶養に影響します。世帯全体で壁を管理することが重要です。",
    },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const info = personTypeMap[type];
  if (!info) return {};
  return buildMetadata({
    title: `${info.label}の年収の壁ガイド【2026年改定対応】`,
    description: `${info.label}に関係する年収の壁を分かりやすく解説。2026年税制改正の影響と対策も紹介。`,
    path: `/tools/income-wall/type/${type}`,
  });
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const info = personTypeMap[type];
  if (!info) notFound();

  const walls = getWallsByIds(info.wallIds);
  const advice = adviceMap[type] ?? "";
  const faqs = faqMap[type] ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "年収の壁シミュレーター", href: "/tools/income-wall" },
          { name: info.label, href: `/tools/income-wall/type/${type}` },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        {info.label}の年収の壁ガイド【2026年改定対応】
      </h1>

      {/* Advice box */}
      <div className="bg-[var(--color-bg)] border border-gray-200 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-bold mb-2">{info.label}へのアドバイス</h2>
        <p className="text-sm text-gray-700 leading-relaxed">{advice}</p>
      </div>

      {/* Relevant walls */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">
          {info.label}に関係する年収の壁（{walls.length}件）
        </h2>
        <div className="space-y-4">
          {walls.map((wall) => (
            <Link
              key={wall.id}
              href={`/tools/income-wall/${wall.id}`}
              className="block rounded-xl border border-gray-200 p-5 hover:border-[var(--color-primary)] hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold">{wall.threshold}万円の壁</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${categoryColor[wall.category]}`}
                >
                  {categoryLabel[wall.category]}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{wall.description.slice(0, 120)}...</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>改正前: {wall.beforeReform.threshold.toLocaleString()}円</span>
                <span>&rarr;</span>
                <span className="font-medium text-[var(--color-primary)]">
                  改正後: {wall.afterReform.threshold.toLocaleString()}円
                </span>
              </div>
              <span className="inline-block mt-2 text-sm text-[var(--color-primary)] font-medium">
                詳しく見る &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Other type links */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">他のタイプを見る</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(personTypeMap)
            .filter(([key]) => key !== type)
            .map(([key, { label }]) => (
              <Link
                key={key}
                href={`/tools/income-wall/type/${key}`}
                className="block rounded-lg border border-gray-200 p-3 text-center hover:border-[var(--color-primary)] transition-colors"
              >
                <span className="font-medium">{label}</span>
              </Link>
            ))}
        </div>
      </section>

      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/tools/income-wall"
          className="inline-block text-sm text-[var(--color-primary)] font-medium hover:underline"
        >
          &larr; シミュレーターに戻る
        </Link>
      </div>

      {/* FAQ */}
      {faqs.length > 0 && <FAQ faqs={faqs} />}

      {/* YMYL disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-gray-500 space-y-1">
        <p>※ あくまで概算です。正確な金額は税理士・社会保険労務士にご相談ください。</p>
        <p>※ 2026年4月時点の税制・社会保険制度に基づいています。</p>
        <p>※ 出典: <a href="https://www.nta.go.jp/" className="underline" target="_blank" rel="noopener noreferrer">国税庁</a>、<a href="https://www.mhlw.go.jp/" className="underline" target="_blank" rel="noopener noreferrer">厚生労働省</a></p>
      </div>
    </div>
  );
}
