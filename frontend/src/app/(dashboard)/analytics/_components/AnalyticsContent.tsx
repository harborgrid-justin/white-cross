/**
 * @fileoverview Analytics Content Component - Healthcare data analytics and reporting
 * @module app/(dashboard)/analytics/_components/AnalyticsContent
 * @category Analytics - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Heart,
  Pill,
  Shield,
  FileText,
  Calendar,
  Download,
  Eye,
  Plus,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Filter,
  Search
} from 'lucide-react';

interface AnalyticsContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    dateRange?: string;
    metric?: string;
    department?: string;
    reportType?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  description: string;
  category: 'HEALTH' | 'SAFETY' | 'COMPLIANCE' | 'OPERATIONAL';
  lastUpdated: string;
}

interface AnalyticsSummary {
  totalStudents: number;
  activeIncidents: number;
  medicationCompliance: number;
  healthScreenings: number;
  emergencyResponseTime: number;
  inventoryUtilization: number;
  complianceScore: number;
  reportGenerated: number;
}

interface ReportActivity {
  id: string;
  title: string;
  type: 'HEALTH_METRICS' | 'COMPLIANCE' | 'INCIDENT_ANALYSIS' | 'MEDICATION_REPORT' | 'CUSTOM';
  status: 'COMPLETED' | 'PROCESSING' | 'SCHEDULED' | 'FAILED';
  generatedAt: string;
  generatedBy: string;
  size: string;
  downloadCount: number;
}

// Mock data for comprehensive healthcare analytics
const mockSummary: AnalyticsSummary = {
  totalStudents: 2847,
  activeIncidents: 12,
  medicationCompliance: 94.2,
  healthScreenings: 1456,
  emergencyResponseTime: 3.2,
  inventoryUtilization: 78.5,
  complianceScore: 96.8,
  reportGenerated: 45
};

const mockMetrics: HealthMetric[] = [
  {
    id: '1',
    name: 'Student Health Index',
    value: 87.3,
    unit: '%',
    trend: 'up',
    change: 2.1,
    description: 'Overall health status across all enrolled students',
    category: 'HEALTH',
    lastUpdated: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Medication Adherence',
    value: 94.2,
    unit: '%',
    trend: 'up',
    change: 1.8,
    description: 'Students taking prescribed medications as scheduled',
    category: 'HEALTH',
    lastUpdated: '2025-01-15T10:00:00Z'
  },
  {
    id: '3',
    name: 'Incident Response Time',
    value: 3.2,
    unit: 'min',
    trend: 'down',
    change: -0.5,
    description: 'Average time from incident report to response',
    category: 'SAFETY',
    lastUpdated: '2025-01-15T10:00:00Z'
  },
  {
    id: '4',
    name: 'Compliance Score',
    value: 96.8,
    unit: '%',
    trend: 'stable',
    change: 0.2,
    description: 'Overall regulatory compliance rating',
    category: 'COMPLIANCE',
    lastUpdated: '2025-01-15T10:00:00Z'
  },
  {
    id: '5',
    name: 'Inventory Turnover',
    value: 78.5,
    unit: '%',
    trend: 'up',
    change: 3.4,
    description: 'Medical supplies inventory utilization rate',
    category: 'OPERATIONAL',
    lastUpdated: '2025-01-15T10:00:00Z'
  },
  {
    id: '6',
    name: 'Emergency Preparedness',
    value: 92.1,
    unit: '%',
    trend: 'up',
    change: 1.2,
    description: 'Emergency response readiness assessment',
    category: 'SAFETY',
    lastUpdated: '2025-01-15T10:00:00Z'
  }
];

const mockReportActivity: ReportActivity[] = [
  {
    id: '1',
    title: 'Monthly Health Metrics Report',
    type: 'HEALTH_METRICS',
    status: 'COMPLETED',
    generatedAt: '2025-01-15T09:30:00Z',
    generatedBy: 'Sarah Johnson',
    size: '2.3 MB',
    downloadCount: 12
  },
  {
    id: '2',
    title: 'Medication Compliance Analysis',
    type: 'MEDICATION_REPORT',
    status: 'COMPLETED',
    generatedAt: '2025-01-15T08:15:00Z',
    generatedBy: 'Dr. Smith',
    size: '1.8 MB',
    downloadCount: 8
  },
  {
    id: '3',
    title: 'Incident Trend Analysis Q1',
    type: 'INCIDENT_ANALYSIS',
    status: 'PROCESSING',
    generatedAt: '2025-01-15T07:45:00Z',
    generatedBy: 'Admin User',
    size: 'Processing...',
    downloadCount: 0
  },
  {
    id: '4',
    title: 'HIPAA Compliance Audit',
    type: 'COMPLIANCE',
    status: 'COMPLETED',
    generatedAt: '2025-01-14T16:20:00Z',
    generatedBy: 'Compliance Officer',
    size: '3.7 MB',
    downloadCount: 24
  }
];

function getTrendIcon(trend: string) {
  switch (trend) {
    case 'up': return TrendingUp;
    case 'down': return TrendingDown;
    default: return Activity;
  }
}

function getTrendColor(trend: string) {
  switch (trend) {
    case 'up': return 'text-green-600';
    case 'down': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'HEALTH': return Heart;
    case 'SAFETY': return Shield;
    case 'COMPLIANCE': return CheckCircle;
    case 'OPERATIONAL': return Target;
    default: return Activity;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'HEALTH': return 'text-red-600';
    case 'SAFETY': return 'text-blue-600';
    case 'COMPLIANCE': return 'text-green-600';
    case 'OPERATIONAL': return 'text-purple-600';
    default: return 'text-gray-600';
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'PROCESSING': return 'warning';
    case 'SCHEDULED': return 'info';
    case 'FAILED': return 'danger';
    default: return 'secondary';
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'HEALTH_METRICS': return Heart;
    case 'COMPLIANCE': return Shield;
    case 'INCIDENT_ANALYSIS': return AlertTriangle;
    case 'MEDICATION_REPORT': return Pill;
    case 'CUSTOM': return FileText;
    default: return BarChart3;
  }
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function AnalyticsContent({ searchParams }: AnalyticsContentProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [reportActivity, setReportActivity] = useState<ReportActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('30d');

  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setSummary(mockSummary);
      setMetrics(mockMetrics);
      setReportActivity(mockReportActivity);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams, selectedDateRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Unable to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Healthcare Analytics</h1>
          <p className="text-gray-600">Comprehensive health metrics and performance insights</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select date range"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Dashboard
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(summary.totalStudents)}
                </p>
                <p className="text-xs text-gray-500">Enrolled students</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Incidents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.activeIncidents}
                </p>
                <p className="text-xs text-gray-500">Requiring attention</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Health Screenings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(summary.healthScreenings)}
                </p>
                <p className="text-xs text-gray-500">This academic year</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reports Generated</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.reportGenerated}
                </p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button className="justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Report
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Health Metrics
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Compliance Dashboard
            </Button>
            <Button variant="outline" className="justify-start">
              <Zap className="h-4 w-4 mr-2" />
              Real-time Monitoring
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Health Metrics */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Key Health Metrics</h3>
              <p className="text-sm text-gray-500">
                Real-time healthcare performance indicators
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => {
              const TrendIcon = getTrendIcon(metric.trend);
              const CategoryIcon = getCategoryIcon(metric.category);
              
              return (
                <div key={metric.id} className="p-4 border rounded-lg hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className={`h-5 w-5 ${getCategoryColor(metric.category)}`} />
                      <Badge variant="secondary" className="text-xs">
                        {metric.category}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                      <TrendIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {metric.trend === 'up' || metric.trend === 'down' 
                          ? `${Math.abs(metric.change)}${metric.unit}`
                          : 'Stable'
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{metric.name}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </span>
                      <span className="text-sm text-gray-500">{metric.unit}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {metric.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Updated: {formatDate(metric.lastUpdated)}</span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Recent Reports & Analytics Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Recent Report Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {reportActivity.map((report) => {
                const TypeIcon = getTypeIcon(report.type);
                
                return (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TypeIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{report.title}</p>
                        <p className="text-xs text-gray-600">
                          {formatDate(report.generatedAt)} • {report.generatedBy}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusBadgeVariant(report.status)} className="text-xs mb-1">
                        {report.status}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        {report.size} • {report.downloadCount} downloads
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" className="w-full text-sm">
                View All Reports
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Performance Overview
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Pill className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Medication Compliance</p>
                    <p className="text-xs text-green-700">Above target threshold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-900">{summary.medicationCompliance}%</p>
                  <Badge variant="success" className="text-xs">Excellent</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Response Time</p>
                    <p className="text-xs text-blue-700">Emergency incidents</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-900">{summary.emergencyResponseTime}min</p>
                  <Badge variant="info" className="text-xs">Good</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Inventory Utilization</p>
                    <p className="text-xs text-purple-700">Medical supplies efficiency</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-900">{summary.inventoryUtilization}%</p>
                  <Badge variant="secondary" className="text-xs">Optimal</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Compliance Score</p>
                    <p className="text-xs text-yellow-700">Regulatory adherence</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-900">{summary.complianceScore}%</p>
                  <Badge variant="warning" className="text-xs">Monitor</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}