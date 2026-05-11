import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { eventsApi } from '../api'
import EventForm from '../components/events/EventForm'
import toast from 'react-hot-toast'

export default function CreateEventPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      const { data: res } = await eventsApi.create(data)
      toast.success('Event created successfully! 🎉')
      navigate(`/events/${res.data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-800 text-4xl text-white mb-2">Create Event</h1>
          <p className="text-slate-500 font-body">Launch your next big event on CloudWave.</p>
        </div>
        <div className="card p-8">
          <EventForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}
