import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '' // Changed from password_confirmation
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('Form data:', formData) // Debug log
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    
    if (!formData.email.trim()) {
      toast.error('Please enter your email')
      return
    }
    
    if (!formData.password) {
      toast.error('Please enter a password')
      return
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      console.log('Password mismatch:', {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        match: formData.password === formData.confirmPassword
      })
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      // Prepare data for backend - try different field name combinations
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword // Try this format
      }
      
      console.log('Sending registration data:', registrationData)
      
      await register(registrationData)
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error response:', error.response)
      
      // More detailed error handling
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const errors = error.response.data.errors
        const firstError = Object.values(errors)[0]
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError)
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
          <p className="text-gray-600 mt-2">Sign up for your CMS Admin panel</p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-12 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password (min. 6 characters)"
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-12 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register