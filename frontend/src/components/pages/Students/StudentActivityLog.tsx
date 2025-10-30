/**
 * @fileoverview Student Activity Log Component
 * 
 * Component for displaying student activity history and interactions.
 * 
 * @module components/pages/Students/StudentActivityLog
 * @since 1.0.0
 */

'use client';

import { useState } from 'react';
import { Activity, User, Calendar, Clock, FileText, Pill, Syringe, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

interface ActivityEntry {
  id: string;
  type: 'health_record' | 'medication' | 'immunization' | 'document' | 'communication' | 'behavior' | 'academic' | 'system';
  action: 'created' | 'updated' | 'deleted' | 'viewed' | 'administered' | 'sent' | 'received';
  title: string;
  description: string;
  timestamp: string;
  performedBy: {
    id: string;
    name: string;
    role: string;
  };
  metadata?: {
    [key: string]: string | number | boolean | null;
  };
  priority: 'low' | 'medium' | 'high';
  relatedId?: string;
}

interface StudentActivityLogProps {
  studentId: string;
  studentName: string;
  activities: ActivityEntry[];
  onViewRelated?: (type: string, id: string) => void;
  showFilters?: boolean;
}

/**
 * Student Activity Log Component
 * 
 * Displays chronological activity history for a student with filtering,
 * search capabilities, and related record navigation.
 */
export function StudentActivityLog({
  studentId,
  studentName,
  activities,
  onViewRelated,
  showFilters = true
}: StudentActivityLogProps) {
  const [filterType, setFilterType] = useState<'all' | ActivityEntry['type']>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | ActivityEntry['priority']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const filteredActivities = activities.filter(activity => {
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesPriority = filterPriority === 'all' || activity.priority === filterPriority;
    const matchesSearch = searchQuery === '' || 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.performedBy.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesPriority && matchesSearch;
  });

  const getActivityIcon = (type: string, action: string) => {
    switch (type) {
      case 'health_record':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'medication':
        return <Pill className="h-4 w-4 text-purple-500" />;
      case 'immunization':
        return <Syringe className="h-4 w-4 text-blue-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-gray-500" />;
      case 'communication':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'behavior':
        return action === 'created' ? <AlertTriangle className="h-4 w-4 text-yellow-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'academic':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'system':
        return <Activity className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      health_record: 'bg-red-100 text-red-800',
      medication: 'bg-purple-100 text-purple-800',
      immunization: 'bg-blue-100 text-blue-800',
      document: 'bg-gray-100 text-gray-800',
      communication: 'bg-green-100 text-green-800',
      behavior: 'bg-yellow-100 text-yellow-800',
      academic: 'bg-blue-100 text-blue-800',
      system: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.system;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      health_record: 'Health Record',
      medication: 'Medication',
      immunization: 'Immunization',
      document: 'Document',
      communication: 'Communication',
      behavior: 'Behavior',
      academic: 'Academic',
      system: 'System'
    };
    return labels[type as keyof typeof labels] || 'Unknown';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatFullTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const activityCounts = {
    all: activities.length,
    health_record: activities.filter(a => a.type === 'health_record').length,
    medication: activities.filter(a => a.type === 'medication').length,
    immunization: activities.filter(a => a.type === 'immunization').length,
    document: activities.filter(a => a.type === 'document').length,
    communication: activities.filter(a => a.type === 'communication').length,
    behavior: activities.filter(a => a.type === 'behavior').length,
    academic: activities.filter(a => a.type === 'academic').length,
    system: activities.filter(a => a.type === 'system').length
  };

  const toggleDetails = (activityId: string) => {
    setShowDetails(showDetails === activityId ? null : activityId);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Activity Log</h2>
            <p className="text-sm text-gray-600">{studentName}</p>
          </div>
          <div className="text-sm text-gray-500">
            {filteredActivities.length} of {activities.length} activities
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(activityCounts).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as typeof filterType)}
                  className={`${
                    filterType === type
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : 'bg-white text-gray-500 border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium`}
                >
                  {type === 'all' ? 'All' : getTypeLabel(type)} ({count})
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <div className="flex gap-2">
              {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
                <button
                  key={priority}
                  onClick={() => setFilterPriority(priority)}
                  className={`${
                    filterPriority === priority
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : 'bg-white text-gray-500 border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium capitalize`}
                >
                  {priority} Priority
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type, activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                        {getTypeLabel(activity.type)}
                      </span>
                      {activity.priority !== 'low' && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                      {onViewRelated && activity.relatedId && (
                        <button
                          onClick={() => onViewRelated(activity.type, activity.relatedId!)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                      )}
                      <button
                        onClick={() => toggleDetails(activity.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        {showDetails === activity.id ? 'Less' : 'More'}
                      </button>
                    </div>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">{activity.description}</p>

                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <User className="h-3 w-3 mr-1" />
                    <span>{activity.performedBy.name} ({activity.performedBy.role})</span>
                  </div>

                  {showDetails === activity.id && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Full Timestamp:</span>
                          <span className="ml-2 text-gray-600">{formatFullTimestamp(activity.timestamp)}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Action:</span>
                          <span className="ml-2 text-gray-600 capitalize">{activity.action}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Performed by:</span>
                          <span className="ml-2 text-gray-600">
                            {activity.performedBy.name} (ID: {activity.performedBy.id})
                          </span>
                        </div>
                        {activity.relatedId && (
                          <div>
                            <span className="font-medium text-gray-700">Related Record:</span>
                            <span className="ml-2 text-gray-600">{activity.relatedId}</span>
                          </div>
                        )}
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <div>
                            <span className="font-medium text-gray-700">Additional Details:</span>
                            <div className="mt-1 space-y-1">
                              {Object.entries(activity.metadata).map(([key, value]) => (
                                <div key={key} className="text-xs text-gray-600">
                                  <span className="font-medium">{key}:</span> {String(value)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchQuery || filterType !== 'all' || filterPriority !== 'all' 
                ? 'No activities found' 
                : 'No activity recorded'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || filterType !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Student activities and interactions will appear here.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {activities.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Activity log shows the most recent interactions and changes.
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: {formatTimestamp(activities[0]?.timestamp || new Date().toISOString())}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
