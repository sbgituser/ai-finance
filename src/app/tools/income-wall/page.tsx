import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import IncomeWallVisualizer from "@/components/tools/IncomeWallVisualizer";
import { webApplicationSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { incomeWalls, personTypeMap, categoryLabel, categoryColor } from "@/data/income-walls";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "年収の壁シミュレーター【2026年改定対応】",
    description:
      "103万・106万・130万・150万・160万・201万円の壁を一覧比較。2026年税制改正（103万→160万）に対応した無料シミュレーターで、時給と勤務時間からあなたの年収がどの壁に該当するか即判定。",
    path: "/tools/income-wall",
  });
}

const faqs = [
  {
    q: "年収の壁とは何ですか？",
    a: "年収の壁とは、一定の年収を超えると税金や社会保険の負担が増えたり、配偶者控除が減額されたりするラインのことです。主に103万・106万・130万・150万・201万円の壁があります。",
  },
  {
    q: "2026年の改正で何が変わりますか？",
    a: "2026年4月の税制改正で基礎控除が48万円から58万円に引き上げられ、所得税の非課税ラインが103万円から160万円に拡大されます。これにより約57万円多く稼いでも所得税がかかりません。",
  },
  {
    q: "パートで働いていますが、一番注意すべき壁はどれですか？",
    a: "配偶者の社会保険扶養に入っている場合は130万円の壁が最も影響が大きいです。超えると社会保険料の自己負担が年間約20〜30万円発生し、手取りが大幅に減る可能性があります。",
  },
  {
    q: "学生アルバイトはどの壁を気にすべきですか？",
    a: "学生の場合は、勤労学生控除を適用すると130万円まで所得税非課税ですが、親の扶養控除（103万円→2026年以降は160万円）に影響するため注意が必要です。また106万円の壁（社会保険）も関係します。",
  },
  {
    q: "副業の収入も壁の計算に含まれますか？",
    a: "はい、給与所得としての年収が壁の判定対象になります。副業が雑所得や事業所得の場合は扱いが異なるため、詳しくは税理士にご相談ください。",
  },
];

export default function IncomeWallPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "年収の壁シミュレーター", href: "/tools/income-wall" },
        ]}
      />

      <JsonLd
        data={webApplicationSchema({
          title: "年収の壁シミュレーター【2026年改定対応】",
          description:
            "時給と勤務時間から年収を計算し、6つの年収の壁との関係を即判定する無料ツール。",
          slug: "income-wall",
        })}
      />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        年収の壁シミュレーター【2026年改定対応】
      </h1>
      <p className="text-gray-500 mb-6">
        2026年4月の税制改正により、所得税の非課税ラインが103万円から160万円に拡大されます。
        時給と週の勤務時間を入力するだけで、あなたの推定年収がどの「壁」に該当するか一目で分かります。
      </p>

      {/* Privacy badge */}
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-6 text-sm text-green-700">
        <span>&#x1f512;</span>
        <span>入力データはブラウザ内でのみ処理されます。サーバーへの送信は一切ありません。</span>
      </div>

      {/* Simulator */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">シミュレーション</h2>
        <IncomeWallVisualizer />
      </section>

      {/* Wall summary cards */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">年収の壁 一覧</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeWalls.map((wall) => (
            <Link
              key={wall.id}
              href={`/tools/income-wall/${wall.id}`}
              className="block rounded-xl border border-gray-200 p-4 hover:border-[var(--color-primary)] hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold">{wall.threshold}万円</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${categoryColor[wall.category]}`}
                >
                  {categoryLabel[wall.category]}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{wall.description.slice(0, 80)}...</p>
              <span className="inline-block mt-2 text-sm text-[var(--color-primary)] font-medium">
                詳しく見る &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Person type links */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">あなたのタイプ別ガイド</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(personTypeMap).map(([key, { label }]) => (
            <Link
              key={key}
              href={`/tools/income-wall/type/${key}`}
              className="block rounded-xl border border-gray-200 p-4 text-center hover:border-[var(--color-primary)] hover:shadow-sm transition-all"
            >
              <p className="font-bold text-lg mb-1">{label}</p>
              <span className="text-sm text-[var(--color-primary)]">該当する壁を確認 &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Compare link */}
      <section className="mb-10">
        <Link
          href="/tools/income-wall/compare"
          className="block rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-bg)] p-6 text-center hover:shadow-md transition-all"
        >
          <p className="font-bold text-lg mb-1">改正前 vs 改正後 比較表</p>
          <p className="text-sm text-gray-500">6つの壁すべてを改正前後で比較できます</p>
          <span className="inline-block mt-2 text-[var(--color-primary)] font-medium">
            比較ページを見る &rarr;
          </span>
        </Link>
      </section>

      {/* FAQ */}
      <FAQ faqs={faqs} />

      {/* YMYL disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-gray-500 space-y-1">
        <p>※ あくまで概算です。正確な金額は税理士・社会保険労務士にご相談ください。</p>
        <p>※ 2026年4月時点の税制・社会保険制度に基づいています。</p>
        <p>※ 出典: <a href="https://www.nta.go.jp/" className="underline" target="_blank" rel="noopener noreferrer">国税庁</a>、<a href="https://www.mhlw.go.jp/" className="underline" target="_blank" rel="noopener noreferrer">厚生労働省</a></p>
      </div>
    </div>
  );
}
