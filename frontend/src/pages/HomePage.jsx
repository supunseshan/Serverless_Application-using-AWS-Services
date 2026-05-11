import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Globe, Calendar } from 'lucide-react'
import { eventsApi } from '../api'
import EventCard from '../components/events/EventCard'

const FEATURES = [
  { icon: Zap, title: 'Serverless & Fast', desc: 'Built on AWS Lambda. Zero cold starts. Instant scale.' },
  { icon: Shield, title: 'Secure by Default', desc: 'Cognito auth, JWT tokens, and encrypted secrets.' },
  { icon: Globe, title: 'Global CDN Delivery', desc: 'CloudFront serves your events at the edge worldwide.' },
  { icon: Calendar, title: 'Smart Reminders', desc: 'EventBridge scheduler sends reminders automatically.' },
]

export default function HomePage() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    eventsApi.getAll({ limit: 3, status: 'ACTIVE' })
      .then(r => setEvents(r.data.data || []))
      .catch(() => {})
  }, [])

  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-4">
        {/* Background orbs */}
        <div className="orb w-[600px] h-[600px] bg-brand-600/10 top-10 left-1/2 -translate-x-1/2" />
        <div className="orb w-96 h-96 bg-purple-700/10 bottom-20 right-10" />
        <div className="orb w-64 h-64 bg-brand-500/8 top-20 left-5" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-up" style={{ animationFillMode: 'forwards', opacity: 0 }}>
            <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-slow" />
            <span className="text-brand-400 text-xs font-mono font-500 tracking-wider uppercase">AWS Serverless Platform</span>
          </div>

          {/* Heading */}
          <h1
            className="font-display font-800 text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-6 animate-fade-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards', opacity: 0 }}
          >
            Events That Live<br />
            <span className="gradient-text">In The Cloud</span>
          </h1>

          <p
            className="text-slate-400 text-lg sm:text-xl font-body leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-up"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards', opacity: 0 }}
          >
            Discover, create, and manage extraordinary events on a serverless platform powered entirely by AWS — built for scale, speed, and security.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards', opacity: 0 }}
          >
            <Link to="/events" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 shadow-glow">
              Explore Events
              <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="btn-secondary text-base px-8 py-3.5">
              Get Started Free
            </Link>
          </div>

          {/* Stats */}
          <div
            className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-up"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards', opacity: 0 }}
          >
            {[['10+', 'AWS Services'], ['∞', 'Scalability'], ['99.9%', 'Uptime SLA']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-display font-800 text-2xl gradient-text">{val}</div>
                <div className="text-slate-600 text-xs font-mono mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-700">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-brand-500/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" />
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title text-4xl mb-4">Enterprise Cloud Architecture</h2>
            <p className="text-slate-500 font-body max-w-xl mx-auto">Every component is battle-tested AWS infrastructure running at production scale.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="card p-6 animate-fade-up hover:border-brand-500/20 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4 border border-brand-500/20">
                  <Icon size={18} className="text-brand-400" />
                </div>
                <h3 className="font-display font-700 text-white mb-2">{title}</h3>
                <p className="text-slate-500 text-sm font-body leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LATEST EVENTS ─────────────────────────────────────── */}
      {events.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="section-title text-4xl mb-2">Upcoming Events</h2>
                <p className="text-slate-500 font-body">Don't miss out on what's next.</p>
              </div>
              <Link to="/events" className="text-brand-400 hover:text-brand-300 text-sm font-display font-600 flex items-center gap-1 transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e, i) => <EventCard key={e.id} event={e} delay={i * 100} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gradient-border">
            <div className="gradient-border-inner px-8 py-12">
              <h2 className="section-title text-4xl mb-4">Ready to Go Live?</h2>
              <p className="text-slate-400 font-body mb-8 max-w-md mx-auto">Create your event in minutes and reach attendees powered by AWS infrastructure.</p>
              <Link to="/register" className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2 shadow-glow">
                Start Building <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
