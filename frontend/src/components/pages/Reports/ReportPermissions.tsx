'use client';

import React, { useState } from 'react';
import { 
  Shield,
  Users,
  UserCheck,
  UserX,
  Eye,
  Edit3,
  Trash2,
  Download,
  Share2,
  Settings,
  Lock,
  Unlock,
  Key,
  Crown,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Save,
  Copy,
  Loader2,
  Building,
  User,
  Globe,
  FileText,
  Calendar,
  Clock
} from 'lucide-react';

/**
 * Permission levels
 */
type PermissionLevel = 'none' | 'read' | 'write' | 'admin' | 'owner';

/**
 * Permission scope types
 */
type PermissionScope = 'report' | 'category' | 'global';

/**
 * User or group types
 */
type EntityType = 'user' | 'group' | 'role' | 'department';

/**
 * Permission action types
 */
type PermissionAction = 'view' | 'edit' | 'delete' | 'export' | 'share' | 'schedule' | 'manage';

/**
 * Permission entity interface
 */
interface PermissionEntity {
  id: string;
  name: string;
  type: EntityType;
  email?: string;
  department?: string;
  avatar?: string;
  isActive: boolean;
  lastAccess?: string;
}

/**
 * Permission rule interface
 */
interface PermissionRule {
  id: string;
  entityId: string;
  entityName: string;
  entityType: EntityType;
  scope: PermissionScope;
  resourceId?: string;
  resourceName?: string;
  level: PermissionLevel;
  actions: PermissionAction[];
  conditions?: {
    timeRestriction?: {
      startTime: string;
      endTime: string;
      days: string[];
    };
    ipRestriction?: string[];
    expiresAt?: string;
  };
  inheritedFrom?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

/**
 * Permission template interface
 */
interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  level: PermissionLevel;
  actions: PermissionAction[];
  scope: PermissionScope;
  isDefault: boolean;
  usageCount: number;
  createdAt: string;
}

/**
 * Access log entry interface
 */
interface AccessLogEntry {
  id: string;
  entityId: string;
  entityName: string;
  entityType: EntityType;
  resourceId: string;
  resourceName: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: string;
}

/**
 * Props for the ReportPermissions component
 */
interface ReportPermissionsProps {
  /** Available entities (users, groups, etc.) */
  entities?: PermissionEntity[];
  /** Permission rules */
  rules?: PermissionRule[];
  /** Permission templates */
  templates?: PermissionTemplate[];
  /** Access logs */
  accessLogs?: AccessLogEntry[];
  /** Available reports */
  reports?: Array<{ id: string; name: string; category: string }>;
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Create permission rule handler */
  onCreateRule?: (rule: Partial<PermissionRule>) => void;
  /** Update permission rule handler */
  onUpdateRule?: (id: string, rule: Partial<PermissionRule>) => void;
  /** Delete permission rule handler */
  onDeleteRule?: (id: string) => void;
  /** Create template handler */
  onCreateTemplate?: (template: Partial<PermissionTemplate>) => void;
  /** Apply template handler */
  onApplyTemplate?: (templateId: string, entityIds: string[]) => void;
  /** Bulk permission change handler */
  onBulkPermissionChange?: (entityIds: string[], changes: Partial<PermissionRule>) => void;
}

/**
 * ReportPermissions Component
 * 
 * A comprehensive permissions management component that handles user and group
 * access control for reports with role-based permissions, templates, and audit logs.
 * Features bulk operations, inheritance, and detailed access tracking.
 * 
 * @param props - ReportPermissions component props
 * @returns JSX element representing the permissions management interface
 */
