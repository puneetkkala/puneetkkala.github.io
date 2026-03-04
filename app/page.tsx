import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { ArrowRight, Clock, Calendar, Tag } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Happy Hub — Accessible. Credible. Ethical.',
  description:
    'Expert content on digital accessibility, WCAG, mobile accessibility, and AI-driven accessibility by Puneet Kala.',
}

const TALKS = [
  {
    title: 'Android Accessibility: Complexity, Challenges, and Solutions',
    event: 'GDG Berlin Android — September 2024',
    embed: 'https://www.youtube.com/embed/av673I4GsLA',
    url: 'https://youtu.be/av673I4GsLA?si=1jkYCuyEUowyFNnP',
  },
  {
    title: 'AI for Accessibility: The Challenge and The Promise',
    event: 'GDG Berlin Android — August 2025',
    embed: 'https://www.youtube.com/embed/_4Flq6hnx8E',
    url: 'https://youtu.be/_4Flq6hnx8E?si=j-PE5htgtsRO0cw9',
  },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-gradient text-white py-24 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-200 font-semibold text-sm uppercase tracking-widest mb-4">
            Happy Hub
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Accessible.<br />
            <span className="text-blue-300">Credible.</span> Ethical.
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            A knowledge platform for digital accessibility professionals, engineers, and advocates — built by{' '}
            <strong className="text-white">Puneet Kala</strong>, CPACC Certified Senior Software Engineer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/blog" className="btn-primary bg-white text-navy hover:bg-blue-50">
              Explore the Blog <ArrowRight size={16} />
            </Link>
            <Link href="/about" className="btn-secondary border-white/40 text-white hover:bg-white/10 hover:text-white">
              About Puneet
            </Link>
          </div>
        </div>
      </section>

      {/* ── Topics strip ── */}
      <section className="bg-white border-y border-slate-200 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-600">
          {['Accessibility Theory', 'WCAG Guidelines', 'Mobile Accessibility', 'AI-Driven Accessibility', 'Inclusive Design', 'Disability Studies'].map((t) => (
            <span key={t} className="tag-badge">{t}</span>
          ))}
        </div>
      </section>

      {/* ── Latest Blog Posts ── */}
      <section className="section">
        <div className="container-lg">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Latest Articles</h2>
              <p className="text-slate-600 mt-1">Research-backed insights on digital inclusion</p>
            </div>
            <Link href="/blog" className="btn-ghost hidden sm:flex">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="card p-6 block group">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.slice(0, 2).map((t) => (
                    <span key={t} className="tag-badge">{t}</span>
                  ))}
                </div>
                <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 group-hover:text-blue-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-2 mb-4">{post.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} aria-hidden="true" />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} aria-hidden="true" />
                    {post.readTime} min read
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/blog" className="btn-secondary">
              View all articles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Talks ── */}
      <section className="section bg-slate-900">
        <div className="container-lg">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Featured Talks</h2>
            <p className="text-slate-400">Conference talks and presentations on accessibility</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {TALKS.map((talk) => (
              <div key={talk.embed} className="bg-slate-800 rounded-2xl overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={talk.embed}
                    title={talk.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white mb-1">{talk.title}</h3>
                  <p className="text-slate-400 text-sm">{talk.event}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/talks" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white">
              View all talks <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section text-center">
        <div className="container-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Have a question or want to collaborate?
          </h2>
          <p className="text-slate-600 mb-8">
            Whether you&apos;re building, testing, or learning — I&apos;m here to help push the web toward meaningful inclusion.
          </p>
          <Link href="/contact" className="btn-primary">
            Get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
