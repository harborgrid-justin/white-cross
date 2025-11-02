/**
 * @fileoverview Budget Sidebar Component - Healthcare financial management navigation
 * @module app/(dashboard)/budget/@sidebar/default
 * @category Budget - Sidebar
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Wallet,
  Receipt,
  CreditCard,
  Calculator,
  FileText,
  Settings,
  PieChart,
  Plus,
  Eye,
  EyeOff,
  Clock,
  Download
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  isActive?: boolean;
  variant?: 'default' | 'warning' | 'success' | 'danger';
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count: number;
}

interface BudgetSidebarProps {
  className?: string;
}

const navigationItems: SidebarItem[] = [
  {
    id: 'overview',
    label: 'Budget Overview',
    icon: PieChart,
    isActive: true
  },
  {
    id: 'categories',
    label: 'Budget Categories',
    icon: Target,
    count: 15
  },
  {
    id: 'allocations',
    label: 'Allocations',
    icon: Wallet,
    count: 8
  },
  {
    id: 'tracking',
    label: 'Expense Tracking',
    icon: Receipt,
    count: 142
  },
  {
    id: 'planning',
    label: 'Budget Planning',
    icon: Calculator,
    count: 3
  },
  {
    id: 'reports',
    label: 'Financial Reports',
    icon: FileText,
    count: 12
  },
  {
    id: 'approvals',
    label: 'Pending Approvals',
    icon: Clock,
    count: 5,
    variant: 'warning'
  }
];

const departmentFilters: FilterOption[] = [
  { id: 'health-services', label: 'Health Services', value: 'HEALTH_SERVICES', count: 8 },
  { id: 'emergency', label: 'Emergency Services', value: 'EMERGENCY_SERVICES', count: 3 },
  { id: 'administration', label: 'Administration', value: 'ADMINISTRATION', count: 4 }
];

const statusFilters: FilterOption[] = [
  { id: 'under-budget', label: 'Under Budget', value: 'UNDER_BUDGET', count: 5 },
  { id: 'on-track', label: 'On Track', value: 'ON_TRACK', count: 7 },
  { id: 'approaching-limit', label: 'Approaching Limit', value: 'APPROACHING_LIMIT', count: 2 },
  { id: 'over-budget', label: 'Over Budget', value: 'OVER_BUDGET', count: 1 }
];

const categoryFilters: FilterOption[] = [
  { id: 'medical-supplies', label: 'Medical Supplies', value: 'MEDICAL_SUPPLIES', count: 1 },
  { id: 'medications', label: 'Medications', value: 'MEDICATIONS', count: 1 },
  { id: 'equipment', label: 'Equipment', value: 'EQUIPMENT', count: 3 },
  { id: 'emergency', label: 'Emergency Supplies', value: 'EMERGENCY_SUPPLIES', count: 2 }
];

function getItemVariantClass(variant: string = 'default') {
  switch (variant) {
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
    case 'success':
      return 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100';
    case 'danger':
      return 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100';
    default:
      return 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';
  }
}

function getBadgeVariant(variant: string = 'default') {
  switch (variant) {
    case 'warning': return 'warning';
    case 'success': return 'success';
    case 'danger': return 'danger';
    default: return 'secondary';
  }
}

export function BudgetSidebar({ className = '' }: BudgetSidebarProps) {
  const [activeFilter, setActiveFilter] = useState<string>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['navigation', 'quick-stats']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className={`w-80 space-y-6 ${className}`}>
      {/* Quick Actions */}
      <Card>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              New Budget Category
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calculator className="h-4 w-4 mr-2" />
              Budget Planning
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Record Expense
            </Button>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Budget Management</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('navigation')}
            >
              {expandedSections.has('navigation') ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {expandedSections.has('navigation') && (
          <div className="p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeFilter === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveFilter(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : getItemVariantClass(item.variant)
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <Badge 
                        variant={isActive ? 'info' : getBadgeVariant(item.variant)} 
                        className="text-xs"
                      >
                        {item.count}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Budget Summary */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">FY 2025 Summary</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('quick-stats')}
            >
              {expandedSections.has('quick-stats') ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {expandedSections.has('quick-stats') && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Total Allocated</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">$2.50M</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Receipt className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-gray-600">Total Spent</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">$1.48M</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Remaining</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">$1.02M</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-gray-600">Utilization</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">59.0%</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Department Filters */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Departments</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('departments')}
            >
              {expandedSections.has('departments') ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {expandedSections.has('departments') && (
          <div className="p-4">
            <div className="space-y-2">
              {departmentFilters.map((filter) => (
                <div key={filter.id} className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    {filter.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Status Filters */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Budget Status</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('status')}
            >
              {expandedSections.has('status') ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {expandedSections.has('status') && (
          <div className="p-4">
            <div className="space-y-2">
              {statusFilters.map((filter) => (
                <div key={filter.id} className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
                  </label>
                  <Badge 
                    variant={
                      filter.value === 'OVER_BUDGET' ? 'danger' :
                      filter.value === 'APPROACHING_LIMIT' ? 'warning' :
                      filter.value === 'ON_TRACK' ? 'success' : 'info'
                    } 
                    className="text-xs"
                  >
                    {filter.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Category Filters */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('categories')}
            >
              {expandedSections.has('categories') ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {expandedSections.has('categories') && (
          <div className="p-4">
            <div className="space-y-2">
              {categoryFilters.map((filter) => (
                <div key={filter.id} className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    {filter.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Receipt className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-gray-700">Medical Supply Order</span>
              </div>
              <Badge variant="success" className="text-xs">Approved</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm text-gray-700">Equipment Maintenance</span>
              </div>
              <Badge variant="warning" className="text-xs">Pending</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-sm text-gray-700">Over Budget Alert</span>
              </div>
              <Badge variant="danger" className="text-xs">Critical</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm text-gray-700">Budget Allocated</span>
              </div>
              <Badge variant="info" className="text-xs">Complete</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card>
        <div className="p-4">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Budget Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}



