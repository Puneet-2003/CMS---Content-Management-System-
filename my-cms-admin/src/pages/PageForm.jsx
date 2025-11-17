import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

// Import React Quill and its CSS
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const PageForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: false
  })

  useEffect(() => {
    if (isEditing) {
      fetchPage()
    }
  }, [id])

  const fetchPage = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/pages/${id}`)
      const page = response.data
      
      setFormData({
        title: page.title || '',
        content: page.content || '',
        published: page.published || false
      })
    } catch (error) {
      toast.error('Failed to fetch page')
      navigate('/pages')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }
    
    if (!formData.content.trim()) {
      toast.error('Please enter some content')
      return
    }

    setSaving(true)

    try {
      if (isEditing) {
        await api.put(`/pages/${id}`, formData)
        toast.success('Page updated successfully')
      } else {
        await api.post('/pages', formData)
        toast.success('Page created successfully')
      }
      navigate('/pages')
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} page`)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // React Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  }

  // React Quill formats configuration
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block'
  ]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-xl w-64 mb-8"></div>
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
     
      <div className="mb-8">
        <button
          onClick={() => navigate('/pages')}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Pages
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {isEditing ? 'Edit Page' : 'Create New Page'}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {isEditing ? 'Update your page content and settings' : 'Create a new static page for your website'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
  
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
 
          <div className="mb-8">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
              Page Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Enter the page title..."
            />
            <p className="text-sm text-gray-500 mt-2">
              The page URL will be automatically generated from the title.
            </p>
          </div>

    
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Content *
            </label>
            <div className="ql-custom-container border border-gray-300 rounded-xl overflow-hidden">
              <ReactQuill
                value={formData.content}
                onChange={(value) => handleChange('content', value)}
                theme="snow"
                modules={modules}
                formats={formats}
                placeholder="Write your page content here..."
                style={{ 
                  border: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

 
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => handleChange('published', e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-3 block text-sm font-medium text-gray-900">
                  Publish immediately
                </label>
              </div>
              
              {formData.published && (
                <div className="flex items-center space-x-2 text-green-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">This page will be visible to the public</span>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">
              {isEditing ? 'Last updated: ' : 'Created: '}
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

     
        <div className="flex items-center justify-end space-x-4 bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
          <button
            type="button"
            onClick={() => navigate('/pages')}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {isEditing ? 'Update Page' : 'Create Page'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PageForm