import React from 'react'
import { 
  Users, 
  Pill, 
  Calendar, 
  AlertTriangle
} from 'lucide-react'

export default function Dashboard() {
  // Mock data - in real app this would come from API
  const stats = [
    { name: 'Total Students', value: '1,247', icon: Users, change: '+12%', changeType: 'positive' },
    { name: 'Active Medications', value: '324', icon: Pill, change: '+8%', changeType: 'positive' },
    { name: 'Today\'s Appointments', value: '18', icon: Calendar, change: '-2%', changeType: 'negative' },
    { name: 'Pending Incidents', value: '3', icon: AlertTriangle, change: '+1', changeType: 'neutral' },
  ]

  const recentActivities = [
    { id: 1, type: 'medication', message: 'Administered insulin to Sarah Johnson', time: '10 minutes ago', status: 'completed' },
    { id: 2, type: 'incident', message: 'New incident report for playground injury', time: '25 minutes ago', status: 'pending' },
    { id: 3, type: 'appointment', message: 'Completed routine checkup for Mike Chen', time: '1 hour ago', status: 'completed' },
    { id: 4, type: 'medication', message: 'Low stock alert: EpiPen expires in 2 days', time: '2 hours ago', status: 'warning' },
    { id: 5, type: 'appointment', message: 'Upcoming appointment with Emma Davis at 2:30 PM', time: '3 hours ago', status: 'upcoming' },
  ]

  const upcomingAppointments = [
    { id: 1, student: 'Alex Thompson', time: '1:30 PM', type: 'Medication Administration', priority: 'high' },
    { id: 2, student: 'Emma Davis', time: '2:30 PM', type: 'Routine Checkup', priority: 'medium' },
    { id: 3, student: 'James Wilson', time: '3:15 PM', type: 'Follow-up', priority: 'low' },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="h-4 w-4" />
      case 'incident': return <AlertTriangle className="h-4 w-4" />
      case 'appointment': return <Calendar className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'warning': return 'text-red-600'
      case 'upcoming': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2" data-cy="dashboard-title">Good morning! 👋</h1>
        <p className="text-primary-100">Here's your school health overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-cy="quick-stats">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card p-6" data-cy="recent-activities">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 mt-1 ${getActivityColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <div className="flex-shrink-0">
                  {activity.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {activity.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                  {activity.status === 'warning' && <AlertCircle className="h-4 w-4 text-red-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{appointment.student}</p>
                  <p className="text-xs text-gray-500">{appointment.type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                    {appointment.priority}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{appointment.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <Users className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Add Student</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <Calendar className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Schedule Appointment</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <AlertTriangle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Report Incident</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <Pill className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Log Medication</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
