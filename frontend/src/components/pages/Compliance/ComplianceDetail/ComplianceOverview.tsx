'use client';

import React from 'react';
import { ChevronDown, ChevronRight, User, Shield } from 'lucide-react';
import { ComplianceOverviewProps } from './types';
import { getPriorityConfig, formatDate } from './utils';
import { CompliancePriority } from '../ComplianceCard';

/**
 * ComplianceOverview Component
 *
 * Displays overview information for a compliance requirement including assignment,
 * timeline, risk assessment, and related regulations. Supports inline editing mode.
 *
 * @param props - ComplianceOverview component props
 * @returns JSX element representing the compliance overview tab
 */
const ComplianceOverview: React.FC<ComplianceOverviewProps> = ({
  requirement,
  users,
  editMode,
  editForm,
  expandedSections,
  onEditFormChange,
  onToggleSection
}) => {
  const priorityConfig = getPriorityConfig(requirement.priority);

  return (
    <div className="space-y-6">
      {/* Assignment and Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Assigned To</span>
              {editMode ? (
                <select
                  value={editForm.assignedTo}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onEditFormChange({ assignedTo: e.target.value })}
                  className="text-sm border border-gray-300 rounded px-2 py-1
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{requirement.assignedToName}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Due Date</span>
              {editMode ? (
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onEditFormChange({ dueDate: e.target.value })}
                  className="text-sm border border-gray-300 rounded px-2 py-1
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <span className="text-sm text-gray-900">
                  {formatDate(requirement.dueDate)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Priority</span>
              {editMode ? (
                <select
                  value={editForm.priority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onEditFormChange({ priority: e.target.value as CompliancePriority })}
                  className="text-sm border border-gray-300 rounded px-2 py-1
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              ) : (
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
                  <span className="text-sm text-gray-900 capitalize">{requirement.priority}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Created</span>
              <span className="text-sm text-gray-900">
                {formatDate(requirement.createdAt)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Last Updated</span>
              <span className="text-sm text-gray-900">
                {formatDate(requirement.updatedAt)}
              </span>
            </div>

            {requirement.lastReview && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Last Review</span>
                <span className="text-sm text-gray-900">
                  {formatDate(requirement.lastReview)}
                </span>
              </div>
            )}

            {requirement.nextReview && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Next Review</span>
                <span className="text-sm text-gray-900">
                  {formatDate(requirement.nextReview)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-gray-50 rounded-lg p-4">
        <button
          onClick={() => onToggleSection('risk')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-medium text-gray-900">Risk Assessment</h3>
          {expandedSections.risk ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.risk && (
          <div className="mt-4">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Risk Level:</span>
              <span className={`text-sm font-bold capitalize ${
                requirement.risk.level === 'critical' ? 'text-red-600' :
                requirement.risk.level === 'high' ? 'text-orange-600' :
                requirement.risk.level === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {requirement.risk.level}
              </span>
            </div>
            <p className="text-sm text-gray-700">{requirement.risk.description}</p>
          </div>
        )}
      </div>

      {/* Regulations */}
      {requirement.regulations.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <button
            onClick={() => onToggleSection('regulations')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-medium text-gray-900">Related Regulations</h3>
            {expandedSections.regulations ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSections.regulations && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {requirement.regulations.map((regulation) => (
                  <span
                    key={regulation}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {regulation}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplianceOverview;
