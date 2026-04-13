import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import { webApplicationSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import {
  allLivingCostModels,
  cities,
  households,
  incomes,
} from "@/data/living-cost";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "生活費シミュレーター【都市別・世帯別】2026年版",
    description:
      "東京・大阪・名古屋・福岡・札幌の5都市×4世帯タイプ×3年収帯で生活費の内訳を一覧表示。家賃・食費・光熱費・貯蓄率がひと目でわかる無料シミュレーター。",
    path: "/tools/living-cost",
  });
}

const faqs = [
  {
    q: "生活費シミュレーターの計算根拠は何ですか？",
    a: "総務省の家計調査および各都市の住宅情報をもとに、都市別の家賃相場、世帯人数別の食費・光熱費などを概算しています。あくまで目安としてご利用ください。",
  },
  {
    q: "年収300万円と500万円で生活レベルはどれくらい変わりますか？",
    a: "年収300万円では貯蓄率8%前後と節約重視の生活になりますが、年収500万円では貯蓄率15%前後を確保しつつ余裕のある生活が可能です。特に食費や娯楽費に差が出ます。",
  },
  {
    q: "東京と地方都市で一番大きな差はどこですか？",
    a: "家賃が最も大きな差を生みます。東京の一人暮らし家賃は約7.5万円ですが、札幌では約4.2万円と4割以上安くなります。その分を貯蓄や娯楽に回すことができます。",
  },
  {
    q: "子どもの人数で生活費はどれくらい変わりますか？",
    a: "子ども1人増えるごとに月2〜4万円程度の支出増が目安です。食費・教育費・保険料が主な増加要因で、住居も広めの物件が必要になり家賃も上がります。",
  },
  {
    q: "貯蓄率の目安はどれくらいですか？",
    a: "一般的に手取りの10〜20%が目安です。年収300万円の場合は8%前後、年収700万円なら20%以上を目指すのが理想的です。先取り貯蓄で自動化するのがおすすめです。",
  },
];

export default function LivingCostHubPage() {
  // サマリーテーブル用: 各都市のsingle-500を表示
  const summaryModels = cities.map(
    (c) => allLivingCostModels.find((m) => m.id === `${c.id}-single-500`)!,
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "ツール", href: "/tools" },
          { name: "生活費シミュレーター", href: "/tools/living-cost" },
        ]}
      />

      <JsonLd
        data={webApplicationSchema({
          title: "生活費シミュレーター【都市別・世帯別】",
          description:
            "5都市×4世帯×3年収帯で生活費モデルを比較できる無料ツール",
          slug: "living-cost",
        })}
      />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        生活費シミュレーター【都市別・世帯別】
      </h1>
      <p className="text-gray-500 mb-6">
        東京・大阪・名古屋・福岡・札幌の5都市、一人暮らし・夫婦二人・子育て世帯の4タイプ、
        年収300万・500万・700万円の3パターンで生活費の内訳と貯蓄率をシミュレーションします。
        気になる組み合わせをクリックして詳細をご覧ください。
      </p>

      {/* 都市別リンク */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">都市から探す</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {cities.map((c) => (
            <Link
              key={c.id}
              href={`/tools/living-cost/city/${c.id}`}
              className="block text-center px-4 py-3 bg-[var(--color-bg)] border border-gray-200 rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors font-medium"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 世帯別リンク */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">世帯タイプから探す</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {households.map((h) => (
            <Link
              key={h.id}
              href={`/tools/living-cost/household/${h.id}`}
              className="block text-center px-4 py-3 bg-[var(--color-bg)] border border-gray-200 rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors font-medium"
            >
              {h.label}
            </Link>
          ))}
        </div>
      </section>

      {/* サマリーテーブル: 都市別 一人暮らし年収500万 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">都市別生活費の比較（一人暮らし・年収500万円）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg)] text-left">
                <th className="px-3 py-2 border border-gray-200 font-semibold">都市</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">家賃</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">食費</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">月間支出</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">貯蓄率</th>
              </tr>
            </thead>
            <tbody>
              {summaryModels.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200">
                    <Link
                      href={`/tools/living-cost/${m.id}`}
                      className="text-[var(--color-primary)] hover:underline font-medium"
                    >
                      {m.cityLabel}
                    </Link>
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right">
                    {m.monthlyBudget.rent.toLocaleString("ja-JP")}円
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right">
                    {m.monthlyBudget.food.toLocaleString("ja-JP")}円
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right">
                    {m.totalMonthly.toLocaleString("ja-JP")}円
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right">
                    {m.savingsRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 全モデル一覧テーブル */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">全モデル一覧</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg)] text-left">
                <th className="px-3 py-2 border border-gray-200 font-semibold">都市</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold">世帯</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">年収</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">月間支出</th>
                <th className="px-3 py-2 border border-gray-200 font-semibold text-right">貯蓄率</th>
              </tr>
            </thead>
            <tbody>
              {allLivingCostModels.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200">{m.cityLabel}</td>
                  <td className="px-3 py-2 border border-gray-200">{m.householdLabel}</td>
                  <td className="px-3 py-2 border border-gray-200 text-right">
                    <Link
                      href={`/tools/living-cost/${m.id}`}
                      className="text-[var(--color-primary)] hover:underline font-medium"
                    >
                      {m.annualIncome}万円
                    </Link>
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right">
                    {m.totalMonthly.toLocaleString("ja-JP")}円
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right">
                    {m.savingsRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <FAQ faqs={faqs} />

      {/* YMYL disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-gray-500 space-y-1">
        <p>※ 生活費モデルは統計データを基にした概算です。実際の支出は個人の生活スタイルにより大きく異なります。</p>
        <p>※ 出典: <a href="https://www.stat.go.jp/data/kakei/" className="underline" target="_blank" rel="noopener noreferrer">総務省 家計調査</a></p>
      </div>
    </div>
  );
}
