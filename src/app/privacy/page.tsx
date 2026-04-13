import Breadcrumb from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";

export const metadata = buildMetadata({
  title: "プライバシーポリシー",
  description: `${siteConfig.name}のプライバシーポリシー。データの取り扱い、アクセス解析、広告プログラムについてご説明します。`,
  path: "/privacy",
  ogImage: "/ogp/default-ogp.png",
});

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "プライバシーポリシー", href: "/privacy" }]} />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-gray-400 mb-8">最終更新日: 2026年4月7日</p>

      <div className="prose prose-gray max-w-none space-y-10">
        <section>
          <h2 className="text-xl font-bold mb-3">1. 基本方針</h2>
          <p className="text-gray-700 leading-relaxed">
            {siteConfig.name}（以下「当サイト」）は、ユーザーのプライバシーを最優先に考えて運営されています。
            当サイトが提供するすべてのシミュレーションツールはブラウザ内（クライアントサイドJavaScript）で動作し、
            ユーザーが入力したデータは一切外部サーバーに送信されません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. ユーザーデータの取り扱い</h2>
          <h3 className="text-lg font-semibold mb-2 mt-4">ツールへの入力データ</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-green-800 text-sm font-medium">
              当サイトのツールに入力された収入・支出・資産額等の金融データは、すべてお使いのブラウザ内で処理されます。
              これらのデータが当サイトのサーバーや第三者に送信されることは一切ありません。
            </p>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
            <li>入力データはブラウザのメモリ上でのみ処理されます</li>
            <li>ページを閉じると入力データは完全に消去されます</li>
            <li>データベースやクラウドストレージへの保存は行いません</li>
            <li>ユーザーアカウントの作成は不要です</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2 mt-6">個人情報の収集</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            当サイトでは、氏名・住所・電話番号・メールアドレス等の個人情報を収集することはありません。
            お問い合わせの際にメールアドレスをご提供いただいた場合は、返信の目的にのみ使用し、第三者に提供することはありません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. アクセス解析（Google Analytics）</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            当サイトでは、サイトの利用状況を把握し改善するため、Google LLC が提供するアクセス解析ツール
            「Google Analytics 4（GA4）」を使用しています。
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
            <li>Google Analytics はCookieを使用してアクセス情報を収集します</li>
            <li>収集されるデータは匿名化されており、個人を特定する情報は含まれません</li>
            <li>収集されるデータ: ページビュー、滞在時間、参照元、使用デバイス・ブラウザ情報など</li>
            <li>データの収集・処理はGoogleのプライバシーポリシーに基づきます</li>
          </ul>
          <p className="text-gray-700 text-sm leading-relaxed mt-3">
            Google Analytics によるデータ収集を無効にしたい場合は、
            ブラウザの設定でCookieを無効にするか、
            Googleが提供する<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline">オプトアウトアドオン</a>をご利用ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. 広告・アフィリエイトプログラム</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            当サイトは、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定された
            アフィリエイトプログラムである「Amazonアソシエイト・プログラム」に参加しています。
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
            <li>商品リンクをクリックしてAmazon.co.jpで購入された場合、当サイトが紹介料を受け取ります</li>
            <li>Amazonのサイトにおけるデータの取り扱いはAmazonのプライバシーポリシーに従います</li>
            <li>当サイトからAmazonに送信されるのはリンクのクリック情報のみです</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Cookieの使用</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            当サイトでは、Google Analytics および Amazon アソシエイトの機能提供のためにCookieを使用しています。
            Cookieはブラウザの設定により無効化することが可能です。
            ただし、Cookieを無効にした場合でも当サイトのツール機能には影響ありません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">6. ポリシーの変更</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            当プライバシーポリシーは、法令の改正やサービス内容の変更に伴い、予告なく変更される場合があります。
            変更後のポリシーは当ページに掲載した時点で効力を生じます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. お問い合わせ</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            プライバシーポリシーに関するお問い合わせは、下記までご連絡ください。
          </p>
          <p className="text-gray-700 text-sm mt-2">
            メール: info@kuras-plus.com
          </p>
        </section>
      </div>
    </div>
  );
}
