'use client';

/**
 * Force dynamic rendering for real-time form data
 */


import React, { useState, useMemo } from 'react';
import { 
  FileText,
  Plus,
  BarChart3,
  Settings,
  Filter,
  Archive,
  Clock,
  Users,
  Shield,
  AlertCircle,
  CheckCircle,
  Play,
  Star,
  TrendingUp,
  Activity,
  Eye,
  FileCheck,
  Search
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Healthcare form types and statuses
type FormType = 'enrollment' | 'health_screening' | 'incident_report' | 'permission_slip' | 'medical_consent' | 'emergency_contact' | 'allergy_form' | 'medication_authorization' | 'assessment' | 'survey' | 'other';
type FormStatus = 'draft' | 'published' | 'paused' | 'archived';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  count?: number;
}

interface FormTemplate {
  id: string;
  title: string;
  description: string;
  type: FormType;
  category: 'healthcare' | 'administrative' | 'emergency' | 'assessment';
  fields: number;
  estimatedTime: number; // minutes
  icon: React.ComponentType<{ className?: string }>;
  isPopular: boolean;
  isRequired: boolean;
}

interface RecentActivity {
  id: string;
  type: 'form_created' | 'form_published' | 'response_received' | 'form_shared' | 'form_archived';
  formTitle: string;
  formId: string;
  timestamp: Date;
  user: {
    name: string;
    role: string;
  };
  details?: string;
}

interface FormsSidebarProps {
  onFilterChange?: (filter: { status?: FormStatus; type?: FormType }) => void;
  currentFilter?: { status?: FormStatus; type?: FormType };
}

