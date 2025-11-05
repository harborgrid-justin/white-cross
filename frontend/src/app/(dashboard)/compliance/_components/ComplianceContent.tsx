/**
 * @fileoverview Compliance Content Component - Healthcare regulatory compliance management
 * @module app/(dashboard)/compliance/_components/ComplianceContent
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
  XCircle,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  Eye,
  Download,
  Plus,
  Users,
  Lock,
  BookOpen,
  Activity
} from 'lucide-react';

interface ComplianceContentProps {
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

interface ComplianceItem {
  id: string;
  title: string;
  category: 'HIPAA' | 'FERPA' | 'OSHA' | 'FDA' | 'STATE' | 'INTERNAL';
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_ATTENTION' | 'UNDER_REVIEW' | 'EXPIRED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  lastAudit: string;
  nextAudit: string;
  dueDate?: string;
  assignee: string;
  description: string;
  requirements: string[];
  documents: number;
  progress: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface ComplianceStats {
  totalRequirements: number;
  compliantCount: number;
  nonCompliantCount: number;
  needsAttentionCount: number;
  upcomingAudits: number;
  overdueTasks: number;
  riskScore: number;
  complianceRate: number;
}

// Mock data for demonstration
const mockComplianceData: ComplianceItem[] = [
  {
    id: '1',
    title: 'HIPAA Privacy Rule Compliance',
    category: 'HIPAA',
    status: 'COMPLIANT',
    priority: 'HIGH',
    lastAudit: '2024-01-15',
    nextAudit: '2024-07-15',
    assignee: 'Sarah Johnson',
    description: 'Ensuring all patient health information is properly protected and handled according to HIPAA Privacy Rule requirements.',
    requirements: [
      'Employee training completed',
      'Privacy policies updated',
      'Access controls implemented',
      'Incident response procedures'
    ],
    documents: 12,
    progress: 100,
    riskLevel: 'LOW'
  },
  {
    id: '2',
    title: 'FERPA Student Records Protection',
    category: 'FERPA',
    status: 'NEEDS_ATTENTION',
    priority: 'HIGH',
    lastAudit: '2023-12-01',
    nextAudit: '2024-06-01',
    dueDate: '2024-02-15',
    assignee: 'Michael Chen',
    description: 'Compliance with Family Educational Rights and Privacy Act for student health and educational records.',
    requirements: [
      'Directory information policies',
      'Parental consent procedures',
      'Record access controls',
      'Staff training program'
    ],
    documents: 8,
    progress: 75,
    riskLevel: 'MEDIUM'
  },
  {
    id: '3',
    title: 'Medication Storage Compliance',
    category: 'FDA',
    status: 'COMPLIANT',
    priority: 'HIGH',
    lastAudit: '2024-01-30',
    nextAudit: '2024-04-30',
    assignee: 'Dr. Emily Rodriguez',
    description: 'FDA requirements for proper storage and handling of medications in school health offices.',
    requirements: [
      'Temperature monitoring',
      'Controlled substance tracking',
      'Expiration date management',
      'Storage facility standards'
    ],
    documents: 15,
    progress: 100,
    riskLevel: 'LOW'
  },
  {
    id: '4',
    title: 'Emergency Response Protocols',
    category: 'OSHA',
    status: 'UNDER_REVIEW',
    priority: 'MEDIUM',
    lastAudit: '2023-11-15',
    nextAudit: '2024-05-15',
    assignee: 'James Wilson',
    description: 'OSHA compliance for workplace safety and emergency response procedures in healthcare settings.',
    requirements: [
      'Emergency evacuation plans',
      'First aid procedures',
      'Incident reporting system',
      'Safety training records'
    ],
    documents: 6,
    progress: 60,
    riskLevel: 'MEDIUM'
  },
  {
    id: '5',
    title: 'Data Breach Response Plan',
    category: 'HIPAA',
    status: 'NON_COMPLIANT',
    priority: 'HIGH',
    lastAudit: '2023-10-01',
    nextAudit: '2024-04-01',
    dueDate: '2024-02-01',
    assignee: 'Lisa Thompson',
    description: 'Updated data breach notification procedures and incident response protocols.',
    requirements: [
      'Breach assessment procedures',
      'Notification timelines',
      'Documentation requirements',
      'Risk assessment protocols'
    ],
    documents: 3,
    progress: 25,
    riskLevel: 'HIGH'
  }
];

const mockStats: ComplianceStats = {
  totalRequirements: 45,
  compliantCount: 32,
  nonCompliantCount: 3,
  needsAttentionCount: 7,
  upcomingAudits: 8,
  overdueTasks: 3,
  riskScore: 78,
  complianceRate: 71
};

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'COMPLIANT': return 'success';
    case 'NON_COMPLIANT': return 'danger';
    case 'NEEDS_ATTENTION': return 'warning';
    case 'UNDER_REVIEW': return 'info';
    case 'EXPIRED': return 'danger';
    default: return 'secondary';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'COMPLIANT': return CheckCircle;
    case 'NON_COMPLIANT': return XCircle;
    case 'NEEDS_ATTENTION': return AlertTriangle;
    case 'UNDER_REVIEW': return Clock;
    case 'EXPIRED': return XCircle;
    default: return Shield;
  }
}

function getPriorityBadgeVariant(priority: string) {
  switch (priority) {
    case 'HIGH': return 'danger';
    case 'MEDIUM': return 'warning';
    case 'LOW': return 'info';
    default: return 'secondary';
  }
}

function getRiskColor(riskLevel: string) {
  switch (riskLevel) {
    case 'HIGH': return 'text-red-600';
    case 'MEDIUM': return 'text-yellow-600';
    case 'LOW': return 'text-green-600';
    default: return 'text-gray-600';
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'HIPAA': return Shield;
    case 'FERPA': return Lock;
    case 'OSHA': return AlertTriangle;
    case 'FDA': return FileText;
    case 'STATE': return BookOpen;
    case 'INTERNAL': return Users;
    default: return Shield;
  }
}

export function ComplianceContent({ searchParams }: ComplianceContentProps) {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [stats, setStats] = useState<ComplianceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setItems(mockComplianceData);
      setStats(mockStats);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams]);

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

  if (!stats) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Unable to load compliance data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Compliant</p>
                <p className="text-2xl font-bold text-gray-900">{stats.compliantCount}</p>
                <p className="text-xs text-gray-500">
                  {((stats.compliantCount / stats.totalRequirements) * 100).toFixed(1)}% of requirements
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Non-Compliant</p>
                <p className="text-2xl font-bold text-gray-900">{stats.nonCompliantCount}</p>
                <p className="text-xs text-gray-500">
                  {stats.overdueTasks} overdue tasks
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                <p className="text-2xl font-bold text-gray-900">{stats.needsAttentionCount}</p>
                <p className="text-xs text-gray-500">
                  Requires review
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.complianceRate}%</p>
                <p className="text-xs text-gray-500">
                  Risk score: {stats.riskScore}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <a href="/compliance/audits" className="block p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Audit Logs</h3>
                <p className="text-sm text-gray-600">HIPAA audit trail</p>
              </div>
            </div>
          </a>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <a href="/compliance/reports" className="block p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600">Reports</h3>
                <p className="text-sm text-gray-600">Generate compliance reports</p>
              </div>
            </div>
          </a>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <a href="/compliance/policies" className="block p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">Policies</h3>
                <p className="text-sm text-gray-600">Policy management</p>
              </div>
            </div>
          </a>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <a href="/compliance/training" className="block p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">Training</h3>
                <p className="text-sm text-gray-600">Staff certification</p>
              </div>
            </div>
          </a>
        </Card>
      </div>

      {/* Compliance Requirements List */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Compliance Requirements</h3>
              <p className="text-sm text-gray-500">
                Track regulatory compliance across all healthcare standards
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {items.map((item) => {
              const StatusIcon = getStatusIcon(item.status);
              const CategoryIcon = getCategoryIcon(item.category);
              
              return (
                <div 
                  key={item.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CategoryIcon className="h-5 w-5 text-gray-600" />
                        <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                        <Badge variant={getStatusBadgeVariant(item.status)} className="text-xs">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(item.priority)} className="text-xs">
                          {item.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>Assignee: {item.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Next Audit: {new Date(item.nextAudit).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{item.documents} documents</span>
                        </div>
                        <div className={`flex items-center gap-1 ${getRiskColor(item.riskLevel)}`}>
                          <AlertTriangle className="h-4 w-4" />
                          <span>Risk: {item.riskLevel}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-900 font-medium">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              item.progress >= 90 ? 'bg-green-600' :
                              item.progress >= 70 ? 'bg-blue-600' :
                              item.progress >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            data-width={`${item.progress}%`}
                          ></div>
                        </div>
                      </div>

                      {/* Requirements Checklist */}
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Key Requirements:</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {item.requirements.map((requirement, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-gray-600">{requirement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Upcoming Audits */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Upcoming Audits
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {items.filter(item => {
                const nextAudit = new Date(item.nextAudit);
                const now = new Date();
                const diffDays = Math.ceil((nextAudit.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays <= 60;
              }).slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.category}</p>
                    <p className="text-xs text-gray-500">{item.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{new Date(item.nextAudit).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{item.assignee}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900">HIPAA Privacy Rule audit completed</p>
                  <p className="text-xs text-gray-500">2 hours ago • Sarah Johnson</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900">Emergency Response Protocols under review</p>
                  <p className="text-xs text-gray-500">5 hours ago • James Wilson</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900">FERPA compliance needs attention</p>
                  <p className="text-xs text-gray-500">1 day ago • Michael Chen</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


