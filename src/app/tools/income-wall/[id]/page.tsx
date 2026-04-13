import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import { webApplicationSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import {
  incomeWalls,
  getWallById,
  getWallsByIds,
  categoryLabel,
  categoryColor,
} from "@/data/income-walls";

export async function generateStaticParams() {
  return incomeWalls.map((wall) => ({ id: wall.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const wall = getWallById(id);
  if (!wall) return {};
  return buildMetadata({
    title: `${wall.title}｜年収の壁シミュレーター`,
    description: wall.description.slice(0, 120),
    path: `/tools/income-wall/${id}`,
  });
}

/** 壁ごとの FAQ を生成 */
function buildFaqs(wall: NonNullable<ReturnType<typeof getWallById>>) {
  const thresholdStr = `${wall.threshold}万円`;
  return [
    {
      q: `${thresholdStr}の壁とは何ですか？`,
      a: wall.description.slice(0, 200),
    },
    {
      q: `${thresholdStr}の壁は2026年の改正でどう変わりますか？`,
      a: `改正前: ${wall.beforeReform.impact} → 改正後: ${wall.afterReform.impact}（${wall.afterReform.effectiveDate}施行）`,
    },
    {
      q: `${thresholdStr}の壁はどんな人に影響しますか？`,
      a: `主に ${wall.affectedPersons.join("、")} に影響があります。年収が${thresholdStr}前後の方は、勤務時間や時給の調整を検討してください。`,
    },
  ];
}

export default async function WallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wall = getWallById(id);
  if (!wall) notFound();

  const relatedWalls = getWallsByIds(wall.relatedWalls);
  const faqs = buildFaqs(wall);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "年収の壁シミュレーター", href: "/tools/income-wall" },
          { name: `${wall.threshold}万円の壁`, href: `/tools/income-wall/${wall.id}` },
        ]}
      />

      <JsonLd
        data={webApplicationSchema({
          title: wall.title,
          description: wall.description.slice(0, 120),
          slug: `income-wall/${wall.id}`,
        })}
      />

      {/* Header */}
      <div className="mt-4 mb-6">
        <span
          className={`inline-block text-xs px-3 py-1 rounded-full mb-2 ${categoryColor[wall.category]}`}
        >
          {categoryLabel[wall.category]}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold">{wall.title}</h1>
      </div>

      {/* Full description */}
      <section className="mb-8">
        <p className="text-gray-700 leading-relaxed">{wall.description}</p>
      </section>

      {/* Before / After comparison */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">改正前後の比較</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-medium text-gray-400 mb-2">改正前</p>
            <p className="text-2xl font-bold mb-2">
              {wall.beforeReform.threshold.toLocaleString()}
              <span className="text-sm font-normal text-gray-500 ml-1">円</span>
            </p>
            <p className="text-sm text-gray-600">{wall.beforeReform.impact}</p>
          </div>
          <div className="rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-bg)] p-5">
            <p className="text-sm font-medium text-[var(--color-primary)] mb-2">改正後</p>
            <p className="text-2xl font-bold mb-2">
              {wall.afterReform.threshold.toLocaleString()}
              <span className="text-sm font-normal text-gray-500 ml-1">円</span>
            </p>
            <p className="text-sm text-gray-600">{wall.afterReform.impact}</p>
            <p className="text-xs text-gray-400 mt-2">施行日: {wall.afterReform.effectiveDate}</p>
          </div>
        </div>
      </section>

      {/* Affected persons */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">影響を受ける人</h2>
        <ul className="flex flex-wrap gap-2">
          {wall.affectedPersons.map((person) => (
            <li
              key={person}
              className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full"
            >
              {person}
            </li>
          ))}
        </ul>
      </section>

      {/* Related walls */}
      {relatedWalls.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">関連する壁</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedWalls.map((rw) => (
              <Link
                key={rw.id}
                href={`/tools/income-wall/${rw.id}`}
                className="block rounded-lg border border-gray-200 p-3 hover:border-[var(--color-primary)] transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">{rw.threshold}万円の壁</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${categoryColor[rw.category]}`}
                  >
                    {categoryLabel[rw.category]}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {rw.description.slice(0, 60)}...
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to simulator */}
      <div className="mb-6">
        <Link
          href="/tools/income-wall"
          className="inline-block text-sm text-[var(--color-primary)] font-medium hover:underline"
        >
          &larr; シミュレーターに戻る
        </Link>
      </div>

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
