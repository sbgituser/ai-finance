import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCard from "@/components/ToolCard";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import { articleSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";
import articlesData from "@/data/articles.json";
import toolsData from "@/data/tools.json";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return articlesData.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articlesData.find((a) => a.slug === slug);
  if (!article) return {};
  return buildMetadata({ title: article.title, description: article.description, path: `/blog/${slug}`, ogImage: `/ogp/blog/${slug}.png` });
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articlesData.find((a) => a.slug === slug);
  if (!article) notFound();

  const relatedTools = toolsData.filter((t) => article.relatedTools?.includes(t.slug));
  const author = "author" in article ? (article.author as { name: string; description?: string }) : undefined;
  const schema = articleSchema({
    title: article.title,
    description: article.description,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    url: `${siteConfig.url}/blog/${slug}`,
    author,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "ブログ", href: "/blog" }, { name: article.title, href: `/blog/${article.slug}` }]} />
      <JsonLd data={schema} />

      <span className="text-sm text-[var(--color-primary)] font-medium mt-4 block">{article.category}</span>
      <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-2">{article.title}</h1>
      <time className="text-sm text-gray-400 block mb-4">
        更新日: {new Date(article.updatedAt).toLocaleDateString("ja-JP")}
      </time>

      {author && (
        <div className="flex items-center gap-3 mb-8 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
            {author.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{author.name}</p>
            {author.description && (
              <p className="text-xs text-gray-500 mt-0.5">{author.description}</p>
            )}
          </div>
        </div>
      )}

      <div className="prose prose-gray max-w-none">
        {article.content.split("\n").map((para, i) => {
          if (para.startsWith("## ")) {
            return <h2 key={i} className="text-xl font-bold mt-8 mb-3">{para.slice(3)}</h2>;
          }
          if (para.startsWith("- ")) {
            return <li key={i} className="ml-4 text-gray-700">{para.slice(2)}</li>;
          }
          if (para.match(/^\d+\./)) {
            return <li key={i} className="ml-4 text-gray-700">{para}</li>;
          }
          if (para.trim() === "") return null;
          return <p key={i} className="text-gray-700 leading-relaxed mb-4">{para}</p>;
        })}
      </div>

      {"faq" in article && article.faq && (
        <FAQ faqs={article.faq as { q: string; a: string }[]} />
      )}

      {relatedTools.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">関連ツール</h2>
          <div className="space-y-3">
            {relatedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
