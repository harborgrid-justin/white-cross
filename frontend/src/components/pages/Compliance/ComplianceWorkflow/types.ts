/**
 * Type definitions for ComplianceWorkflow components
 * Extracted from ComplianceWorkflow.tsx for better organization and reusability
 */

/**
 * Workflow status for tracking execution
 */
export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed' | 'cancelled'

/**
 * Workflow step status
 */
export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped' | 'cancelled'

/**
 * Workflow trigger type
 */
export type TriggerType = 'manual' | 'scheduled' | 'event' | 'conditional' | 'webhook'

/**
 * Workflow priority level
 */
export type WorkflowPriority = 'critical' | 'high' | 'medium' | 'low'

/**
 * Step action type
 */
export type StepAction =
  | 'approval'
  | 'review'
  | 'notification'
  | 'document'
  | 'assessment'
  | 'training'
  | 'audit'
  | 'custom'

/**
 * Workflow step interface
 */
export interface WorkflowStep {
  id: string
  name: string
  description: string
  action: StepAction
  status: StepStatus
  assignedTo?: string
  assignedGroup?: string
  dueDate?: string
  completedDate?: string
  completedBy?: string
  duration?: number // in hours
  prerequisites: string[]
  approvalRequired: boolean
  autoComplete: boolean
  conditions: string[]
  notes: string
  attachments: string[]
  order: number
}

/**
 * Workflow execution log entry
 */
export interface WorkflowLogEntry {
  id: string
  timestamp: string
  stepId: string
  action: string
  user: string
  details: string
  status: 'success' | 'warning' | 'error' | 'info'
}

/**
 * Compliance workflow interface
 */
export interface ComplianceWorkflow {
  id: string
  name: string
  description: string
  category: string
  status: WorkflowStatus
  priority: WorkflowPriority
  trigger: TriggerType
  createdBy: string
  createdDate: string
  lastModified: string
  lastRun?: string
  nextRun?: string
  completionRate: number
  averageExecutionTime: number
  steps: WorkflowStep[]
  logs: WorkflowLogEntry[]
  isTemplate: boolean
  tags: string[]
  participants: string[]
  approvers: string[]
  notifications: string[]
  retryPolicy: {
    maxRetries: number
    retryDelay: number
    escalationEnabled: boolean
  }
}

/**
 * Props for the ComplianceWorkflow component
 */
export interface ComplianceWorkflowProps {
  /** Array of compliance workflows to display */
  workflows?: ComplianceWorkflow[]
  /** Callback when a workflow is selected */
  onWorkflowSelect?: (workflow: ComplianceWorkflow) => void
  /** Callback when creating a new workflow */
  onCreateWorkflow?: () => void
  /** Callback when starting a workflow */
  onStartWorkflow?: (workflowId: string) => void
  /** Callback when pausing a workflow */
  onPauseWorkflow?: (workflowId: string) => void
  /** Callback when stopping a workflow */
  onStopWorkflow?: (workflowId: string) => void
  /** Loading state */
  loading?: boolean
  /** Error state */
  error?: string | null
  /** Additional CSS classes */
  className?: string
}

/**
 * Workflow statistics interface
 */
export interface WorkflowStats {
  total: number
  active: number
  completed: number
  failed: number
  paused: number
  avgCompletionRate: number
  avgExecutionTime: number
}
