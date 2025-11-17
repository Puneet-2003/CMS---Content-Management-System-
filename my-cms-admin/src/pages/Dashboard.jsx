import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Files, 
  Image, 
  Eye, 
  Plus,
  TrendingUp,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Clock,
  BarChart3,
  ExternalLink
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const StatCard = ({ title, value, icon: Icon, change, changeType, color, link, description }) => (
  <Link to={link} className="block group">
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group-hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mb-3">{description}</p>
          )}
          {change && (
            <div className={`flex items-center text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? 
                <ArrowUp className="w-4 h-4 mr-1" /> : 
                <ArrowDown className="w-4 h-4 mr-1" />
              }
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${color} shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </Link>
)

const QuickActionCard = ({ icon: Icon, title, description, link, color }) => (
  <Link to={link} className="block group">
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group-hover:scale-[1.02]">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${color} shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </div>
    </div>
  </Link>
)

const RecentActivityItem = ({ title, type, date, status, id, slug }) => {
  const handleView = () => {

    if (type === 'post') {

      const postUrl = `/blog/${slug}`;
      const postUrl2 = `/posts/${slug}`;
      const postUrl3 = `/${slug}`;
      
    
      const newWindow = window.open(postUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
     
        const secondTry = window.open(postUrl2, '_blank');
        if (!secondTry || secondTry.closed || typeof secondTry.closed === 'undefined') {
          window.open(postUrl3, '_blank');
        }
      }
    } else if (type === 'page') {

      const pageUrl = `/${slug}`;
      window.open(pageUrl, '_blank');
    }
  }

  const handleEdit = () => {
   
    if (type === 'post') {
      window.location.href = `/posts/edit/${id}`;
    } else if (type === 'page') {
      window.location.href = `/pages/edit/${id}`;
    }
  }

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg ${
          type === 'post' ? 'bg-blue-100' : 'bg-green-100'
        }`}>
          {type === 'post' ? (
            <FileText className="w-4 h-4 text-blue-600" />
          ) : (
            <Files className="w-4 h-4 text-green-600" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h4>
          <div className="flex items-center space-x-3 mt-1">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{date}</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {status}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleView}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
          title="View on website"
        >
   
        </button>
        <button
          onClick={handleEdit}
          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
          title="Edit"
        >
          <FileText className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalPages: 0,
    publishedPosts: 0,
    mediaFiles: 0
  })
  const [recentItems, setRecentItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [postsRes, pagesRes, mediaRes] = await Promise.all([
        api.get('/posts'),
        api.get('/pages'),
        api.get('/media')
      ])

      const posts = postsRes.data || []
      const pages = pagesRes.data || []
      const media = mediaRes.data || []

      
setStats({
  totalPosts: posts.length,
  totalPages: pages.length,
  publishedPosts: posts.filter(post => post.published).length,
  mediaFiles: media.length 
})

      const recentPosts = posts.slice(0, 3).map(post => ({
        id: post.id,
        title: post.title,
        type: 'post',
        slug: post.slug || `post-${post.id}`,
        published: post.published,
        date: new Date(post.updated_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }))
      
      const recentPages = pages.slice(0, 3).map(page => ({
        id: page.id,
        title: page.title,
        type: 'page',
        slug: page.slug || `page-${page.id}`,
        published: page.published,
        date: new Date(page.updated_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }))

      const allRecent = [...recentPosts, ...recentPages]
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 4)

      setRecentItems(allRecent)

    } catch (error) {
      console.error('Dashboard data error:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-xl w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Welcome to your content management workspace</p>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <BarChart3 className="w-4 h-4" />
            <span>Last updated: Just now</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={FileText}
          change="+12%"
          changeType="positive"
          color="bg-blue-500"
          link="/posts"
          description="Blog articles & news"
        />
        <StatCard
          title="Published"
          value={stats.publishedPosts}
          icon={Eye}
          change="+8%"
          changeType="positive"
          color="bg-green-500"
          link="/posts"
          description="Live content"
        />
        <StatCard
          title="Pages"
          value={stats.totalPages}
          icon={Files}
          change="+5%"
          changeType="positive"
          color="bg-purple-500"
          link="/pages"
          description="Static pages"
        />
        <StatCard
          title="Media Files"
          value={stats.mediaFiles}
          icon={Image}
          change="+15%"
          changeType="positive"
          color="bg-orange-500"
          link="/media"
          description="Images & documents"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60">
            <div className="p-6 border-b border-gray-200/60">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Quick Actions</span>
              </h2>
              <p className="text-gray-600 mt-1">Get started with these common tasks</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickActionCard
                icon={FileText}
                title="Create New Post"
                description="Write and publish a new blog post"
                link="/posts/create"
                color="bg-blue-500"
              />
              <QuickActionCard
                icon={Files}
                title="Create New Page"
                description="Add a new static page to your site"
                link="/pages/create"
                color="bg-green-500"
              />
              <QuickActionCard
                icon={Image}
                title="Manage Media"
                description="Upload and organize your media files"
                link="/media"
                color="bg-orange-500"
              />

            </div>
          </div>
        </div>


        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60">
          <div className="p-6 border-b border-gray-200/60">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Recent Activity</span>
            </h2>
            <p className="text-gray-600 mt-1">Latest updates across your content</p>
          </div>
          <div className="p-4">
            {recentItems.length > 0 ? (
              recentItems.map((item, index) => (
                <RecentActivityItem
                  key={index}
                  id={item.id}
                  title={item.title}
                  type={item.type}
                  slug={item.slug}
                  date={item.date}
                  status={item.published ? 'published' : 'draft'}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No recent activity</p>
                <p className="text-sm text-gray-500 mt-1">Content you create will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard