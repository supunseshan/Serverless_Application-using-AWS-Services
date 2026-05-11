import React, { useState } from 'react'
import { Upload, X, Loader2, ImagePlus } from 'lucide-react'
import { filesApi } from '../../api'
import toast from 'react-hot-toast'

export default function EventForm({ initialData = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    date: initialData.date ? new Date(initialData.date).toISOString().slice(0,16) : '',
    location: initialData.location || '',
    capacity: initialData.capacity || 100,
    imageUrl: initialData.imageUrl || '',
    documentUrl: initialData.documentUrl || '',
  })
  const [imageUploading, setImageUploading] = useState(false)
  const [docUploading, setDocUploading] = useState(false)

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageUploading(true)
    try {
      const { data } = await filesApi.getPresignedUrl(file.type, 'event-images')
      await filesApi.uploadToS3(data.data.uploadUrl, file)
      setForm(prev => ({ ...prev, imageUrl: data.data.fileUrl }))
      toast.success('Image uploaded!')
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setImageUploading(false)
    }
  }

  const handleDocUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setDocUploading(true)
    try {
      const { data } = await filesApi.getPresignedUrl(file.type, 'event-docs')
      await filesApi.uploadToS3(data.data.uploadUrl, file)
      setForm(prev => ({ ...prev, documentUrl: data.data.fileUrl }))
      toast.success('Document uploaded!')
    } catch {
      toast.error('Failed to upload document')
    } finally {
      setDocUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="label">Event Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={set('title')}
          placeholder="e.g. AWS Re:Invent 2025"
          className="input-field"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="label">Description *</label>
        <textarea
          value={form.description}
          onChange={set('description')}
          placeholder="Tell people what this event is about..."
          rows={4}
          className="input-field resize-none"
          required
        />
      </div>

      {/* Date & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Date & Time *</label>
          <input
            type="datetime-local"
            value={form.date}
            onChange={set('date')}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="label">Location *</label>
          <input
            type="text"
            value={form.location}
            onChange={set('location')}
            placeholder="e.g. Las Vegas Convention Center"
            className="input-field"
            required
          />
        </div>
      </div>

      {/* Capacity */}
      <div>
        <label className="label">Capacity</label>
        <input
          type="number"
          value={form.capacity}
          onChange={set('capacity')}
          min="1"
          max="100000"
          className="input-field"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="label">Event Banner Image</label>
        <div className="mt-1">
          {form.imageUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-white/10 h-40">
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl h-32 cursor-pointer hover:border-brand-500/40 hover:bg-white/[0.02] transition-all duration-200 group">
              <div className="flex flex-col items-center gap-2">
                {imageUploading ? (
                  <Loader2 size={20} className="text-brand-400 animate-spin" />
                ) : (
                  <ImagePlus size={20} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                )}
                <span className="text-xs text-slate-500 group-hover:text-slate-400">
                  {imageUploading ? 'Uploading...' : 'Click to upload image (JPG, PNG, WebP)'}
                </span>
              </div>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" disabled={imageUploading} />
            </label>
          )}
        </div>
      </div>

      {/* Document Upload */}
      <div>
        <label className="label">Event Document <span className="text-slate-500 font-normal">(optional)</span></label>
        <label className="flex items-center gap-3 border border-dashed border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-brand-500/40 hover:bg-white/[0.02] transition-all duration-200 group">
          {docUploading ? (
            <Loader2 size={16} className="text-brand-400 animate-spin flex-shrink-0" />
          ) : (
            <Upload size={16} className="text-slate-600 group-hover:text-brand-400 transition-colors flex-shrink-0" />
          )}
          <span className="text-sm text-slate-500 group-hover:text-slate-400 truncate">
            {form.documentUrl ? '✅ Document uploaded' : docUploading ? 'Uploading...' : 'Upload PDF document'}
          </span>
          {form.documentUrl && (
            <button type="button" onClick={(e) => { e.preventDefault(); setForm(prev => ({ ...prev, documentUrl: '' })) }} className="ml-auto">
              <X size={14} className="text-red-400" />
            </button>
          )}
          <input type="file" accept="application/pdf" onChange={handleDocUpload} className="hidden" disabled={docUploading} />
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || imageUploading || docUploading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? 'Saving...' : (initialData.id ? 'Update Event' : 'Create Event')}
      </button>
    </form>
  )
}