const FormsSidebar: React.FC<FormsSidebarProps> = ({ 
  onFilterChange, 
  currentFilter 
}) => {
  const [expandedSection, setExpandedSection] = useState<'templates' | 'activity' | 'stats' | null>('templates');

  // Healthcare form templates
  const templates: FormTemplate[] = useMemo(() => [
    {
      id: 'enrollment-template',
      title: 'Student Enrollment Form',
      description: 'Comprehensive enrollment with health information and emergency contacts',
      type: 'enrollment',
      category: 'administrative',
      fields: 12,
      estimatedTime: 15,
      icon: Users,
      isPopular: true,
      isRequired: true
    },
    {
      id: 'health-screening-template',
      title: 'Daily Health Screening',
      description: 'COVID-19 and general health screening for students and staff',
      type: 'health_screening',
      category: 'healthcare',
      fields: 6,
      estimatedTime: 3,
      icon: Shield,
      isPopular: true,
      isRequired: true
    },
    {
      id: 'incident-report-template',
      title: 'Incident Report Form',
      description: 'Document accidents, injuries, or behavioral incidents',
      type: 'incident_report',
      category: 'emergency',
      fields: 8,
      estimatedTime: 10,
      icon: AlertCircle,
      isPopular: false,
      isRequired: true
    },
    {
      id: 'medication-auth-template',
      title: 'Medication Authorization',
      description: 'Parent authorization for school medication administration',
      type: 'medical_consent',
      category: 'healthcare',
      fields: 7,
      estimatedTime: 8,
      icon: FileCheck,
      isPopular: true,
      isRequired: true
    },
    {
      id: 'permission-slip-template',
      title: 'Field Trip Permission',
      description: 'Permission form for field trips and off-campus activities',
      type: 'permission_slip',
      category: 'administrative',
      fields: 6,
      estimatedTime: 5,
      icon: CheckCircle,
      isPopular: false,
      isRequired: false
    },
    {
      id: 'allergy-form-template',
      title: 'Allergy Information Form',
      description: 'Detailed allergy and dietary restriction information',
      type: 'allergy_form',
      category: 'healthcare',
      fields: 9,
      estimatedTime: 12,
      icon: Shield,
      isPopular: false,
      isRequired: true
    },
    {
      id: 'emergency-contact-template',
      title: 'Emergency Contact Update',
      description: 'Update emergency contact information and medical alerts',
      type: 'emergency_contact',
      category: 'emergency',
      fields: 5,
      estimatedTime: 7,
      icon: AlertCircle,
      isPopular: false,
      isRequired: true
    },
    {
      id: 'health-assessment-template',
      title: 'Annual Health Assessment',
      description: 'Comprehensive health evaluation and screening results',
      type: 'assessment',
      category: 'assessment',
      fields: 15,
      estimatedTime: 20,
      icon: Activity,
      isPopular: false,
      isRequired: true
    }
  ], []);

  // Mock recent activity
  const recentActivity: RecentActivity[] = useMemo(() => [
    {
      id: 'activity-001',
      type: 'response_received',
      formTitle: 'Daily Health Screening',
      formId: 'form-001',
      timestamp: new Date('2024-10-31T08:45:00'),
      user: { name: 'Parent Johnson', role: 'Parent' },
      details: 'Temperature: 98.6°F, No symptoms'
    },
    {
      id: 'activity-002',
      type: 'form_published',
      formTitle: 'Medication Authorization Form',
      formId: 'form-004',
      timestamp: new Date('2024-10-30T14:20:00'),
      user: { name: 'Jennifer Smith', role: 'School Nurse' },
      details: 'Form published and shared with parents'
    },
    {
      id: 'activity-003',
      type: 'response_received',
      formTitle: 'Student Enrollment Form',
      formId: 'form-002',
      timestamp: new Date('2024-10-30T11:15:00'),
      user: { name: 'Parent Wilson', role: 'Parent' },
      details: 'New student enrollment completed'
    },
    {
      id: 'activity-004',
      type: 'form_created',
      formTitle: 'Field Trip Permission Slip',
      formId: 'form-005',
      timestamp: new Date('2024-10-29T16:30:00'),
      user: { name: 'Teacher Wilson', role: 'Teacher' },
      details: 'Draft created for Science Museum trip'
    },
    {
      id: 'activity-005',
      type: 'response_received',
      formTitle: 'Incident Report Form',
      formId: 'form-003',
      timestamp: new Date('2024-10-29T13:45:00'),
      user: { name: 'Jennifer Smith', role: 'School Nurse' },
      details: 'Minor playground incident documented'
    }
  ], []);

  // Quick actions
  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'create-form',
      label: 'Create New Form',
      icon: Plus,
      href: '/forms/new',
      variant: 'primary'
    },
    {
      id: 'form-analytics',
      label: 'View Analytics',
      icon: BarChart3,
      href: '/forms/analytics',
      variant: 'outline'
    },
    {
      id: 'form-settings',
      label: 'Form Settings',
      icon: Settings,
      href: '/forms/settings',
      variant: 'outline'
    },
    {
      id: 'archived-forms',
      label: 'Archived Forms',
      icon: Archive,
      href: '/forms?status=archived',
      variant: 'outline',
      count: 12
    }
  ], []);

  // Form statistics for sidebar
  const sidebarStats = useMemo(() => {
    return [
      {
        label: 'Active Forms',
        value: '15',
        icon: Play,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      {
        label: 'Draft Forms',
        value: '3',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      },
      {
        label: 'Today\'s Responses',
        value: '42',
        icon: TrendingUp,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      {
        label: 'Critical Forms',
        value: '2',
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      }
    ];
  }, []);

  // Filter handlers
  const handleStatusFilter = (status: FormStatus) => {
    onFilterChange?.({ 
      ...currentFilter, 
      status: currentFilter?.status === status ? undefined : status 
    });
  };

  const handleTypeFilter = (type: FormType) => {
    onFilterChange?.({ 
      ...currentFilter, 
      type: currentFilter?.type === type ? undefined : type 
    });
  };

  const toggleSection = (section: typeof expandedSection) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'form_created':
        return <Plus className="h-4 w-4 text-blue-500" />;
      case 'form_published':
        return <Play className="h-4 w-4 text-green-500" />;
      case 'response_received':
        return <Eye className="h-4 w-4 text-purple-500" />;
      case 'form_shared':
        return <Users className="h-4 w-4 text-indigo-500" />;
      case 'form_archived':
        return <Archive className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityTypeLabel = (type: RecentActivity['type']): string => {
    switch (type) {
      case 'form_created':
        return 'Created';
      case 'form_published':
        return 'Published';
      case 'response_received':
        return 'Response';
      case 'form_shared':
        return 'Shared';
      case 'form_archived':
        return 'Archived';
      default:
        return 'Activity';
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const getCategoryBadgeColor = (category: FormTemplate['category']): string => {
    switch (category) {
      case 'healthcare':
        return 'bg-green-100 text-green-800';
      case 'administrative':
        return 'bg-blue-100 text-blue-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'assessment':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <div key={action.id}>
                {action.href ? (
                  <a href={action.href} className="block">
                    <Button
                      variant={action.variant}
                      className="w-full justify-start"
                      size="sm"
                    >
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.label}
                      {action.count && (
                        <Badge className="ml-auto bg-gray-100 text-gray-800">
                          {action.count}
                        </Badge>
                      )}
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant={action.variant}
                    onClick={action.action}
                    className="w-full justify-start"
                    size="sm"
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                    {action.count && (
                      <Badge className="ml-auto bg-gray-100 text-gray-800">
                        {action.count}
                      </Badge>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Statistics */}
        <div>
          <button
            onClick={() => toggleSection('stats')}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3 hover:text-gray-700"
          >
            <span>Form Statistics</span>
            <BarChart3 className="h-4 w-4" />
          </button>
          
          {expandedSection === 'stats' && (
            <div className="space-y-3">
              {sidebarStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between p-2 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${stat.bgColor}`}>
                      <stat.icon className={`h-3 w-3 ${stat.color}`} />
                    </div>
                    <span className="text-sm text-gray-600">{stat.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Options */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Filters</span>
          </div>

          {/* Status Filters */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
              Status
            </p>
            <div className="space-y-1">
              {(['published', 'draft', 'paused', 'archived'] as FormStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`flex items-center justify-between w-full px-2 py-1 text-sm rounded hover:bg-gray-50 ${
                    currentFilter?.status === status
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600'
                  }`}
                >
                  <span className="capitalize">{status}</span>
                  {status === 'published' && <Badge className="bg-green-100 text-green-800 text-xs">15</Badge>}
                  {status === 'draft' && <Badge className="bg-gray-100 text-gray-800 text-xs">3</Badge>}
                  {status === 'paused' && <Badge className="bg-yellow-100 text-yellow-800 text-xs">1</Badge>}
                  {status === 'archived' && <Badge className="bg-red-100 text-red-800 text-xs">12</Badge>}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
              Form Type
            </p>
            <div className="space-y-1">
              {(['health_screening', 'enrollment', 'incident_report', 'medical_consent'] as FormType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeFilter(type)}
                  className={`flex items-center justify-between w-full px-2 py-1 text-sm rounded hover:bg-gray-50 ${
                    currentFilter?.type === type
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600'
                  }`}
                >
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                  {type === 'health_screening' && <Badge className="bg-green-100 text-green-800 text-xs">5</Badge>}
                  {type === 'enrollment' && <Badge className="bg-blue-100 text-blue-800 text-xs">3</Badge>}
                  {type === 'incident_report' && <Badge className="bg-red-100 text-red-800 text-xs">2</Badge>}
                  {type === 'medical_consent' && <Badge className="bg-purple-100 text-purple-800 text-xs">4</Badge>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Healthcare Form Templates */}
        <div>
          <button
            onClick={() => toggleSection('templates')}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3 hover:text-gray-700"
          >
            <span>Healthcare Templates</span>
            <FileText className="h-4 w-4" />
          </button>
          
          {expandedSection === 'templates' && (
            <div className="space-y-3">
              {templates.slice(0, 4).map((template) => (
                <Card key={template.id} className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                  <a href={`/forms/new?template=${template.id}`}>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <template.icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                              {template.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {template.description}
                            </p>
                          </div>
                        </div>
                        {template.isPopular && (
                          <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge className={getCategoryBadgeColor(template.category)}>
                          {template.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{template.fields} fields</span>
                          <span>•</span>
                          <span>{template.estimatedTime}m</span>
                        </div>
                      </div>

                      {template.isRequired && (
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600">Required Form</span>
                        </div>
                      )}
                    </div>
                  </a>
                </Card>
              ))}
              
              <a href="/forms/templates">
                <Button variant="outline" size="sm" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  View All Templates ({templates.length})
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <button
            onClick={() => toggleSection('activity')}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3 hover:text-gray-700"
          >
            <span>Recent Activity</span>
            <Clock className="h-4 w-4" />
          </button>
          
          {expandedSection === 'activity' && (
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-900">
                          {getActivityTypeLabel(activity.type)}
                        </span>
                        <Badge className="bg-gray-100 text-gray-600 text-xs">
                          {activity.user.role}
                        </Badge>
                      </div>
                      
                      <a 
                        href={`/forms/${activity.formId}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium line-clamp-1"
                      >
                        {activity.formTitle}
                      </a>
                      
                      {activity.details && (
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                          {activity.details}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          by {activity.user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <a href="/forms/activity">
                <Button variant="outline" size="sm" className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  View All Activity
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Healthcare Compliance Notice */}
        <Card className="p-3 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                HIPAA Compliance
              </h4>
              <p className="text-xs text-blue-700">
                All healthcare forms automatically include HIPAA consent and data protection measures.
              </p>
            </div>
          </div>
        </Card>

        {/* Form Analytics Summary */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">This Week</h4>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Form Responses:</span>
              <span className="font-medium text-gray-900">127</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg. Completion:</span>
              <span className="font-medium text-gray-900">84.2%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">New Forms:</span>
              <span className="font-medium text-gray-900">3</span>
            </div>
          </div>
          <a href="/forms/analytics">
            <Button variant="outline" size="sm" className="w-full mt-3">
              <BarChart3 className="h-4 w-4 mr-2" />
              Full Analytics
            </Button>
          </a>
        </Card>
      </div>
    </div>
  );
};

export default FormsSidebar;


