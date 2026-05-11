import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, MapPin, Users, FileText, Edit, Trash2, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { eventsApi, registrationsApi } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function EventDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    eventsApi.getById(id).then(r => setEvent(r.data.data)).catch(() => navigate('/events')).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (user) {
      registrationsApi.getMine().then(r => {
        const regs = r.data.data || []
        setIsRegistered(regs.some(reg => reg.eventId === id))
      }).catch(() => {})
    }
  }, [user, id])

  const handleRegister = async () => {
    if (!user) { navigate('/login'); return }
    setRegistering(true)
    try {
      await registrationsApi.register(id)
      setIsRegistered(true)
      toast.success('🎉 Successfully registered! Check your email for confirmation.')
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed'
      toast.error(msg)
    } finally {
      setRegistering(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await eventsApi.delete(id)
      toast.success('Event deleted')
      navigate('/events')
    } catch {
      toast.error('Failed to delete event')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="text-brand-500 animate-spin" />
    </div>
  )

  if (!event) return null

  const registrations = event._count?.registrations ?? 0
  const spotsLeft = event.capacity - registrations
  const isFull = spotsLeft <= 0
  const fillPercent = Math.min((registrations / event.capacity) * 100, 100)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <Link to="/events" className="inline-flex items-center gap-2 text-slate-500 hover:text-white font-body text-sm mb-8 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>

        {/* Hero Image */}
        {event.imageUrl && (
          <div className="rounded-2xl overflow-hidden h-64 sm:h-80 mb-8 border border-white/[0.06]">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`badge ${event.status === 'ACTIVE' ? 'badge-active' : event.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-completed'}`}>
                  {event.status}
                </span>
              </div>
              <h1 className="font-display font-800 text-3xl sm:text-4xl text-white mb-2">{event.title}</h1>
              <p className="text-slate-500 text-sm font-body">Created by {event.createdBy?.name}</p>
            </div>

            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                  <Calendar size={16} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">Date & Time</div>
                  <div className="text-white font-body font-500 text-sm mt-0.5">
                    {format(new Date(event.date), 'EEEE, MMMM dd, yyyy · h:mm a')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                  <MapPin size={16} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">Location</div>
                  <div className="text-white font-body font-500 text-sm mt-0.5">{event.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                  <Users size={16} className="text-brand-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">Capacity</div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white font-body font-500 text-sm">{registrations} / {event.capacity} registered</span>
                    <span className={`text-xs font-mono font-500 ${isFull ? 'text-red-400' : 'text-emerald-400'}`}>
                      {isFull ? 'Full' : `${spotsLeft} spots left`}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-500 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isFull ? 'bg-red-500' : fillPercent > 75 ? 'bg-amber-500' : 'bg-brand-500'}`}
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-display font-700 text-white mb-3">About This Event</h2>
              <p className="text-slate-400 font-body leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            {event.documentUrl && (
              <a href={event.documentUrl} target="_blank" rel="noreferrer"
                className="card p-4 flex items-center gap-3 hover:border-brand-500/30 transition-all duration-200 group">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                  <FileText size={16} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-white font-display font-600 text-sm group-hover:text-brand-400 transition-colors">Event Document</div>
                  <div className="text-slate-500 text-xs font-mono">Click to view PDF</div>
                </div>
              </a>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Register Card */}
            <div className="card p-6">
              {isRegistered ? (
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/20">
                    <CheckCircle size={22} className="text-emerald-400" />
                  </div>
                  <h3 className="font-display font-700 text-white mb-1">You're In!</h3>
                  <p className="text-slate-500 text-sm font-body">Check your email for confirmation details.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-display font-700 text-white mb-1">Register for this Event</h3>
                  <p className="text-slate-500 text-sm font-body mb-4">
                    {isFull ? 'This event is at full capacity.' : `${spotsLeft} spots remaining`}
                  </p>
                  <button
                    onClick={handleRegister}
                    disabled={registering || isFull || event.status !== 'ACTIVE'}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    {registering && <Loader2 size={15} className="animate-spin" />}
                    {isFull ? 'Event Full' : registering ? 'Registering...' : 'Register Now'}
                  </button>
                  {!user && (
                    <p className="text-center text-xs text-slate-600 mt-3 font-body">
                      <Link to="/login" className="text-brand-400 hover:text-brand-300">Sign in</Link> to register
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Owner Actions */}
            {user && event.createdBy?.id && (
              <div className="card p-4 space-y-2">
                <p className="text-xs text-slate-600 font-mono uppercase tracking-wider mb-3">Manage Event</p>
                <Link to={`/events/${id}/edit`} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm py-2.5">
                  <Edit size={14} /> Edit Event
                </Link>
                <button onClick={handleDelete} className="w-full flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all">
                  <Trash2 size={14} /> Delete Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
