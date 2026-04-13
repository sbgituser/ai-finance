import Breadcrumb from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMetadata({
  title: "運営者情報・サイトについて",
  description: `${siteConfig.name}の運営者情報、サイトの理念、免責事項をご案内します。`,
  path: "/about",
  ogImage: "/ogp/default-ogp.png",
});

export default function AboutPage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: `${siteConfig.url}/images/logo.png`,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "運営者情報", href: "/about" }]} />
      <JsonLd data={organizationSchema} />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-8">運営者情報・サイトについて</h1>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">サイト概要</h2>
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="bg-gray-50 px-4 py-3 text-left font-medium w-1/3">サイト名</th>
              <td className="px-4 py-3">{siteConfig.name}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="bg-gray-50 px-4 py-3 text-left font-medium">URL</th>
              <td className="px-4 py-3">{siteConfig.url}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="bg-gray-50 px-4 py-3 text-left font-medium">運営者</th>
              <td className="px-4 py-3">kuras（個人運営）</td>
            </tr>
            <tr>
              <th className="bg-gray-50 px-4 py-3 text-left font-medium">お問い合わせ</th>
              <td className="px-4 py-3">info@kuras-plus.com</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">サイトの理念</h2>
        <div className="prose prose-gray max-w-none space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {siteConfig.name}は「プライバシーファースト」を基本理念とした、ブラウザ完結型の家計管理・資産シミュレーションサイトです。
          </p>
          <p className="text-gray-700 leading-relaxed">
            多くの家計管理サービスでは、銀行口座やクレジットカード情報をクラウドサーバーに送信する必要があります。
            当サイトのツールはすべてブラウザ内（JavaScript）で計算処理を行い、入力データを一切外部サーバーに送信しません。
          </p>
          <p className="text-gray-700 leading-relaxed">
            年収・資産額・ローン残高など、特に機密性の高い金融情報を安心して入力できる環境を提供することが、当サイトの最大の価値です。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">コンテンツ制作方針</h2>
        <div className="prose prose-gray max-w-none space-y-4">
          <p className="text-gray-700 leading-relaxed">
            当サイトの記事・ツールは、公的統計データ（総務省家計調査、国土交通省住宅調査等）や信頼性の高い調査レポートを根拠として制作しています。
          </p>
          <p className="text-gray-700 leading-relaxed">
            金融・家計に関する情報（YMYL領域）を扱うサイトとして、正確性と最新性の維持に努めています。
            情報の更新日は各ページに明記しています。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">免責事項</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-sm text-gray-600 space-y-3">
          <p>
            当サイトのシミュレーションツールが提供する計算結果は、一般的な統計データや数理モデルに基づく参考値であり、
            将来の投資成果や家計改善を保証するものではありません。
          </p>
          <p>
            当サイトの情報を利用して行った投資・資産運用・家計管理の結果について、運営者は一切の責任を負いません。
            実際の金融判断は、ファイナンシャルプランナー等の専門家にご相談ください。
          </p>
          <p>
            当サイトに掲載されている情報の正確性には万全を期していますが、その内容を保証するものではありません。
            情報は予告なく変更・削除される場合があります。
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">広告・アフィリエイトについて</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          当サイトはAmazonアソシエイト・プログラムに参加しています。
          記事やツールページ内で紹介する商品リンクを通じて購入された場合、当サイトが紹介料を受け取ることがあります。
          なお、アフィリエイト報酬の有無がコンテンツの評価や推奨に影響することはありません。
        </p>
      </section>
    </div>
  );
}
