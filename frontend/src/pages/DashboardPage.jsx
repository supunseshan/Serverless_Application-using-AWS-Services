import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, X, Plus, LayoutDashboard, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { registrationsApi } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRegistrations = () => {
    registrationsApi.getMine()
      .then(r => setRegistrations(r.data.data || []))
      .catch(() => setRegistrations([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRegistrations() }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this registration?')) return
    try {
      await registrationsApi.cancel(id)
      toast.success('Registration cancelled')
      fetchRegistrations()
    } catch {
      toast.error('Failed to cancel registration')
    }
  }

  const upcoming = registrations.filter(r => new Date(r.event.date) >= new Date())
  const past = registrations.filter(r => new Date(r.event.date) < new Date())

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 bg-brand-500/10 rounded-lg flex items-center justify-center border border-brand-500/20">
                <LayoutDashboard size={16} className="text-brand-400" />
              </div>
              <span className="text-slate-500 text-sm font-mono">Dashboard</span>
            </div>
            <h1 className="font-display font-800 text-4xl text-white">
              Welcome back{user?.signInDetails?.loginId ? `, ${user.signInDetails.loginId.split('@')[0]}` : ''}
            </h1>
            <p className="text-slate-500 font-body mt-1">Track your registered events</p>
          </div>
          <Link to="/events/create" className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> New Event
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Registered', value: registrations.length },
            { label: 'Upcoming', value: upcoming.length },
            { label: 'Past Events', value: past.length },
          ].map(({ label, value }) => (
            <div key={label} className="card p-5">
              <div className="font-display font-800 text-3xl gradient-text mb-1">{value}</div>
              <div className="text-slate-500 text-sm font-mono">{label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="text-brand-500 animate-spin" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🌊</div>
            <h3 className="font-display font-700 text-white text-xl mb-2">No Registrations Yet</h3>
            <p className="text-slate-500 font-body mb-6">Start exploring events to register for.</p>
            <Link to="/events" className="btn-primary inline-flex">Explore Events</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div>
                <h2 className="font-display font-700 text-white text-xl mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Upcoming Events
                </h2>
                <div className="space-y-3">
                  {upcoming.map(reg => (
                    <RegistrationRow key={reg.id} reg={reg} onCancel={handleCancel} />
                  ))}
                </div>
              </div>
            )}

            {/* Past */}
            {past.length > 0 && (
              <div>
                <h2 className="font-display font-700 text-slate-500 text-xl mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                  Past Events
                </h2>
                <div className="space-y-3 opacity-60">
                  {past.map(reg => (
                    <RegistrationRow key={reg.id} reg={reg} isPast />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function RegistrationRow({ reg, onCancel, isPast }) {
  return (
    <div className="card p-4 flex items-center gap-4 group hover:border-white/10 transition-all duration-200">
      {/* Color dot */}
      <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
        <span className="font-display font-800 text-brand-400 text-sm">
          {reg.event.title.charAt(0)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <Link to={`/events/${reg.eventId}`} className="font-display font-700 text-white hover:text-brand-400 transition-colors truncate block">
          {reg.event.title}
        </Link>
        <div className="flex items-center gap-4 mt-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
            <Calendar size={11} />
            {format(new Date(reg.event.date), 'MMM dd, yyyy')}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
            <MapPin size={11} />
            <span className="truncate max-w-[120px]">{reg.event.location}</span>
          </div>
        </div>
      </div>

      <span className={`badge flex-shrink-0 ${isPast ? 'badge-completed' : 'badge-active'}`}>
        {isPast ? 'Past' : 'Upcoming'}
      </span>

      {!isPast && onCancel && (
        <button
          onClick={() => onCancel(reg.id)}
          className="flex-shrink-0 w-8 h-8 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all duration-200"
          title="Cancel registration"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
