/**
 * DashboardContent Component - White Cross Healthcare Platform
 * 
 * Main dashboard overview featuring:
 * - Healthcare statistics and KPIs
 * - Student health status overview
 * - Recent activities and alerts
 * - Quick access to key functions
 * - Emergency notifications and status
 * 
 * @component DashboardContent
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users,
  Activity,
  AlertTriangle,
  Calendar,
  Pill,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Bell,
  Shield,
  Heart,
  UserCheck,
  MessageSquare,
  Download,
  Plus,
  Eye,
  Filter,
  RefreshCw,
  Search,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  getDashboardData, 
  getDashboardStats, 
  getHealthAlerts, 
  getRecentActivities, 
  getSystemStatus,
  acknowledgeHealthAlert,
  refreshDashboardData,
  type DashboardStats as DashboardStatsType,
  type HealthAlert as HealthAlertType,
  type RecentActivity as RecentActivityType,
  type SystemStatus,
  type DashboardFilters
} from '@/lib/actions/dashboard.actions';

// Types now imported from actions

export default function DashboardContent() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month' | 'quarter'>('today');
  const [alertFilter, setAlertFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for dashboard data
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [healthAlerts, setHealthAlerts] = useState<HealthAlertType[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivityType[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const filters: DashboardFilters = {
          timeframe: selectedTimeframe,
          alertSeverity: alertFilter === 'all' ? undefined : alertFilter
        };

        const data = await getDashboardData(filters);
        
        setStats(data.stats);
        setHealthAlerts(data.alerts);
        setRecentActivities(data.activities);
        setSystemStatus(data.systemStatus);

      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard data');
        
        // Set empty defaults on error
        setStats({
          totalStudents: 0,
          activeStudents: 0,
          healthAlerts: 0,
          pendingMedications: 0,
          appointmentsToday: 0,
          completedScreenings: 0,
          immunizationCompliance: 0,
          emergencyContacts: 0
        });
        setHealthAlerts([]);
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [selectedTimeframe, alertFilter]);

  // Handle alert acknowledgment
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const success = await acknowledgeHealthAlert(alertId, 'current-user-id'); // In real app, get from auth
      
      if (success) {
        // Update local state to reflect acknowledgment
        setHealthAlerts(prev => 
          prev.map(alert => 
            alert.id === alertId 
              ? { ...alert, status: 'acknowledged' as const }
              : alert
          )
        );
      }
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    try {
      await refreshDashboardData();
      
      // Reload data after refresh
      const filters: DashboardFilters = {
        timeframe: selectedTimeframe,
        alertSeverity: alertFilter === 'all' ? undefined : alertFilter
      };

      const data = await getDashboardData(filters);
      setStats(data.stats);
      setHealthAlerts(data.alerts);
      setRecentActivities(data.activities);
      setSystemStatus(data.systemStatus);
      
    } catch (err) {
      console.error('Failed to refresh dashboard:', err);
    }
  };

  const getAlertIcon = (type: HealthAlertType['type']) => {
    switch (type) {
      case 'medication': return Pill;
      case 'allergy': return AlertTriangle;
      case 'condition': return Heart;
      case 'emergency': return Shield;
      case 'immunization': return Shield;
      default: return Bell;
    }
  };

  const getAlertColor = (severity: HealthAlertType['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getActivityIcon = (type: RecentActivityType['type']) => {
    switch (type) {
      case 'student_enrollment': return Users;
      case 'health_record_update': return FileText;
      case 'medication_administered': return Pill;
      case 'appointment_scheduled': return Calendar;
      case 'emergency_contact': return Shield;
      case 'document_upload': return Download;
      case 'system_alert': return Bell;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Healthcare Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of student health management and activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as 'today' | 'week' | 'month' | 'quarter')}>
            <SelectTrigger className="w-32" aria-label="Select time period for dashboard data">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            aria-label="Refresh dashboard data"
          >
            <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </header>

      {/* Key Statistics */}
      <section aria-labelledby="key-stats-heading">
        <h2 id="key-stats-heading" className="sr-only">Key Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-semibold text-gray-900" aria-label={`${stats?.totalStudents ?? 0} total students`}>{stats?.totalStudents ?? 0}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" aria-hidden="true" />
                    <span className="text-xs text-green-600">+2.3% vs last month</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Health Alerts</p>
                  <p className="text-2xl font-semibold text-gray-900" aria-label={`${stats?.healthAlerts ?? 0} health alerts, 4 critical`}>{stats?.healthAlerts ?? 0}</p>
                  <div className="flex items-center mt-1">
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-1" aria-hidden="true" />
                    <span className="text-xs text-red-600">4 critical</span>
                  </div>
                </div>
                <Bell className="h-8 w-8 text-red-600" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Appointments Today</p>
                  <p className="text-2xl font-semibold text-gray-900" aria-label={`${stats?.appointmentsToday ?? 0} appointments today, 8 completed`}>{stats?.appointmentsToday ?? 0}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 text-blue-600 mr-1" aria-hidden="true" />
                    <span className="text-xs text-blue-600">8 completed</span>
                  </div>
                </div>
                <Calendar className="h-8 w-8 text-green-600" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Immunization Rate</p>
                  <p className="text-2xl font-semibold text-gray-900" aria-label={`${stats?.immunizationCompliance ?? 0} percent immunization compliance rate, above target`}>{stats?.immunizationCompliance ?? 0}%</p>
                  <div className="flex items-center mt-1">
                    <Shield className="h-4 w-4 text-green-600 mr-1" aria-hidden="true" />
                    <span className="text-xs text-green-600">Above target</span>
                  </div>
                </div>
                <UserCheck className="h-8 w-8 text-purple-600" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section aria-labelledby="dashboard-tabs-heading">
        <h2 id="dashboard-tabs-heading" className="sr-only">Dashboard Information Tabs</h2>
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4" role="tablist" aria-label="Dashboard information sections">
            <TabsTrigger value="alerts" role="tab" aria-controls="alerts-panel">Health Alerts</TabsTrigger>
            <TabsTrigger value="activities" role="tab" aria-controls="activities-panel">Recent Activities</TabsTrigger>
            <TabsTrigger value="analytics" role="tab" aria-controls="analytics-panel">Analytics</TabsTrigger>
            <TabsTrigger value="quickactions" role="tab" aria-controls="quickactions-panel">Quick Actions</TabsTrigger>
          </TabsList>

        {/* Health Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4" role="tabpanel" id="alerts-panel" aria-labelledby="alerts-tab">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Health Alerts & Notifications</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={alertFilter} onValueChange={(value) => setAlertFilter(value as 'all' | 'critical' | 'high' | 'medium' | 'low')}>
                    <SelectTrigger className="w-32" aria-label="Filter health alerts by severity">
                      <SelectValue placeholder="Select alert filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" aria-label="Show filter options">
                    <Filter className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3" role="list" aria-label="Health alerts">
                {healthAlerts.map((alert) => {
                  const AlertIcon = getAlertIcon(alert.type);
                  return (
                    <div
                      key={alert.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertColor(alert.severity)}`}
                      role="listitem"
                      aria-label={`${alert.severity} severity ${alert.type} alert for ${alert.studentName}`}
                    >
                      <AlertIcon className="h-5 w-5 mt-0.5" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">{alert.studentName}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={alert.status === 'new' ? 'error' : 'secondary'}>
                              {alert.status}
                            </Badge>
                            <span className="text-xs text-gray-500" aria-label={`Alert time: ${new Date(alert.timestamp).toLocaleTimeString()}`}>
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mt-1">{alert.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="info" className="text-xs">
                            {alert.type} • {alert.severity}
                          </Badge>
                          <div className="flex space-x-1" role="group" aria-label="Alert actions">
                            <Button variant="ghost" size="sm" aria-label={`View details for ${alert.studentName} alert`}>
                              <Eye className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button variant="ghost" size="sm" aria-label={`Mark ${alert.studentName} alert as acknowledged`}>
                              <CheckCircle className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button variant="ghost" size="sm" aria-label={`More options for ${alert.studentName} alert`}>
                              <MoreVertical className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" aria-label={`View all ${healthAlerts.length + 8} health alerts`}>
                  View All Alerts ({healthAlerts.length + 8} total)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activities Tab */}
        <TabsContent value="activities" className="space-y-4" role="tabpanel" id="activities-panel" aria-labelledby="activities-tab">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Healthcare Activities</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                    <Input
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                      aria-label="Search recent activities"
                    />
                  </div>
                  <Button variant="outline" size="sm" aria-label="Export activities to file">
                    <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3" role="list" aria-label="Recent healthcare activities">
                {recentActivities.map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      role="listitem"
                      aria-label={`${activity.status} activity: ${activity.description} for ${activity.studentAffected || 'System'}`}
                    >
                      <div className={`p-2 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-100' :
                        activity.status === 'pending' ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`} aria-hidden="true">
                        <ActivityIcon className={`h-4 w-4 ${
                          activity.status === 'completed' ? 'text-green-600' :
                          activity.status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{activity.studentAffected || 'System'}</h3>
                          <span className="text-xs text-gray-500" aria-label={`Activity time: ${new Date(activity.timestamp).toLocaleTimeString()}`}>
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">By {activity.performedBy}</span>
                          <Badge variant={
                            activity.status === 'completed' ? 'success' :
                            activity.status === 'pending' ? 'warning' :
                            'error'
                          }>
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" aria-label="View all recent activities">
                  View All Activities
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4" role="tabpanel" id="analytics-panel" aria-labelledby="analytics-tab">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Health Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Medication Compliance</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">92.3%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Screening Completion</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">88.7%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Emergency Response Time</span>
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">4.2 min</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Parent Engagement</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">76.8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Appointments</span>
                    <span className="text-sm font-medium">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Medications Administered</span>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Health Screenings</span>
                    <span className="text-sm font-medium">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Emergency Incidents</span>
                    <span className="text-sm font-medium">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Documents Processed</span>
                    <span className="text-sm font-medium">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quick Actions Tab */}
        <TabsContent value="quickactions" className="space-y-4" role="tabpanel" id="quickactions-panel" aria-labelledby="quickactions-tab">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="list" aria-label="Quick action shortcuts">
            <Card
              className="cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500"
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); /* Navigate to new appointment */ }}}
              aria-label="Schedule a new health appointment"
            >
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 text-blue-600 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-medium text-gray-900 mb-1">New Appointment</h3>
                <p className="text-sm text-gray-600">Schedule a health appointment</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500"
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); /* Navigate to medication log */ }}}
              aria-label="Record medication administration"
            >
              <CardContent className="p-6 text-center">
                <Pill className="h-8 w-8 text-green-600 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-medium text-gray-900 mb-1">Medication Log</h3>
                <p className="text-sm text-gray-600">Record medication administration</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500"
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); /* Navigate to emergency alert */ }}}
              aria-label="Send emergency notification"
            >
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-medium text-gray-900 mb-1">Emergency Alert</h3>
                <p className="text-sm text-gray-600">Send emergency notification</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500"
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); /* Navigate to health report */ }}}
              aria-label="Generate health summary report"
            >
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-medium text-gray-900 mb-1">Health Report</h3>
                <p className="text-sm text-gray-600">Generate health summary</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500"
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); /* Navigate to health screening */ }}}
              aria-label="Conduct health assessment"
            >
              <CardContent className="p-6 text-center">
                <UserCheck className="h-8 w-8 text-indigo-600 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-medium text-gray-900 mb-1">Health Screening</h3>
                <p className="text-sm text-gray-600">Conduct health assessment</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500"
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); /* Navigate to send message */ }}}
              aria-label="Contact parents or staff"
            >
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-orange-600 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-medium text-gray-900 mb-1">Send Message</h3>
                <p className="text-sm text-gray-600">Contact parents or staff</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </section>
    </div>
  );
}
