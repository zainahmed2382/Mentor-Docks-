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

export function buildDetailedExplanation(
  key: string,
  title: string,
  description: string,
  category: string,
  severity: "critical" | "medium" | "minor",
  context: ExplanationContext = {}
): DetailedAuditExplanation {
  const url = context.url || "your website";
  const priority: "High" | "Medium" | "Low" =
    severity === "critical" ? "High" : severity === "medium" ? "Medium" : "Low";

  // 1. HTTPS Not Enforced
  if (key === "https") {
    return {
      friendlyTitle: "Unencrypted Website Connection (HTTP Instead of HTTPS)",
      whatItMeans:
        "Your website sends data between the visitor and server in plain text without SSL encryption. Visitors on public Wi-Fi networks can have their sensitive data intercepted.",
      whyItExists: `The web server at ${url} serves content over http:// or does not automatically redirect visitors to the secure https:// protocol.`,
      realImpact: {
        userExperience:
          "Modern web browsers like Chrome and Safari show a warning badge ('Not Secure') in the address bar, scaring visitors away.",
        seoRankings:
          "Google officially uses HTTPS as a core ranking signal. Insecure sites suffer ranking penalties in Google Search.",
        conversions:
          "Studies show up to 64% of visitors immediately abandon checkout or contact forms when a 'Not Secure' warning appears.",
      },
      realWorldExample:
        "Sending personal postcards through the mail where anyone can read the written contents, instead of using a sealed envelope.",
      stepByStepSolution: [
        "Obtain an SSL/TLS certificate from your hosting provider or Let's Encrypt.",
        "Install the SSL certificate on your web server (Nginx, Apache, or Caddy).",
        "Add a 301 Permanent Redirect rule forcing all HTTP requests to load over HTTPS.",
        "Update internal menu links, image sources, and sitemaps to use https:// URLs.",
      ],
      solutions: [
        {
          title: "Automatic SSL via Cloudflare CDN (Recommended)",
          description: "Route your domain DNS through Cloudflare to get free, auto-renewing SSL certificates and HTTP/2 proxying.",
          isRecommended: true,
          whyRecommended: "Zero server management required and instant global CDN speedup.",
          codeSnippet: "# Cloudflare Always Use HTTPS setting: Enabled",
        },
        {
          title: "Nginx 301 Redirect Rule",
          description: "Add a redirection server block in your Nginx configuration.",
          isRecommended: false,
          codeSnippet: `server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}`,
        },
      ],
      bestPractices: [
        "Enable HSTS (Strict-Transport-Security) header to prevent SSL stripping attacks.",
        "Ensure all assets (images, fonts, scripts) load via HTTPS to prevent mixed-content warnings.",
      ],
      mistakesToAvoid: [
        "Using self-signed certificates in production environments.",
        "Leaving http:// URLs hardcoded inside JavaScript or CSS files.",
      ],
      estimatedImprovement: "+12 Overall Score Points & Eliminates Browser Security Warnings",
      difficulty: "Easy",
      priority: "High",
      timeRequired: "15-30 minutes",
      expectedPerformanceGain: "Instant security trust & baseline Google SEO compliance",
      codeSnippet: `<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`,
    };
  }

  // 2. Missing Security Headers
  if (key === "security_headers") {
    const missing = context.missingHeaders?.join(", ") || "security headers";
    return {
      friendlyTitle: "Missing Web Server Security Headers",
      whatItMeans:
        "Security headers are special instructions sent by your web server to tell the browser how to protect your users against cross-site scripting (XSS), clickjacking, and data theft.",
      whyItExists: `Your HTTP response headers are missing recommended defense policies: ${missing}.`,
      realImpact: {
        userExperience:
          "Leaves visitors vulnerable to malicious scripts, pop-ups, or fake frames attempting to capture passwords on your site.",
        seoRankings:
          "Indirectly impacts SEO as security scanners lower your domain trust score.",
        conversions:
          "Security breaches or bad script injections destroy brand trust and lead to instant lost revenue.",
      },
      realWorldExample:
        "Building a bank vault with thick steel walls but leaving the back window unlocked without an alarm system.",
      stepByStepSolution: [
        "Access your web server configuration file (Nginx config, Vercel headers, or Express app).",
        "Add Content-Security-Policy, Strict-Transport-Security, and X-Content-Type-Options.",
        "Test your updated server response headers using online security checkers.",
      ],
      solutions: [
        {
          title: "Express Helmet Middleware (Node.js)",
          description: "Install and use Helmet to set safe default HTTP security headers automatically.",
          isRecommended: true,
          whyRecommended: "One line of code secures Express backends with industry defaults.",
          codeSnippet: `import helmet from "helmet";
app.use(helmet());`,
        },
        {
          title: "Nginx Directives",
          description: "Append custom header rules to your Nginx location block.",
          isRecommended: false,
          codeSnippet: `add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`,
        },
      ],
      bestPractices: [
        "Test Content-Security-Policy rules in Report-Only mode before enforcing them strictly.",
        "Set X-Frame-Options to SAMEORIGIN to block clickjacking iframe attacks.",
      ],
      mistakesToAvoid: [
        "Setting CSP header so tightly that third-party analytics (Google Analytics) break.",
        "Omitting Strict-Transport-Security on HTTPS domains.",
      ],
      estimatedImprovement: "+10 Security Score Points",
      difficulty: "Easy",
      priority,
      timeRequired: "10-20 minutes",
      expectedPerformanceGain: "Full protection against clickjacking and XSS injection vulnerabilities",
      codeSnippet: `// Node.js Express Helmet setup
const helmet = require('helmet');
app.use(helmet());`,
    };
  }

  // 3. Viewport Meta Tag
  if (key === "viewport") {
    return {
      friendlyTitle: "Mobile Viewport Configuration Missing",
      whatItMeans:
        "Without a viewport tag, mobile browsers render your web page at a desktop resolution (usually 980px wide) and shrink it down, making text microscopic and unreadable on phones.",
      whyItExists: "The HTML document `<head>` lacks a `<meta name='viewport'>` declaration.",
      realImpact: {
        userExperience:
          "Mobile users must pinch and zoom to read text or tap tiny buttons, leading to high frustration.",
        seoRankings:
          "Google uses Mobile-First Indexing. Missing viewport tags result in severe mobile ranking drops.",
        conversions:
          "Mobile conversion rates drop by up to 80% when page layout does not scale to device screens.",
      },
      realWorldExample:
        "Trying to read a full-size printed newspaper through a tiny smartphone screen without re-formatting the text.",
      stepByStepSolution: [
        "Open your main HTML template file (e.g. index.html).",
        "Locate the `<head>` tag section near the top.",
        "Insert `<meta name='viewport' content='width=device-width, initial-scale=1.0'>`.",
        "Test responsive scaling across mobile screen widths.",
      ],
      solutions: [
        {
          title: "Standard Mobile Viewport Tag",
          description: "Tells mobile devices to set page width equal to the device screen width.",
          isRecommended: true,
          whyRecommended: "Universal standard compatible with 100% of modern mobile browsers.",
          codeSnippet: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
        },
      ],
      bestPractices: [
        "Always include width=device-width and initial-scale=1.0.",
        "Avoid using user-scalable=no unless creating a mobile canvas game.",
      ],
      mistakesToAvoid: [
        "Hardcoding fixed pixel widths like width=1024 in the meta tag.",
        "Placing the viewport tag outside of the `<head>` element.",
      ],
      estimatedImprovement: "+20 Responsiveness Score Points",
      difficulty: "Easy",
      priority: "High",
      timeRequired: "2 minutes",
      expectedPerformanceGain: "Pass Google Mobile-Friendly compliance immediately",
      codeSnippet: `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>`,
    };
  }

  // 4. Alt Text Missing
  if (key === "alt_text") {
    const missingAlt = context.missingAlt || 1;
    const total = context.totalImages || 1;
    return {
      friendlyTitle: "Images Missing Alternative Descriptions (Alt Text)",
      whatItMeans:
        "Alternative text (`alt`) describes image contents to screen readers for visually impaired users and helps Google understand what the images represent.",
      whyItExists: `${missingAlt} out of ${total} images on ${url} lack descriptive alt attributes.`,
      realImpact: {
        userExperience:
          "Screen readers read out raw file names like 'IMG_9210.png', confusing blind or low-vision visitors.",
        seoRankings:
          "Images fail to rank in Google Images search results, missing out on image search traffic.",
        conversions:
          "Excludes millions of users with disabilities and increases web accessibility legal risk.",
      },
      realWorldExample:
        "Hanging paintings in an art gallery with the labels turned backwards so nobody knows what they represent.",
      stepByStepSolution: [
        "Inspect image elements (`<img>`) in your HTML/JSX code.",
        "Write a short, clear description of the image content in the `alt` property.",
        "For purely decorative images or background icons, use `alt=''` so screen readers skip them cleanly.",
      ],
      solutions: [
        {
          title: "Descriptive Alt Tags",
          description: "Provide meaningful descriptions for content images and empty `alt=''` for decorative graphics.",
          isRecommended: true,
          whyRecommended: "Satisfies WCAG 2.1 AA accessibility guidelines completely.",
          codeSnippet: `<!-- Informational Image -->
<img src="product.jpg" alt="Black wireless over-ear headphones with noise cancellation">

<!-- Decorative Graphic -->
<img src="divider.svg" alt="" aria-hidden="true">`,
        },
      ],
      bestPractices: [
        "Keep alt descriptions concise (under 125 characters).",
        "Describe what the image visually conveys without saying 'image of' or 'photo of'.",
      ],
      mistakesToAvoid: [
        "Stuffing alt tags with repetitive keyword spam.",
        "Leaving alt text blank for important charts or diagrams.",
      ],
      estimatedImprovement: "+8 to +15 Accessibility Score Points",
      difficulty: "Easy",
      priority: "Medium",
      timeRequired: "10-15 minutes",
      expectedPerformanceGain: "Full screen reader compliance & Google Image search indexing",
      codeSnippet: `<img src="dashboard.jpg" alt="Analytics dashboard showing monthly user growth charts">`,
    };
  }

  // 5. Poor LCP (Largest Contentful Paint)
  if (key === "lcp" || title.toLowerCase().includes("lcp") || title.toLowerCase().includes("largest contentful paint")) {
    const lcpMs = context.lcpMs ? Math.round(context.lcpMs) : 3200;
    return {
      friendlyTitle: "Main Page Content Takes Too Long to Load (Slow LCP)",
      whatItMeans:
        "Largest Contentful Paint (LCP) measures how fast the main visual piece of content (hero image, headline, or banner) appears on screen. Your site takes ~" +
        (lcpMs / 1000).toFixed(1) +
        "s, exceeding Google's 2.5s goal.",
      whyItExists: `The primary hero element took ${lcpMs}ms to render due to uncompressed images, slow server response times, or render-blocking scripts.`,
      realImpact: {
        userExperience:
          "Visitors stare at a blank screen or loading spinner for several seconds, increasing frustration.",
        seoRankings:
          "LCP is a Core Web Vitals metric. Google actively penalizes sites with poor LCP scores in search rankings.",
        conversions:
          "Every 1-second delay in initial load time reduces conversion rates by up to 7%.",
      },
      realWorldExample:
        "Sitting at a restaurant table for 10 minutes before the waiter even brings a glass of water.",
      stepByStepSolution: [
        "Preload the hero image in your document `<head>` using `<link rel='preload' as='image'>`.",
        "Compress the hero image into modern Next-Gen WebP or AVIF format.",
        "Add `fetchpriority='high'` to the hero `<img>` tag.",
        "Defer non-critical JavaScript files and eliminate render-blocking CSS.",
      ],
      solutions: [
        {
          title: "Preload Hero Image & Convert to WebP",
          description: "Instruct the browser to download the main hero image before anything else and compress it to WebP.",
          isRecommended: true,
          whyRecommended: "Directly cuts 1.0 to 2.5 seconds off initial paint times.",
          codeSnippet: `<!-- Preload in HTML Head -->
<link rel="preload" as="image" href="/hero.webp" type="image/webp" fetchpriority="high">`,
        },
        {
          title: "Enable Cloudflare / CDN Cache",
          description: "Serve static assets from edge servers close to your users.",
          isRecommended: false,
          codeSnippet: `Cache-Control: public, max-age=31536000, immutable`,
        },
      ],
      bestPractices: [
        "Never lazy-load (`loading='lazy'`) the hero image; lazy loading delays LCP!",
        "Use modern responsive image `srcset` for mobile vs desktop screen dimensions.",
      ],
      mistakesToAvoid: [
        "Using massive multi-megabyte PNG or uncompressed JPEG images for the hero section.",
        "Loading heavy fonts before rendering hero text.",
      ],
      estimatedImprovement: "+15 to +30 Performance Score Points (~1.5s faster initial load)",
      difficulty: "Medium",
      priority: "High",
      timeRequired: "30-45 minutes",
      expectedPerformanceGain: "Sub-2.5s Core Web Vitals pass grade",
      codeSnippet: `<img src="/hero.webp" alt="Hero Banner" width="1200" height="600" fetchpriority="high">`,
    };
  }

  // 6. Cumulative Layout Shift (CLS)
  if (key === "cls" || title.toLowerCase().includes("cls") || title.toLowerCase().includes("layout shift")) {
    const clsVal = context.cls ? context.cls.toFixed(3) : "0.220";
    return {
      friendlyTitle: "Page Content Jumps Around While Loading (Layout Shift / CLS)",
      whatItMeans:
        "Cumulative Layout Shift (CLS) measures visual stability. As images, fonts, or ads load unexpectedly, elements jump on screen, causing users to accidentally tap the wrong link or button.",
      whyItExists: `Cumulative Layout Shift is ${clsVal} (target is 0.10 or less). Images or dynamic content missing fixed width and height dimensions cause layout recalculations.`,
      realImpact: {
        userExperience:
          "Extremely annoying; users tap a button just as an image shifts down, causing accidental clicks on wrong links or ads.",
        seoRankings:
          "High CLS triggers a direct Google Core Web Vitals search ranking penalty.",
        conversions:
          "Leads to accidental form resets, abandoned shopping carts, and high bounce rates.",
      },
      realWorldExample:
        "Trying to click a menu option on a tablet while someone keeps shaking the table.",
      stepByStepSolution: [
        "Add explicit `width` and `height` attributes to all `<img>` and `<iframe>` elements.",
        "Use CSS `aspect-ratio` to reserve layout space before images download.",
        "Pre-allocate container height for dynamic banners or ads.",
        "Preload web fonts to prevent Font Synthesis reflow shifts.",
      ],
      solutions: [
        {
          title: "Set Explicit Dimensions & CSS Aspect Ratio",
          description: "Reserve layout bounding boxes before assets finish downloading.",
          isRecommended: true,
          whyRecommended: "Completely eliminates layout shifts caused by delayed image rendering.",
          codeSnippet: `<img src="banner.jpg" width="800" height="400" style="aspect-ratio: 2/1; width: 100%; height: auto;" alt="Banner">`,
        },
      ],
      bestPractices: [
        "Use `font-display: swap` for web fonts to minimize layout shift during font load.",
        "Reserve skeleton placeholders for dynamically fetched data blocks.",
      ],
      mistakesToAvoid: [
        "Injecting dynamic banners above existing content without pre-allocating height.",
      ],
      estimatedImprovement: "+10 to +20 Performance Points & Perfect Visual Stability",
      difficulty: "Easy",
      priority: "High",
      timeRequired: "15-20 minutes",
      expectedPerformanceGain: "CLS reduced to optimal sub-0.05 level",
      codeSnippet: `img {\n  max-width: 100%;\n  height: auto;\n  aspect-ratio: 16 / 9;\n}`,
    };
  }

  // 7. Interaction to Next Paint (INP)
  if (key === "inp" || title.toLowerCase().includes("inp") || title.toLowerCase().includes("interaction")) {
    const inpMs = context.inpMs ? Math.round(context.inpMs) : 340;
    return {
      friendlyTitle: "Sluggish Button Taps & Input Response (Slow INP)",
      whatItMeans:
        "Interaction to Next Paint (INP) measures how quickly your website responds visually when a user clicks a button, opens a navigation drawer, or types into an input field.",
      whyItExists: `Interaction response latency measured at ${inpMs}ms (target is under 200ms). Heavy JavaScript tasks hog the main browser thread.`,
      realImpact: {
        userExperience:
          "The website feels frozen or laggy. Users tap buttons multiple times thinking the page broke.",
        seoRankings:
          "INP is an official Google Core Web Vitals metric used to judge site quality.",
        conversions:
          "Slow interaction feedback leads to double submissions, checkout errors, and user abandonment.",
      },
      realWorldExample:
        "Pressing a door bell and hearing no sound for 3 seconds, leaving you wondering if it works.",
      stepByStepSolution: [
        "Break long JavaScript functions into smaller async tasks using `setTimeout` or `requestIdleCallback`.",
        "Remove or defer non-critical third-party analytics scripts.",
        "Avoid executing heavy calculations inside input change handlers.",
      ],
      solutions: [
        {
          title: "Yield Execution to Main Thread",
          description: "Yield control back to the browser UI renderer before executing heavy data processing.",
          isRecommended: true,
          whyRecommended: "Ensures visual click feedback happens instantly within 16ms.",
          codeSnippet: `button.addEventListener('click', async () => {
  // 1. Show feedback UI immediately
  showSpinner();
  // 2. Yield to browser renderer
  await new Promise(r => setTimeout(r, 0));
  // 3. Perform heavy operation
  processData();
});`,
        },
      ],
      bestPractices: [
        "Keep JavaScript main-thread tasks under 50ms.",
        "Use Web Workers for CPU-intensive data transformations.",
      ],
      mistakesToAvoid: [
        "Running un-throttled event listeners on window scroll or resize events.",
      ],
      estimatedImprovement: "+10 to +18 Performance Score Points",
      difficulty: "Advanced",
      priority: "High",
      timeRequired: "30-60 minutes",
      expectedPerformanceGain: "Instant UI touch and click response under 100ms",
      codeSnippet: `const yieldToMain = () => new Promise(res => setTimeout(res, 0));`,
    };
  }

  // 8. Low Color Contrast
  if (key === "contrast" || title.toLowerCase().includes("contrast")) {
    return {
      friendlyTitle: "Low Text Contrast Makes Reading Difficult",
      whatItMeans:
        "Text colors blend into the background, failing WCAG AA accessibility contrast standards (minimum 4.5:1 ratio required for standard text).",
      whyItExists: `Detected text elements with insufficient contrast ratios on ${url}.`,
      realImpact: {
        userExperience:
          "Causes eye strain. Elderly users, visually impaired visitors, or people outdoors in bright sunlight cannot read your content.",
        seoRankings:
          "Accessibility failures lower overall page quality scores in search engine audits.",
        conversions:
          "Visitors skip reading important descriptions, terms, or button text due to illegibility.",
      },
      realWorldExample:
        "Writing text with a pale yellow pen on light yellow paper.",
      stepByStepSolution: [
        "Identify low-contrast text elements in your CSS/Tailwind styles.",
        "Darken light text on light backgrounds or lighten text on dark backgrounds.",
        "Ensure a minimum contrast ratio of 4.5:1 for body copy and 3:1 for large headings.",
      ],
      solutions: [
        {
          title: "Upgrade Text Color Tokens",
          description: "Replace faint gray text classes with higher-contrast slate/zinc neutrals.",
          isRecommended: true,
          whyRecommended: "Guarantees 100% WCAG AA readability compliance.",
          codeSnippet: `/* Fails (2.8:1): color: #94a3b8 on white */
/* Passes (7.1:1): */
.body-text {
  color: #334155; /* Slate 700 */
}`,
        },
      ],
      bestPractices: [
        "Use contrast checker tools during design phase.",
        "Maintain high contrast across both light and dark themes.",
      ],
      mistakesToAvoid: [
        "Using faint gray (#ccc) for form labels or placeholder copy.",
      ],
      estimatedImprovement: "+8 to +12 Accessibility Score Points",
      difficulty: "Easy",
      priority: "Medium",
      timeRequired: "10 minutes",
      expectedPerformanceGain: "Full WCAG AA color accessibility compliance",
      codeSnippet: `.accessible-text {\n  color: #0f172a; /* Deep Slate 900 */\n  background-color: #ffffff;\n}`,
    };
  }

  // 9. Meta Description Missing
  if (key === "meta_description") {
    return {
      friendlyTitle: "Missing Search Snippet Summary (Meta Description)",
      whatItMeans:
        "The meta description is the short summary snippet that appears underneath your page title in Google search results. Without it, Google picks random text from your page.",
      whyItExists: "No `<meta name='description'>` tag was found inside the document `<head>`.",
      realImpact: {
        userExperience:
          "Searchers see broken or generic page snippet text in Google results instead of a clear summary.",
        seoRankings:
          "Lowers click-through rate (CTR) from search engine result pages.",
        conversions:
          "Misses the chance to present a compelling call-to-action to potential visitors on Google.",
      },
      realWorldExample:
        "Publishing a book with a blank back cover summary.",
      stepByStepSolution: [
        "Write a 140-160 character summary of your page.",
        "Insert `<meta name='description' content='...'>` in the `<head>` section.",
        "Include primary keywords naturally with a call to action.",
      ],
      solutions: [
        {
          title: "Add Strategic Meta Description Tag",
          description: "Provide a concise summary highlighting key value propositions.",
          isRecommended: true,
          whyRecommended: "Directly improves search snippet click-through rates.",
          codeSnippet: `<meta name="description" content="Discover instant website audit tools to boost speed, accessibility, and Google SEO rankings. Scan your site for free today.">`,
        },
      ],
      bestPractices: [
        "Keep meta descriptions between 140 and 160 characters.",
        "Ensure every page on your site has a unique meta description.",
      ],
      mistakesToAvoid: [
        "Duplicating identical descriptions across multiple site pages.",
      ],
      estimatedImprovement: "+10 SEO Score Points & Increased Search CTR",
      difficulty: "Easy",
      priority: "Medium",
      timeRequired: "5 minutes",
      expectedPerformanceGain: "Professional snippet appearance in Google Search results",
      codeSnippet: `<head>\n  <meta name="description" content="Comprehensive real-time website audit powered by Google PageSpeed Insights. Fix SEO, speed, and accessibility issues.">\n</head>`,
    };
  }

  // 10. JavaScript Errors
  if (key === "js_errors" || title.toLowerCase().includes("javascript")) {
    const errSample = context.jsErrors?.slice(0, 2)?.join(" | ") || "Uncaught TypeError: Cannot read property of undefined";
    return {
      friendlyTitle: "Uncaught JavaScript Runtime Errors Detected",
      whatItMeans:
        "JavaScript code crashed in the browser while rendering, which can break dynamic buttons, forms, modals, or dropdown menus.",
      whyItExists: `Uncaught browser exception: ${errSample}.`,
      realImpact: {
        userExperience:
          "Forms fail to submit, buttons become unresponsive, or the screen freezes completely.",
        seoRankings:
          "Googlebot search crawlers encountering JS errors may fail to render and index dynamic content.",
        conversions:
          "Severe revenue loss if JS exceptions occur during checkout or lead capture.",
      },
      realWorldExample:
        "A vending machine accepting your coins and then freezing before dispensing your item.",
      stepByStepSolution: [
        "Open Developer Tools Console (F12) to locate the exact line number of the error.",
        "Add optional chaining (`?.`) and fallback default values to prevent undefined reference crashes.",
        "Wrap API calls in `try...catch` blocks.",
      ],
      solutions: [
        {
          title: "Defensive Optional Chaining & Fallbacks",
          description: "Safely access properties and provide default fallback values.",
          isRecommended: true,
          whyRecommended: "Prevents uncaught runtime exceptions from crashing the UI.",
          codeSnippet: `// Safely handle potentially missing data
const itemTitle = data?.result?.title ?? "Default Title";`,
        },
      ],
      bestPractices: [
        "Use React Error Boundaries to catch sub-component errors gracefully.",
        "Monitor client-side errors in production using Sentry or LogRocket.",
      ],
      mistakesToAvoid: [
        "Ignoring console errors during local development testing.",
      ],
      estimatedImprovement: "+15 Code Quality Score Points",
      difficulty: "Medium",
      priority: "High",
      timeRequired: "20-30 minutes",
      expectedPerformanceGain: "Flawless script execution and interface stability",
      codeSnippet: `try {\n  initializeWidget();\n} catch (err) {\n  console.warn("Widget failed gracefully:", err);\n}`,
    };
  }

  // 11. Generic/Dynamic PageSpeed Audits (Default Fallback Generator)
  return {
    friendlyTitle: title || "Website Optimization Opportunity",
    whatItMeans:
      description ||
      "This issue was flagged by Google PageSpeed Insights and web crawler heuristics as a key area for performance, accessibility, or SEO improvement.",
    whyItExists: `Audited condition on ${url}: ${description.slice(0, 250)}.`,
    realImpact: {
      userExperience:
        "Affects overall page responsiveness, rendering smoothness, or visual accessibility for visitors.",
      seoRankings:
        "Contributes to Google Lighthouse quality index scoring and Core Web Vitals assessment.",
      conversions:
        "Optimizing this issue reduces page friction, improving user retention and goal completions.",
    },
    realWorldExample:
      "Driving a sports car with slightly under-inflated tires—it works, but you lose speed and efficiency.",
    stepByStepSolution: [
      "Review the specific resources or DOM nodes highlighted in this audit finding.",
      "Apply modern web optimization best practices (asset compression, deferring scripts, or adding ARIA attributes).",
      "Re-run the audit scan to verify metric improvements.",
    ],
    solutions: [
      {
        title: "Automated Build & Asset Optimization",
        description: "Utilize modern bundler plugins (Vite, Webpack) to compress and inline critical resources automatically.",
        isRecommended: true,
        whyRecommended: "Solves asset delivery bottlenecks systematically across the entire site.",
        codeSnippet: `// vite.config.ts build optimization\nexport default {\n  build: {\n    minify: 'terser',\n    cssMinify: true\n  }\n}`,
      },
    ],
    bestPractices: [
      "Continuously monitor performance metrics after major code deployments.",
      "Follow official Google Web Vitals guidelines.",
    ],
    mistakesToAvoid: [
      "Over-optimizing at the cost of breaking site functionality or analytics.",
    ],
    estimatedImprovement: "+5 to +15 Metric Score Points",
    difficulty: category === "code" || category === "performance" ? "Medium" : "Easy",
    priority,
    timeRequired: "15-30 minutes",
    expectedPerformanceGain: "Measurable speed and compliance enhancement",
    codeSnippet: `/* Applied optimization directive */\n@media (prefers-reduced-motion: reduce) {\n  * { animation-duration: 0.01ms !important; }\n}`,
  };
}
