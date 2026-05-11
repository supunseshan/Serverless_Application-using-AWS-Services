// src/components/ui/Input.jsx
import React from 'react'

export default function Input({
  label,
  error,
  hint,
  className = '',
  ...props
}) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <input
        className={`input-field ${error ? 'border-red-500/50 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400 font-body">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-600 font-body">{hint}</p>}
    </div>
  )
}
