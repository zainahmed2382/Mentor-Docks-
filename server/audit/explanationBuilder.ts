import type { DetailedAuditExplanation } from "../../src/types";

interface ExplanationContext {
  url?: string;
  lcpMs?: number | null;
  cls?: number | null;
  inpMs?: number | null;
  missingHeaders?: string[];
  missingAlt?: number;
  totalImages?: number;
  statusCode?: number;
  duplicateIds?: string[];
  missingLabels?: number;
  contrastRatio?: number;
  contrastFailuresCount?: number;
  responseTimeMs?: number;
  jsErrors?: string[];
  displayValue?: string;
  auditId?: string;
}

/**
 * Ensures technical terms are explained in simple English if present.
 */
function sanitizeJargon(text: string): string {
  if (!text) return text;

  let result = text;
  
  // Replace un-explained terms with friendly explanations
  const jargonMap: Array<[RegExp, string]> = [
    [/\bLCP\b(?!\s*\(|\s*simply|\s*means)/gi, "Largest Contentful Paint (LCP - how long it takes for the biggest part of your page to appear)"],
    [/\bCLS\b(?!\s*\(|\s*simply|\s*means)/gi, "Cumulative Layout Shift (CLS - how much page elements jump around while loading)"],
    [/\bINP\b(?!\s*\(|\s*simply|\s*means)/gi, "Interaction to Next Paint (INP - how fast your site reacts when a visitor taps a button)"],
    [/\bFID\b(?!\s*\(|\s*simply|\s*means)/gi, "First Input Delay (FID - how quickly the browser responds to a user's first tap)"],
    [/\bDOM\b(?!\s*\(|\s*simply|\s*means)/gi, "Document Object Model (DOM - the invisible structure holding your website elements)"],
    [/\bARIA\b(?!\s*\(|\s*simply|\s*means)/gi, "ARIA accessibility labels (code tags that help screen readers for blind visitors read your page aloud)"],
    [/\bTTFB\b(?!\s*\(|\s*simply|\s*means)/gi, "Time to First Byte (TTFB - how long your server takes to respond to a visitor)"],
    [/\bHTTP Headers\b(?!\s*\(|\s*simply|\s*means)/gi, "HTTP Response Headers (simple security instructions sent by your web server)"],
    [/\bContent Security Policy\b(?!\s*\(|\s*simply|\s*means)/gi, "Content Security Policy (CSP - security rules telling browsers which scripts are safe to run)"],
    [/\bPermissions Policy\b(?!\s*\(|\s*simply|\s*means)/gi, "Permissions Policy (security rules controlling access to features like camera or location)"],
    [/\bSSL\b(?!\s*\(|\s*simply|\s*means)/gi, "SSL (Secure Sockets Layer - the padlock security lock on your domain)"],
  ];

  for (const [pattern, replacement] of jargonMap) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

export function buildDetailedExplanation(
  key: string,
  title: string,
  description: string,
  category: string,
  severity: "critical" | "medium" | "minor",
  context: ExplanationContext = {}
): DetailedAuditExplanation {
  const rawUrl = context.url || "your website";
  // Strip http:// or https:// for clean domain reference
  const domainName = rawUrl.replace(/^https?:\/\//i, "").replace(/\/.*$/, "") || "your website";
  const normKey = key.toLowerCase();

  // Priority mapping
  const priority: "Critical" | "High" | "Medium" | "Low" =
    severity === "critical" ? "Critical" : severity === "medium" ? "Medium" : "Low";

  // 1. Unencrypted Website Connection (HTTP)
  if (normKey === "https" || normKey === "unreachable") {
    return {
      friendlyTitle: "Your Website Connection is Not Secure (HTTP Instead of HTTPS)",
      simpleProblem: `Your website (${domainName}) sends information in open text without an encrypted HTTPS lock.`,
      whyItHappened: `When people visit ${domainName}, their browser connects over regular HTTP. This means anyone on the same Wi-Fi network could theoretically see what pages they view or info they type.`,
      whyItMattersBullets: [
        "Visitors see a warning badge ('Not Secure') in Google Chrome and Safari address bars.",
        "Many potential customers immediately leave when they see security warnings.",
        "Google penalizes insecure websites by ranking them lower in search results.",
        "Mobile shoppers won't feel safe submitting contact forms or buying products.",
      ],
      howToFixSteps: [
        "Log into your domain host (like GoDaddy, Namecheap, Vercel, or Cloudflare).",
        "Enable a free SSL security certificate (SSL stands for Secure Sockets Layer, which adds the padlock icon).",
        "Set up an automatic redirect so all http:// traffic instantly moves to https://.",
      ],
      bestRecommendation: "We recommend turning on free Cloudflare SSL or Vercel Automatic HTTPS because it secures your entire site in 1 click without any code changes.",
      expectedImprovementBullets: [
        "Instant green padlock security trust badge in all browsers",
        "Better Google search ranking eligibility",
        "Higher visitor confidence and conversion rates",
        "Higher Lighthouse Security Score",
      ],
      priority: "Critical",
      difficulty: "Easy",
      timeRequired: "10 minutes",
      whereIsIssue: "Website Security & Domain Settings",
      readyToUseExample: `Redirect http://${domainName} to https://${domainName} automatically using your hosting provider's 1-click HTTPS toggle.`,
      codeSnippet: `// Example 301 Redirect in Nginx web server config:
server {
    listen 80;
    server_name ${domainName};
    return 301 https://$host$request_uri;
}`,
    };
  }

  // 2. Missing Security Headers
  if (normKey === "security_headers") {
    const missing = context.missingHeaders?.slice(0, 3).join(", ") || "security headers";
    return {
      friendlyTitle: "Your Web Server is Missing Essential Security Rules",
      simpleProblem: `Your website is missing basic web server security rules (${missing}) that protect visitors from online attacks.`,
      whyItHappened: `HTTP Response Headers (simple security instructions sent by your web server) are not configured yet. Without them, browsers don't know if foreign scripts or popups are allowed to load.`,
      whyItMattersBullets: [
        "Hackers could attempt to overlay fake login boxes on your website (called clickjacking).",
        "Harmful popups or third-party scripts could compromise visitor trust.",
        "Automated security scanners mark your domain as vulnerable.",
        "Search engine crawlers lower your site trust score over time.",
      ],
      howToFixSteps: [
        "Open your web server or hosting control panel (e.g. Vercel, Netlify, Cloudflare, or Nginx).",
        "Add standard security headers such as Content Security Policy (CSP - rules telling browsers which scripts are safe) and Strict Transport Security.",
        "If using Node.js or Express, install the free 'helmet' package to set them automatically in 1 line of code.",
      ],
      bestRecommendation: "If you use Node.js, add the 'helmet' package. If using Vercel or Netlify, add a simple headers rule in your config file.",
      expectedImprovementBullets: [
        "Full defense against malicious popups and fake frames",
        "Higher website safety trust rating",
        "Pass automated security audits cleanly",
        "Higher overall Lighthouse score",
      ],
      priority: severity === "critical" ? "Critical" : "High",
      difficulty: "Easy",
      timeRequired: "15 minutes",
      whereIsIssue: "Web Server Configuration & HTTP Headers",
      readyToUseExample: "Enable browser caching and security rules: Add 'X-Frame-Options: SAMEORIGIN' and 'X-Content-Type-Options: nosniff' to your web server.",
      codeSnippet: `// Node.js Express Server Setup:
import helmet from "helmet";
app.use(helmet());`,
    };
  }

  // 3. Viewport Meta Tag
  if (normKey === "viewport") {
    return {
      friendlyTitle: "Your Website Doesn't Auto-Fit Mobile Phone Screens",
      simpleProblem: "Mobile phones render your website at full desktop width and shrink it down, making text microscopic.",
      whyItHappened: "Your website is missing a simple mobile screen instruction tag inside its HTML head code.",
      whyItMattersBullets: [
        "Mobile visitors must constantly pinch and zoom to read your text.",
        "Buttons are tiny and hard to tap on smartphones.",
        "Google severely penalizes sites that fail mobile usability tests.",
        "Over 60% of web traffic comes from phones, so mobile users will leave immediately.",
      ],
      howToFixSteps: [
        "Open your main HTML file (index.html).",
        "Look for the `<head>` section near the top of the file.",
        "Paste this exact line of code: `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">`.",
        "Save and refresh your website on your phone to see it fit automatically.",
      ],
      bestRecommendation: "Add the standard viewport tag to the top of index.html. It takes less than 2 minutes and instantly makes your page fit mobile screens.",
      expectedImprovementBullets: [
        "Instant mobile-friendly rendering on all smartphones and tablets",
        "Better Google mobile search rankings",
        "Dramatically better experience for phone visitors",
        "+20 Points on Responsiveness Score",
      ],
      priority: "Critical",
      difficulty: "Easy",
      timeRequired: "2 minutes",
      whereIsIssue: "Homepage HTML <head> Code",
      readyToUseExample: `Add this tag inside <head>: <meta name="viewport" content="width=device-width, initial-scale=1.0">`,
      codeSnippet: `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>`,
    };
  }

  // 4. Missing Alt Text on Images
  if (normKey === "alt_text") {
    const missingAlt = context.missingAlt || 1;
    const total = context.totalImages || 1;
    return {
      friendlyTitle: "Some Website Images are Missing Description Labels (Alt Text)",
      simpleProblem: `${missingAlt} out of ${total} images on your website don't have text descriptions explaining what they show.`,
      whyItHappened: "When uploading images to your website, text description tags (called 'alt text') were left empty. Without alt text, screen readers for blind users and Google search engines cannot tell what the picture represents.",
      whyItMattersBullets: [
        "Visually impaired visitors using screen readers hear computer code names like 'IMG_4920.jpg' instead of helpful descriptions.",
        "Your images won't show up in Google Image search results.",
        "Your site fails international web accessibility standards (WCAG).",
        "You miss out on free search traffic from Google Images.",
      ],
      howToFixSteps: [
        "Open your website editor, WordPress, or HTML files.",
        "Select each image and add a short, clear description of what is in the photo.",
        "For example, instead of leaving it blank, write: 'Black wireless over-ear headphones'.",
        "If an image is just a background visual divider, set alt='' so screen readers ignore it cleanly.",
      ],
      bestRecommendation: "Add short 5-10 word descriptive labels to all product photos and main banners.",
      expectedImprovementBullets: [
        "Full screen reader accessibility for visually impaired visitors",
        "New organic traffic from Google Image Search",
        "Better overall website accessibility score",
        "+10 Points on Accessibility",
      ],
      priority: "Medium",
      difficulty: "Easy",
      timeRequired: "10 minutes",
      whereIsIssue: "Website Images & Media",
      readyToUseExample: `Change <img src="hero.jpg"> to <img src="hero.jpg" alt="Friendly team collaborating around a desk in a bright office">`,
      codeSnippet: `<img src="product.jpg" alt="Black wireless over-ear noise cancelling headphones">`,
    };
  }

  // 5. Poor LCP (Largest Contentful Paint)
  if (normKey === "lcp" || title.toLowerCase().includes("lcp") || title.toLowerCase().includes("largest contentful paint")) {
    const lcpSec = context.lcpMs ? (context.lcpMs / 1000).toFixed(1) : "3.5";
    return {
      friendlyTitle: "The Main Banner on Your Page Takes Too Long to Load",
      simpleProblem: `Largest Contentful Paint (LCP - simply how long it takes for the biggest photo or banner on your page to appear) is taking ${lcpSec} seconds, which is slower than Google's 2.5 second goal.`,
      whyItHappened: "The main hero image or headline image at the top of your homepage is likely a large, uncompressed file (like a multi-megabyte PNG or JPG). The browser spends seconds downloading it before showing it to visitors.",
      whyItMattersBullets: [
        "Visitors sit looking at a blank space while the main picture slowly loads.",
        "Google penalizes slow-loading websites in search rankings.",
        "Mobile visitors on 4G connection may leave before the page finishes loading.",
        "Lower sales and lead sign-ups due to slow initial load.",
      ],
      howToFixSteps: [
        "Compress the main banner photo using a free tool like TinyPNG or Squoosh.",
        "Convert the photo from JPG/PNG into modern WebP format (which is up to 80% smaller in file size).",
        "Add `fetchpriority='high'` to the main image tag so the browser downloads it first.",
        "Avoid using massive 4K images for website banners.",
      ],
      bestRecommendation: "We recommend converting your top hero image to WebP format and keeping its file size below 200 KB.",
      expectedImprovementBullets: [
        "Page loads almost 2 seconds faster",
        "Better Google search rankings (passes Core Web Vitals)",
        "Much smoother experience for mobile users",
        "+15 to +25 Performance Score Points",
      ],
      priority: severity === "critical" ? "Critical" : "High",
      difficulty: "Easy",
      timeRequired: "15 minutes",
      whereIsIssue: "Homepage Hero Banner Section",
      readyToUseExample: `Convert hero-banner.png (2.8 MB) into hero-banner.webp (180 KB) and add fetchpriority="high".`,
      codeSnippet: `<img src="/hero-banner.webp" alt="Welcome banner" fetchpriority="high" width="1200" height="600">`,
    };
  }

  // 6. Cumulative Layout Shift (CLS)
  if (normKey === "cls" || title.toLowerCase().includes("cls") || title.toLowerCase().includes("layout shift")) {
    return {
      friendlyTitle: "Page Elements Jump Around While Loading",
      simpleProblem: "Cumulative Layout Shift (CLS - simply how much buttons, text, and images shift around unexpectedly while the page loads) is causing visual instability.",
      whyItHappened: "Images or custom fonts are missing fixed height and width dimensions. When the image finally downloads, it pushes all the text below it downward suddenly.",
      whyItMattersBullets: [
        "Visitors try to tap a button, but it suddenly moves down and they accidentally tap the wrong link.",
        "The reading experience feels jumpy and unpolished.",
        "Google penalizes jumpy websites in search engine rankings.",
        "Frustrated users abandon checkout carts when layout shifts happen during checkout.",
      ],
      howToFixSteps: [
        "Add explicit width and height numbers to all image tags in your code.",
        "Reserve space in your design for banners before they finish downloading.",
        "Use modern CSS rules like `aspect-ratio` so the browser knows how much space to save.",
      ],
      bestRecommendation: "Add `width` and `height` attributes to every image tag on your website so the page layout stays steady.",
      expectedImprovementBullets: [
        "Perfect visual stability while loading",
        "No more accidental clicks on wrong buttons",
        "Passes Google Core Web Vitals audit",
        "+15 Performance Score Points",
      ],
      priority: severity === "critical" ? "Critical" : "High",
      difficulty: "Easy",
      timeRequired: "15 minutes",
      whereIsIssue: "Homepage Images & Layout Boxes",
      readyToUseExample: `Change <img src="banner.jpg"> to <img src="banner.jpg" width="800" height="400" style="aspect-ratio: 2/1;">`,
      codeSnippet: `<img src="banner.jpg" width="800" height="400" style="width: 100%; height: auto; aspect-ratio: 2 / 1;" alt="Main banner">`,
    };
  }

  // 7. Interaction to Next Paint (INP)
  if (normKey === "inp" || title.toLowerCase().includes("inp") || title.toLowerCase().includes("interaction")) {
    return {
      friendlyTitle: "Buttons & Menus React Slowly When Tapped",
      simpleProblem: "Interaction to Next Paint (INP - simply how fast your website reacts when a visitor taps a button or opens a menu) is taking too long.",
      whyItHappened: "When visitors click buttons, complex scripts execute all at once on the browser thread, causing a noticeable delay before the visual menu opens or updates.",
      whyItMattersBullets: [
        "Visitors tap a button, think it didn't work, and tap it multiple times.",
        "The website feels sluggish and unresponsive.",
        "Google ranks slow-reacting sites lower in mobile search.",
        "Users abandon forms due to delay feedback.",
      ],
      howToFixSteps: [
        "Break large script calculations into smaller steps so the button press shows feedback immediately.",
        "Remove unnecessary tracking scripts or delay them until after the main page loads.",
        "Show a loading spinner or active highlight as soon as a button is clicked.",
      ],
      bestRecommendation: "Update click handlers to update the screen state immediately before running heavy background calculations.",
      expectedImprovementBullets: [
        "Instant responsive feedback under 100ms when tapping buttons",
        "Passes Google Core Web Vitals inspection",
        "Higher customer satisfaction on mobile devices",
        "+15 Performance Score Points",
      ],
      priority: "High",
      difficulty: "Medium",
      timeRequired: "30 minutes",
      whereIsIssue: "Buttons, Menus & Form Submission Controls",
      readyToUseExample: "Update button click event code to show a loading state instantly within 16 milliseconds.",
      codeSnippet: `button.addEventListener('click', () => {
  // 1. Show spinner immediately
  showLoadingSpinner();
  // 2. Perform action in background
  setTimeout(runDataProcessing, 0);
});`,
    };
  }

  // 8. Low Color Contrast
  if (normKey === "contrast" || title.toLowerCase().includes("contrast")) {
    return {
      friendlyTitle: "Text is Hard to Read Due to Faint Colors",
      simpleProblem: "The color of your text is too light or close to the background color, making it difficult for people to read.",
      whyItHappened: "Using light gray text on a white background (or dark gray text on a dark background) fails contrast standards. Text needs a contrast ratio of at least 4.5 to 1 to be readable.",
      whyItMattersBullets: [
        "Elderly visitors or people with visual impairments cannot read your text.",
        "Anyone reading your site on a smartphone outdoors in bright sunlight will struggle to see the copy.",
        "Visitors skip over important information because reading takes extra effort.",
        "Lower accessibility audit scores.",
      ],
      howToFixSteps: [
        "Darken light gray text on white backgrounds.",
        "Make sure text stands out clearly against its background.",
        "Use contrast checker tools to verify text color is easily readable.",
      ],
      bestRecommendation: "Change faint gray body text (#94A3B8) to a darker charcoal shade (#334155 or #0F172A).",
      expectedImprovementBullets: [
        "Effortless reading experience for all visitors in any light",
        "100% compliance with web accessibility standards",
        "Higher conversion rates on product copy",
        "+10 Points on Accessibility",
      ],
      priority: "Medium",
      difficulty: "Easy",
      timeRequired: "10 minutes",
      whereIsIssue: "Website Body Copy & Labels",
      readyToUseExample: "Replace CSS rule `color: #a0aec0` with `color: #1a202c` for body copy on light backgrounds.",
      codeSnippet: `/* High contrast text styling */
.body-text {
  color: #1e293b; /* Dark Slate - 7:1 Contrast Ratio on white */
}`,
    };
  }

  // 9. Meta Description Missing
  if (normKey === "meta_description") {
    return {
      friendlyTitle: "Missing Google Search Result Summary (Meta Description)",
      simpleProblem: "Your website does not have a meta description, so Google has to guess what summary text to show under your search result link.",
      whyItHappened: "The invisible summary tag (`<meta name=\"description\">`) was left out of your HTML head section.",
      whyItMattersBullets: [
        "Google search results may display random, cut-off sentences from your page instead of a polished sales pitch.",
        "Fewer people click on your link when browsing Google search results.",
        "You lose control over how your brand is presented in search results.",
        "Missed opportunity to highlight special offers or key services.",
      ],
      howToFixSteps: [
        "Write a 1 to 2 sentence summary (140-160 characters) explaining what your business or site offers.",
        "Add this tag inside your HTML `<head>`: `<meta name=\"description\" content=\"Your clear summary here...\">`.",
        "Include a clear call to action, like 'Shop online today' or 'Book your free consultation'.",
      ],
      bestRecommendation: "Add a friendly 150-character meta description highlighting your main offering and a reason to click.",
      expectedImprovementBullets: [
        "Polished, professional appearance in Google search results",
        "More clicks from people searching for your services",
        "Better control over search snippet text",
        "+10 SEO Score Points",
      ],
      priority: "Medium",
      difficulty: "Easy",
      timeRequired: "5 minutes",
      whereIsIssue: "SEO Meta Tags (<head>)",
      readyToUseExample: `Add to <head>: <meta name="description" content="Discover handcrafted organic coffee beans roasted fresh daily. Order online today for free shipping on orders over $30.">`,
      codeSnippet: `<head>
  <meta name="description" content="Discover handcrafted organic coffee beans roasted fresh daily. Order online today for free shipping.">
</head>`,
    };
  }

  // 10. JavaScript Errors
  if (normKey === "js_errors" || title.toLowerCase().includes("javascript")) {
    const errSample = context.jsErrors?.[0] || "Uncaught TypeError: Cannot read property of undefined";
    return {
      friendlyTitle: "Interactive Code Crashed in the Visitor's Browser",
      simpleProblem: "A script on your website stopped working due to an error, which can cause buttons, contact forms, or popups to fail.",
      whyItHappened: `The browser encountered a broken script instruction (${errSample.slice(0, 80)}...).`,
      whyItMattersBullets: [
        "Contact forms or checkout buttons might stop responding when clicked.",
        "Interactive galleries, dropdown menus, or mobile drawers may fail to open.",
        "Google's search bot might encounter errors when indexing dynamic content.",
        "Lost sales if errors happen during customer sign-ups.",
      ],
      howToFixSteps: [
        "Open Developer Tools in your browser (press F12 or right-click -> Inspect -> Console).",
        "Locate the line number of the red error message.",
        "Add safety checks (`if (element)` or `?.`) so the code handles missing data smoothly.",
      ],
      bestRecommendation: "Add safety fallback checks to script variables so missing data never freezes the interface.",
      expectedImprovementBullets: [
        "Flawless button clicks and form submissions",
        "Smooth navigation across all devices",
        "Zero hidden script crashes",
        "+15 Code Quality Score Points",
      ],
      priority: "Critical",
      difficulty: "Medium",
      timeRequired: "20 minutes",
      whereIsIssue: "Website JavaScript & Interactive Components",
      readyToUseExample: "Replace risky script code `user.name` with safe code `user?.name || 'Guest'`.",
      codeSnippet: `// Safe code handling:
try {
  runInteractiveMenu();
} catch (error) {
  console.warn("Handled gracefully:", error);
}`,
    };
  }

  // 11. Missing H1 Heading
  if (normKey === "h1_missing") {
    return {
      friendlyTitle: "Your Page is Missing a Main Headline (H1 Heading)",
      simpleProblem: "Your page does not have a primary `<h1>` headline tag telling visitors and search engines what the page is about.",
      whyItHappened: "Headlines were styled visually using paragraph bold text instead of a proper `<h1>` HTML tag.",
      whyItMattersBullets: [
        "Google uses the H1 headline to understand the main topic of your page.",
        "Screen readers for visually impaired users rely on H1 tags to introduce page sections.",
        "Without an H1 tag, search engine indexing is less effective.",
        "Page structure looks incomplete to automated crawlers.",
      ],
      howToFixSteps: [
        "Add one main `<h1>` tag at the top of your page content.",
        "Write a clear title summarizing your page (e.g. `<h1>Organic Artisan Coffee in Chicago</h1>`).",
        "Make sure you only have ONE primary H1 tag per page.",
      ],
      bestRecommendation: "Wrap your main homepage banner title in an `<h1>` tag.",
      expectedImprovementBullets: [
        "Clear document hierarchy for Google search bots",
        "Better keyword ranking relevance",
        "Full screen reader accessibility",
        "+10 SEO Score Points",
      ],
      priority: "Medium",
      difficulty: "Easy",
      timeRequired: "5 minutes",
      whereIsIssue: "Homepage Hero Title",
      readyToUseExample: `Replace <div class="title">My Shop</div> with <h1>My Shop - Quality Handmade Leather Goods</h1>.`,
      codeSnippet: `<h1>Welcome to Acme Studio - Premium Web Design Services</h1>`,
    };
  }

  // 12. Multiple H1 Headings
  if (normKey === "h1_multiple") {
    return {
      friendlyTitle: "Your Page Has Too Many Main Headlines (Multiple H1s)",
      simpleProblem: "Your page contains more than one `<h1>` headline tag, which can confuse search engines about your main topic.",
      whyItHappened: "Multiple sections on your page were assigned H1 tags instead of using sub-heading tags like H2 or H3.",
      whyItMattersBullets: [
        "Google search bots aren't sure which headline is the most important.",
        "Document structure becomes confusing for screen reader users.",
        "Dilutes the SEO power of your primary target keyword.",
      ],
      howToFixSteps: [
        "Keep the single main title as `<h1>`.",
        "Change secondary section titles to `<h2>` or `<h3>` tags.",
        "Use CSS styles to keep the visual size looking great.",
      ],
      bestRecommendation: "Keep 1 main `<h1>` title at the top and change section titles to `<h2>`.",
      expectedImprovementBullets: [
        "Clean, structured outline for search engine crawlers",
        "Focused keyword relevance for Google ranking",
        "+5 Typography & SEO Points",
      ],
      priority: "Low",
      difficulty: "Easy",
      timeRequired: "5 minutes",
      whereIsIssue: "Section Headings",
      readyToUseExample: `Change secondary section title <h1>Our Services</h1> to <h2>Our Services</h2>.`,
      codeSnippet: `<!-- Main Title (Only One) -->
<h1>Acme Web Agency</h1>

<!-- Sub-Section Titles -->
<h2>Our Services</h2>
<h2>Client Testimonials</h2>`,
    };
  }

  // 13. Missing Open Graph Tags
  if (normKey === "og_tags") {
    return {
      friendlyTitle: "Missing Social Media Share Preview Card Tags",
      simpleProblem: "When someone shares your website link on WhatsApp, Facebook, or LinkedIn, it shows a plain text link without a photo preview card.",
      whyItHappened: "Open Graph metadata tags (`og:title`, `og:image`, `og:description`) are missing from your HTML head section.",
      whyItMattersBullets: [
        "Social media shares look plain and uninteresting without a photo banner.",
        "People are far less likely to click plain text links on social feeds.",
        "Missed opportunity to showcase your brand logo or lead image.",
      ],
      howToFixSteps: [
        "Create a share preview graphic (1200 x 630 pixels) with your logo or main hero image.",
        "Add `og:title`, `og:description`, and `og:image` tags to your HTML `<head>`.",
        "Test your link on social preview tools to confirm the preview card shows up.",
      ],
      bestRecommendation: "Add Open Graph image and title tags so sharing your website link automatically displays a beautiful preview card.",
      expectedImprovementBullets: [
        "Eye-catching rich preview cards on WhatsApp, Facebook, LinkedIn, and X",
        "More clicks and traffic from social shares",
        "Higher social media engagement",
        "+8 SEO & Social Traffic Points",
      ],
      priority: "Low",
      difficulty: "Easy",
      timeRequired: "10 minutes",
      whereIsIssue: "Social Media Share Preview Tags (<head>)",
      readyToUseExample: `Add to <head>: <meta property="og:title" content="My Shop"> <meta property="og:image" content="https://${domainName}/og-share.jpg">`,
      codeSnippet: `<head>
  <meta property="og:title" content="Acme Studio - Creative Design Agency">
  <meta property="og:description" content="We build high-converting websites for growing brands.">
  <meta property="og:image" content="https://${domainName}/share-preview.jpg">
</head>`,
    };
  }

  // 14. Render-blocking resources / PageSpeed Optimizations (Default / Dynamic Fallback)
  const cleanTitle = sanitizeJargon(title || "Website Performance & Accessibility Check");
  const cleanDesc = sanitizeJargon(description || "This issue affects page loading speed or visitor readability.");
  
  // Deduce where issue is based on category / title
  let issueLocation = "Homepage & Page Assets";
  if (category === "performance") issueLocation = "Page Assets & Speed Settings";
  else if (category === "accessibility") issueLocation = "Page Layout & Text Accessibility";
  else if (category === "seo") issueLocation = "Search Engine Meta Information";
  else if (category === "responsive") issueLocation = "Mobile Layout & Screen Scaling";
  else if (category === "code") issueLocation = "Website Code & Server Setup";
  else if (category === "typography") issueLocation = "Fonts & Text Structure";

  return {
    friendlyTitle: cleanTitle,
    simpleProblem: `On ${domainName}, ${cleanDesc.split(". ")[0] || "an asset or setting is slowing down page load times"}.`,
    whyItHappened: `During our scan of ${domainName}, we detected resources or tags that take extra time to download or render. ${cleanDesc.slice(0, 150)}.`,
    whyItMattersBullets: [
      "Visitors have to wait extra time before seeing full page contents.",
      "Slower loading speeds lower your Google Lighthouse performance score.",
      "Mobile users experience slower page rendering on cell networks.",
      "Can hurt customer retention and lead conversion rates.",
    ],
    howToFixSteps: [
      "Review the highlighted files or tags on your website.",
      "Compress files (images, scripts, styles) to keep file sizes as small as possible.",
      "Defer non-critical files so the main page appears first.",
      "Re-scan your website to verify score improvements.",
    ],
    bestRecommendation: `Optimize resources on ${domainName} by compressing image files under 300 KB and deferring heavy scripts.`,
    expectedImprovementBullets: [
      "Faster page load speed for visitors",
      "Better Google search ranking potential",
      "Smoother experience on mobile phones",
      "Higher Lighthouse Audit Score",
    ],
    priority,
    difficulty: category === "code" || category === "performance" ? "Medium" : "Easy",
    timeRequired: "15 minutes",
    whereIsIssue: issueLocation,
    readyToUseExample: `Enable browser caching and asset compression for CSS, JavaScript, and images on ${domainName}.`,
    codeSnippet: `// Example optimization directive:
Cache-Control: public, max-age=31536000, immutable`,
  };
}
