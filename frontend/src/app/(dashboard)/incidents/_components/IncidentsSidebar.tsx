'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  FileText, 
  Clock, 
  Plus,
  Shield,
  Activity,
  Users,
  Bell,
  TrendingUp,
  RefreshCw,
  Eye,
  Calendar,
  Search
} from 'lucide-react';

interface IncidentsSidebarProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    severity?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

interface IncidentStats {
  total: number;
  pendingReview: number;
  underInvestigation: number;
  requiresAction: number;
  resolved: number;
  criticalIncidents: number;
  injuryIncidents: number;
  behavioralIncidents: number;
  safetyIncidents: number;
  emergencyIncidents: number;
  followUpsRequired: number;
  parentsNotified: number;
}

export function IncidentsSidebar({ searchParams }: IncidentsSidebarProps) {
  const [stats, setStats] = useState<IncidentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const mockStats: IncidentStats = {
          total: 247,
          pendingReview: 15,
          underInvestigation: 8,
          requiresAction: 12,
          resolved: 198,
          criticalIncidents: 3,
          injuryIncidents: 45,
          behavioralIncidents: 32,
          safetyIncidents: 18,
          emergencyIncidents: 5,
          followUpsRequired: 23,
          parentsNotified: 156,
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching incident stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [searchParams]);

  const recentIncidents = [
    {
      id: '1',
      title: 'Playground Fall',
      studentName: 'Emma Johnson',
      severity: 'MEDIUM',
      status: 'PENDING_REVIEW',
      timestamp: '15 minutes ago',
      type: 'INJURY',
    },
    {
      id: '2',
      title: 'Classroom Disruption',
      studentName: 'Michael Chen',
      severity: 'HIGH',
      status: 'UNDER_INVESTIGATION',
      timestamp: '1 hour ago',
      type: 'BEHAVIORAL',
    },
    {
      id: '3',
      title: 'Wet Floor Hazard',
      studentName: 'Multiple Students',
      severity: 'HIGH',
      status: 'REQUIRES_ACTION',
      timestamp: '2 hours ago',
      type: 'SAFETY',
    },
  ];

  const priorityActions = [
    {
      id: '1',
      action: 'Review emergency response protocol',
      dueDate: 'Today',
      priority: 'HIGH',
      incident: 'Allergic Reaction - Alex Thompson',
    },
    {
      id: '2',
      action: 'Follow up with parent conference',
      dueDate: 'Tomorrow',
      priority: 'MEDIUM',
      incident: 'Behavioral Issue - Michael Chen',
    },
    {
      id: '3',
      action: 'Update safety measures documentation',
      dueDate: 'This Week',
      priority: 'MEDIUM',
      incident: 'Wet Floor Hazard',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'text-green-600 bg-green-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'HIGH': return 'text-orange-600 bg-orange-50';
      case 'CRITICAL': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INJURY': return <AlertTriangle className="h-4 w-4" />;
      case 'ILLNESS': return <Activity className="h-4 w-4" />;
      case 'BEHAVIORAL': return <Users className="h-4 w-4" />;
      case 'SAFETY': return <Shield className="h-4 w-4" />;
      case 'EMERGENCY': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Incident Statistics */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Incident Overview
            </h3>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          {stats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-600">Total Incidents</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pendingReview}
                </div>
                <div className="text-xs text-gray-600">Pending Review</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.underInvestigation}
                </div>
                <div className="text-xs text-gray-600">Investigating</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">
                  {stats.requiresAction}
                </div>
                <div className="text-xs text-gray-600">Requires Action</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-green-600">
                  {stats.resolved}
                </div>
                <div className="text-xs text-gray-600">Resolved</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-red-600">
                  {stats.criticalIncidents}
                </div>
                <div className="text-xs text-gray-600">Critical</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-purple-600">
                  {stats.injuryIncidents}
                </div>
                <div className="text-xs text-gray-600">Injuries</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-indigo-600">
                  {stats.behavioralIncidents}
                </div>
                <div className="text-xs text-gray-600">Behavioral</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-cyan-600">
                  {stats.safetyIncidents}
                </div>
                <div className="text-xs text-gray-600">Safety</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-pink-600">
                  {stats.emergencyIncidents}
                </div>
                <div className="text-xs text-gray-600">Emergency</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-teal-600">
                  {stats.followUpsRequired}
                </div>
                <div className="text-xs text-gray-600">Follow-ups</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-emerald-600">
                  {stats.parentsNotified}
                </div>
                <div className="text-xs text-gray-600">Parents Notified</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Incidents */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Incidents
            </h3>
            <Badge variant="info">
              {recentIncidents.length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(incident.type)}
                    <span className="font-medium text-gray-900 text-sm">
                      {incident.title}
                    </span>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={getSeverityColor(incident.severity)}
                  >
                    {incident.severity}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  {incident.studentName}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {incident.timestamp}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" size="sm" className="w-full text-sm">
            View All Recent
          </Button>
        </div>
      </Card>

      {/* Priority Actions */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Priority Actions
            </h3>
            <Badge variant="warning">
              {priorityActions.filter(action => action.priority === 'HIGH').length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {priorityActions.map((action) => (
              <div key={action.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant="secondary"
                    className={getPriorityColor(action.priority)}
                  >
                    {action.priority} Priority
                  </Badge>
                  <span className="text-xs text-gray-500">{action.dueDate}</span>
                </div>
                <div className="text-sm text-gray-900 mb-1 font-medium">
                  {action.action}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Related to: {action.incident}
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule Action
                </Button>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" size="sm" className="w-full text-sm">
            View All Actions
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Report New Incident
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Report
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Search className="h-4 w-4 mr-2" />
              Advanced Search
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
          </div>
        </div>
      </Card>

      {/* System Status */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Status
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Incident Database</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Notification System</span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Emergency Protocols</span>
              <Badge variant="success">Ready</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Backup Systems</span>
              <Badge variant="warning">Maintenance</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}



