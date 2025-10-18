/**
 * WF-COMP-115 | FollowUpActionContext.example.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./FollowUpActionContext, ../types/incidents | Dependencies: ./FollowUpActionContext, ../types/incidents
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, named exports | Key Features: useState, useEffect, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Follow-Up Action Context Usage Examples
 * Demonstrates proper implementation patterns for using FollowUpActionContext
 *
 * @module FollowUpActionContextExamples
 */

import React, { useEffect } from 'react';
import { FollowUpActionProvider, useFollowUpActions } from './FollowUpActionContext';
import { ActionStatus, ActionPriority } from '../types/incidents';

// =====================
// EXAMPLE 1: Basic Setup
// =====================

/**
 * Example: Wrap your app or incident component with the provider
 */
export function AppWithFollowUpActions() {
  return (
    <FollowUpActionProvider
      initialIncidentId="incident-123"
      refreshInterval={60000} // Refresh every 60 seconds
      autoNotifyOverdue={true}
    >
      <IncidentDetailsPage />
    </FollowUpActionProvider>
  );
}

// =====================
// EXAMPLE 2: Display Follow-Up Actions List
// =====================

/**
 * Example: Display all follow-up actions with filtering
 */
function FollowUpActionsList() {
  const {
    actions,
    isLoading,
    error,
    filters,
    setFilters,
    stats,
    loadFollowUpActions,
  } = useFollowUpActions();

  useEffect(() => {
    // Load actions for a specific incident
    loadFollowUpActions('incident-123');
  }, [loadFollowUpActions]);

  if (isLoading) {
    return <div>Loading follow-up actions...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Follow-Up Actions</h2>

      {/* Statistics */}
      <div className="stats">
        <div>Total: {stats.total}</div>
        <div>Pending: {stats.pending}</div>
        <div>In Progress: {stats.inProgress}</div>
        <div>Completed: {stats.completed}</div>
        <div>Overdue: {stats.overdue}</div>
      </div>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilters({ assignedToMe: !filters.assignedToMe })}>
          {filters.assignedToMe ? 'Show All' : 'Show My Actions'}
        </button>
        <button onClick={() => setFilters({ overduedOnly: !filters.overduedOnly })}>
          {filters.overduedOnly ? 'Show All' : 'Show Overdue Only'}
        </button>
      </div>

      {/* Actions List */}
      <ul>
        {actions.map((action) => (
          <FollowUpActionItem key={action.id} action={action} />
        ))}
      </ul>
    </div>
  );
}

// =====================
// EXAMPLE 3: Individual Action Item Component
// =====================

/**
 * Example: Individual action item with status updates
 */
