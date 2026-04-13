import BlogCard from "@/components/BlogCard";
import Breadcrumb from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";
import articlesData from "@/data/articles.json";

export const metadata = buildMetadata({
  title: "AI×家計管理・資産運用ガイド｜最新記事一覧",
  description:
    "AI家計管理・資産形成・節約術・住宅ローン・投資の始め方まで、お金にまつわる実践ガイドを発信。ブラウザ完結の無料シミュレーターと連携した記事で家計改善をサポートします。",
  path: "/blog",
  ogImage: "/ogp/default-ogp.png",
});

export default function BlogListPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "記事一覧", href: "/blog" }]} />
      <h1 className="text-2xl md:text-3xl font-bold mb-8 mt-4">ブログ記事一覧</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articlesData.map((article) => (
          <BlogCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
