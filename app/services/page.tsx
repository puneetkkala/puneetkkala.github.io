import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldCheck,
  Smartphone,
  UserCheck,
  FileText,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Info,
  Scale,
  Award,
  Layers,
  Clock,
  Sparkles,
  FileCheck,
  Users,
  BookOpen,
  Send,
  Zap,
} from 'lucide-react'
import { createPageMetadata } from '@/lib/seo'
import { CAL_COM_URL, BRAND_NAME } from '@/lib/constants'

export const metadata: Metadata = createPageMetadata({
  title: 'Advisory & Consulting Services — Puneet Kumar Kala',
  description:
    'Choose the engagement model that fits your scope: quotation-based bespoke advisory or standardized fixed-price packages.',
  path: '/services',
})

// Track A: Quotation-Based Offerings
const TRACK_A_OFFERINGS = [
  {
    id: 'accessibility',
    title: 'Digital Accessibility & EAA/BFSG Readiness',
    icon: ShieldCheck,
    badge: 'Compliance & Universal Design',
    color: 'blue',
    description:
      'Comprehensive technical audits and strategic advisory to prepare digital platforms for European Accessibility Act (EAA/BFSG) compliance, WCAG 2.2 standards, and seamless assistive tech compatibility.',
    deliverables: [
      'Full WCAG 2.2 Level AA / EN 301 549 compliance audit reports',
      'European Accessibility Act (EAA / BFSG) readiness roadmap',
      'Assistive tech testing: Android TalkBack, iOS VoiceOver, keyboard nav',
      'Design system remediation (tokens, contrast, semantics, focus states)',
    ],
    pricing: 'Custom quote based on digital product complexity',
    scopeNote: 'Priced according to application surface, viewport count, and target regulatory standards.',
  },
  {
    id: 'android-architecture',
    title: 'Android Architecture & Code Audits',
    icon: Smartphone,
    badge: 'Modularity & Performance',
    color: 'emerald',
    description:
      'Independent architectural reviews and code assessments to improve modularity, build times, testability, and UI performance for scale-up and enterprise Android codebases.',
    deliverables: [
      'Comprehensive architectural diagnostic report with risk scoring',
      'Multi-module dependency analysis and Gradle build time optimization',
      'Jetpack Compose recomposition profiling and state hoisting review',
      'Phased technical debt triage and refactoring roadmap',
    ],
    pricing: 'Custom quote (Typical engagements start from €1,200)',
    scopeNote: 'Scoped by module count, test coverage baseline, and architectural debt complexity.',
  },
  {
    id: 'content-review',
    title: 'Technical Content Review & Fact-Checking',
    icon: FileText,
    badge: 'Verification & Editorial Rigor',
    color: 'amber',
    description:
      'Technical accuracy review, WCAG compliance verification, and code-level verification for technical documentation, engineering blog articles, and enterprise whitepapers.',
    deliverables: [
      'Line-by-line technical fact-checking & API correctness verification',
      'WCAG 2.2 & accessibility guidance validation',
      'Runnable sample code verification & dependency sanity checks',
      'Actionable editorial feedback report with suggested revisions',
    ],
    pricing: 'Custom quote starting from €200',
    scopeNote: 'Quoted transparently based on word count, technical depth, and code sample density.',
  },
  {
    id: 'custom-hiring-panels',
    title: 'Custom Hiring Panels & Engineering Rubrics',
    icon: Users,
    badge: 'Talent Acquisition & Assessment',
    color: 'purple',
    description:
      'Multi-stage interview loops, custom take-home assignment design, and hiring panel calibration for growing engineering teams and executive search.',
    deliverables: [
      'Custom technical assessment & take-home assignment design',
      'Role-tailored evaluation rubrics for Senior & Staff engineering tiers',
      'Multi-candidate interview sprints & panel co-interviewing',
      'Interviewer calibration workshops & structured debrief facilitation',
    ],
    pricing: 'Custom quote based on sprint volume & role seniority',
    scopeNote: 'Available as a bespoke retainer or multi-candidate hiring loop package.',
  },
  {
    id: 'large-scale-docs',
    title: 'Large-Scale Content & Documentation Projects',
    icon: BookOpen,
    badge: 'Technical Authority & Developer Portals',
    color: 'indigo',
    description:
      'Authoritative whitepapers, end-to-end technical documentation series, developer portals, and comprehensive developer course curriculums.',
    deliverables: [
      'Exhaustive architectural whitepapers with custom diagrams',
      'End-to-end developer portal documentation & API guides',
      'Curriculum design for internal engineering upskilling',
      'Production-ready companion code repositories and sample projects',
    ],
    pricing: 'Custom quote based on project scope & deliverables',
    scopeNote: 'Agreed as milestone-driven turnkey projects with clear review cycles.',
  },
]

