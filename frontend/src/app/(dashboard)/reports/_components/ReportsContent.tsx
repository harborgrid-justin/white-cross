/**
 * @fileoverview Reports Content Component - Healthcare reporting system
 * @module app/(dashboard)/reports/_components/ReportsContent
 * @category Reports - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  Download,
  Plus,
  Eye,
  Calendar,
  Filter,
  Search,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Shield,
  Heart,
  Pill,
  Users,
  Target,

  RefreshCw,
  Share2,
  Edit,
  Trash2,
  Play,
  Pause,
  Mail,

  ChevronDown,
  ExternalLink
} from 'lucide-react';

interface ReportsContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    dateRange?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

interface Report {
  id: string;
  title: string;
  description: string;
  category: 'HEALTH' | 'COMPLIANCE' | 'OPERATIONAL' | 'FINANCIAL' | 'CUSTOM';
  type: 'SCHEDULED' | 'ON_DEMAND' | 'AUTOMATED';
  status: 'COMPLETED' | 'PROCESSING' | 'SCHEDULED' | 'FAILED' | 'DRAFT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  updatedAt: string;
  generatedBy: string;
  department: string;
  size?: string;
  downloadCount: number;
  schedule?: string;
  nextRun?: string;
  recipients?: string[];
  tags: string[];
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: typeof FileText;
  parameters: number;
  lastUsed?: string;
  useCount: number;
}

interface ReportsSummary {
  totalReports: number;
  completedToday: number;
  scheduledReports: number;
  failedReports: number;
  totalDownloads: number;
  avgProcessingTime: number;
}

// Mock data for comprehensive healthcare reports
const mockSummary: ReportsSummary = {
  totalReports: 156,
  completedToday: 12,
  scheduledReports: 8,
  failedReports: 2,
  totalDownloads: 1247,
  avgProcessingTime: 4.2
};

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Monthly Health Metrics Report',
    description: 'Comprehensive health indicators and student wellness metrics for January 2025',
    category: 'HEALTH',
    type: 'SCHEDULED',
    status: 'COMPLETED',
    priority: 'HIGH',
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-15T09:30:00Z',
    generatedBy: 'Sarah Johnson',
    department: 'Health Services',
    size: '2.3 MB',
    downloadCount: 24,
    schedule: 'Monthly - 1st',
    nextRun: '2025-02-01T09:00:00Z',
    recipients: ['admin@school.edu', 'health@school.edu'],
    tags: ['monthly', 'health-metrics', 'wellness']
  },
  {
    id: '2',
    title: 'HIPAA Compliance Audit',
    description: 'Quarterly compliance assessment and regulatory adherence report',
    category: 'COMPLIANCE',
    type: 'SCHEDULED',
    status: 'PROCESSING',
    priority: 'URGENT',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T10:15:00Z',
    generatedBy: 'Compliance Officer',
    department: 'Administration',
    downloadCount: 0,
    schedule: 'Quarterly',
    recipients: ['compliance@school.edu', 'legal@school.edu'],
    tags: ['quarterly', 'hipaa', 'compliance', 'audit']
  },
  {
    id: '3',
    title: 'Medication Adherence Analysis',
    description: 'Student medication compliance rates and safety incident tracking',
    category: 'HEALTH',
    type: 'ON_DEMAND',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    createdAt: '2025-01-14T14:30:00Z',
    updatedAt: '2025-01-14T15:45:00Z',
    generatedBy: 'Dr. Smith',
    department: 'Health Services',
    size: '1.8 MB',
    downloadCount: 15,
    recipients: ['pharmacy@school.edu'],
    tags: ['medication', 'adherence', 'safety']
  },
  {
    id: '4',
    title: 'Emergency Response Performance',
    description: 'Incident response times, protocols effectiveness, and safety metrics',
    category: 'OPERATIONAL',
    type: 'AUTOMATED',
    status: 'SCHEDULED',
    priority: 'HIGH',
    createdAt: '2025-01-13T16:00:00Z',
    updatedAt: '2025-01-13T16:00:00Z',
    generatedBy: 'System Generated',
    department: 'Safety & Security',
    downloadCount: 8,
    schedule: 'Weekly - Friday',
    nextRun: '2025-01-17T16:00:00Z',
    tags: ['emergency', 'response', 'safety', 'weekly']
  },
  {
    id: '5',
    title: 'Budget Utilization Report',
    description: 'Healthcare budget allocation, spending analysis, and variance reporting',
    category: 'FINANCIAL',
    type: 'SCHEDULED',
    status: 'FAILED',
    priority: 'MEDIUM',
    createdAt: '2025-01-12T10:00:00Z',
    updatedAt: '2025-01-12T10:05:00Z',
    generatedBy: 'Finance Team',
    department: 'Finance',
    downloadCount: 0,
    schedule: 'Bi-weekly',
    recipients: ['finance@school.edu', 'budget@school.edu'],
    tags: ['budget', 'financial', 'utilization']
  },
  {
    id: '6',
    title: 'Custom Immunization Tracking',
    description: 'Student vaccination records, compliance rates, and upcoming requirements',
    category: 'CUSTOM',
    type: 'ON_DEMAND',
    status: 'DRAFT',
    priority: 'LOW',
    createdAt: '2025-01-10T11:20:00Z',
    updatedAt: '2025-01-15T09:45:00Z',
    generatedBy: 'Nurse Williams',
    department: 'Health Services',
    downloadCount: 0,
    tags: ['immunization', 'vaccines', 'compliance', 'custom']
  }
];

const mockTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Health Metrics Dashboard',
    description: 'Comprehensive student health indicators and wellness trends',
    category: 'Health Reports',
    icon: Heart,
    parameters: 8,
    lastUsed: '2025-01-15T09:00:00Z',
    useCount: 45
  },
  {
    id: '2',
    name: 'Compliance Audit Report',
    description: 'Regulatory compliance assessment and adherence tracking',
    category: 'Compliance Reports',
    icon: Shield,
    parameters: 12,
    lastUsed: '2025-01-14T16:30:00Z',
    useCount: 23
  },
  {
    id: '3',
    name: 'Incident Analysis Report',
    description: 'Safety incident patterns, response times, and prevention metrics',
    category: 'Safety Reports',
    icon: AlertTriangle,
    parameters: 10,
    lastUsed: '2025-01-13T14:15:00Z',
    useCount: 67
  },
  {
    id: '4',
    name: 'Medication Management',
    description: 'Prescription tracking, adherence rates, and safety monitoring',
    category: 'Medication Reports',
    icon: Pill,
    parameters: 15,
    lastUsed: '2025-01-12T11:00:00Z',
    useCount: 34
  },
  {
    id: '5',
    name: 'Student Population Health',
    description: 'Demographics, health trends, and population-level insights',
    category: 'Population Reports',
    icon: Users,
    parameters: 6,
    lastUsed: '2025-01-11T10:30:00Z',
    useCount: 29
  },
  {
    id: '6',
    name: 'Performance Analytics',
    description: 'Operational efficiency, resource utilization, and KPI tracking',
    category: 'Analytics Reports',
    icon: BarChart3,
    parameters: 20,
    lastUsed: '2025-01-10T15:45:00Z',
    useCount: 56
  }
];

// Note: getCategoryColor removed as it's not used in current implementation

function getCategoryBadgeVariant(category: string): "default" | "secondary" | "success" | "danger" | "warning" | "info" {
  switch (category) {
    case 'HEALTH': return 'danger';
    case 'COMPLIANCE': return 'success';
    case 'OPERATIONAL': return 'info';
    case 'FINANCIAL': return 'secondary';
    case 'CUSTOM': return 'warning';
    default: return 'default';
  }
}

// Note: getStatusColor removed as it's not used in current implementation

function getStatusBadgeVariant(status: string): "default" | "secondary" | "success" | "danger" | "warning" | "info" {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'PROCESSING': return 'info';
    case 'SCHEDULED': return 'warning';
    case 'FAILED': return 'danger';
    case 'DRAFT': return 'secondary';
    default: return 'default';
  }
}

// Note: getPriorityColor removed as it's not used in current implementation

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function ReportsContent({ searchParams }: ReportsContentProps) {
  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());
  const [viewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setSummary(mockSummary);
      setReports(mockReports);
      setTemplates(mockTemplates);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const toggleReportSelection = (reportId: string) => {
    const newSelected = new Set(selectedReports);
    if (newSelected.has(reportId)) {
      newSelected.delete(reportId);
    } else {
      newSelected.add(reportId);
    }
    setSelectedReports(newSelected);
  };

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
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Unable to load reports data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Healthcare Reports</h1>
          <p className="text-gray-600">Generate, schedule, and manage comprehensive healthcare reports</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(summary.totalReports)}
                </p>
                <p className="text-xs text-gray-500">All time generated</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.completedToday}
                </p>
                <p className="text-xs text-gray-500">Successfully processed</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.scheduledReports}
                </p>
                <p className="text-xs text-gray-500">Upcoming reports</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(summary.totalDownloads)}
                </p>
                <p className="text-xs text-gray-500">Total downloads</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Templates */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid gap-3 md:grid-cols-2">
              <Button className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Bulk Export
              </Button>
              <Button variant="outline" className="justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Report Settings
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Popular Templates</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {templates.slice(0, 3).map((template) => {
                const Icon = template.icon;
                return (
                  <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{template.name}</p>
                        <p className="text-xs text-gray-600">{template.useCount} uses</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" className="w-full text-sm">
                View All Templates
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
              <p className="text-sm text-gray-500">
                {reports.length} reports • {selectedReports.size} selected
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                View: {viewMode === 'list' ? 'List' : 'Grid'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 border rounded-lg hover:shadow-sm transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedReports.has(report.id)}
                      onChange={() => toggleReportSelection(report.id)}
                      className="mt-1"
                      aria-label={`Select report: ${report.title}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {report.title}
                        </h4>
                        <Badge variant={getCategoryBadgeVariant(report.category)} className="text-xs">
                          {report.category}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(report.status)} className="text-xs">
                          {report.status}
                        </Badge>
                        <Badge 
                          variant={report.priority === 'URGENT' || report.priority === 'HIGH' ? 'danger' : 'secondary'} 
                          className="text-xs"
                        >
                          {report.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {report.generatedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {report.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(report.createdAt)}
                        </span>
                        {report.size && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {report.size}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {report.downloadCount} downloads
                        </span>
                        {report.schedule && (
                          <span className="flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" />
                            {report.schedule}
                          </span>
                        )}
                      </div>
                      
                      {report.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {report.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {report.status === 'COMPLETED' && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {report.status === 'PROCESSING' && (
                      <Button variant="ghost" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {report.status === 'DRAFT' && (
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedReports.size > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {selectedReports.size} report{selectedReports.size !== 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Bulk Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Reports
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}