function FollowUpActionItem({ action }: { action: any }) {
  const {
    updateActionStatus,
    completeAction,
    deleteFollowUpAction,
    isActionOverdue,
    canEditAction,
    setSelectedAction,
  } = useFollowUpActions();

  const overdue = isActionOverdue(action);
  const canEdit = canEditAction(action);

  const handleStatusChange = async (newStatus: ActionStatus) => {
    try {
      await updateActionStatus(action.id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleComplete = async () => {
    const notes = prompt('Enter completion notes:');
    if (notes) {
      try {
        await completeAction(action.id, notes);
      } catch (error) {
        console.error('Failed to complete action:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this action?')) {
      try {
        await deleteFollowUpAction(action.id);
      } catch (error) {
        console.error('Failed to delete action:', error);
      }
    }
  };

  return (
    <li className={overdue ? 'overdue' : ''}>
      <div>
        <strong>{action.action}</strong>
        <span className={`priority-${action.priority.toLowerCase()}`}>
          {action.priority}
        </span>
        <span className={`status-${action.status.toLowerCase()}`}>
          {action.status}
        </span>
      </div>
      <div>Due: {new Date(action.dueDate).toLocaleDateString()}</div>
      {overdue && <div className="overdue-warning">OVERDUE!</div>}

      {canEdit && (
        <div className="actions">
          <button onClick={() => setSelectedAction(action)}>Edit</button>
          {action.status === ActionStatus.PENDING && (
            <button onClick={() => handleStatusChange(ActionStatus.IN_PROGRESS)}>
              Start
            </button>
          )}
          {action.status === ActionStatus.IN_PROGRESS && (
            <button onClick={handleComplete}>Complete</button>
          )}
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </li>
  );
}

// =====================
// EXAMPLE 4: Create New Action Form
// =====================

/**
 * Example: Form to create a new follow-up action
 */
function CreateFollowUpActionForm({ incidentId }: { incidentId: string }) {
  const { createFollowUpAction, isCreating } = useFollowUpActions();
  const [formData, setFormData] = React.useState({
    action: '',
    priority: ActionPriority.MEDIUM,
    dueDate: '',
    assignedTo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createFollowUpAction({
        incidentReportId: incidentId,
        action: formData.action,
        priority: formData.priority,
        dueDate: formData.dueDate,
        assignedTo: formData.assignedTo || undefined,
      });

      // Reset form
      setFormData({
        action: '',
        priority: ActionPriority.MEDIUM,
        dueDate: '',
        assignedTo: '',
      });
    } catch (error) {
      console.error('Failed to create action:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Follow-Up Action</h3>

      <div>
        <label>Action Description:</label>
        <textarea
          value={formData.action}
          onChange={(e) => setFormData({ ...formData, action: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Priority:</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as ActionPriority })}
        >
          <option value={ActionPriority.LOW}>Low</option>
          <option value={ActionPriority.MEDIUM}>Medium</option>
          <option value={ActionPriority.HIGH}>High</option>
          <option value={ActionPriority.URGENT}>Urgent</option>
        </select>
      </div>

      <div>
        <label>Due Date:</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Assign To (User ID):</label>
        <input
          type="text"
          value={formData.assignedTo}
          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          placeholder="Leave empty for unassigned"
        />
      </div>

      <button type="submit" disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create Action'}
      </button>
    </form>
  );
}

// =====================
// EXAMPLE 5: Overdue Actions Alert
// =====================

/**
 * Example: Display overdue actions with severity-based styling
 */
function OverdueActionsAlert() {
  const { overdueActions, getOverdueActions } = useFollowUpActions();

  const criticalActions = overdueActions.filter((alert) => alert.severity === 'critical');
  const warningActions = overdueActions.filter((alert) => alert.severity === 'warning');

  if (overdueActions.length === 0) {
    return null;
  }

  return (
    <div className="overdue-alerts">
      {criticalActions.length > 0 && (
        <div className="alert-critical">
          <h3>Critical Overdue Actions ({criticalActions.length})</h3>
          <ul>
            {criticalActions.map((alert) => (
              <li key={alert.action.id}>
                {alert.action.action} - {alert.daysOverdue} days overdue
              </li>
            ))}
          </ul>
        </div>
      )}

      {warningActions.length > 0 && (
        <div className="alert-warning">
          <h3>Overdue Actions ({warningActions.length})</h3>
          <ul>
            {warningActions.map((alert) => (
              <li key={alert.action.id}>
                {alert.action.action} - {alert.daysOverdue} days overdue
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// =====================
// EXAMPLE 6: Action Assignment
// =====================

/**
 * Example: Assign action to a user with permission check
 */
function AssignActionButton({ actionId, userId }: { actionId: string; userId: string }) {
  const { assignAction, canAssignAction, actions } = useFollowUpActions();

  const action = actions.find((a) => a.id === actionId);

  if (!action || !canAssignAction(action)) {
    return null;
  }

  const handleAssign = async () => {
    try {
      await assignAction(actionId, userId);
      alert('Action assigned successfully!');
    } catch (error: any) {
      alert(`Failed to assign action: ${error.message}`);
    }
  };

  return <button onClick={handleAssign}>Assign to User</button>;
}

// =====================
// EXAMPLE 7: Filter by Status
// =====================

/**
 * Example: Filter actions by specific statuses
 */
function FilterByStatusButtons() {
  const { setFilters, clearFilters, filters } = useFollowUpActions();

  return (
    <div className="status-filters">
      <button onClick={() => setFilters({ status: [ActionStatus.PENDING] })}>
        Show Pending
      </button>
      <button onClick={() => setFilters({ status: [ActionStatus.IN_PROGRESS] })}>
        Show In Progress
      </button>
      <button
        onClick={() =>
          setFilters({ status: [ActionStatus.PENDING, ActionStatus.IN_PROGRESS] })
        }
      >
        Show Active
      </button>
      <button onClick={() => setFilters({ status: [ActionStatus.COMPLETED] })}>
        Show Completed
      </button>
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  );
}

// =====================
// EXAMPLE 8: Sort Actions
// =====================

/**
 * Example: Sort actions by different criteria
 */
function SortActionsControls() {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useFollowUpActions();

  return (
    <div className="sort-controls">
      <label>Sort By:</label>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
        <option value="createdAt">Created Date</option>
      </select>

      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
      </button>
    </div>
  );
}

// =====================
// EXAMPLE 9: Complete Incident Details Page
// =====================

/**
 * Example: Full incident details page with follow-up actions
 */
function IncidentDetailsPage() {
  const { loadFollowUpActions, refreshActions } = useFollowUpActions();

  useEffect(() => {
    const incidentId = 'incident-123'; // Get from route params
    loadFollowUpActions(incidentId);
  }, [loadFollowUpActions]);

  return (
    <div className="incident-details">
      <h1>Incident Details</h1>

      {/* Incident Information */}
      <div className="incident-info">{/* ... incident details ... */}</div>

      {/* Overdue Alerts */}
      <OverdueActionsAlert />

      {/* Follow-Up Actions Section */}
      <div className="follow-up-section">
        <div className="section-header">
          <h2>Follow-Up Actions</h2>
          <button onClick={refreshActions}>Refresh</button>
        </div>

        <FilterByStatusButtons />
        <SortActionsControls />
        <FollowUpActionsList />
        <CreateFollowUpActionForm incidentId="incident-123" />
      </div>
    </div>
  );
}

// =====================
// EXAMPLE 10: Query Specific Actions
// =====================

/**
 * Example: Get actions by specific criteria
 */
function ActionsByPriority() {
  const { getActionsByPriority } = useFollowUpActions();

  const urgentActions = getActionsByPriority(ActionPriority.URGENT);
  const highActions = getActionsByPriority(ActionPriority.HIGH);

  return (
    <div>
      <h3>Urgent Actions ({urgentActions.length})</h3>
      <ul>
        {urgentActions.map((action) => (
          <li key={action.id}>{action.action}</li>
        ))}
      </ul>

      <h3>High Priority Actions ({highActions.length})</h3>
      <ul>
        {highActions.map((action) => (
          <li key={action.id}>{action.action}</li>
        ))}
      </ul>
    </div>
  );
}

// =====================
// EXAMPLE 11: Cancel Action with Reason
// =====================

/**
 * Example: Cancel an action with a reason
 */
function CancelActionButton({ actionId }: { actionId: string }) {
  const { cancelAction, isUpdating } = useFollowUpActions();

  const handleCancel = async () => {
    const reason = prompt('Please provide a reason for cancelling this action:');
    if (reason) {
      try {
        await cancelAction(actionId, reason);
        alert('Action cancelled successfully');
      } catch (error: any) {
        alert(`Failed to cancel action: ${error.message}`);
      }
    }
  };

  return (
    <button onClick={handleCancel} disabled={isUpdating}>
      {isUpdating ? 'Cancelling...' : 'Cancel Action'}
    </button>
  );
}

// Export examples for documentation
export {
  FollowUpActionsList,
  FollowUpActionItem,
  CreateFollowUpActionForm,
  OverdueActionsAlert,
  AssignActionButton,
  FilterByStatusButtons,
  SortActionsControls,
  IncidentDetailsPage,
  ActionsByPriority,
  CancelActionButton,
};
