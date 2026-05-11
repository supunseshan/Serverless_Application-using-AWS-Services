import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-900/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-white" fill="white" />
              </div>
              <span className="font-display font-700 text-white">Cloud<span className="gradient-text">Wave</span></span>
            </Link>
            <p className="text-slate-500 text-sm font-body leading-relaxed">
              Discover, create, and manage extraordinary events powered by the cloud.
            </p>
          </div>
          <div>
            <h4 className="font-display font-600 text-white text-sm mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              {[['Explore Events', '/events'], ['Create Event', '/events/create'], ['Dashboard', '/dashboard']].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-slate-500 hover:text-slate-300 text-sm font-body transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-600 text-white text-sm mb-4 uppercase tracking-wider">Account</h4>
            <ul className="space-y-2">
              {[['Sign In', '/login'], ['Register', '/register']].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-slate-500 hover:text-slate-300 text-sm font-body transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.05] mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs font-mono">
            © {new Date().getFullYear()} CloudWave Events. Built on AWS.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-400 transition-colors">
              <Github size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-400 transition-colors">
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
