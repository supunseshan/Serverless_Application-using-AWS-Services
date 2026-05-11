import React, { useEffect, useState, useCallback } from 'react'
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react'
import { eventsApi } from '../api'
import EventCard from '../components/events/EventCard'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchEvents = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const { data } = await eventsApi.getAll({ page, limit: 12, search: debouncedSearch })
      setEvents(data.data || [])
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
    } catch {
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => { fetchEvents(1) }, [fetchEvents])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display font-800 text-4xl text-white mb-2">Explore Events</h1>
          <p className="text-slate-500 font-body">
            {pagination.total > 0 ? `${pagination.total} events available` : 'Browse all upcoming events'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search events, locations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-11"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2 px-4">
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-48" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-5 rounded-lg w-3/4" />
                  <div className="skeleton h-4 rounded-lg w-full" />
                  <div className="skeleton h-4 rounded-lg w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🌊</div>
            <h3 className="font-display font-700 text-white text-xl mb-2">No Events Found</h3>
            <p className="text-slate-500 font-body">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} delay={i * 60} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => fetchEvents(p)}
                    className={`w-10 h-10 rounded-xl font-mono font-500 text-sm transition-all duration-200 ${
                      p === pagination.page
                        ? 'bg-brand-500 text-white shadow-glow'
                        : 'bg-surface-600 text-slate-400 hover:bg-surface-500 hover:text-white border border-white/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
