// src/components/ui/Badge.jsx
import React from 'react'

const STYLES = {
  ACTIVE:    'badge-active',
  CANCELLED: 'badge-cancelled',
  COMPLETED: 'badge-completed',
  default:   'badge bg-slate-500/10 text-slate-400 border border-slate-500/20',
}

export default function Badge({ status, children }) {
  return (
    <span className={STYLES[status] || STYLES.default}>
      {children || status}
    </span>
  )
}
