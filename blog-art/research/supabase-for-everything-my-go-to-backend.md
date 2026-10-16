# Research notes: Supabase for Everything: Why It's My Go-To Backend

Run date: Oct 7, 2026. Topic came from blog/topics.json (first queued item). Angle chosen from research: the UpGuard finding (late Sep 2026) that 16,326 Supabase databases were readable by anyone, mostly from missing row level security in AI-built apps.

## Supabase news (last ~90 days)

- **16,326 Supabase databases exposing readable tables; over half had PII.** UpGuard scanned ~300,000 domains with Supabase indicators. Root causes: RLS not enabled (RLS is on by default only for tables made in the Table Editor UI; tables created through the API, which coding agents use, don't get it), weak policies, public keys used as if secret. Examples include a US valet service (100,000+ customers, 665 staff records) and a Canadian relocation service (884 plain-text passwords).
  - "Everything Everywhere: Systemic Data Exposure in Supabase Apps", Greg Pollock, UpGuard, page dated Oct 1, 2026. https://www.upguard.com/blog/everything-everywhere-systemic-data-exposure-in-supabase-apps
- **TechCrunch coverage, Supabase response.** CISO Bil Harmer: projects are "secure by default"; security is a shared responsibility; customers control configuration. Most exposed datasets appear to be US.
  - "Some Supabase customers are publicly exposing reams of people's data to the web", Zack Whittaker, TechCrunch, Sep 25, 2026. https://techcrunch.com/2026/09/25/some-supabase-customers-are-publicly-exposing-reams-of-peoples-data-to-the-web/
- **BleepingComputer coverage.** 16,000+ databases; causes: missing/ineffective RLS policies and misuse of public keys; common thread is apps made by AI coding agents (not proven for every site).
  - "Over 16,000 Supabase databases expose PII, passwords, auth tokens", Bill Toulas, BleepingComputer, Sep 28, 2026. https://www.bleepingcomputer.com/news/security/misconfigured-supabase-apps-expose-data-in-over-16-000-databases/
- **Cybernews coverage.** Supabase protections aren't automatically applied to databases created through coding tools; earlier Lovable-related misconfigurations (Mar 2025).
  - "16,000 Supabase databases exposed as vibe-coded apps leak sensitive user data", Anna Zhadan, Cybernews, Sep 26, 2026. https://cybernews.com/news/16000-supabase-databases-exposed/
- **Supabase raised $500M Series F at $10.5B valuation; 9M+ developers.** Led by GIC; Stripe and Salesforce Ventures in.
  - "Supabase Raises $500 Million at $10.5 Billion Valuation to Accelerate Lead in Agentic Infrastructure", Orrick, Jun 8, 2026. https://www.orrick.com/en/News/2026/06/Supabase-Raises-500-Million-at-10-5-Billion-Valuation-to-Accelerate-Lead-in-Agentic-Infrastructure
- **Scoped personal access tokens GA (Oct 6, 2026).** Tokens can be limited to specific projects/orgs and read or read-write per capability; work with Management API, MCP server and CLI. Also: OrioleDB public beta (Oct 1), Realtime schema locked down (Jul 14).
  - "Changelog", Supabase. https://supabase.com/changelog

## Supabase primary docs

- **RLS docs.** "A table in an exposed schema without RLS is readable and writable by any role with a grant on it." "Once RLS is enabled, no data is accessible through the API when using a publishable key, until you create policies." "Never use a secret key in the browser or expose it to customers." Example policy using `(select auth.uid()) = user_id`.
  - "Row Level Security", Supabase Docs (accessed Oct 7, 2026). https://supabase.com/docs/guides/database/postgres/row-level-security
- **Pricing.** Free $0 (500 MB DB, 50,000 MAUs, 2 active projects, pauses after 1 week inactivity). Pro from $25/mo (daily backups 7 days, projects never pause, $10 compute credits). Team from $599/mo (SOC2, ISO 27001).
  - "Pricing", Supabase (accessed Oct 7, 2026). https://supabase.com/pricing

## Small business / trades market context

- **74% of small businesses using or piloting AI (up from 64% in 2025); data privacy is the top concern (51%); top reason non-adopters give (38%).** n=750, fielded by Propeller Insights.
  - "2026 Main Street AI Gap Report", Guy Berger, Homebase, Sep 22, 2026. https://www.joinhomebase.com/blog/small-business-ai-gap-report
- **48% of home service pros actively use AI; plumbing 53%, electrical 54%; top use is customer communication and follow-up (52%).** n=248, May-Jun 2026, directional.
  - "AI in the Trades", Housecall Pro, Jun 30, 2026 (updated Jul 13, 2026). https://www.housecallpro.com/resources/ai-in-the-trades/
- **41.4% of small business owners say software costs went up in the past 12 months (n=781).** Vendor research desk, methodology thin.
  - "41% Of Small Business Owners Report Rising Software Costs", Small Business Expo, Mar 20, 2026 (updated Jul 23, 2026). https://www.thesmallbusinessexpo.com/blog/small-business-software-costs/

## Case study used

- UpGuard's US valet service example (100,000+ customer records and 665 staff records readable). Unnamed by UpGuard, so the post doesn't name it. No named small business Supabase success story with reported numbers was found that fit; skipped rather than invent one.

## Solvr Labs facts used (from the site)

- custom-software.html: built with Next.js, Supabase and the Claude API; you own 100% of code, data and infrastructure, hosted on your accounts (Vercel, Supabase); focused app 4-6 weeks, complex 8-10; client portals, dashboards.
- building-taskline.html: TaskLine on Supabase + Postgres; real-time subscriptions update the dashboard; approved proposals stored in Supabase and used as context.
- assessment.html: free 30-minute operations assessment + written report, AZ small businesses, English and Spanish.
- radar.html: Radar from $149/mo, no contracts, setup fee waived for Taskline users.

## Dropped

- Supabase "Security Advisor" specifics (not verified in this run's sources).
- Firebase feature/price comparisons (kept to opinion, no figures).
