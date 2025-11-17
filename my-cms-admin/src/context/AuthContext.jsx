import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await api.get('/auth/me')
        setUser(response.data)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    const { user, token } = response.data
    
    localStorage.setItem('token', token)
    setUser(user)
    
    return response.data
  }

  const register = async (userData) => {
    try {
      console.log('Sending to backend:', userData)
      
      // Try different field name combinations
      const registrationPayload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        // Try different confirm password field names
        password_confirmation: userData.password_confirmation || userData.confirmPassword,
        confirmPassword: userData.confirmPassword || userData.password_confirmation
      }
      
      // Remove undefined fields
      Object.keys(registrationPayload).forEach(key => {
        if (registrationPayload[key] === undefined) {
          delete registrationPayload[key]
        }
      })
      
      console.log('Final payload:', registrationPayload)
      
      const response = await api.post('/auth/register', registrationPayload)
      
      console.log('Registration response:', response.data)
      
      // If registration returns a token directly, handle it
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)
      }
      
      return response.data
    } catch (error) {
      console.error('Registration error in context:', error)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      })
      throw error
    }
  }
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}