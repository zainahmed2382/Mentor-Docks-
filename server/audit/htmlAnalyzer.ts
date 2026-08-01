import * as cheerio from "cheerio";
import type { HtmlAnalysis } from "./types";

export function analyzeHtml(html: string): HtmlAnalysis {
  const $ = cheerio.load(html);
  const lower = html.toLowerCase();

  const pageTitle = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() || "";

  const hasViewport =
    $('meta[name="viewport"]').length > 0 ||
    lower.includes('name="viewport"') ||
    lower.includes("name='viewport'");

  const hasLang = $("html[lang]").length > 0 && Boolean($("html").attr("lang")?.trim());
  const hasCanonical = $('link[rel="canonical"]').length > 0;

  const images = $("img");
  const imageCount = images.length;
  let imagesWithAlt = 0;
  let imagesWithEmptyAlt = 0;
  images.each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt !== undefined) {
      if (alt.trim().length > 0) imagesWithAlt += 1;
      else imagesWithEmptyAlt += 1;
    }
  });

  const semanticTagsCount = $("header, footer, nav, main, article, section, aside").length;
  const h1 = $("h1").length;
  const h2 = $("h2").length;
  const h3 = $("h3").length;
  const headings = { h1, h2, h3, total: h1 + h2 + h3 + $("h4, h5, h6").length };

  const ogTagsCount = $('meta[property^="og:"]').length;
  const scriptTagsCount = $("script").length;
  const styleTagsCount = $('link[rel="stylesheet"]').length + $("style").length;
  const inlineStyleCount = $("[style]").length;
  const linkTagsCount = $("a[href]").length;

  const idMap = new Map<string, number>();
  $("[id]").each((_, el) => {
    const id = $(el).attr("id");
    if (id) idMap.set(id, (idMap.get(id) || 0) + 1);
  });
  const duplicateIds = [...idMap.entries()].filter(([, c]) => c > 1).map(([id]) => id).slice(0, 10);

  let missingFormLabels = 0;
  $("input, select, textarea").each((_, el) => {
    const tag = el.tagName?.toLowerCase();
    if (tag === "input" && $(el).attr("type") === "hidden") return;
    const id = $(el).attr("id");
    const ariaLabel = $(el).attr("aria-label") || $(el).attr("aria-labelledby");
    const hasLabel = id ? $(`label[for="${id}"]`).length > 0 : false;
    if (!hasLabel && !ariaLabel) missingFormLabels += 1;
  });

  const iframeCount = $("iframe").length;

  return {
    pageTitle,
    metaDescription,
    hasViewport,
    hasLang,
    hasCanonical,
    imageCount,
    imagesWithAlt,
    imagesWithEmptyAlt,
    semanticTagsCount,
    headings,
    ogTagsCount,
    scriptTagsCount,
    styleTagsCount,
    inlineStyleCount,
    linkTagsCount,
    isWordPress: lower.includes("/wp-content/") || lower.includes("/wp-includes/"),
    isShopify: lower.includes("cdn.shopify.com") || lower.includes("shopify.theme"),
    isReact:
      lower.includes("react-root") ||
      lower.includes("_next/static") ||
      lower.includes("data-reactroot"),
    htmlSizeBytes: Buffer.byteLength(html, "utf8"),
    duplicateIds,
    missingFormLabels,
    iframeCount,
  };
}
