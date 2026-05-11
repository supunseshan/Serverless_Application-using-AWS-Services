// src/utils/formatters.js
import { format, formatDistanceToNow, isPast, isTomorrow } from 'date-fns'

export const formatEventDate = (date) =>
  format(new Date(date), 'EEEE, MMMM dd, yyyy · h:mm a')

export const formatShortDate = (date) =>
  format(new Date(date), 'MMM dd, yyyy')

export const formatRelativeDate = (date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true })

export const isEventPast = (date) => isPast(new Date(date))

export const isEventTomorrow = (date) => isTomorrow(new Date(date))

export const getSpotsLeft = (capacity, registrationCount) =>
  Math.max(0, capacity - registrationCount)

export const getCapacityPercent = (capacity, registrationCount) =>
  Math.min(100, Math.round((registrationCount / capacity) * 100))

export const getCapacityColor = (percent) => {
  if (percent >= 100) return 'text-red-400'
  if (percent >= 75) return 'text-amber-400'
  return 'text-emerald-400'
}

export const getCapacityBarColor = (percent) => {
  if (percent >= 100) return 'bg-red-500'
  if (percent >= 75) return 'bg-amber-500'
  return 'bg-brand-500'
}

export const truncate = (str, len = 120) =>
  str?.length > len ? str.slice(0, len) + '…' : str

export const getInitial = (str) =>
  str?.charAt(0)?.toUpperCase() ?? '?'
