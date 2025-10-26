import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Brain, FileText, GraduationCap, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()

  const stats = [
    { label: 'Active Services', value: '24', change: '+12%', icon: TrendingUp },
    { label: 'Education Students', value: '156', change: '+8%', icon: Users },
    { label: 'AI Learning Sessions', value: '2.4K', change: '+15%', icon: Brain },
    { label: 'Compliance Rate', value: '98%', change: '+2%', icon: FileText }
  ]

  const recentActivities = [
    { action: 'New AI agent deployed', time: '2 minutes ago', type: 'deployment' },
    { action: 'System backup completed', time: '1 hour ago', type: 'maintenance' },
    { action: 'Security scan passed', time: '3 hours ago', type: 'security' },
    { action: 'Database optimized', time: '6 hours ago', type: 'performance' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-muted-foreground">Here's what's happening with your Azora OS</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className="flex items-center gap-2">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <div className="text-green-500 text-sm font-medium">
                  {stat.change}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div>
                <p className="text-foreground font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                activity.type === 'deployment' ? 'bg-blue-500/10 text-blue-500' :
                activity.type === 'maintenance' ? 'bg-green-500/10 text-green-500' :
                activity.type === 'security' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-purple-500/10 text-purple-500'
              }`}>
                {activity.type}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/education/dashboard" className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left block">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-foreground">Education Dashboard</h3>
            </div>
            <p className="text-sm text-muted-foreground">Access homeschool management tools</p>
          </Link>
          <Link to="/education/ai-assistant" className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left block">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <h3 className="font-medium text-foreground">AI Learning Assistant</h3>
            </div>
            <p className="text-sm text-muted-foreground">Get personalized learning support</p>
          </Link>
          <Link to="/education/compliance" className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left block">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-green-500" />
              <h3 className="font-medium text-foreground">Compliance Reports</h3>
            </div>
            <p className="text-sm text-muted-foreground">Department of Education compliance</p>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard