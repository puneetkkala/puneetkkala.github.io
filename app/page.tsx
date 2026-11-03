import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { getPublishedTalks } from '@/lib/talks'
import { createPageMetadata } from '@/lib/seo'
import { CAL_COM_URL, BUSINESS_EMAIL } from '@/lib/constants'
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  ShieldCheck,
  Smartphone,
  UserCheck,
  FileText,
  CheckCircle2,
  Award,
  Scale,
  Layers,
  ChevronRight,
  Mail,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Puneet Kumar Kala — Independent Software Engineering & Accessibility Advisory',
  description:
    'Targeted technical advisory for enterprise platforms, scale-ups, and engineering leaders. Specialising in Android UI systems, digital accessibility (EAA/BFSG), technical assessments, and engineering documentation.',
  path: '/',
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function HomePage() {
  const posts = getAllPosts().slice(0, 3)
  const talks = await getPublishedTalks(2)

  return (
    <>
      {/* ── 1. Hero Section (Executive Advisory) ── */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors">
        <div className="max-w-5xl mx-auto">
          {/* Pre-header Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" aria-hidden="true" />
              Independent Advisory & Engineering
            </span>
          </div>

          {/* H1 Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.12] mb-6">
            Independent Software Engineering &amp; Accessibility Advisory
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl leading-relaxed mb-10">
            Building robust Android UI systems, legally compliant (EAA/BFSG) digital products, and high-impact engineering assessments.
          </p>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
            <a
              href={CAL_COM_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
              className="btn-primary text-base px-6 py-3 shadow-sm hover:shadow-md"
            >
              <Calendar size={18} aria-hidden="true" />
              <span>Book Discovery Call</span>
              <ArrowUpRight size={16} className="opacity-80" aria-hidden="true" />
            </a>

            <a
              href="#services"
              className="btn-secondary text-base px-6 py-3"
            >
              <span>View Offerings</span>
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="text-xs text-zinc-500 mb-14">
            30-Minute Discovery Session (Complimentary for First-Time Clients)
          </p>

          {/* Executive Credentials Micro-Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-zinc-100 dark:border-zinc-900 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Award size={18} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
              <span className="font-medium text-zinc-800 dark:text-zinc-200">CPACC Certified</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Scale size={18} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
              <span className="font-medium text-zinc-800 dark:text-zinc-200">EAA / BFSG Ready</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Layers size={18} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
              <span className="font-medium text-zinc-800 dark:text-zinc-200">Staff Android Systems</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <UserCheck size={18} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
              <span className="font-medium text-zinc-800 dark:text-zinc-200">Technical Assessments</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Services Grid (#services) ── */}
      <section id="services" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header & Subheader */}
          <div className="mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Strategic Practice Areas
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1 mb-3">
              Advisory &amp; Consulting Offerings
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Targeted technical expertise for enterprise platforms, scale-ups, and engineering leaders.
            </p>
          </div>

          {/* 4-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Offering 1: Digital Accessibility & EAA/BFSG Readiness */}
            <div className="card p-7 sm:p-8 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900">
                    Compliance &amp; UX
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <ShieldCheck size={20} aria-hidden="true" />
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Digital Accessibility &amp; EAA/BFSG Readiness
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Comprehensive technical audits and strategic advisory to prepare digital platforms for European Accessibility Act (EAA/BFSG) compliance, WCAG 2.2 standards, and seamless assistive tech compatibility.
                </p>

                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mb-4">
                  Initial 30-minute technical discovery session is free. Scope evaluation and binding fixed-price proposals follow within 3–5 business days.
                </p>

                <ul className="space-y-2 mb-8 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>WCAG 2.2 AA / EN 301 549 Audits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>European Accessibility Act (BFSG) Strategy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>TalkBack &amp; Screen Reader Optimization</span>
                  </li>
                </ul>
              </div>

              <div>
                <a
                  href={CAL_COM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
                >
                  <span>Book Discovery Call (Free 30-min)</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Offering 2: Android Architecture & Code Audits */}
            <div className="card p-7 sm:p-8 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="tag-badge text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900">
                    Modularity &amp; Performance
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <Smartphone size={20} aria-hidden="true" />
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Android Architecture &amp; Code Audits
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Independent architectural reviews and code assessments to improve modularity, build times, testability, and UI performance for scale-up and enterprise Android codebases.
                </p>

                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-4">
                  Initial 30-minute technical discovery session is free. Scope evaluation and binding fixed-price proposals follow within 3–5 business days.
                </p>

                <ul className="space-y-2 mb-8 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>Jetpack Compose UI &amp; State Profiling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>Multi-Module Build &amp; Render Performance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>Diagnostic Report &amp; Refactoring Plan</span>
                  </li>
                </ul>
              </div>

              <div>
                <a
                  href={CAL_COM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
                >
                  <span>Book Discovery Call (Free 30-min)</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Offering 3: Technical Interviewing & Assessments */}
            <div className="card p-7 sm:p-8 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="tag-badge text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900">
                    Hiring &amp; Evaluations
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 group-hover:bg-purple-50 dark:group-hover:bg-purple-950/50 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    <UserCheck size={20} aria-hidden="true" />
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Technical Interviewing &amp; Assessments
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Structured, unbiased technical interviews and candidate evaluations conducted by a Senior Software Engineer to accelerate and validate your engineering hiring.
                </p>

                <ul className="space-y-2 mb-8 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>60–75 Min Technical Interviews &amp; Scorecards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>Take-Home Assignment Code Reviews &amp; Grading</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>Live Technical Panel Support &amp; Debriefs</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <Link
                  href="/services/order?category=interview"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
                >
                  <span>Order Standard Package</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
                <a
                  href={CAL_COM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
                  className="text-xs text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Discovery Call →
                </a>
              </div>
            </div>

            {/* Offering 4: Technical & Educational Content Writing */}
            <div className="card p-7 sm:p-8 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="tag-badge text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900">
                    Content &amp; Authority
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/50 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    <FileText size={20} aria-hidden="true" />
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Technical &amp; Educational Content Writing
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Authoritative engineering content, tutorials, and documentation that translate complex architectural and accessibility concepts into actionable technical guides.
                </p>

                <ul className="space-y-2 mb-8 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>Deep Architectural Deep-Dives &amp; Tutorials</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>WCAG &amp; Accessibility Documentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>Code-Verified Proofreading &amp; Fact-Checking</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <Link
                  href="/services/order?category=writing"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
                >
                  <span>Commission Content</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
                <a
                  href={CAL_COM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
                  className="text-xs text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Discovery Call →
                </a>
              </div>
            </div>
          </div>

          {/* Dedicated Services Page Link Button */}
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-800 transition-colors shadow-xs"
            >
              <span>Explore Detailed Offerings &amp; Pricing</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {/* Section Bottom Strip */}
          <div className="mt-8 p-5 sm:p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-zinc-700 dark:text-zinc-300 font-medium text-center sm:text-left">
              Need tailored advisory? Let&apos;s discuss your scope
            </div>
            <a
              href={CAL_COM_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 px-4 py-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <span>Book Discovery Call (Free 30-min)</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ── 3. Executive Advisory Credentials & Background ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Executive Profile
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Engineered for High-Stakes Digital Products
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                Operating at the intersection of technical excellence and statutory compliance.
                Advising European enterprises, scale-ups, and product engineering teams on building resilient, accessible, and high-performance software.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
                >
                  <span>Read full advisory credentials &amp; background</span>
                  <ChevronRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Award size={18} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  CPACC Certified Practitioner
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Accredited by the IAAP in global accessibility standards, universal design principles, and international digital rights.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <Scale size={18} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  EAA &amp; BFSG Compliance Specialist
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Translating European statutory requirements into actionable architectural guidelines and regression test pipelines.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Layers size={18} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  Production Scale Mobile Systems
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Decade-long background structuring native Android UI design systems, Compose performance tuning, and modular multi-package repos.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
                  <UserCheck size={18} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  Evaluations &amp; Technical Writing
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Conducting unbiased candidate technical interviews, grading engineering assessments, and authoring authoritative technical guides.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Dynamic Content: Latest Insights & Frameworks (Articles Section) ── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Editorial &amp; Whitepapers
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">
                Latest Insights &amp; Frameworks
              </h2>
              <p className="text-base text-zinc-600 dark:text-zinc-400 mt-2">
                Engineering methodologies, compliance deep-dives, and technical architectural standards.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 shrink-0 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
            >
              <span>View all insights</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.slug}
                className="card p-6 flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Read article: ${post.title}`}
              >
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 2).map((t) => (
                      <span key={t} className="tag-badge">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-6">
                    {post.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} aria-hidden="true" />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} aria-hidden="true" />
                    {post.readTime} min read
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Dynamic Content: Keynote & Conference Talks (Speaking Section) ── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950 text-white border-t border-zinc-800 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Thought Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                Keynote &amp; Conference Talks
              </h2>
              <p className="text-base text-zinc-400 mt-2">
                Selected presentations and technical keynotes delivered at leading software engineering conferences.
              </p>
            </div>
            <Link
              href="/talks"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 shrink-0 focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm"
            >
              <span>View full speaking archive</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {talks.map((talk) => (
              <div
                key={talk.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="aspect-video bg-black relative">
                  {talk.video_embed_url ? (
                    <iframe
                      src={talk.video_embed_url}
                      title={talk.title}
                      className="w-full h-full"
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">
                      Video stream recording
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white text-lg mb-2">{talk.title}</h3>
                  <p className="text-zinc-400 text-sm">
                    {talk.event_name}
                    {talk.event_date ? ` — ${formatDate(talk.event_date)}` : ''}
                  </p>
                  {talk.description && (
                    <p className="text-zinc-400 text-xs mt-3 line-clamp-2 leading-relaxed">
                      {talk.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Executive Contact CTA Section ── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 text-center transition-colors">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 inline-block">
            Direct Technical Engagement
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Initiate an Advisory Engagement
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg mb-8 leading-relaxed">
            Whether preparing for European Accessibility Act (BFSG) enforcement, scheduling senior technical interviews, or auditing Android UI architecture — let&apos;s align on your roadmap.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={CAL_COM_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
              className="btn-primary text-base px-6 py-3 w-full sm:w-auto"
            >
              <Calendar size={18} aria-hidden="true" />
              <span>Book Discovery Call</span>
              <ArrowUpRight size={16} className="opacity-80" aria-hidden="true" />
            </a>
            <a
              href={`mailto:${BUSINESS_EMAIL}`}
              className="btn-secondary text-base px-6 py-3 w-full sm:w-auto"
            >
              <Mail size={18} aria-hidden="true" />
              <span>Inquiries via Email</span>
            </a>
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            30-Minute Discovery Session (Complimentary for First-Time Clients)
          </p>
        </div>
      </section>
    </>
  )
}
