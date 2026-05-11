import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Loader2, Zap, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register, confirmRegistration, resendCode, login } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('register') // register | verify
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [code, setCode] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleRegister = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      await register(form.email, form.password, form.name)
      setStep('verify')
      toast.success('Verification code sent to your email!')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await confirmRegistration(form.email, code)
      await login(form.email, form.password)
      toast.success('Account verified! Welcome to CloudWave 🎉')
      navigate('/events')
    } catch (err) {
      toast.error(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-8">
      <div className="orb w-96 h-96 bg-brand-600/10 top-10 right-1/4" />
      <div className="orb w-64 h-64 bg-purple-700/8 bottom-10 left-1/4" />

      <div className="relative z-10 w-full max-w-md animate-fade-up" style={{ animationFillMode: 'forwards', opacity: 0 }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shadow-glow">
              <Zap size={20} className="text-white" fill="white" />
            </div>
          </div>
          <h1 className="font-display font-800 text-3xl text-white">
            {step === 'register' ? 'Create Account' : 'Verify Email'}
          </h1>
          <p className="text-slate-500 font-body mt-2">
            {step === 'register' ? 'Join CloudWave Events today' : `Code sent to ${form.email}`}
          </p>
        </div>

        <div className="card p-8">
          {step === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="label">Full Name</label>
                <input type="text" value={form.name} onChange={set('name')} placeholder="Jane Smith" className="input-field" required />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className="input-field" required />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 8 characters with uppercase & number" className="input-field pr-11" required />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="text-center p-4 bg-brand-500/5 rounded-xl border border-brand-500/20 mb-2">
                <Mail size={24} className="text-brand-400 mx-auto mb-2" />
                <p className="text-slate-400 text-sm font-body">Check your inbox for a 6-digit verification code</p>
              </div>
              <div>
                <label className="label">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="input-field text-center text-2xl font-mono tracking-[0.5em]"
                  required
                />
              </div>
              <button type="submit" disabled={loading || code.length !== 6} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
              <button
                type="button"
                onClick={() => { resendCode(form.email); toast.success('Code resent!') }}
                className="text-center text-slate-500 text-sm font-body w-full hover:text-slate-400 transition-colors"
              >
                Didn't receive it? <span className="text-brand-400">Resend code</span>
              </button>
            </form>
          )}

          {step === 'register' && (
            <p className="text-center text-slate-500 text-sm font-body mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-500 transition-colors">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