// Track B: Standardized Fixed-Price Packages
const TRACK_B_PACKAGES = [
  {
    id: 'standard-interview',
    name: 'Standard Technical Interview',
    category: 'Engineering Evaluation',
    scope: 'Up to 60 minutes + structured scorecard',
    fee: '€180',
    amount: 180,
    deliverables: 'Live technical interview (up to 60 mins), standardized evaluation rubric, hire/no-hire recommendation, delivery within 24h.',
  },
  {
    id: 'senior-interview',
    name: 'Senior Engineering Interview',
    category: 'Engineering Evaluation',
    scope: 'Up to 75 minutes + architecture evaluation & scorecard',
    fee: '€230',
    amount: 230,
    deliverables: 'Deep architectural & system design evaluation (up to 75 mins), leadership aptitude assessment, executive scorecard within 24h.',
  },
  {
    id: 'assessment-review',
    name: 'Technical Assessment Review',
    category: 'Engineering Evaluation',
    scope: 'Review of candidate take-home submission + written feedback',
    fee: '€150',
    amount: 150,
    deliverables: 'Thorough review of candidate repository/take-home submission, code quality evaluation, maintainability review, written scorecard within 48h.',
  },
  {
    id: 'panel-support',
    name: 'Single Interview Panel Support',
    category: 'Engineering Evaluation',
    scope: '1 live interview session + hiring panel debrief',
    fee: '€250',
    amount: 250,
    deliverables: 'Live co-interviewing alongside internal panel members, structured debrief moderation, consolidated hiring recommendation.',
  },
  {
    id: 'tech-article',
    name: 'Technical Article',
    category: 'Technical Content',
    scope: 'Up to 1,000 words + deep research + 1 revision round',
    fee: '€350',
    amount: 350,
    deliverables: 'Fully researched technical article in Markdown/MDX, SEO metadata, clear headings, tested code snippets, 1 revision round included.',
  },
  {
    id: 'tech-deep-dive',
    name: 'In-Depth Technical Deep Dive',
    category: 'Technical Content',
    scope: 'Up to 1,800 words + code snippets + 1 revision round',
    fee: '€550',
    amount: 550,
    deliverables: 'Long-form engineering deep-dive, tested code walkthroughs, architectural diagrams, 1 revision round included.',
  },
  {
    id: 'tech-tutorial',
    name: 'Architectural Guide / Tutorial',
    category: 'Technical Content',
    scope: 'Up to 3,000 words + practical sample repository',
    fee: '€900',
    amount: 900,
    deliverables: 'Comprehensive architectural guide, step-by-step tutorial, production-grade sample repository on GitHub, 2 revision rounds.',
  },
]

