// src/components/auth/UserMenu.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  const email = user?.signInDetails?.loginId || ''
  const initial = email.charAt(0).toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-surface-600 hover:bg-surface-500 border border-white/10 rounded-xl px-3 py-2 transition-all"
      >
        <div className="w-6 h-6 rounded-lg bg-brand-500/30 flex items-center justify-center text-brand-400 font-display font-700 text-xs">
          {initial}
        </div>
        <span className="text-slate-300 text-sm font-body hidden sm:block max-w-[120px] truncate">{email}</span>
        <ChevronDown size={13} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 card py-1 z-50 animate-slide-in">
          <Link to="/dashboard" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] font-body transition-colors">
            <LayoutDashboard size={14} /> Dashboard
          </Link>
          <div className="border-t border-white/[0.05] my-1" />
          <button onClick={handleLogout}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 font-body transition-colors w-full">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
