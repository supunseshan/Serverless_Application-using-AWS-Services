import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  signIn, signOut, signUp, confirmSignUp,
  getCurrentUser, fetchAuthSession, resendSignUpCode
} from 'aws-amplify/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      const session = await fetchAuthSession()
      const idToken = session.tokens?.idToken?.toString()
      setUser(currentUser)
      setToken(idToken)
    } catch {
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUser() }, [])

  const login = async (email, password) => {
    const result = await signIn({ username: email, password })
    await loadUser()
    return result
  }

  const register = async (email, password, name) => {
    return signUp({
      username: email,
      password,
      options: { userAttributes: { email, name } }
    })
  }

  const confirmRegistration = async (email, code) => {
    return confirmSignUp({ username: email, confirmationCode: code })
  }

  const resendCode = async (email) => {
    return resendSignUpCode({ username: email })
  }

  const logout = async () => {
    await signOut()
    setUser(null)
    setToken(null)
  }

  const refreshToken = async () => {
    const session = await fetchAuthSession({ forceRefresh: true })
    const idToken = session.tokens?.idToken?.toString()
    setToken(idToken)
    return idToken
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, confirmRegistration, resendCode, logout, refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
