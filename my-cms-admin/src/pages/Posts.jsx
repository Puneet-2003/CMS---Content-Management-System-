import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, User, ExternalLink } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts')
      setPosts(response.data)
    } catch (error) {
      toast.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await api.delete(`/posts/${id}`)
      setPosts(posts.filter(post => post.id !== id))
      toast.success('Post deleted successfully')
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const handlePublishToggle = async (post) => {
    try {
      const response = await api.patch(`/posts/${post.id}/publish`)
      setPosts(posts.map(p => 
        p.id === post.id ? { ...p, published: response.data.published } : p
      ))
      toast.success(`Post ${response.data.published ? 'published' : 'unpublished'}`)
    } catch (error) {
      toast.error('Failed to update post status')
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && post.published) ||
                         (statusFilter === 'draft' && !post.published)
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600 mt-2">Manage your blog posts</p>
        </div>
        <Link
          to="/posts/create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow border p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No posts found</p>
            <Link
              to="/posts/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Post
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.updated_at).toLocaleDateString()}</span>
                      </div>
                      {post.author && (
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{post.author.name}</span>
                        </div>
                      )}
                    </div>
                    {post.excerpt && (
                      <p className="text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                 
                    <Link
                      to={`/posts/view/${post.id}`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                      title="View Post"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    
                    <button
                      onClick={() => handlePublishToggle(post)}
                      className={`p-2 rounded ${
                        post.published ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <Link
                      to={`/posts/edit/${post.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Posts