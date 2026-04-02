#!/usr/bin/env node
/**
 * Generates a blog post from the next topic in the queue.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node scripts/generate-blog-post.js
 *
 * What it does:
 *   1. Reads blog/topics.json and picks the first topic
 *   2. Calls Claude API to generate the blog post HTML
 *   3. Writes the post to blog/<slug>.html
 *   4. Adds a card to blog.html
 *   5. Removes the topic from the queue
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = path.resolve(__dirname, "..");
const TOPICS_FILE = path.join(ROOT, "blog", "topics.json");
const BLOG_INDEX = path.join(ROOT, "blog.html");

// ── Helpers ──────────────────────────────────────────────────────────────────

function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      reject(new Error("ANTHROPIC_API_KEY environment variable is required"));
      return;
    }

    const body = JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    });

    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
            return;
          }
          resolve(parsed.content[0].text);
        } catch (e) {
          reject(new Error(`Failed to parse API response: ${data.slice(0, 500)}`));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function todayFormatted() {
  const d = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function getTagIcon(tag) {
  if (tag === "Build Log") {
    return `<svg class="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`;
  }
  if (tag === "Case Study") {
    return `<svg class="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`;
  }
  if (tag === "Comparison") {
    return `<svg class="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/></svg>`;
  }
  // Opinion / default
  return `<svg class="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`;
}

function getGradient(tag) {
  if (tag === "Build Log") return "from-brand-400 to-brand-600";
  if (tag === "Case Study") return "from-brand-500 to-brand-700";
  if (tag === "Comparison") return "from-brand-600 to-emerald-600";
  return "from-brand-600 to-brand-900";
}

// Read existing blog posts to pass as context for "More Posts" section
function getExistingPosts() {
  const blogDir = path.join(ROOT, "blog");
  const posts = [];
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".html"));
  for (const file of files) {
    const content = fs.readFileSync(path.join(blogDir, file), "utf-8");
    const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/s);
    const dateMatch = content.match(/<span class="text-xs text-gray-400">(.*?)<\/span>/);
    if (titleMatch) {
      posts.push({
        slug: file.replace(".html", ""),
        title: titleMatch[1].replace(/<[^>]+>/g, "").trim(),
        date: dateMatch ? dateMatch[1] : "",
      });
    }
  }
  return posts;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Load topics
  if (!fs.existsSync(TOPICS_FILE)) {
    console.error("No topics.json found. Add topics to blog/topics.json first.");
    process.exit(1);
  }

  const topics = JSON.parse(fs.readFileSync(TOPICS_FILE, "utf-8"));
  if (topics.length === 0) {
    console.log("Topic queue is empty. Nothing to generate.");
    process.exit(0);
  }

  const topic = topics[0];
  const date = todayFormatted();
  const postPath = path.join(ROOT, "blog", `${topic.slug}.html`);

  if (fs.existsSync(postPath)) {
    console.log(`Post already exists: blog/${topic.slug}.html — skipping.`);
    topics.shift();
    fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2) + "\n");
    process.exit(0);
  }

  console.log(`Generating: "${topic.title}"...`);

  const existingPosts = getExistingPosts();
  const morePosts = existingPosts
    .slice(0, 2)
    .map(
      (p) =>
        `<a href="/blog/${p.slug}" class="block bg-white rounded-xl p-5 border border-gray-200/80 hover:border-brand-200 transition-colors">
                    <span class="text-xs text-gray-400">${p.date}</span>
                    <h4 class="font-semibold text-brand-900 mt-1">${p.title}</h4>
                </a>`
    )
    .join("\n                ");

  // 2. Generate post content via Claude
  const prompt = `You are writing a blog post for Solvr Labs (solvrlabs.com). The author is Jessy, a solo full-stack developer who builds AI automation systems for service businesses (plumbers, cleaners, landscapers, property managers). He uses n8n, Claude AI, Supabase, Next.js, Twilio, Stripe, and Vercel.

Write in first person. Casual but knowledgeable developer tone — like a dev diary / build log. Talk about real problems, real solutions, real tools. No marketing fluff. No filler. Be specific and technical where it helps, but keep it accessible.

=== SOLVR LABS PRODUCTS (weave these in naturally where relevant) ===

**Radar by Solvr Labs** (/radar) — The always-on AI receptionist & dispatcher for tradespeople. Target audience: independent plumbers, electricians, HVAC techs, and small service businesses who can't afford a full-time receptionist but can't afford to miss calls either. Tone: warm, reliable, service-oriented — Radar is a sidekick, not a replacement. The tradesperson is the hero.

Key product details:
- Answers calls 24/7/365, books jobs, dispatches emergencies, syncs to ServiceTitan/Jobber/Housecall Pro/Google Calendar/Discord/Slack/SMS/QuickBooks
- Each client names their own AI receptionist during onboarding (e.g. "Emma", "Sarah") — the AI answers using that name, feeling like a real hire, not a bot
- Custom-trained on each business: services, pricing, service area, availability
- Powered by ElevenLabs for natural voice — callers can't tell it's AI
- Simultaneous call handling (no hold times, even during peak season)
- 30+ languages with auto-detection
- Spam & robocall filtering
- Call transcripts & recordings
- Missed call recovery & auto follow-up
- Dedicated tech team (real engineers, not a ticket queue)
- Full AI mode starts at $149/mo + one-time setup fee (waived for Taskline users)
- No contracts, cancel anytime
- Marketing hooks: "Nothing gets past your Radar", "Your 24/7 front desk"

**Radar has TWO operating modes:**

1. **Full AI Mode** ($149/mo) — Radar handles everything autonomously. AI answers the call, has the conversation, books the job, dispatches emergencies, fires all integrations — no human needed. 24/7/365.

2. **Copilot Mode** (~half the price of full AI mode) — For businesses that want to keep a human receptionist on the phone. The human handles the conversation; Radar works behind the scenes in real time:
   - Extracts caller info (name, phone, address, service type, urgency, preferred time) with confidence scores
   - Surfaces knowledge base answers when callers ask questions (pricing, availability, policies)
   - Suggests what to ask next — dynamic checklist of missing info that auto-clears as the AI hears answers
   - Looks up caller history (past calls, previous jobs)
   - Queues up all integrations: calendar booking, ServiceTitan/Jobber job creation, Discord/Slack team alerts, SMS to on-call tech
   - After the call: receptionist reviews extracted data, edits if needed, enables/disables specific integrations, clicks "Confirm & Execute" — one click fires everything
   - Result: no manual data entry, no sticky notes, no forgetting to create the job
   - Dramatically increases receptionist productivity — they handle more calls because Radar does all the backend work
   - This is a KEY differentiator in every comparison: competitors force you to choose human OR AI. Radar gives you both working together. Always mention copilot mode in comparison posts.

**Taskline** (taskline.solvrlabs.com) — AI-powered job management platform for service businesses. Generates proposals, tracks jobs, manages clients. Built on Supabase. Taskline users get the Radar setup fee waived.

=== COMPETITOR POSITIONING GUIDELINES ===

When the topic involves comparisons or alternatives:
- Be factual and fair — acknowledge what competitors do well, then explain where Solvr Labs does it better or differently.
- Never trash competitors. Instead, highlight gaps: "X is great for Y, but if you need Z, that's where Radar comes in."
- Use specific, verifiable differentiators — not vague claims.
- Target the search intent: someone Googling "[Competitor] alternative" or "[Competitor] vs" is actively shopping. Give them a real comparison, then make the case.
- Name competitors directly in headings and body text for SEO. Don't be shy.
- When comparing pricing, be honest about ranges. Radar starts at $149/mo — compare that to per-minute answering services, $3-5K/mo receptionists, or $300+/mo AI phone platforms.
- Always end with why Solvr Labs is the right choice for independent tradespeople and small service businesses specifically.

=== TOPIC ===

Topic: ${topic.title}
Tag: ${topic.tag}
Summary: ${topic.summary}
Context: ${topic.context}

Return ONLY the article body HTML — the content that goes inside <article class="py-16 bg-white"><div class="max-w-3xl mx-auto px-6 prose">HERE</div></article>.

Use these HTML elements:
- <h2> for main sections
- <h3> for subsections
- <p> for paragraphs (with color: use the prose class styling)
- <ul><li> for lists
- <strong> for emphasis
- <code> for inline code/tool names
- <blockquote> for callout quotes
- <a href="/radar" class="text-brand-600 hover:text-brand-700 font-medium"> for Radar links
- <a href="https://taskline.solvrlabs.com" class="text-brand-600 hover:text-brand-700 font-medium" target="_blank"> for Taskline links
- <a href="/contact" class="text-brand-600 hover:text-brand-700 font-medium"> for CTA links

Write 800-1200 words. End with a natural CTA linking to /contact or /radar (whichever fits the topic). Do NOT include the article wrapper tags — just the inner content starting with an <h2>.`;

  const articleContent = await callClaude(prompt);

  // 3. Build full HTML page
  const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth overflow-x-hidden">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${topic.title} - Solvr Labs</title>
    <meta name="description" content="${topic.summary.replace(/"/g, "&quot;")}">
    <link rel="icon" type="image/png" href="../assets/favicon-solvrlabs.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: { 50:'#f0f5ff',100:'#e1ebff',200:'#c8d8fe',300:'#a3bffc',400:'#7da0f8',500:'#5a7de6',600:'#4664d6',700:'#3a53bd',800:'#33469a',900:'#2c3a7c',950:'#1d264e' },
                        gray: { 50:'#f9fafb',100:'#f2f3f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#1d1e20' },
                    },
                    fontFamily: { sans: ['"DM Sans"','system-ui','sans-serif'], display: ['"DM Sans"','system-ui','sans-serif'] },
                },
            },
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">
    <style>
        * { font-family: 'DM Sans', system-ui, sans-serif; }
        html { overflow-x: clip; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f2f3f6; } ::-webkit-scrollbar-thumb { background: #5a7de6; border-radius: 3px; }
        .reveal { opacity:0; transform:translateY(30px); transition:opacity 0.7s ease-out, transform 0.7s ease-out; }
        .reveal.visible { opacity:1; transform:translateY(0); }
        .reveal-delay-1 { transition-delay:0.1s; } .reveal-delay-2 { transition-delay:0.2s; } .reveal-delay-3 { transition-delay:0.3s; }
        .burger span { display:block; width:22px; height:2px; background:#2c3a7c; transition:all 0.3s ease; }
        .burger.active span:nth-child(1) { transform:rotate(45deg) translate(5px,5px); }
        .burger.active span:nth-child(2) { opacity:0; }
        .burger.active span:nth-child(3) { transform:rotate(-45deg) translate(5px,-5px); }
        .prose h2 { font-size: 1.5rem; font-weight: 700; color: #2c3a7c; margin-top: 2.5rem; margin-bottom: 1rem; }
        .prose h3 { font-size: 1.25rem; font-weight: 600; color: #33469a; margin-top: 2rem; margin-bottom: 0.75rem; }
        .prose p { color: #6b7280; line-height: 1.8; margin-bottom: 1.25rem; }
        .prose ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .prose ul li { color: #6b7280; line-height: 1.8; margin-bottom: 0.5rem; }
        .prose strong { color: #374151; font-weight: 600; }
        .prose code { background: #f0f5ff; color: #4664d6; padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-size: 0.9em; }
        .prose blockquote { border-left: 3px solid #5a7de6; padding-left: 1.25rem; margin: 1.5rem 0; font-style: italic; color: #9ca3af; }
    </style>
</head>
<body class="bg-white text-gray-900 overflow-x-hidden">

    <!-- Nav -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
        <div class="max-w-6xl mx-auto px-6">
            <div class="flex items-center justify-between h-20">
                <a href="/" class="py-3.5">
                    <img src="../assets/full-logo-png (1).png" alt="Solvr Labs" class="h-[36px] md:h-[50px]">
                </a>
                <div class="hidden md:flex items-center gap-10">
                    <a href="/" class="text-lg font-medium text-gray-500 hover:text-brand-600 transition-colors">Home</a>
                    <div class="relative group">
                        <button class="text-lg font-medium text-gray-500 hover:text-brand-600 transition-colors inline-flex items-center gap-1">Products <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></button>
                        <div class="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div class="w-64 bg-white rounded-xl border border-gray-200/80 shadow-xl shadow-gray-200/50 overflow-hidden">
                                <a href="/radar" class="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors">
                                    <div class="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0"><svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg></div>
                                    <div><p class="text-sm font-semibold text-brand-900">Radar</p><p class="text-xs text-gray-400">AI receptionist &amp; dispatcher</p></div>
                                </a>
                                <a href="https://taskline.solvrlabs.com" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors border-t border-gray-100">
                                    <div class="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0"><img src="/assets/TaskLine-Logo.png" alt="Taskline" class="w-full h-full object-cover"></div>
                                    <div><p class="text-sm font-semibold text-brand-900">Taskline</p><p class="text-xs text-gray-400">AI-powered job management</p></div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <a href="/services" class="text-lg font-medium text-gray-500 hover:text-brand-600 transition-colors">Services</a>
                    <a href="/about" class="text-lg font-medium text-gray-500 hover:text-brand-600 transition-colors">About</a>
                    <a href="/#work" class="text-lg font-medium text-gray-500 hover:text-brand-600 transition-colors">Work</a>
                    <a href="/contact" class="px-6 py-2.5 text-base font-semibold rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm">Book a Call</a>
                </div>
                <button id="burger" class="burger md:hidden flex flex-col gap-1.5 p-2" aria-label="Toggle menu"><span></span><span></span><span></span></button>
            </div>
        </div>
        <div id="mobile-menu" class="md:hidden hidden bg-white border-t border-gray-100">
            <div class="px-6 py-4 space-y-1">
                <a href="/" class="block px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">Home</a>
                <div>
                    <button onclick="document.getElementById('mobile-products').classList.toggle('hidden')" class="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">Products <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></button>
                    <div id="mobile-products" class="hidden pl-4 space-y-1 mt-1">
                        <a href="/radar" class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50"><span class="w-6 h-6 rounded-md bg-brand-100 flex items-center justify-center flex-shrink-0"><svg class="w-3.5 h-3.5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg></span> Radar</a>
                        <a href="https://taskline.solvrlabs.com" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50"><span class="w-6 h-6 rounded-md overflow-hidden flex-shrink-0"><img src="/assets/TaskLine-Logo.png" alt="Taskline" class="w-full h-full object-cover"></span> Taskline</a>
                    </div>
                </div>
                <a href="/services" class="block px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">Services</a>
                <a href="/about" class="block px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">About</a>
                <a href="/#work" class="block px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">Work</a>
                <a href="/contact" class="block mt-3 px-3 py-2.5 text-sm font-semibold text-center text-white rounded-full bg-brand-600">Book a Call</a>
            </div>
        </div>
    </nav>

    <!-- Article Header -->
    <section class="pt-32 pb-12 bg-brand-50/50">
        <div class="max-w-3xl mx-auto px-6">
            <a href="/blog" class="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors mb-6">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/></svg>
                Back to Blog
            </a>
            <div class="flex items-center gap-3 mb-4">
                <span class="text-xs font-semibold text-brand-600 bg-brand-100 px-2.5 py-1 rounded-full">${topic.tag}</span>
                <span class="text-xs text-gray-400">${date}</span>
            </div>
            <h1 class="font-bold text-3xl sm:text-4xl text-brand-900 leading-tight mb-4">${topic.title}</h1>
            <p class="text-gray-500 text-lg leading-relaxed">${topic.summary}</p>
        </div>
    </section>

    <!-- Article Body -->
    <article class="py-16 bg-white">
        <div class="max-w-3xl mx-auto px-6 prose">
            ${articleContent}
        </div>
    </article>

    <!-- More Posts -->
    <section class="py-16 bg-brand-50/50">
        <div class="max-w-3xl mx-auto px-6">
            <h3 class="reveal font-bold text-xl text-brand-900 mb-6">More Posts</h3>
            <div class="reveal reveal-delay-1 space-y-4">
                ${morePosts}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-brand-900 text-white">
        <div class="max-w-6xl mx-auto px-6 py-14">
            <div class="grid md:grid-cols-4 gap-10">
                <div class="md:col-span-2">
                    <a href="/" class="inline-block mb-4"><img src="../assets/full-logo-png (1).png" alt="Solvr Labs" class="h-10 md:h-14 brightness-0 invert"></a>
                    <p class="text-brand-300/60 text-sm leading-relaxed max-w-xs">AI automation and custom software for service businesses.</p>
                </div>
                <div>
                    <h4 class="font-semibold text-sm mb-4 uppercase tracking-wider text-brand-300/80">Navigation</h4>
                    <ul class="space-y-2"><li><a href="/" class="text-brand-300/50 hover:text-white text-sm transition-colors">Home</a></li><li><a href="/services" class="text-brand-300/50 hover:text-white text-sm transition-colors">Services</a></li><li><a href="/about" class="text-brand-300/50 hover:text-white text-sm transition-colors">About</a></li><li><a href="/blog" class="text-brand-300/50 hover:text-white text-sm transition-colors">Blog</a></li><li><a href="/contact" class="text-brand-300/50 hover:text-white text-sm transition-colors">Contact</a></li></ul>
                </div>
                <div>
                    <h4 class="font-semibold text-sm mb-4 uppercase tracking-wider text-brand-300/80">Services</h4>
                    <ul class="space-y-2"><li><a href="/ai-automation" class="text-brand-300/50 hover:text-white text-sm transition-colors">AI Workflow Automation</a></li><li><a href="/radar" class="text-brand-300/50 hover:text-white text-sm transition-colors">Radar</a></li><li><a href="/custom-software" class="text-brand-300/50 hover:text-white text-sm transition-colors">Custom Software</a></li></ul>
                    <h4 class="font-semibold text-sm mb-3 mt-5 uppercase tracking-wider text-brand-300/80">Industries</h4>
                    <ul class="space-y-2"><li><a href="/home-services" class="text-brand-300/50 hover:text-white text-sm transition-colors">Home Services</a></li><li><a href="/property-management" class="text-brand-300/50 hover:text-white text-sm transition-colors">Property Management</a></li></ul>
                </div>
            </div>
            <div class="border-t border-brand-800 mt-10 pt-6 text-center text-brand-300/40 text-xs">&copy; 2026 Solvr Labs, LLC. All rights reserved.</div>
        </div>
    </footer>

    <script>
        document.getElementById('burger').addEventListener('click', function() { this.classList.toggle('active'); document.getElementById('mobile-menu').classList.toggle('hidden'); });
        const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    </script>
    <script defer src="/_vercel/insights/script.js"></script>
</body>
</html>`;

  fs.writeFileSync(postPath, html);
  console.log(`Created: blog/${topic.slug}.html`);

  // 4. Add card to blog.html listing
  const blogIndex = fs.readFileSync(BLOG_INDEX, "utf-8");
  const gradient = getGradient(topic.tag);
  const icon = getTagIcon(topic.tag);

  const newCard = `
                <!-- Post: ${topic.title} -->
                <a href="/blog/${topic.slug}" class="reveal blog-card block bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br ${gradient} flex items-center justify-center">
                        ${icon}
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">${topic.tag}</span>
                            <span class="text-xs text-gray-400">${date}</span>
                        </div>
                        <h3 class="font-bold text-lg text-brand-900 mb-2 leading-snug">${topic.title}</h3>
                        <p class="text-gray-500 text-sm leading-relaxed">${topic.summary}</p>
                    </div>
                </a>`;

  // Insert after the opening of the grid div
  const gridMarker = `<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">`;
  const updatedIndex = blogIndex.replace(gridMarker, gridMarker + newCard);

  fs.writeFileSync(BLOG_INDEX, updatedIndex);
  console.log("Updated: blog.html with new card");

  // 5. Remove topic from queue
  topics.shift();
  fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2) + "\n");
  console.log(`Removed topic from queue. ${topics.length} topics remaining.`);

  console.log("Done!");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
