import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Eye, Edit, Clock } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const PageView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPage()
  }, [id])

  const fetchPage = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/pages/${id}`)
      setPage(response.data)
    } catch (error) {
      toast.error('Failed to load page')
      navigate('/pages')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-xl w-64 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded-xl mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
          <Link
            to="/pages"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pages
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">

        <div className="mb-8">
          <button
            onClick={() => navigate('/pages')}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Pages
          </button>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {page.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDate(page.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {formatDate(page.updated_at)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    page.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
            
            <Link
              to={`/pages/edit/${page.id}`}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Page
            </Link>
          </div>
        </div>

   
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
          {page.content ? (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No content available for this page.</p>
              <p className="text-sm mt-2">Edit the page to add content.</p>
            </div>
          )}
        </div>

   
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">URL Slug:</span>
              <p className="text-blue-600 font-mono mt-1">/{page.slug}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                page.published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {page.published ? 'Public' : 'Private Draft'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Created:</span>
              <p className="text-gray-600 mt-1">{formatDate(page.created_at)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Last Updated:</span>
              <p className="text-gray-600 mt-1">{formatDate(page.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageView