import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { eventsApi } from '../api'
import EventForm from '../components/events/EventForm'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export default function EditEventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    eventsApi.getById(id).then(r => setEvent(r.data.data)).catch(() => navigate('/events'))
  }, [id])

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await eventsApi.update(id, data)
      toast.success('Event updated!')
      navigate(`/events/${id}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update event')
    } finally {
      setLoading(false)
    }
  }

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="text-brand-500 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-800 text-4xl text-white mb-2">Edit Event</h1>
          <p className="text-slate-500 font-body">Update your event details below.</p>
        </div>
        <div className="card p-8">
          <EventForm initialData={event} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}
