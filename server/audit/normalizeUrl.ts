export function normalizeUrl(input: string): { ok: true; url: string } | { ok: false; error: string } {
  let url = input.trim();
  if (!url) {
    return { ok: false, error: "URL is required" };
  }

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes(".")) {
      return { ok: false, error: "Invalid URL structure. Please provide a valid domain (e.g., website.com)" };
    }
    return { ok: true, url: parsed.toString() };
  } catch {
    return { ok: false, error: "Invalid URL structure. Please provide a valid domain (e.g., website.com)" };
  }
}