export default function ServicesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Advisory & Consulting Services — Puneet Kumar Kala',
    description:
      'Choose the engagement model that fits your scope: quotation-based bespoke advisory or standardized fixed-price packages.',
    url: 'https://happyhub.in/services',
    provider: {
      '@type': 'Person',
      name: BRAND_NAME,
      url: 'https://happyhub.in/about',
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: 'Certified Professional in Accessibility Core Competencies (CPACC)',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* ── Section A: Header & Compliance Note ── */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <header className="mb-14">
            <div className="mb-4">
              <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900">
                Engagement Models &amp; Offerings
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
              Advisory &amp; Consulting Services
            </h1>
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl leading-relaxed mb-8">
              Choose the engagement model that fits your scope: quotation-based bespoke advisory or standardized fixed-price packages.
            </p>

            {/* Legal Tax Notice (§ 19 UStG Compliant) */}
            <div className="p-5 sm:p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Transparent Fixed Pricing &amp; German Statutory Notice (§ 19 UStG)
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    All prices are in EUR. In accordance with § 19 UStG (Kleinunternehmerregelung), no VAT is charged or calculated. We operate exclusively on transparent fixed pricing agreed upfront.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-3">
              <a
                href={CAL_COM_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
                className="btn-primary text-base px-6 py-3 shadow-sm hover:shadow-md"
              >
                <Calendar size={18} aria-hidden="true" />
                <span>Book 30-Min Discovery Session</span>
                <ArrowUpRight size={16} className="opacity-80" aria-hidden="true" />
              </a>

              <Link
                href="/services/order"
                className="btn-secondary text-base px-6 py-3"
              >
                <FileCheck size={18} aria-hidden="true" />
                <span>Order Fixed Package</span>
              </Link>
            </div>
            <p className="text-xs text-zinc-500 mb-8">
              Track A projects require discovery scoping. Track B packages can be ordered directly with instant 24-hour invoicing.
            </p>

            {/* In-page Anchor Links */}
            <nav className="flex flex-wrap gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800" aria-label="Services Navigation">
              <a href="#track-a" className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Track A: Custom Advisory (5 Offerings)
              </a>
              <a href="#advisory-workflow" className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                4-Stage Advisory Workflow
              </a>
              <a href="#track-b" className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Track B: Fixed-Price Packages (7 Tiers)
              </a>
              <a href="#turnkey-workflow" className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                3-Step Turnkey Fulfillment
              </a>
            </nav>
          </header>

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* ── Section B: Track A: Quotation-Based & Custom Advisory ── */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <section id="track-a" className="mb-20 scroll-mt-24" aria-labelledby="track-a-heading">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900">
                  Track A
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Bespoke Enterprise Advisory
                </span>
              </div>
              <h2
                id="track-a-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
              >
                Track A: Quotation-Based &amp; Custom Advisory
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 max-w-3xl">
                All engagements requiring tailored scoping, complex codebase access, multi-candidate loops, or custom regulatory milestones are delivered under Track A.
              </p>
            </div>

            {/* 5 Track A Offerings */}
            <div className="space-y-8 mb-12">
              {TRACK_A_OFFERINGS.map((offering, idx) => {
                const Icon = offering.icon
                return (
                  <div
                    key={offering.id}
                    id={offering.id}
                    className="card p-7 sm:p-9 border border-zinc-200 dark:border-zinc-800 scroll-mt-24"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900">
                            Pillar 0{idx + 1} · {offering.badge}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                          {offering.title}
                        </h3>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
                        <Icon size={24} aria-hidden="true" />
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                      {offering.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
                          Key Deliverables
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                          {offering.deliverables.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
                          Pricing &amp; Scope Structure
                        </h4>
                        <div className="p-5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                          <div className="text-xs uppercase tracking-wider font-semibold text-zinc-500">
                            Commercial Model
                          </div>
                          <div className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            {offering.pricing}
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {offering.scopeNote}
                          </p>
                          <div className="pt-1 text-xs text-blue-700 dark:text-blue-400 font-medium">
                            Transparent fixed fee quotation issued following discovery.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Track A Engagement Workflow: 4-Stage Advisory Workflow ── */}
            <div
              id="advisory-workflow"
              className="p-8 sm:p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 scroll-mt-24"
            >
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Track A Process
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1 mb-2">
                  4-Stage Advisory Workflow
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
                  A transparent, milestone-driven engagement workflow designed to deliver measurable technical results without administrative overhead.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {/* Stage 1 */}
                <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center mb-3 border border-blue-200 dark:border-blue-900">
                      01
                    </div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Discovery Session
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Complimentary 30-minute technical discovery via Cal.com to review objectives, constraints, and scope.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    Complimentary / Zero Obligation
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center mb-3 border border-blue-200 dark:border-blue-900">
                      02
                    </div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Scoping &amp; Fixed Quotation
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Transparent scope and fixed proposal issued within 3–5 business days with binding milestones.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-medium text-zinc-500">
                    Transparent Proposal (3–5 Days)
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center mb-3 border border-blue-200 dark:border-blue-900">
                      03
                    </div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Execution &amp; Delivery
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Work begins upon 50% advance settlement, delivered per agreed schedule with regular progress syncs.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-medium text-zinc-500">
                    50% Advance Settlement
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center mb-3 border border-blue-200 dark:border-blue-900">
                      04
                    </div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Walkthrough &amp; Handoff
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Dedicated review session to walk through findings, followed by final 50% invoice upon satisfaction.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-medium text-zinc-500">
                    Complete Knowledge Transfer
                  </div>
                </div>
              </div>

              {/* Track A Primary Action Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Ready to discuss your custom advisory requirements?
                  </p>
                  <p>Initial 30-minute technical discovery session is free and carries zero obligation.</p>
                </div>

                <a
                  href={CAL_COM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
                  className="btn-primary text-sm px-6 py-2.5 whitespace-nowrap shadow-sm"
                >
                  <Calendar size={16} aria-hidden="true" />
                  <span>Book 30-Min Discovery Session</span>
                  <ArrowUpRight size={14} className="opacity-80" aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* ── Section C: Track B: Standardized Fixed-Price Packages ── */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <section id="track-b" className="mb-20 scroll-mt-24" aria-labelledby="track-b-heading">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="tag-badge text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900">
                  Track B
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Flat-Rate Turnkey Packages
                </span>
              </div>
              <h2
                id="track-b-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
              >
                Track B: Standardized Fixed-Price Packages
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 max-w-3xl">
                Flat-rate, turnkey packages with predefined pricing and 100% upfront settlement. No scoping calls, negotiations, or unexpected invoices.
              </p>
            </div>

            {/* 7 Fixed Packages Table / Cards */}
            <div className="mb-10 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                      <th scope="col" className="py-4 px-4 sm:px-6 font-semibold text-zinc-900 dark:text-zinc-100">
                        Package
                      </th>
                      <th scope="col" className="py-4 px-4 sm:px-6 font-semibold text-zinc-900 dark:text-zinc-100">
                        Scope &amp; Included Deliverables
                      </th>
                      <th scope="col" className="py-4 px-4 sm:px-6 font-semibold text-zinc-900 dark:text-zinc-100 text-right">
                        Fixed Fee (§ 19 UStG)
                      </th>
                      <th scope="col" className="py-4 px-4 sm:px-6 font-semibold text-zinc-900 dark:text-zinc-100 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {TRACK_B_PACKAGES.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-4 px-4 sm:px-6 align-top">
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                            {pkg.name}
                          </div>
                          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                            {pkg.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 align-top">
                          <div className="font-medium text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">
                            {pkg.scope}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                            {pkg.deliverables}
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 align-top text-right whitespace-nowrap">
                          <span className="font-mono font-bold text-base text-blue-600 dark:text-blue-400">
                            {pkg.fee}
                          </span>
                          <span className="block text-[11px] text-zinc-500">VAT exempt</span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 align-top text-right whitespace-nowrap">
                          <Link
                            href={`/services/order?package=${pkg.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                          >
                            <span>Order</span>
                            <ArrowRight size={12} aria-hidden="true" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Track B Execution Workflow: 3-Step Turnkey Fulfillment ── */}
            <div
              id="turnkey-workflow"
              className="p-8 sm:p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 scroll-mt-24"
            >
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Track B Process
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1 mb-2">
                  3-Step Turnkey Fulfillment
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
                  Frictionless onboarding designed for immediate project kickoff without negotiation overhead.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Step 1 */}
                <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 font-bold text-xs flex items-center justify-center mb-3 border border-purple-200 dark:border-purple-900">
                      01
                    </div>
                    <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-2">
                      Direct Intake
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Submit candidate details/job spec or article outline via our dedicated order page. No scheduling loops needed.
                    </p>
                  </div>
                  <div className="pt-3 mt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                    2-Minute Checkout Form
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 font-bold text-xs flex items-center justify-center mb-3 border border-purple-200 dark:border-purple-900">
                      02
                    </div>
                    <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-2">
                      Upfront Settlement
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Settle the formal invoice via Revolut Card/Apple Pay payment link or SEPA transfer. Delivered to your inbox in 24 hours.
                    </p>
                  </div>
                  <div className="pt-3 mt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-medium text-zinc-500">
                    Guaranteed 24h Invoicing SLA
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 font-bold text-xs flex items-center justify-center mb-3 border border-purple-200 dark:border-purple-900">
                      03
                    </div>
                    <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-2">
                      Execution &amp; Delivery
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Receive completed evaluation scorecard or draft within the agreed timeframe directly via email.
                    </p>
                  </div>
                  <div className="pt-3 mt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-medium text-zinc-500">
                    On-Time Delivery Guarantee
                  </div>
                </div>
              </div>

              {/* Track B Primary Action Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  Ready to commission a standard technical interview or authoritative article?
                </div>

                <Link
                  href="/services/order"
                  className="btn-primary text-sm px-6 py-2.5 justify-center shadow-sm"
                >
                  <FileCheck size={16} aria-hidden="true" />
                  <span>Order Fixed Package</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* ── Section D: Commitments & Commercial Terms Block ── */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <section className="p-8 sm:p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60" aria-labelledby="terms-heading">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Commercial Standards
              </span>
              <h2
                id="terms-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1 mb-3"
              >
                Commitments &amp; Commercial Terms
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Professional B2B advisory engagements designed to meet enterprise compliance standards and provide absolute financial certainty.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <CheckCircle2 size={18} aria-hidden="true" />
                </div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
                  Transparent Fixed Fees
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Every engagement is scoped with an agreed fixed price upfront. No surprise invoices, hidden hours, or unexpected billing.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Award size={18} aria-hidden="true" />
                </div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
                  CPACC Certified Rigor
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Direct senior technical leadership with decade-long mobile architecture experience and IAAP CPACC accessibility credential.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Scale size={18} aria-hidden="true" />
                </div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
                  German Statutory Law (§ 19 UStG)
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Operated from Berlin under German commercial law. Transparent B2B contracts with § 19 UStG Kleinunternehmer exemption applied.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                <Link href="/legal/terms" className="hover:text-zinc-900 dark:hover:text-white underline underline-offset-4">
                  Terms &amp; Conditions
                </Link>
                <Link href="/legal/impressum" className="hover:text-zinc-900 dark:hover:text-white underline underline-offset-4">
                  Impressum (§ 5 DDG)
                </Link>
                <Link href="/legal/privacy" className="hover:text-zinc-900 dark:hover:text-white underline underline-offset-4">
                  Privacy Policy (DSGVO)
                </Link>
                <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-white underline underline-offset-4">
                  Contact &amp; Inquiries
                </Link>
              </div>

              <a
                href={CAL_COM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm px-6 py-2.5 whitespace-nowrap text-center"
              >
                <Calendar size={16} aria-hidden="true" />
                <span>Schedule a Free Consultation</span>
                <ArrowUpRight size={14} className="opacity-80" aria-hidden="true" />
              </a>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
