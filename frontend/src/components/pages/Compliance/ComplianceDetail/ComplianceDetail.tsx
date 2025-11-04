'use client';

import React, { useState } from 'react';
import {
  Shield,
  Calendar,
  User,
  FileText,
  Edit3,
  Save,
  X,
  Share2,
  Eye,
  CheckCircle,
  History,
  MessageSquare,
  Settings,
  Target,
  Flag
} from 'lucide-react';
import { ComplianceDetailProps, DetailTab, EditFormState } from './types';
import {
  getStatusConfig,
  getCategoryConfig,
  getPriorityConfig,
  getDaysUntilDue,
  getDueDateColorClass,
  getDueDateMessage,
  formatDate
} from './utils';
import ComplianceOverview from './ComplianceOverview';
import ComplianceTasks from './ComplianceTasks';
import ComplianceEvidence from './ComplianceEvidence';
import ComplianceHistory from './ComplianceHistory';
import ComplianceComments from './ComplianceComments';
import ComplianceSettings from './ComplianceSettings';

/**
 * ComplianceDetail Component
 *
 * A comprehensive detail view component for compliance requirements with tabs for
 * overview, tasks, evidence, history, comments, and settings. Features inline editing,
 * file uploads, task management, and collaboration tools.
 *
 * This is the main orchestrator component that manages state and coordinates between
 * all tab components.
 *
 * @param props - ComplianceDetail component props
 * @returns JSX element representing the compliance requirement detail view
 */
const ComplianceDetail: React.FC<ComplianceDetailProps> = ({
  requirement,
  comments = [],
  history = [],
  users = [],
  loading = false,
  editMode = false,
  className = '',
  onEditModeToggle,
  onSaveChanges,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onUploadEvidence,
  onDownloadEvidence,
  onDeleteEvidence,
  onAddComment,
  onDeleteComment,
  onShare,
  onAssignmentChange,
  onStatusChange,
  onPriorityChange
}) => {
  // State
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    tasks: true,
    evidence: true,
    risk: true,
    regulations: true
  });

  // Edit form state
  const [editForm, setEditForm] = useState<EditFormState>({
    title: requirement.title,
    description: requirement.description,
    dueDate: requirement.dueDate,
    priority: requirement.priority,
    assignedTo: requirement.assignedTo
  });

  /**
   * Toggles section expansion
   */
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  /**
   * Handles edit form changes
   */
  const handleEditFormChange = (updates: Partial<EditFormState>) => {
    setEditForm(prev => ({ ...prev, ...updates }));
  };

  /**
   * Handles save changes
   */
  const handleSaveChanges = () => {
    onSaveChanges?.(editForm);
    onEditModeToggle?.(false);
  };

  /**
   * Handles cancel edit
   */
  const handleCancelEdit = () => {
    setEditForm({
      title: requirement.title,
      description: requirement.description,
      dueDate: requirement.dueDate,
      priority: requirement.priority,
      assignedTo: requirement.assignedTo
    });
    onEditModeToggle?.(false);
  };

  const statusConfig = getStatusConfig(requirement.status);
  const categoryConfig = getCategoryConfig(requirement.category);
  const priorityConfig = getPriorityConfig(requirement.priority);
  const StatusIcon = statusConfig.icon;
  const completedTasks = requirement.tasks.filter(task => task.completed).length;
  const daysUntilDue = getDaysUntilDue(requirement.dueDate);

  // Loading state
  if (loading) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {editMode ? (
              <input
                type="text"
                value={editForm.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleEditFormChange({ title: e.target.value })}
                className="text-2xl font-bold text-gray-900 border-none outline-none bg-transparent w-full
                         focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                placeholder="Requirement title"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{requirement.title}</h1>
            )}

            <div className="flex items-center space-x-4 mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryConfig.color}`}>
                {categoryConfig.label}
              </span>

              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </div>

              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
                <span className={`text-sm font-medium ${priorityConfig.color}`}>
                  {priorityConfig.label} Priority
                </span>
              </div>
            </div>

            {editMode ? (
              <textarea
                value={editForm.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleEditFormChange({ description: e.target.value })}
                rows={3}
                className="w-full text-gray-600 border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Requirement description"
              />
            ) : (
              <p className="text-gray-600">{requirement.description}</p>
            )}
          </div>

          <div className="flex items-center space-x-3 ml-6">
            {editMode ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                           bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white
                           bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onShare}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                           bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button
                  onClick={() => onEditModeToggle?.(true)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white
                           bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">{requirement.progress}%</p>
                <p className="text-xs text-gray-500">{completedTasks}/{requirement.tasks.length} tasks</p>
              </div>
              <Target className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due Date</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(requirement.dueDate)}
                </p>
                <p className={`text-xs font-medium ${getDueDateColorClass(daysUntilDue)}`}>
                  {getDueDateMessage(daysUntilDue)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Level</p>
                <p className={`text-lg font-bold capitalize ${
                  requirement.risk.level === 'critical' ? 'text-red-600' :
                  requirement.risk.level === 'high' ? 'text-orange-600' :
                  requirement.risk.level === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {requirement.risk.level}
                </p>
              </div>
              <Flag className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Evidence</p>
                <p className="text-2xl font-bold text-gray-900">{requirement.evidence.length}</p>
                <p className="text-xs text-gray-500">files uploaded</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 py-4">
          {[
            { id: 'overview' as DetailTab, label: 'Overview', icon: Eye },
            { id: 'tasks' as DetailTab, label: 'Tasks', icon: CheckCircle, count: requirement.tasks.length },
            { id: 'evidence' as DetailTab, label: 'Evidence', icon: FileText, count: requirement.evidence.length },
            { id: 'history' as DetailTab, label: 'History', icon: History, count: history.length },
            { id: 'comments' as DetailTab, label: 'Comments', icon: MessageSquare, count: comments.length },
            { id: 'settings' as DetailTab, label: 'Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <ComplianceOverview
            requirement={requirement}
            users={users}
            editMode={editMode}
            editForm={editForm}
            expandedSections={expandedSections}
            onEditFormChange={handleEditFormChange}
            onToggleSection={toggleSection}
          />
        )}

        {activeTab === 'tasks' && (
          <ComplianceTasks
            tasks={requirement.tasks}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
            onDeleteTask={onDeleteTask}
          />
        )}

        {activeTab === 'evidence' && (
          <ComplianceEvidence
            evidence={requirement.evidence}
            onUploadEvidence={onUploadEvidence}
            onDownloadEvidence={onDownloadEvidence}
            onDeleteEvidence={onDeleteEvidence}
          />
        )}

        {activeTab === 'history' && (
          <ComplianceHistory history={history} />
        )}

        {activeTab === 'comments' && (
          <ComplianceComments
            comments={comments}
            onAddComment={onAddComment}
            onDeleteComment={onDeleteComment}
          />
        )}

        {activeTab === 'settings' && (
          <ComplianceSettings
            requirement={requirement}
            onStatusChange={onStatusChange}
          />
        )}
      </div>
    </div>
  );
};

export default ComplianceDetail;
