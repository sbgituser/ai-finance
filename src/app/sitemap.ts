import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";

export const dynamic = "force-static";
import toolsData from "@/data/tools.json";
import articlesData from "@/data/articles.json";
import { getAllIncomeValues } from "@/lib/tax-calc";
import { incomeWalls, personTypeMap } from "@/lib/social-insurance-calc";
import { generateAllInvestmentScenarios, MONTHLY_AMOUNTS } from "@/lib/investment-calc";
import { allLivingCostModels, cities, households } from "@/data/living-cost";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date().toISOString();

  const tools = toolsData.map((tool) => ({
    url: `${base}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const articles = articlesData.map((article) => ({
    url: `${base}/blog/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 年収別手取り早見表
  const takeHomePay = getAllIncomeValues().map((income) => ({
    url: `${base}/tools/take-home-pay/${income}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 年収の壁
  const incomeWallPages = incomeWalls.map((wall) => ({
    url: `${base}/tools/income-wall/${wall.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const incomeWallTypePages = Object.keys(personTypeMap).map((type) => ({
    url: `${base}/tools/income-wall/type/${type}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 投資リターン
  const investmentPages = generateAllInvestmentScenarios().map((s) => ({
    url: `${base}/tools/investment-return/${s.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const investmentMonthlyPages = MONTHLY_AMOUNTS.map((amount) => ({
    url: `${base}/tools/investment-return/monthly/${amount}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 生活費
  const livingCostPages = allLivingCostModels.map((m) => ({
    url: `${base}/tools/living-cost/${m.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const livingCostCityPages = cities.map((c) => ({
    url: `${base}/tools/living-cost/city/${c.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const livingCostHouseholdPages = households.map((h) => ({
    url: `${base}/tools/living-cost/household/${h.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    ...tools,
    ...articles,
    // 新規ツールハブページ
    { url: `${base}/tools/take-home-pay`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/tools/take-home-pay/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...takeHomePay,
    { url: `${base}/tools/income-wall`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/tools/income-wall/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...incomeWallPages,
    ...incomeWallTypePages,
    { url: `${base}/tools/investment-return`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...investmentPages,
    ...investmentMonthlyPages,
    { url: `${base}/tools/living-cost`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...livingCostPages,
    ...livingCostCityPages,
    ...livingCostHouseholdPages,
  ];
}
