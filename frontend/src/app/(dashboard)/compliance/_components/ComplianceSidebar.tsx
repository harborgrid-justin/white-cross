/**
 * @fileoverview Compliance Sidebar Component - Sidebar navigation for compliance management
 * @module app/(dashboard)/compliance/_components/ComplianceSidebar
 * @category Compliance - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  TrendingUp,
  Plus,
  Download,
  Eye,
  XCircle,
  BookOpen,
  Activity
} from 'lucide-react';

interface ComplianceSidebarProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    priority?: string;
    dateRange?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

interface SidebarStats {
  totalRequirements: number;
  compliantCount: number;
  nonCompliantCount: number;
  needsAttentionCount: number;
  underReviewCount: number;
  riskScore: number;
  upcomingAudits: {
    id: string;
    title: string;
    category: string;
    dueDate: string;
    assignee: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  criticalIssues: {
    id: string;
    title: string;
    category: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    daysOverdue: number;
  }[];
  categoryBreakdown: {
    category: string;
    compliant: number;
    total: number;
    percentage: number;
  }[];
  recentActivity: {
    id: string;
    type: 'audit' | 'review' | 'update' | 'issue';
    message: string;
    timestamp: string;
    category: string;
  }[];
}

// Mock data for demonstration
const mockStats: SidebarStats = {
  totalRequirements: 45,
  compliantCount: 32,
  nonCompliantCount: 3,
  needsAttentionCount: 7,
  underReviewCount: 3,
  riskScore: 78,
  upcomingAudits: [
    {
      id: '1',
      title: 'HIPAA Security Rule Review',
      category: 'HIPAA',
      dueDate: '2024-02-15',
      assignee: 'Sarah Johnson',
      priority: 'HIGH'
    },
    {
      id: '2',
      title: 'FERPA Compliance Assessment',
      category: 'FERPA',
      dueDate: '2024-02-22',
      assignee: 'Michael Chen',
      priority: 'MEDIUM'
    },
    {
      id: '3',
      title: 'Medication Storage Audit',
      category: 'FDA',
      dueDate: '2024-03-01',
      assignee: 'Dr. Emily Rodriguez',
      priority: 'HIGH'
    }
  ],
  criticalIssues: [
    {
      id: '1',
      title: 'Data Breach Response Plan',
      category: 'HIPAA',
      severity: 'HIGH',
      daysOverdue: 14
    },
    {
      id: '2',
      title: 'Emergency Procedures Update',
      category: 'OSHA',
      severity: 'MEDIUM',
      daysOverdue: 7
    }
  ],
  categoryBreakdown: [
    { category: 'HIPAA', compliant: 12, total: 15, percentage: 80 },
    { category: 'FERPA', compliant: 8, total: 12, percentage: 67 },
    { category: 'OSHA', compliant: 6, total: 8, percentage: 75 },
    { category: 'FDA', compliant: 6, total: 10, percentage: 60 }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'audit',
      message: 'HIPAA Privacy Rule audit completed',
      timestamp: '2 hours ago',
      category: 'HIPAA'
    },
    {
      id: '2',
      type: 'review',
      message: 'Emergency Response Protocols under review',
      timestamp: '5 hours ago',
      category: 'OSHA'
    },
    {
      id: '3',
      type: 'issue',
      message: 'FERPA compliance issue identified',
      timestamp: '1 day ago',
      category: 'FERPA'
    },
    {
      id: '4',
      type: 'update',
      message: 'Medication storage policies updated',
      timestamp: '2 days ago',
      category: 'FDA'
    }
  ]
};

function getPriorityBadgeVariant(priority: string) {
  switch (priority) {
    case 'HIGH': return 'danger';
    case 'MEDIUM': return 'warning';
    case 'LOW': return 'info';
    default: return 'secondary';
  }
}



function getActivityIcon(type: string) {
  switch (type) {
    case 'audit': return CheckCircle;
    case 'review': return Clock;
    case 'update': return FileText;
    case 'issue': return AlertTriangle;
    default: return Activity;
  }
}

function getRiskScoreColor(score: number) {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export function ComplianceSidebar({ searchParams }: ComplianceSidebarProps) {
  const [stats, setStats] = useState<SidebarStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-500">Unable to load compliance statistics</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compliance Overview */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Compliance Overview</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Requirements</span>
              <span className="text-sm font-semibold text-gray-900">{stats.totalRequirements}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Compliant</span>
              <Badge variant="success" className="text-xs">
                {stats.compliantCount}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Non-Compliant</span>
              <Badge variant="danger" className="text-xs">
                {stats.nonCompliantCount}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Needs Attention</span>
              <Badge variant="warning" className="text-xs">
                {stats.needsAttentionCount}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Risk Score</span>
              <span className={`text-sm font-semibold ${getRiskScoreColor(stats.riskScore)}`}>
                {stats.riskScore}/100
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-medium text-gray-900">By Category</h3>
          </div>
          <div className="space-y-3">
            {stats.categoryBreakdown.map((category) => (
              <div key={category.category}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">{category.category}</span>
                  <span className="text-xs font-medium">{category.compliant}/{category.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        category.percentage >= 80 ? 'bg-green-600' :
                        category.percentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      data-width={`${category.percentage}%`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Critical Issues */}
      {stats.criticalIssues.length > 0 && (
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="h-4 w-4 text-red-600" />
              <h3 className="text-sm font-medium text-gray-900">Critical Issues</h3>
            </div>
            <div className="space-y-3">
              {stats.criticalIssues.map((issue) => (
                <div key={issue.id} className="p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-red-900 truncate">
                        {issue.title}
                      </p>
                      <p className="text-xs text-red-700 truncate">
                        {issue.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-red-600">
                          {issue.daysOverdue} days overdue
                        </span>
                        <Badge variant="danger" className="text-xs">
                          {issue.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Upcoming Audits */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Upcoming Audits</h3>
          </div>
          <div className="space-y-3">
            {stats.upcomingAudits.slice(0, 3).map((audit) => (
              <div key={audit.id} className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-900 truncate">
                      {audit.title}
                    </p>
                    <p className="text-xs text-blue-700 truncate">
                      {audit.category} • {audit.assignee}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-600">
                        Due: {new Date(audit.dueDate).toLocaleDateString()}
                      </span>
                      <Badge variant={getPriorityBadgeVariant(audit.priority)} className="text-xs">
                        {audit.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Audit
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Eye className="h-4 w-4 mr-2" />
              View Policies
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 4).map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <IconComponent className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-600">{activity.category}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* System Status */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-medium text-gray-900">System Status</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Audit Tracking</span>
              <Badge variant="success" className="text-xs">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Last Sync</span>
              <span className="text-xs text-gray-500">3 min ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Auto Alerts</span>
              <Badge variant="success" className="text-xs">Enabled</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


