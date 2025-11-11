/**
 * @fileoverview Recent Activity Component - User activity logs and system interactions
 * @module app/(dashboard)/profile/_components/RecentActivity
 * @category Profile - Components
 */

'use client';

import { useState } from 'react';
import { 
  Activity, 
  Calendar, 
  Clock, 
  Monitor, 
  Smartphone, 
  Globe, 
  FileText, 
  User, 
  Settings, 
  Download,
  Filter,
  ChevronDown,
  MapPin
} from 'lucide-react';

interface ActivityItem {
  id: string;
  action: string;
  resource: string;
  timestamp: string;
  device: string;
  ipAddress: string;
  location?: string;
  userAgent?: string;
  outcome: 'success' | 'failure' | 'warning';
}

interface RecentActivityProps {
  activities: ActivityItem[];
  onExportActivity: (timeframe: string) => Promise<void>;
  onRefreshActivity: () => Promise<void>;
  isLoading?: boolean;
}

export function RecentActivity({
  activities,
  onExportActivity,
  onRefreshActivity,
  isLoading = false
}: RecentActivityProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Helper functions
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return formatDateTime(dateString);
  };

  const getDeviceIcon = (device: string) => {
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes('mobile') || deviceLower.includes('phone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (deviceLower.includes('tablet') || deviceLower.includes('ipad')) {
      return <Monitor className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getActivityIcon = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login') || actionLower.includes('signin')) {
      return <User className="h-4 w-4 text-green-600" />;
    }
    if (actionLower.includes('logout') || actionLower.includes('signout')) {
      return <User className="h-4 w-4 text-orange-600" />;
    }
    if (actionLower.includes('download') || actionLower.includes('export')) {
      return <Download className="h-4 w-4 text-blue-600" />;
    }
    if (actionLower.includes('settings') || actionLower.includes('config')) {
      return <Settings className="h-4 w-4 text-purple-600" />;
    }
    if (actionLower.includes('view') || actionLower.includes('access')) {
      return <FileText className="h-4 w-4 text-gray-600" />;
    }
    return <Activity className="h-4 w-4 text-blue-600" />;
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return 'text-green-600';
      case 'failure':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failure':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'success') return activity.outcome === 'success';
    if (selectedFilter === 'failure') return activity.outcome === 'failure';
    if (selectedFilter === 'warning') return activity.outcome === 'warning';
    return true;
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, ActivityItem[]>);

  const handleExport = async () => {
    try {
      await onExportActivity(selectedTimeframe);
    } catch (error) {
      console.error('Failed to export activity:', error);
      // Error handling is managed by parent component
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="ml-2 text-sm text-gray-500">
            ({filteredActivities.length} items)
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-1"
            title="Toggle filters"
          >
            <Filter className="h-3 w-3" />
            Filters
            <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Export Button */}
          <button 
            onClick={handleExport}
            disabled={isLoading}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="timeframe-select" className="block text-sm font-medium text-gray-700 mb-1">
                Timeframe
              </label>
              <select
                id="timeframe-select"
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">Last 24 hours</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="filter-select" className="block text-sm font-medium text-gray-700 mb-1">
                Activity Type
              </label>
              <select
                id="filter-select"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Activities</option>
                <option value="success">Successful Actions</option>
                <option value="failure">Failed Actions</option>
                <option value="warning">Warnings</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Activity Summary */}
      {filteredActivities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-semibold text-green-900">
                  {activities.filter(a => a.outcome === 'success').length}
                </div>
                <div className="text-sm text-green-700">Successful</div>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Activity className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <div className="text-lg font-semibold text-red-900">
                  {activities.filter(a => a.outcome === 'failure').length}
                </div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Activity className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <div className="text-lg font-semibold text-yellow-900">
                  {activities.filter(a => a.outcome === 'warning').length}
                </div>
                <div className="text-sm text-yellow-700">Warnings</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading activity...</span>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Found</h3>
          <p className="text-gray-600">No recent activity matches your current filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, dateActivities]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-700">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>
                
                <div className="space-y-3">
                  {dateActivities
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getOutcomeColor(activity.outcome)} bg-opacity-10`}>
                          {getActivityIcon(activity.action)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">{activity.action}</h4>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeBadge(activity.outcome)}`}>
                                  {activity.outcome.charAt(0).toUpperCase() + activity.outcome.slice(1)}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{activity.resource}</p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{getRelativeTime(activity.timestamp)}</span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  {getDeviceIcon(activity.device)}
                                  <span>{activity.device}</span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  <span>IP: {activity.ipAddress}</span>
                                </div>
                                
                                {activity.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{activity.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right text-xs text-gray-500 ml-4">
                              {formatDateTime(activity.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Load More */}
      {!isLoading && filteredActivities.length > 0 && (
        <div className="mt-6 text-center">
          <button 
            onClick={onRefreshActivity}
            className="px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
}
