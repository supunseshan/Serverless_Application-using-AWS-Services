import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="orb w-80 h-80 bg-brand-600/8 top-1/4 left-1/4" />
      <div className="text-center relative z-10 animate-fade-up" style={{ animationFillMode: 'forwards', opacity: 0 }}>
        <div className="font-display font-800 text-[10rem] leading-none gradient-text opacity-20 select-none mb-4">404</div>
        <h1 className="font-display font-800 text-4xl text-white mb-3 -mt-8">Page Not Found</h1>
        <p className="text-slate-500 font-body mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={15} /> Back to Home
        </Link>
      </div>
    </div>
  )
}
