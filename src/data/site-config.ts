export const siteConfig = {
  name: "AIファイナンスツール",
  description: "完全ブラウザ内完結のAI家計分析・資産シミュレーション。あなたのデータは一切外部に送信しません。",
  domain: "ai-finance.kuras-plus.com",
  url: "https://ai-finance.kuras-plus.com",
  theme: "green" as const,
  amazonTag: "kurasplus-22",
  ga4Id: "",
  ogImage: "/images/og-default.png",
  twitterHandle: "",
  nav: [
    { label: "ツール", href: "/tools" },
    { label: "ブログ", href: "/blog" },
  ],
};

export const themeColors = {
  blue:   { primary: "#2563EB", accent: "#3B82F6", bg: "#EFF6FF" },
  green:  { primary: "#059669", accent: "#10B981", bg: "#ECFDF5" },
  purple: { primary: "#7C3AED", accent: "#8B5CF6", bg: "#F5F3FF" },
  orange: { primary: "#EA580C", accent: "#F97316", bg: "#FFF7ED" },
};