const ReportPermissions = ({
  entities = [],
  rules = [],
  templates = [],
  accessLogs = [],
  reports = [],
  loading = false,
  className = '',
  onCreateRule,
  onUpdateRule,
  onDeleteRule,
  onCreateTemplate,
  onApplyTemplate,
  onBulkPermissionChange
}: ReportPermissionsProps) => {
  // State
  const [activeTab, setActiveTab] = useState<'permissions' | 'templates' | 'logs'>('permissions');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    entityType: 'all' as EntityType | 'all',
    level: 'all' as PermissionLevel | 'all',
    scope: 'all' as PermissionScope | 'all'
  });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    conditions: false,
    advanced: false
  });

  // Form state for new rule
  const [newRule, setNewRule] = useState<Partial<PermissionRule>>({
    entityId: '',
    scope: 'report',
    level: 'read',
    actions: ['view'],
    conditions: {}
  });

  // Form state for new template
  const [newTemplate, setNewTemplate] = useState<Partial<PermissionTemplate>>({
    name: '',
    description: '',
    level: 'read',
    actions: ['view'],
    scope: 'report',
    isDefault: false
  });

  /**
   * Gets permission level color and icon
   */
  const getPermissionLevelDisplay = (level: PermissionLevel) => {
    const config = {
      none: { color: 'text-red-600 bg-red-100', icon: X, label: 'No Access' },
      read: { color: 'text-blue-600 bg-blue-100', icon: Eye, label: 'Read Only' },
      write: { color: 'text-green-600 bg-green-100', icon: Edit3, label: 'Read & Write' },
      admin: { color: 'text-purple-600 bg-purple-100', icon: Settings, label: 'Admin' },
      owner: { color: 'text-orange-600 bg-orange-100', icon: Crown, label: 'Owner' }
    };
    return config[level];
  };

  /**
   * Gets entity type icon
   */
  const getEntityTypeIcon = (type: EntityType) => {
    const icons = {
      user: User,
      group: Users,
      role: Key,
      department: Building
    };
    return icons[type];
  };

  /**
   * Filters rules based on search and filters
   */
  const filteredRules = rules.filter(rule => {
    if (searchTerm && !rule.entityName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !rule.resourceName?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.entityType !== 'all' && rule.entityType !== filters.entityType) return false;
    if (filters.level !== 'all' && rule.level !== filters.level) return false;
    if (filters.scope !== 'all' && rule.scope !== filters.scope) return false;
    return true;
  });

  /**
   * Filters access logs
   */
  const filteredLogs = accessLogs.filter(log => {
    if (searchTerm && !log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.resourceName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  /**
   * Handles bulk selection
   */
  const handleBulkSelect = (ruleId: string, selected: boolean) => {
    if (selected) {
      setSelectedRules(prev => [...prev, ruleId]);
    } else {
      setSelectedRules(prev => prev.filter(id => id !== ruleId));
    }
  };

  /**
   * Handles form submission for new rule
   */
  const handleSubmitRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRule.entityId && newRule.level) {
      onCreateRule?.(newRule);
      setShowCreateModal(false);
      setNewRule({
        entityId: '',
        scope: 'report',
        level: 'read',
        actions: ['view'],
        conditions: {}
      });
    }
  };

  /**
   * Handles form submission for new template
   */
  const handleSubmitTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTemplate.name && newTemplate.level) {
      onCreateTemplate?.(newTemplate);
      setShowTemplateModal(false);
      setNewTemplate({
        name: '',
        description: '',
        level: 'read',
        actions: ['view'],
        scope: 'report',
        isDefault: false
      });
    }
  };

  /**
   * Toggles section expansion
   */
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Permissions</h1>
            <p className="text-gray-600 mt-1">
              Manage user and group access to reports and data
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Copy className="w-4 h-4 mr-2" />
              New Template
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Permission
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <nav className="flex space-x-8">
            {[
              { id: 'permissions' as const, label: 'Permissions', count: rules.length },
              { id: 'templates' as const, label: 'Templates', count: templates.length },
              { id: 'logs' as const, label: 'Access Logs', count: accessLogs.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="p-6">
          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search entities or resources..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm 
                               focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <select
                    value={filters.entityType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                      setFilters(prev => ({ ...prev, entityType: e.target.value as EntityType | 'all' }))}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm 
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by entity type"
                  >
                    <option value="all">All Types</option>
                    <option value="user">Users</option>
                    <option value="group">Groups</option>
                    <option value="role">Roles</option>
                    <option value="department">Departments</option>
                  </select>
                  
                  <select
                    value={filters.level}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                      setFilters(prev => ({ ...prev, level: e.target.value as PermissionLevel | 'all' }))}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm 
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by permission level"
                  >
                    <option value="all">All Levels</option>
                    <option value="none">No Access</option>
                    <option value="read">Read Only</option>
                    <option value="write">Read & Write</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                
                {selectedRules.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {selectedRules.length} selected
                    </span>
                    <button
                      onClick={() => {
                        selectedRules.forEach(id => onDeleteRule?.(id));
                        setSelectedRules([]);
                      }}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 
                               bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete Selected
                    </button>
                  </div>
                )}
              </div>

              {/* Permissions List */}
              {filteredRules.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Permission Rules</h3>
                  <p className="text-gray-600 mb-4">
                    No permission rules match your current filters.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                             bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Permission Rule
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={selectedRules.length === filteredRules.length}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (e.target.checked) {
                                  setSelectedRules(filteredRules.map(rule => rule.id));
                                } else {
                                  setSelectedRules([]);
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Entity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Resource
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Permission Level
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Conditions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Modified
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRules.map((rule) => {
                          const EntityIcon = getEntityTypeIcon(rule.entityType);
                          const levelConfig = getPermissionLevelDisplay(rule.level);
                          const LevelIcon = levelConfig.icon;
                          
                          return (
                            <tr key={rule.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedRules.includes(rule.id)}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                    handleBulkSelect(rule.id, e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <EntityIcon className="w-4 h-4 text-gray-400 mr-3" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{rule.entityName}</div>
                                    <div className="text-sm text-gray-500 capitalize">{rule.entityType}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {rule.resourceName || 'All Reports'}
                                </div>
                                <div className="text-sm text-gray-500 capitalize">{rule.scope}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${levelConfig.color}`}>
                                  <LevelIcon className="w-3 h-3 mr-1" />
                                  {levelConfig.label}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                  {rule.actions.map((action) => (
                                    <span
                                      key={action}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                    >
                                      {action}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {rule.conditions?.timeRestriction && (
                                  <span className="inline-flex items-center text-xs text-orange-600">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Time Limited
                                  </span>
                                )}
                                {rule.conditions?.expiresAt && (
                                  <span className="inline-flex items-center text-xs text-red-600">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Expires
                                  </span>
                                )}
                                {rule.inheritedFrom && (
                                  <span className="inline-flex items-center text-xs text-blue-600">
                                    <Users className="w-3 h-3 mr-1" />
                                    Inherited
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(rule.updatedAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => {/* Handle edit */}}
                                    className="text-blue-600 hover:text-blue-900"
                                    aria-label="Edit permission"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => onDeleteRule?.(rule.id)}
                                    className="text-red-600 hover:text-red-900"
                                    aria-label="Delete permission"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              {templates.length === 0 ? (
                <div className="text-center py-12">
                  <Copy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Permission Templates</h3>
                  <p className="text-gray-600 mb-4">
                    Create reusable permission templates for common access patterns.
                  </p>
                  <button
                    onClick={() => setShowTemplateModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                             bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {templates.map((template) => {
                    const levelConfig = getPermissionLevelDisplay(template.level);
                    const LevelIcon = levelConfig.icon;
                    
                    return (
                      <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 rounded-lg p-2">
                              <LevelIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                              <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                          </div>
                          
                          {template.isDefault && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Level:</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${levelConfig.color}`}>
                              {levelConfig.label}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Actions:</span>
                            <div className="flex flex-wrap gap-1">
                              {template.actions.slice(0, 3).map((action) => (
                                <span
                                  key={action}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {action}
                                </span>
                              ))}
                              {template.actions.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{template.actions.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Usage:</span>
                            <span className="text-gray-900">{template.usageCount} times</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center space-x-2">
                          <button
                            onClick={() => {/* Handle apply template */}}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 
                                     bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Apply Template
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Access Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search access logs..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Access Logs */}
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Access Logs</h3>
                  <p className="text-gray-600">
                    No access logs match your search criteria.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Resource
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timestamp
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            IP Address
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLogs.slice(0, 50).map((log) => {
                          const EntityIcon = getEntityTypeIcon(log.entityType);
                          
                          return (
                            <tr key={log.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <EntityIcon className="w-4 h-4 text-gray-400 mr-3" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{log.entityName}</div>
                                    <div className="text-sm text-gray-500 capitalize">{log.entityType}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{log.resourceName}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {log.action}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {log.success ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Success
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Failed
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {log.ipAddress}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Permission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmitRule}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Add Permission Rule</h3>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="entitySelect" className="block text-sm font-medium text-gray-700 mb-1">
                      Entity
                    </label>
                    <select
                      id="entitySelect"
                      value={newRule.entityId || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        setNewRule(prev => ({ ...prev, entityId: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                               focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select entity</option>
                      {entities.map((entity) => (
                        <option key={entity.id} value={entity.id}>
                          {entity.name} ({entity.type})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="permissionLevel" className="block text-sm font-medium text-gray-700 mb-1">
                      Permission Level
                    </label>
                    <select
                      id="permissionLevel"
                      value={newRule.level || 'read'}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        setNewRule(prev => ({ ...prev, level: e.target.value as PermissionLevel }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                               focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="none">No Access</option>
                      <option value="read">Read Only</option>      
                      <option value="write">Read & Write</option>
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="scopeSelect" className="block text-sm font-medium text-gray-700 mb-1">
                      Scope
                    </label>
                    <select
                      id="scopeSelect"
                      value={newRule.scope || 'report'}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        setNewRule(prev => ({ ...prev, scope: e.target.value as PermissionScope }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                               focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="report">Specific Report</option>
                      <option value="category">Report Category</option>
                      <option value="global">All Reports</option>
                    </select>
                  </div>
                  
                  {newRule.scope !== 'global' && (
                    <div>
                      <label htmlFor="resourceSelect" className="block text-sm font-medium text-gray-700 mb-1">
                        Resource
                      </label>
                      <select
                        id="resourceSelect"
                        value={newRule.resourceId || ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                          setNewRule(prev => ({ ...prev, resourceId: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                                 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select resource</option>
                        {reports.map((report) => (
                          <option key={report.id} value={report.id}>
                            {report.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                           rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent 
                           rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <form onSubmit={handleSubmitTemplate}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Create Permission Template</h3>
                  <button
                    type="button"
                    onClick={() => setShowTemplateModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    id="templateName"
                    value={newTemplate.name || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter template name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="templateDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="templateDescription"
                    value={newTemplate.description || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe this permission template"
                  />
                </div>
                
                <div>
                  <label htmlFor="templateLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    Permission Level
                  </label>
                  <select
                    id="templateLevel"
                    value={newTemplate.level || 'read'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                      setNewTemplate(prev => ({ ...prev, level: e.target.value as PermissionLevel }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="read">Read Only</option>
                    <option value="write">Read & Write</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                           rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent 
                           rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPermissions;
