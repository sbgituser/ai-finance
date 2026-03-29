import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");

// Load data with relative paths (path aliases not available in scripts)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const toolsData = require("../src/data/tools.json") as {
  slug: string;
  title: string;
  description: string;
}[];
// eslint-disable-next-line @typescript-eslint/no-require-imports
const articlesData = require("../src/data/articles.json") as {
  slug: string;
  title: string;
  description: string;
}[];

const SITE_NAME = "AIファイナンスツール";
const PRIMARY_COLOR = "#059669";

async function fetchNotoSansJPBold(): Promise<ArrayBuffer | null> {
  try {
    // Use curl-like user-agent so Google Fonts returns TTF (not WOFF2)
    // satori's opentype.js does not support WOFF2 format
    const cssUrl =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap";
    const cssRes = await fetch(cssUrl, {
      headers: { "User-Agent": "curl/7.68.0" },
    });
    if (!cssRes.ok) throw new Error(`CSS fetch failed: ${cssRes.status}`);
    const css = await cssRes.text();
    const match = css.match(/src: url\(([^)]+)\)/);
    if (!match) throw new Error("Could not find font URL in CSS response");
    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) throw new Error(`Font fetch failed: ${fontRes.status}`);
    const contentType = fontRes.headers.get("content-type") ?? "";
    if (contentType.includes("woff2")) {
      throw new Error("Google returned WOFF2 which is unsupported by satori");
    }
    return await fontRes.arrayBuffer();
  } catch (e) {
    console.warn("[OGP] Font fetch failed:", (e as Error).message);
    return null;
  }
}

async function generateOGP(
  title: string,
  subtitle: string,
  fontData: ArrayBuffer | null
): Promise<Buffer> {
  const fonts: Parameters<typeof satori>[1]["fonts"] = fontData
    ? [
        {
          name: "NotoSansJP",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ]
    : [];

  const fontFamily = fontData ? "NotoSansJP, sans-serif" : "sans-serif";
  const titleFontSize = title.length > 25 ? 48 : title.length > 18 ? 54 : 60;

  // Truncate subtitle for display
  const displaySubtitle =
    subtitle.length > 60 ? subtitle.slice(0, 58) + "…" : subtitle;

  const element = {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#ffffff",
        padding: "0 80px",
        fontFamily,
        position: "relative" as const,
      },
      children: [
        // Left green accent bar
        {
          type: "div",
          props: {
            style: {
              position: "absolute" as const,
              top: "0",
              left: "0",
              width: "12px",
              height: "630px",
              backgroundColor: PRIMARY_COLOR,
            },
          },
        },
        // Top accent line
        {
          type: "div",
          props: {
            style: {
              width: "100px",
              height: "6px",
              backgroundColor: PRIMARY_COLOR,
              marginBottom: "36px",
              borderRadius: "3px",
            },
          },
        },
        // Main title
        {
          type: "div",
          props: {
            style: {
              fontSize: `${titleFontSize}px`,
              fontWeight: 700,
              color: "#111827",
              lineHeight: "1.25",
              marginBottom: "28px",
              maxWidth: "1020px",
            },
            children: title,
          },
        },
        // Subtitle
        {
          type: "div",
          props: {
            style: {
              fontSize: "28px",
              color: "#6b7280",
              lineHeight: "1.5",
              maxWidth: "1020px",
            },
            children: displaySubtitle,
          },
        },
        // Site name badge (bottom right)
        {
          type: "div",
          props: {
            style: {
              position: "absolute" as const,
              bottom: "40px",
              right: "72px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: "28px",
                    height: "28px",
                    backgroundColor: PRIMARY_COLOR,
                    borderRadius: "6px",
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "22px",
                    color: PRIMARY_COLOR,
                    fontWeight: 700,
                  },
                  children: SITE_NAME,
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(element as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts,
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  return Buffer.from(resvg.render().asPng());
}

async function main() {
  const outputDir = join(PROJECT_ROOT, "public", "ogp");
  mkdirSync(join(outputDir, "tools"), { recursive: true });
  mkdirSync(join(outputDir, "blog"), { recursive: true });

  console.log("[OGP] Fetching Noto Sans JP Bold font...");
  const fontData = await fetchNotoSansJPBold();
  if (fontData) {
    console.log("[OGP] Font loaded successfully.");
  } else {
    console.warn("[OGP] Font unavailable, images will render without Japanese font.");
  }

  let count = 0;

  // Default OGP
  console.log("[OGP] Generating default-ogp.png...");
  const defaultPng = await generateOGP(
    SITE_NAME,
    "完全ブラウザ内完結のAI家計分析・資産シミュレーション",
    fontData
  );
  writeFileSync(join(outputDir, "default-ogp.png"), defaultPng);
  count++;

  // Tool OGPs
  for (const tool of toolsData) {
    console.log(`[OGP] Generating tools/${tool.slug}.png...`);
    const png = await generateOGP(tool.title, tool.description, fontData);
    writeFileSync(join(outputDir, "tools", `${tool.slug}.png`), png);
    count++;
  }

  // Blog OGPs
  for (const article of articlesData) {
    console.log(`[OGP] Generating blog/${article.slug}.png...`);
    const png = await generateOGP(article.title, article.description, fontData);
    writeFileSync(join(outputDir, "blog", `${article.slug}.png`), png);
    count++;
  }

  console.log(`[OGP] Done! Generated ${count} images in public/ogp/`);
}

main().catch((e) => {
  console.error("[OGP] Fatal error:", e);
  process.exit(1);
});
