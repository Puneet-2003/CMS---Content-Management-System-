import React, { useState, useEffect } from 'react'
import { Plus, Upload, Image, File, Trash2, Download, Eye } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const MediaManager = () => {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const response = await api.get('/media')
      console.log('Media API Response:', response.data) // Debug log
      setMedia(response.data || [])
    } catch (error) {
      console.error('Media fetch error:', error)
      toast.error('Failed to fetch media files')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const files = event.target.files
    if (!files.length) return

    setUploading(true)
    
    try {
      for (let file of files) {
        const formData = new FormData()
        formData.append('file', file)
        
        console.log('Uploading file:', file.name, file.type) // Debug log
        
        const response = await api.post('/media/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        console.log('Upload response:', response.data) // Debug log
        
        setMedia(prev => [response.data, ...prev])
      }
      toast.success('Files uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload files')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return

    try {
      await api.delete(`/media/${id}`)
      setMedia(media.filter(item => item.id !== id))
      toast.success('File deleted successfully')
    } catch (error) {
      toast.error('Failed to delete file')
    }
  }

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-600" />
    }
    return <File className="w-8 h-8 text-gray-600" />
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Function to get display URL (handle different URL formats)
  const getDisplayUrl = (item) => {
    if (!item) return ''
    
    // If item has direct URL
    if (item.url) return item.url
    
    // If item has path and we need to construct URL
    if (item.path) {
      // Remove leading slash if present
      const cleanPath = item.path.startsWith('/') ? item.path.slice(1) : item.path
      return `http://localhost:5000/storage/${cleanPath}`
    }
    
    // Fallback to ID-based URL
    return `http://localhost:5000/api/media/${item.id}`
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-xl w-1/4 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-40"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Media Library
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Manage your media files and uploads</p>
        </div>
        <label className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
          <Upload className="w-5 h-5 mr-2" />
          Upload Files
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          />
        </label>
      </div>

      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-700 font-medium">Uploading files...</span>
          </div>
        </div>
      )}

      {media.length === 0 ? (
        <div className="text-center py-16">
          <Image className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No media files</h3>
          <p className="text-gray-500 mb-6">Upload your first file to get started.</p>
          <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
            <Plus className="w-5 h-5 mr-2" />
            Upload Files
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Total {media.length} file{media.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {media.map((item) => {
              const displayUrl = getDisplayUrl(item)
              const isImage = item.mime_type?.startsWith('image/')
              
              return (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200/60 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center p-4 relative">
                    {isImage ? (
                      <>
                        <img
                          src={displayUrl}
                          alt={item.file_name || 'Media file'}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            // If image fails to load, show icon instead
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        <div className="absolute inset-0 hidden items-center justify-center bg-gray-100">
                          <Image className="w-8 h-8 text-gray-400" />
                        </div>
                      </>
                    ) : (
                      getFileIcon(item.mime_type)
                    )}
                    
                 
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => window.open(displayUrl, '_blank')}
                        className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                        title="View full size"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <p 
                      className="text-sm font-medium text-gray-900 truncate mb-1" 
                      title={item.file_name}
                    >
                      {item.file_name}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        {formatFileSize(item.size)}
                      </p>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => window.open(displayUrl, '_blank')}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Download/View"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default MediaManager