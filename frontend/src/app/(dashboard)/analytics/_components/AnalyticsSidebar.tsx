/**
 * @fileoverview Analytics Sidebar Component - Navigation and filters for healthcare analytics
 * @module app/(dashboard)/analytics/_components/AnalyticsSidebar
 * @category Analytics - Components
 */

'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  Heart,
  Shield,
  Target,
  Pill,
  Users,
  AlertTriangle,
  TrendingUp,
  FileText,
  Calendar,
  Filter,
  RefreshCw,
  Download,
  Settings,
  Eye,
  Clock,
  CheckCircle,
  Activity,
  Zap,
  Search,
  Plus,
  BookOpen,
  Database
} from 'lucide-react';

interface AnalyticsSidebarProps {
  className?: string;
}

interface AnalyticsModule {
  id: string;
  name: string;
  description: string;
  icon: typeof BarChart3;
  count?: number;
  status?: 'active' | 'warning' | 'success' | 'error';
  href: string;
}

// Note: FilterOption interface removed as it's defined inline in filterCategories

interface QuickStat {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  icon: typeof Heart;
  color: string;
}

// Analytics modules for healthcare platform
const analyticsModules: AnalyticsModule[] = [
  {
    id: 'overview',
    name: 'Dashboard Overview',
    description: 'Comprehensive healthcare metrics summary',
    icon: BarChart3,
    count: 12,
    status: 'active',
    href: '/analytics'
  },
  {
    id: 'health-metrics',
    name: 'Health Metrics',
    description: 'Student health indicators and trends',
    icon: Heart,
    count: 8,
    status: 'success',
    href: '/analytics/health-metrics'
  },
  {
    id: 'compliance',
    name: 'Compliance Analytics',
    description: 'Regulatory compliance tracking',
    icon: Shield,
    count: 5,
    status: 'warning',
    href: '/analytics/compliance'
  },
  {
    id: 'incidents',
    name: 'Incident Analysis',
    description: 'Safety incident patterns and trends',
    icon: AlertTriangle,
    count: 3,
    status: 'error',
    href: '/analytics/incidents'
  },
  {
    id: 'medications',
    name: 'Medication Reports',
    description: 'Prescription adherence and safety',
    icon: Pill,
    count: 15,
    status: 'success',
    href: '/analytics/medications'
  },
  {
    id: 'population',
    name: 'Population Health',
    description: 'Student population health insights',
    icon: Users,
    count: 7,
    status: 'active',
    href: '/analytics/population'
  },
  {
    id: 'performance',
    name: 'Performance Metrics',
    description: 'Operational efficiency tracking',
    icon: Target,
    count: 9,
    status: 'success',
    href: '/analytics/performance'
  },
  {
    id: 'custom-reports',
    name: 'Custom Reports',
    description: 'User-generated analytics reports',
    icon: FileText,
    count: 23,
    status: 'active',
    href: '/analytics/custom-reports'
  }
];

// Filter options for analytics data
const filterCategories = [
  {
    title: 'Time Range',
    filters: [
      { id: '7d', name: 'Last 7 days', value: '7d', count: 245, active: false },
      { id: '30d', name: 'Last 30 days', value: '30d', count: 1024, active: true },
      { id: '90d', name: 'Last 90 days', value: '90d', count: 2847, active: false },
      { id: '1y', name: 'Last year', value: '1y', count: 8965, active: false },
      { id: 'custom', name: 'Custom range', value: 'custom', count: 0, active: false }
    ]
  },
  {
    title: 'Department',
    filters: [
      { id: 'all', name: 'All Departments', value: 'all', count: 2847, active: true },
      { id: 'elementary', name: 'Elementary', value: 'elementary', count: 1245, active: false },
      { id: 'middle', name: 'Middle School', value: 'middle', count: 892, active: false },
      { id: 'high', name: 'High School', value: 'high', count: 710, active: false },
      { id: 'special', name: 'Special Education', value: 'special', count: 156, active: false }
    ]
  },
  {
    title: 'Metric Category',
    filters: [
      { id: 'health', name: 'Health Indicators', value: 'health', count: 45, active: false },
      { id: 'safety', name: 'Safety Metrics', value: 'safety', count: 23, active: false },
      { id: 'compliance', name: 'Compliance', value: 'compliance', count: 12, active: false },
      { id: 'operational', name: 'Operations', value: 'operational', count: 34, active: false }
    ]
  },
  {
    title: 'Report Status',
    filters: [
      { id: 'completed', name: 'Completed', value: 'completed', count: 45, active: false },
      { id: 'processing', name: 'Processing', value: 'processing', count: 3, active: false },
      { id: 'scheduled', name: 'Scheduled', value: 'scheduled', count: 8, active: false },
      { id: 'failed', name: 'Failed', value: 'failed', count: 1, active: false }
    ]
  }
];

// Quick stats for sidebar
const quickStats: QuickStat[] = [
  {
    label: 'Active Reports',
    value: 23,
    trend: 'up',
    icon: FileText,
    color: 'text-blue-600'
  },
  {
    label: 'Health Score',
    value: '87.3%',
    trend: 'up',
    icon: Heart,
    color: 'text-red-600'
  },
  {
    label: 'Compliance',
    value: '96.8%',
    trend: 'stable',
    icon: Shield,
    color: 'text-green-600'
  },
  {
    label: 'Incidents',
    value: 12,
    trend: 'down',
    icon: AlertTriangle,
    color: 'text-yellow-600'
  }
];

