'use client';

import React from 'react';
import {
  Shield,
  Search,
  Edit3,
  Trash2,
  Plus,
  Clock,
  Calendar,
  Users
} from 'lucide-react';

import type {
  PermissionRule,
  PermissionFilters,
  EntityType,
  PermissionLevel
} from './types';
import {
  getPermissionLevelDisplay,
  getEntityTypeIcon
} from './utils';

/**
 * Props for the PermissionsTable component
 */
export interface PermissionsTableProps {
  /** Permission rules to display */
  rules: PermissionRule[];
  /** Current search term */
  searchTerm: string;
  /** Current filters */
  filters: PermissionFilters;
  /** Selected rule IDs */
  selectedRules: string[];
  /** Whether all rules are selected */
  isAllSelected: boolean;
  /** Search term change handler */
  onSearchChange: (term: string) => void;
  /** Filter change handler */
  onFilterChange: (filterType: keyof PermissionFilters, value: string) => void;
  /** Individual rule selection handler */
  onSelectRule: (ruleId: string, selected: boolean) => void;
  /** Select all toggle handler */
  onSelectAll: (selected: boolean) => void;
  /** Edit rule handler */
  onEditRule?: (ruleId: string) => void;
  /** Delete rule handler */
  onDeleteRule?: (ruleId: string) => void;
  /** Bulk delete handler */
  onBulkDelete?: (ruleIds: string[]) => void;
  /** Create new rule handler */
  onCreateRule?: () => void;
}

/**
 * PermissionsTable Component
 *
 * Displays permission rules in a table format with search, filtering,
 * and bulk operations support. Handles large datasets efficiently.
 */
export const PermissionsTable: React.FC<PermissionsTableProps> = ({
  rules,
  searchTerm,
  filters,
  selectedRules,
  isAllSelected,
  onSearchChange,
  onFilterChange,
  onSelectRule,
  onSelectAll,
  onEditRule,
  onDeleteRule,
  onBulkDelete,
  onCreateRule
}) => {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search entities or resources..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search permissions"
            />
          </div>

          {/* Entity Type Filter */}
          <select
            value={filters.entityType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFilterChange('entityType', e.target.value as EntityType | 'all')}
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

          {/* Permission Level Filter */}
          <select
            value={filters.level}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFilterChange('level', e.target.value as PermissionLevel | 'all')}
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

        {/* Bulk Actions */}
        {selectedRules.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedRules.length} selected
            </span>
            <button
              onClick={() => onBulkDelete?.(selectedRules)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600
                       bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
              aria-label="Delete selected permissions"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Permissions Table */}
      {rules.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Permission Rules</h3>
          <p className="text-gray-600 mb-4">
            No permission rules match your current filters.
          </p>
          <button
            onClick={onCreateRule}
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
                      checked={isAllSelected}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      aria-label="Select all permissions"
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
                {rules.map((rule) => {
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
                            onSelectRule(rule.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          aria-label={`Select ${rule.entityName}`}
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
                          <span className="inline-flex items-center text-xs text-red-600 ml-2">
                            <Calendar className="w-3 h-3 mr-1" />
                            Expires
                          </span>
                        )}
                        {rule.inheritedFrom && (
                          <span className="inline-flex items-center text-xs text-blue-600 ml-2">
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
                            onClick={() => onEditRule?.(rule.id)}
                            className="text-blue-600 hover:text-blue-900"
                            aria-label={`Edit ${rule.entityName} permission`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteRule?.(rule.id)}
                            className="text-red-600 hover:text-red-900"
                            aria-label={`Delete ${rule.entityName} permission`}
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
  );
};

export default PermissionsTable;
