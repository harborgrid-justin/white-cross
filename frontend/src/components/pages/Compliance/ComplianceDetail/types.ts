import { ComplianceRequirement, ComplianceStatus, CompliancePriority } from '../ComplianceCard';

/**
 * Tab types for detail view navigation
 */
export type DetailTab = 'overview' | 'tasks' | 'evidence' | 'history' | 'comments' | 'settings';

/**
 * Comment interface for compliance requirement discussions
 */
export interface ComplianceComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  isSystem: boolean;
  mentions?: string[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: number;
  }[];
}

/**
 * History entry interface for tracking requirement changes
 */
export interface ComplianceHistoryEntry {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  performedByName: string;
  timestamp: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  metadata?: Record<string, unknown>;
}

/**
 * User interface for assignment and collaboration
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Edit form state for inline editing
 */
export interface EditFormState {
  title: string;
  description: string;
  dueDate: string;
  priority: CompliancePriority;
  assignedTo: string;
}

/**
 * Props for the main ComplianceDetail component
 */
export interface ComplianceDetailProps {
  /** Compliance requirement data */
  requirement: ComplianceRequirement;
  /** Comments for the requirement */
  comments?: ComplianceComment[];
  /** History entries for the requirement */
  history?: ComplianceHistoryEntry[];
  /** Available users for assignment */
  users?: User[];
  /** Loading state */
  loading?: boolean;
  /** Edit mode state */
  editMode?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Edit mode toggle handler */
  onEditModeToggle?: (editMode: boolean) => void;
  /** Save changes handler */
  onSaveChanges?: (changes: Partial<ComplianceRequirement>) => void;
  /** Task completion toggle handler */
  onToggleTask?: (taskId: string, completed: boolean) => void;
  /** Add task handler */
  onAddTask?: (title: string, dueDate?: string) => void;
  /** Delete task handler */
  onDeleteTask?: (taskId: string) => void;
  /** Upload evidence handler */
  onUploadEvidence?: (files: FileList) => void;
  /** Download evidence handler */
  onDownloadEvidence?: (evidenceId: string) => void;
  /** Delete evidence handler */
  onDeleteEvidence?: (evidenceId: string) => void;
  /** Add comment handler */
  onAddComment?: (content: string, mentions?: string[]) => void;
  /** Delete comment handler */
  onDeleteComment?: (commentId: string) => void;
  /** Share requirement handler */
  onShare?: () => void;
  /** Assignment change handler */
  onAssignmentChange?: (userId: string) => void;
  /** Status change handler */
  onStatusChange?: (status: ComplianceStatus) => void;
  /** Priority change handler */
  onPriorityChange?: (priority: CompliancePriority) => void;
}

/**
 * Props for ComplianceOverview tab component
 */
export interface ComplianceOverviewProps {
  requirement: ComplianceRequirement;
  users: User[];
  editMode: boolean;
  editForm: EditFormState;
  expandedSections: Record<string, boolean>;
  onEditFormChange: (updates: Partial<EditFormState>) => void;
  onToggleSection: (section: string) => void;
}

/**
 * Props for ComplianceTasks tab component
 */
export interface ComplianceTasksProps {
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
  }>;
  onToggleTask?: (taskId: string, completed: boolean) => void;
  onAddTask?: (title: string, dueDate?: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

/**
 * Props for ComplianceEvidence tab component
 */
export interface ComplianceEvidenceProps {
  evidence: Array<{
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    uploadedBy?: string;
  }>;
  onUploadEvidence?: (files: FileList) => void;
  onDownloadEvidence?: (evidenceId: string) => void;
  onDeleteEvidence?: (evidenceId: string) => void;
}

/**
 * Props for ComplianceHistory tab component
 */
export interface ComplianceHistoryProps {
  history: ComplianceHistoryEntry[];
}

/**
 * Props for ComplianceComments tab component
 */
export interface ComplianceCommentsProps {
  comments: ComplianceComment[];
  onAddComment?: (content: string, mentions?: string[]) => void;
  onDeleteComment?: (commentId: string) => void;
}

/**
 * Props for ComplianceSettings tab component
 */
export interface ComplianceSettingsProps {
  requirement: ComplianceRequirement;
  onStatusChange?: (status: ComplianceStatus) => void;
}