function getStatusColor(status: string | undefined): string {
  switch (status) {
    case 'success': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'error': return 'text-red-600';
    case 'active': return 'text-blue-600';
    default: return 'text-gray-600';
  }
}

function getStatusBadgeVariant(status: string | undefined): "default" | "secondary" | "success" | "danger" | "warning" | "info" {
  switch (status) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'danger';
    case 'active': return 'info';
    default: return 'secondary';
  }
}

function getTrendIcon(trend: string | undefined) {
  switch (trend) {
    case 'up': return TrendingUp;
    case 'down': return TrendingUp; // Will be rotated in CSS
    default: return Activity;
  }
}

export function AnalyticsSidebar({ className = '' }: AnalyticsSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['modules', 'filters', 'stats']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleFilterChange = (categoryTitle: string, filterId: string) => {
    const params = new URLSearchParams(searchParams);
    const paramKey = categoryTitle.toLowerCase().replace(' ', '_');
    
    if (filterId === 'all' || filterId === params.get(paramKey)) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, filterId);
    }
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl as '/analytics');
  };

  return (
    <div className={`w-80 flex-shrink-0 ${className}`}>
      <div className="space-y-6">
        {/* Analytics Modules */}
        <Card>
          <div 
            className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('modules')}
          >
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
              Analytics Modules
            </h3>
            <Button variant="ghost" size="sm">
              {expandedSections.has('modules') ? '−' : '+'}
            </Button>
          </div>
          {expandedSections.has('modules') && (
            <div className="p-4">
              <div className="space-y-2">
                {analyticsModules.map((module) => {
                  const Icon = module.icon;
                  const isActive = pathname === module.href || pathname.startsWith(`${module.href}/`);
                  
                  return (
                    <div
                      key={module.id}
                      onClick={() => router.push(module.href as '/analytics')}
                      className={`
                        flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all
                        ${isActive 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50 border border-transparent'
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 mt-0.5 ${isActive ? 'text-blue-600' : getStatusColor(module.status)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'} truncate`}>
                            {module.name}
                          </p>
                          {module.count !== undefined && (
                            <Badge 
                              variant={isActive ? 'info' : getStatusBadgeVariant(module.status)} 
                              className="text-xs ml-2"
                            >
                              {module.count}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                          {module.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Plus className="h-3 w-3 mr-2" />
                  Create Custom Module
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-purple-600" />
              Quick Actions
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Plus className="h-3 w-3 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Download className="h-3 w-3 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Calendar className="h-3 w-3 mr-2" />
                Schedule Analysis
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Settings className="h-3 w-3 mr-2" />
                Configure Alerts
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <BookOpen className="h-3 w-3 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Statistics */}
        <Card>
          <div 
            className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('stats')}
          >
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-600" />
              Quick Stats
            </h3>
            <Button variant="ghost" size="sm">
              {expandedSections.has('stats') ? '−' : '+'}
            </Button>
          </div>
          {expandedSections.has('stats') && (
            <div className="p-4">
              <div className="space-y-3">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  const TrendIcon = getTrendIcon(stat.trend);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                        <div>
                          <p className="text-xs font-medium text-gray-900">{stat.label}</p>
                          <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                      {stat.trend && (
                        <TrendIcon 
                          className={`h-4 w-4 ${
                            stat.trend === 'up' ? 'text-green-600' :
                            stat.trend === 'down' ? 'text-red-600 rotate-180' :
                            'text-gray-600'
                          }`} 
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Refresh Stats
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Data Filters */}
        <Card>
          <div 
            className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('filters')}
          >
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Filter className="h-4 w-4 mr-2 text-indigo-600" />
              Data Filters
            </h3>
            <Button variant="ghost" size="sm">
              {expandedSections.has('filters') ? '−' : '+'}
            </Button>
          </div>
          {expandedSections.has('filters') && (
            <div className="p-4">
              <div className="space-y-4">
                {filterCategories.map((category) => (
                  <div key={category.title}>
                    <h4 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                      {category.title}
                    </h4>
                    <div className="space-y-1">
                      {category.filters.map((filter) => (
                        <div
                          key={filter.id}
                          onClick={() => handleFilterChange(category.title, filter.id)}
                          className={`
                            flex items-center justify-between p-2 rounded cursor-pointer transition-all text-xs
                            ${filter.active 
                              ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                              : 'hover:bg-gray-50 text-gray-700'
                            }
                          `}
                        >
                          <span className="truncate">{filter.name}</span>
                          <Badge 
                            variant={filter.active ? 'info' : 'secondary'} 
                            className="text-xs ml-2"
                          >
                            {filter.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Search className="h-3 w-3 mr-2" />
                  Advanced Search
                </Button>
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-orange-600" />
              Recent Activity
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-green-900">Health Report Generated</p>
                  <p className="text-xs text-green-700">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                <Eye className="h-4 w-4 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-900">Compliance Dashboard Viewed</p>
                  <p className="text-xs text-blue-700">15 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                <Database className="h-4 w-4 text-purple-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-purple-900">Data Export Completed</p>
                  <p className="text-xs text-purple-700">1 hour ago</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View All Activity
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


