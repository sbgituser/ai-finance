import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/seo";
import { incomeWalls, categoryLabel, categoryColor } from "@/data/income-walls";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "年収の壁 改正前後 比較表【2026年改定対応】",
    description:
      "103万・106万・130万・150万・160万・201万円の壁を改正前後で一覧比較。2026年税制改正の影響が一目で分かる比較表です。",
    path: "/tools/income-wall/compare",
  });
}

export default function ComparePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "年収の壁シミュレーター", href: "/tools/income-wall" },
          { name: "改正前後の比較", href: "/tools/income-wall/compare" },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        年収の壁 改正前後 比較表【2026年改定対応】
      </h1>
      <p className="text-gray-500 mb-8">
        6つの年収の壁について、改正前と改正後の閾値・影響を一覧で比較できます。
      </p>

      {/* Comparison table */}
      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-3 border-b border-gray-200 font-medium">壁</th>
              <th className="text-left px-4 py-3 border-b border-gray-200 font-medium">カテゴリ</th>
              <th className="text-right px-4 py-3 border-b border-gray-200 font-medium">改正前（円）</th>
              <th className="text-right px-4 py-3 border-b border-gray-200 font-medium">改正後（円）</th>
              <th className="text-center px-4 py-3 border-b border-gray-200 font-medium">変化</th>
              <th className="text-left px-4 py-3 border-b border-gray-200 font-medium">施行日</th>
            </tr>
          </thead>
          <tbody>
            {incomeWalls.map((wall) => {
              const diff = wall.afterReform.threshold - wall.beforeReform.threshold;
              return (
                <tr key={wall.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 border-b border-gray-100">
                    <Link
                      href={`/tools/income-wall/${wall.id}`}
                      className="font-medium text-[var(--color-primary)] hover:underline"
                    >
                      {wall.threshold}万円の壁
                    </Link>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-100">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor[wall.category]}`}>
                      {categoryLabel[wall.category]}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-100 text-right tabular-nums">
                    {wall.beforeReform.threshold.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-100 text-right tabular-nums font-medium">
                    {wall.afterReform.threshold.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-100 text-center">
                    {diff > 0 ? (
                      <span className="text-green-600 font-medium">+{diff.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-400">変更なし</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-100 text-xs text-gray-500">
                    {wall.afterReform.effectiveDate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Visual comparison cards */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">各壁の改正ポイント</h2>
        <div className="space-y-4">
          {incomeWalls.map((wall) => {
            const diff = wall.afterReform.threshold - wall.beforeReform.threshold;
            const barMax = 2_200_000;
            const beforePct = (wall.beforeReform.threshold / barMax) * 100;
            const afterPct = (wall.afterReform.threshold / barMax) * 100;
            return (
              <div key={wall.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <Link
                    href={`/tools/income-wall/${wall.id}`}
                    className="font-bold text-[var(--color-primary)] hover:underline"
                  >
                    {wall.threshold}万円の壁
                  </Link>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor[wall.category]}`}>
                    {categoryLabel[wall.category]}
                  </span>
                </div>

                {/* Visual bar comparison */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-12">改正前</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-400 rounded-full transition-all"
                        style={{ width: `${beforePct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-20 text-right tabular-nums">
                      {wall.beforeReform.threshold.toLocaleString()}円
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--color-primary)] w-12">改正後</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                        style={{ width: `${afterPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-20 text-right tabular-nums">
                      {wall.afterReform.threshold.toLocaleString()}円
                    </span>
                  </div>
                </div>

                {diff > 0 && (
                  <p className="mt-2 text-sm text-green-600 font-medium">
                    +{diff.toLocaleString()}円 引き上げ
                  </p>
                )}

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                  <p><span className="font-medium">改正前:</span> {wall.beforeReform.impact}</p>
                  <p><span className="font-medium">改正後:</span> {wall.afterReform.impact}</p>
                </div>
              </div>
            );
          })}
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

      {/* YMYL disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-gray-500 space-y-1">
        <p>※ あくまで概算です。正確な金額は税理士・社会保険労務士にご相談ください。</p>
        <p>※ 2026年4月時点の税制・社会保険制度に基づいています。</p>
        <p>※ 出典: <a href="https://www.nta.go.jp/" className="underline" target="_blank" rel="noopener noreferrer">国税庁</a>、<a href="https://www.mhlw.go.jp/" className="underline" target="_blank" rel="noopener noreferrer">厚生労働省</a></p>
      </div>
    </div>
  );
}
