import ToolCard from "@/components/ToolCard";
import Breadcrumb from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";
import toolsData from "@/data/tools.json";

export const metadata = buildMetadata({
  title: "無料オンライン家計・資産シミュレーター6選｜ブラウザ完結で安心",
  description:
    "家計支出分析・複利計算・住宅ローン・手取り計算など無料のAI家計シミュレーターを一覧で紹介。すべてブラウザ完結でデータ送信なし、プライバシーも安心です。",
  path: "/tools",
  ogImage: "/ogp/default-ogp.png",
});

export default function ToolsListPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "ツール一覧", href: "/tools" }]} />
      <h1 className="text-2xl md:text-3xl font-bold mb-8 mt-4">ツール一覧</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {toolsData.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
