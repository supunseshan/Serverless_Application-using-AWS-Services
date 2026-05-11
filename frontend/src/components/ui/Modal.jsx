// src/components/ui/Modal.jsx
import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full ${sizes[size]} card p-6 animate-fade-up`}
           style={{ animationFillMode: 'forwards', opacity: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-700 text-white text-lg">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
