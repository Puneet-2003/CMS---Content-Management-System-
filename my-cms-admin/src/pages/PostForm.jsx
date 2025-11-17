import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import { Save, ArrowLeft, Eye, EyeOff, Upload, Image } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const PostForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false,
    featured_image: ''
  })
  const [imagePreview, setImagePreview] = useState('')

  // Function to get proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return ''
    if (imagePath.startsWith('http')) return imagePath
    // Handle relative paths from backend
    return `http://localhost:5000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
  }

  useEffect(() => {
    if (isEditing) {
      fetchPost()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/posts/${id}`)
      const post = response.data
      
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        published: post.published || false,
        featured_image: post.featured_image || ''
      })
      
      if (post.featured_image) {
        // Use getImageUrl to set the preview
        setImagePreview(getImageUrl(post.featured_image))
      }
    } catch (error) {
      toast.error('Failed to fetch post')
      navigate('/posts')
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
        await api.put(`/posts/${id}`, formData)
        toast.success('Post updated successfully')
      } else {
        await api.post('/posts', formData)
        toast.success('Post created successfully')
      }
      navigate('/posts')
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} post`)
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      const uploadedImage = response.data
      const imageUrl = getImageUrl(uploadedImage.url)
      
      setFormData(prev => ({
        ...prev,
        featured_image: uploadedImage.url // Store the original URL from backend
      }))
      setImagePreview(imageUrl) // Use the processed URL for preview
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload image')
    }
  }

  const handleRemoveImage = () => {
    setImagePreview('')
    setFormData(prev => ({
      ...prev,
      featured_image: ''
    }))
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
    'blockquote', 'code-block'
  ]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-xl w-64 mb-8"></div>
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
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
          onClick={() => navigate('/posts')}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Posts
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {isEditing ? 'Update your post content and settings' : 'Write and publish a new blog post'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
 
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
     
          <div className="mb-8">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
              Post Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Enter a compelling title for your post..."
            />
          </div>


          <div className="mb-8">
            <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-900 mb-3">
              Excerpt
              <span className="text-gray-500 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              id="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 resize-none"
              placeholder="Brief description of your post that will appear in listings..."
            />
            <p className="text-sm text-gray-500 mt-2">
              A short summary of your post. If left empty, it will be generated from the content.
            </p>
          </div>

      
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Featured Image
              <span className="text-gray-500 font-normal ml-1">(optional)</span>
            </label>
            
            {imagePreview ? (
              <div className="space-y-4">
                <div className="relative w-full max-w-md h-48 rounded-xl overflow-hidden border border-gray-300 bg-gray-100">
                  <img
                    src={imagePreview}
                    alt="Featured preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
               
                      console.error('Image failed to load:', imagePreview)
                      e.target.style.display = 'none'
                    }}
                  />
            
                  {!imagePreview && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-400" />
                      <span className="text-gray-500 ml-2">Image not available</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    Remove Image
                  </button>
                  <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm font-medium">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Current image URL: {formData.featured_image}
                </p>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full max-w-md h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Image className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

       
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Content *
            </label>
            <div className="border border-gray-300 rounded-xl overflow-hidden">
              <ReactQuill
                value={formData.content}
                onChange={(value) => handleChange('content', value)}
                theme="snow"
                modules={modules}
                formats={formats}
                placeholder="Write your post content here..."
                style={{ 
                  minHeight: '400px',
                  border: 'none'
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
                  <span className="text-sm font-medium">This post will be visible to the public</span>
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
            onClick={() => navigate('/posts')}
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
                {isEditing ? 'Update Post' : 'Create Post'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostForm