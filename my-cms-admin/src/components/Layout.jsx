import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  FileText,
  Files,
  Image,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Search,
  Bell,
  Settings,
  Home
} from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/posts', icon: FileText, label: 'Posts' },
    { path: '/pages', icon: Files, label: 'Pages' },
    { path: '/media', icon: Image, label: 'Media Library' },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className={`lg:hidden fixed inset-0 z-50 bg-black bg-opacity-60 transition-opacity duration-300 ${
        sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setSidebarOpen(false)}>
        <div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`} onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CMS Admin</h1>
                <p className="text-blue-100 text-sm">Management Panel</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    active
                      ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${
                    active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

    
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200 shadow-lg">
          <div className="flex items-center justify-between flex-shrink-0 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CMS Admin</h1>
                <p className="text-blue-100 text-sm">Management Panel</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    active
                      ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${
                    active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>


      <div className="lg:pl-80">

        <div className="sticky top-0 z-40 flex items-center justify-between flex-shrink-0 h-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 shadow-sm px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

          
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
              <Settings className="w-6 h-6" />
            </button>

    
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-all">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  userDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200/60 backdrop-blur-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
                  </div>
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Preferences</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout