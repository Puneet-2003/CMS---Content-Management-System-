import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter,
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  User,
  MoreVertical,
  FileText,
  ExternalLink  // Add this import
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const Pages = () => {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await api.get('/pages')
      setPages(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch pages')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return

    try {
      await api.delete(`/pages/${id}`)
      setPages(pages.filter(page => page.id !== id))
      toast.success('Page deleted successfully')
    } catch (error) {
      toast.error('Failed to delete page')
    }
  }

  const handlePublishToggle = async (page) => {
    try {
      const response = await api.patch(`/pages/${page.id}/publish`)
      setPages(pages.map(p => 
        p.id === page.id ? { ...p, published: response.data.published } : p
      ))
      toast.success(`Page ${response.data.published ? 'published' : 'unpublished'}`)
    } catch (error) {
      toast.error('Failed to update page status')
    }
  }

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.content?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && page.published) ||
                         (statusFilter === 'draft' && !page.published)
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-xl w-64 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-24"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
   
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Pages
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Manage your static website pages</p>
        </div>
        <Link
          to="/pages/create"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Page
        </Link>
      </div>


      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pages by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
        {filteredPages.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pages found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first page.</p>
            <Link
              to="/pages/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Page
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200/60">
            {filteredPages.map((page) => (
              <div key={page.id} className="p-6 hover:bg-gray-50/50 transition-all duration-200 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {page.title}
                      </h3>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                        page.published 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {page.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Updated {new Date(page.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-blue-600 font-medium">/{page.slug}</span>
                      </div>
                    </div>

                    {page.excerpt && (
                      <p className="text-gray-600 mt-3 line-clamp-2">{page.excerpt}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-6">
               
                    <Link
                      to={`/pages/view/${page.id}`}
                      className="p-3 text-green-600 hover:bg-green-50 hover:shadow-sm rounded-xl transition-all duration-200"
                      title="View Page"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                    
                    <button
                      onClick={() => handlePublishToggle(page)}
                      className={`p-3 rounded-xl transition-all duration-200 ${
                        page.published 
                          ? 'text-orange-600 hover:bg-orange-50 hover:shadow-sm' 
                          : 'text-green-600 hover:bg-green-50 hover:shadow-sm'
                      }`}
                      title={page.published ? 'Unpublish' : 'Publish'}
                    >
                      {page.published ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    
                    <Link
                      to={`/pages/edit/${page.id}`}
                      className="p-3 text-blue-600 hover:bg-blue-50 hover:shadow-sm rounded-xl transition-all duration-200"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="p-3 text-red-600 hover:bg-red-50 hover:shadow-sm rounded-xl transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Pages