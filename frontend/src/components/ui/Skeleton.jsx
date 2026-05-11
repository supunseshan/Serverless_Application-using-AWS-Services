// src/components/ui/Skeleton.jsx
import React from 'react'

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-48" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 rounded-lg w-3/4" />
        <div className="skeleton h-4 rounded-lg w-full" />
        <div className="skeleton h-4 rounded-lg w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-3 rounded w-24" />
          <div className="skeleton h-3 rounded w-20" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-4 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export default function Spinner({ size = 28 }) {
  return (
    <div
      className="rounded-full border-2 border-brand-500 border-t-transparent animate-spin"
      style={{ width: size, height: size }}
    />
  )
}
