import BlogCard from "@/components/BlogCard";
import Breadcrumb from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";
import articlesData from "@/data/articles.json";

export const metadata = buildMetadata({
  title: "ブログ",
  description: `${siteConfig.name}の記事一覧。役立つ情報を発信しています。`,
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
