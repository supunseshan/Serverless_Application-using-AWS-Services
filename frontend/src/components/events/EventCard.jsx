import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

const STATUS_STYLES = {
  ACTIVE: 'badge-active',
  CANCELLED: 'badge-cancelled',
  COMPLETED: 'badge-completed',
}

export default function EventCard({ event, delay = 0 }) {
  const registrations = event._count?.registrations ?? 0
  const spotsLeft = event.capacity - registrations
  const isFull = spotsLeft <= 0
  const fillPercent = Math.min((registrations / event.capacity) * 100, 100)

  return (
    <Link
      to={`/events/${event.id}`}
      className="card-hover group block overflow-hidden animate-fade-up"
      style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: 'forwards' }}
    >
      {/* Image / Placeholder */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-br from-surface-600 to-surface-700">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-20 font-display font-800 text-brand-400 select-none">
              {event.title.charAt(0).toUpperCase()}
            </div>
            {/* Decorative orbs */}
            <div className="orb w-32 h-32 bg-brand-600/20 top-0 right-0" />
            <div className="orb w-24 h-24 bg-purple-600/15 bottom-0 left-0" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={STATUS_STYLES[event.status] || 'badge'}>
            {event.status}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-700 text-white text-lg mb-1 line-clamp-1 group-hover:text-brand-400 transition-colors duration-200">
          {event.title}
        </h3>
        <p className="text-slate-500 text-sm font-body leading-relaxed mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Calendar size={13} className="text-brand-500 flex-shrink-0" />
            <span className="font-mono text-xs">
              {format(new Date(event.date), 'MMM dd, yyyy · h:mm a')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <MapPin size={13} className="text-brand-500 flex-shrink-0" />
            <span className="truncate text-xs">{event.location}</span>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Users size={11} />
              <span>{registrations}/{event.capacity}</span>
            </div>
            <span className={`text-xs font-mono font-500 ${isFull ? 'text-red-400' : 'text-emerald-400'}`}>
              {isFull ? 'Full' : `${spotsLeft} left`}
            </span>
          </div>
          <div className="h-1 rounded-full bg-surface-500 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isFull ? 'bg-red-500' : fillPercent > 75 ? 'bg-amber-500' : 'bg-brand-500'
              }`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
          <span className="text-xs text-slate-600 font-body">
            by {event.createdBy?.name || 'Unknown'}
          </span>
          <span className="text-brand-400 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1 text-xs font-display font-600">
            View <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}
