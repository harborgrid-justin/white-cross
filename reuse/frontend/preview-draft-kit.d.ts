/**
 * @fileoverview Enterprise Content Preview & Draft Management Kit for React/Next.js
 * @module reuse/frontend/preview-draft-kit
 *
 * @description
 * Comprehensive preview and draft management system for content platforms.
 * Provides live preview, device simulation, draft versioning, real-time sync,
 * collaborative editing, preview sharing, annotations, and conflict resolution.
 *
 * @example
 * ```tsx
 * // Basic preview management
 * const { isPreview, exitPreview } = usePreviewMode();
 * const { draft, saveDraft, deleteDraft } = useDraft(contentId);
 *
 * // Device preview with responsive breakpoints
 * <PreviewDevice device="mobile" orientation="portrait">
 *   <YourContent />
 * </PreviewDevice>
 *
 * // Live preview with real-time sync
 * const { preview, sync } = useLivePreview({
 *   contentId,
 *   onUpdate: (data) => console.log('Content updated', data)
 * });
 *
 * // Draft auto-save with conflict resolution
 * const { autoSave, conflicts } = useDraftAutoSave({
 *   draftId,
 *   interval: 30000,
 *   onConflict: (conflict) => handleConflict(conflict)
 * });
 *
 * // Shareable preview with expiration
 * const { previewLink, token } = useShareablePreview({
 *   contentId,
 *   expiresIn: 86400,
 *   password: 'secure123'
 * });
 *
 * // Compare versions side-by-side
 * <SideBySidePreview
 *   leftVersion={draft}
 *   rightVersion={published}
 *   showDiff={true}
 * />
 * ```
 *
 * @author Enterprise Frontend Team
 * @copyright 2025 White Cross. All rights reserved.
 * @license MIT
 * @version 2.0.0
 */
import type { ReactNode, CSSProperties } from 'react';
/**
 * Preview mode enumeration
 */
export type PreviewMode = 'draft' | 'published' | 'scheduled' | 'archived' | 'comparison';
/**
 * Device type for preview simulation
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'watch' | 'tv' | 'custom';
/**
 * Device orientation
 */
export type DeviceOrientation = 'portrait' | 'landscape' | 'auto';
/**
 * Preview sync status
 */
export type PreviewSyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'conflict';
/**
 * Draft status enumeration
 */
export type DraftStatus = 'creating' | 'editing' | 'saving' | 'saved' | 'error' | 'conflict';
/**
 * Annotation type
 */
export type AnnotationType = 'comment' | 'highlight' | 'drawing' | 'suggestion' | 'issue';
/**
 * Preview access level
 */
export type PreviewAccessLevel = 'public' | 'authenticated' | 'password' | 'token' | 'private';
/**
 * Diff operation type
 */
export type DiffOperationType = 'insert' | 'delete' | 'replace' | 'move' | 'unchanged';
/**
 * Device viewport configuration
 */
export interface DeviceViewport {
    /** Device identifier */
    id: string;
    /** Display name */
    name: string;
    /** Device type */
    type: DeviceType;
    /** Viewport width in pixels */
    width: number;
    /** Viewport height in pixels */
    height: number;
    /** Device pixel ratio */
    pixelRatio: number;
    /** User agent string */
    userAgent: string;
    /** Touch support */
    hasTouch: boolean;
    /** Mobile device */
    isMobile: boolean;
    /** Default orientation */
    defaultOrientation: DeviceOrientation;
}
/**
 * Responsive breakpoint definition
 */
export interface PreviewBreakpoint {
    /** Breakpoint name */
    name: string;
    /** Minimum width in pixels */
    minWidth: number;
    /** Maximum width in pixels */
    maxWidth: number;
    /** Associated device type */
    deviceType: DeviceType;
    /** Icon identifier */
    icon?: string;
}
/**
 * Preview configuration
 */
export interface PreviewConfig {
    /** Preview mode */
    mode: PreviewMode;
    /** Target device */
    device?: DeviceType;
    /** Device orientation */
    orientation?: DeviceOrientation;
    /** Custom viewport dimensions */
    viewport?: {
        width: number;
        height: number;
    };
    /** Enable real-time sync */
    realtime?: boolean;
    /** Show preview frame/chrome */
    showFrame?: boolean;
    /** Enable annotations */
    enableAnnotations?: boolean;
    /** Preview base URL */
    baseUrl?: string;
    /** Custom headers for preview requests */
    headers?: Record<string, string>;
}
/**
 * Draft metadata
 */
export interface Draft<T = any> {
    /** Unique draft identifier */
    id: string;
    /** Content ID this draft belongs to */
    contentId: string;
    /** Draft title/name */
    title: string;
    /** Draft content data */
    content: T;
    /** Draft status */
    status: DraftStatus;
    /** Content hash for change detection */
    contentHash: string;
    /** Creator user ID */
    createdBy: string;
    /** Last editor user ID */
    updatedBy: string;
    /** Creation timestamp */
    createdAt: Date;
    /** Last update timestamp */
    updatedAt: Date;
    /** Auto-save enabled */
    autoSave: boolean;
    /** Auto-save interval in milliseconds */
    autoSaveInterval?: number;
    /** Last auto-save timestamp */
    lastAutoSave?: Date;
    /** Associated tags */
    tags: string[];
    /** Custom metadata */
    metadata: Record<string, any>;
    /** Parent draft ID (for branching) */
    parentId?: string;
    /** Conflict information if exists */
    conflict?: DraftConflict;
}
/**
 * Preview snapshot
 */
export interface PreviewSnapshot {
    /** Snapshot identifier */
    id: string;
    /** Draft or content ID */
    contentId: string;
    /** Snapshot timestamp */
    timestamp: Date;
    /** Snapshot content */
    content: any;
    /** Device configuration at snapshot time */
    device: DeviceViewport;
    /** Viewport configuration */
    viewport: {
        width: number;
        height: number;
    };
    /** Screenshot data URL (if captured) */
    screenshot?: string;
    /** User who created snapshot */
    createdBy: string;
    /** Snapshot notes */
    notes?: string;
}
/**
 * Preview annotation
 */
export interface PreviewAnnotation {
    /** Annotation identifier */
    id: string;
    /** Preview or draft ID */
    previewId: string;
    /** Annotation type */
    type: AnnotationType;
    /** Position data (varies by type) */
    position: {
        x: number;
        y: number;
        width?: number;
        height?: number;
        selector?: string;
    };
    /** Annotation content */
    content: string;
    /** Author user ID */
    authorId: string;
    /** Author display name */
    authorName: string;
    /** Creation timestamp */
    createdAt: Date;
    /** Resolved status */
    resolved: boolean;
    /** Resolution timestamp */
    resolvedAt?: Date;
    /** Resolved by user ID */
    resolvedBy?: string;
    /** Thread of replies */
    replies: AnnotationReply[];
    /** Highlighting color */
    color?: string;
    /** Custom metadata */
    metadata?: Record<string, any>;
}
/**
 * Annotation reply
 */
export interface AnnotationReply {
    /** Reply identifier */
    id: string;
    /** Reply content */
    content: string;
    /** Author user ID */
    authorId: string;
    /** Author display name */
    authorName: string;
    /** Creation timestamp */
    createdAt: Date;
}
/**
 * Draft conflict information
 */
export interface DraftConflict {
    /** Conflict identifier */
    id: string;
    /** Conflicting draft IDs */
    draftIds: [string, string];
    /** Conflict detection timestamp */
    detectedAt: Date;
    /** Conflicting fields */
    fields: ConflictField[];
    /** Resolution status */
    resolved: boolean;
    /** Resolution strategy used */
    resolutionStrategy?: 'ours' | 'theirs' | 'merge' | 'manual';
    /** Resolved timestamp */
    resolvedAt?: Date;
    /** Resolved by user ID */
    resolvedBy?: string;
}
/**
 * Individual field conflict
 */
export interface ConflictField {
    /** Field path (e.g., 'title', 'content.body') */
    path: string;
    /** Current draft value */
    ours: any;
    /** Conflicting draft value */
    theirs: any;
    /** Base/original value */
    base?: any;
    /** Resolution choice */
    resolution?: 'ours' | 'theirs' | 'custom';
    /** Custom resolved value */
    customValue?: any;
}
/**
 * Shareable preview token
 */
export interface PreviewToken {
    /** Token string */
    token: string;
    /** Preview/draft ID */
    contentId: string;
    /** Access level */
    accessLevel: PreviewAccessLevel;
    /** Creation timestamp */
    createdAt: Date;
    /** Expiration timestamp */
    expiresAt: Date;
    /** Password hash (if password-protected) */
    passwordHash?: string;
    /** Allowed IP addresses */
    allowedIPs?: string[];
    /** Maximum view count */
    maxViews?: number;
    /** Current view count */
    viewCount: number;
    /** Creator user ID */
    createdBy: string;
    /** Token metadata */
    metadata?: Record<string, any>;
}
/**
 * Preview link configuration
 */
export interface PreviewLinkConfig {
    /** Content/draft ID */
    contentId: string;
    /** Access level */
    accessLevel?: PreviewAccessLevel;
    /** Expiration in seconds */
    expiresIn?: number;
    /** Password protection */
    password?: string;
    /** Maximum views allowed */
    maxViews?: number;
    /** Allowed IP addresses */
    allowedIPs?: string[];
    /** Custom metadata */
    metadata?: Record<string, any>;
}
/**
 * Diff change
 */
export interface DiffChange {
    /** Change operation */
    operation: DiffOperationType;
    /** Field path */
    path: string;
    /** Old value */
    oldValue?: any;
    /** New value */
    newValue?: any;
    /** Position in content */
    position?: {
        start: number;
        end: number;
    };
    /** Change summary */
    summary: string;
}
/**
 * Version comparison result
 */
export interface VersionComparison {
    /** Left version ID */
    leftId: string;
    /** Right version ID */
    rightId: string;
    /** List of changes */
    changes: DiffChange[];
    /** Statistics */
    stats: {
        additions: number;
        deletions: number;
        modifications: number;
        unchanged: number;
    };
    /** Comparison timestamp */
    comparedAt: Date;
}
/**
 * Preview history entry
 */
export interface PreviewHistoryEntry {
    /** Entry identifier */
    id: string;
    /** Preview/draft ID */
    contentId: string;
    /** Action type */
    action: 'view' | 'edit' | 'share' | 'comment' | 'snapshot';
    /** Action timestamp */
    timestamp: Date;
    /** User who performed action */
    userId: string;
    /** User display name */
    userName: string;
    /** Device used */
    device?: DeviceViewport;
    /** Action details */
    details?: Record<string, any>;
}
/**
 * Auto-save configuration
 */
export interface AutoSaveConfig {
    /** Draft identifier */
    draftId: string;
    /** Auto-save interval in milliseconds */
    interval: number;
    /** Enable debouncing */
    debounce?: boolean;
    /** Debounce delay in milliseconds */
    debounceDelay?: number;
    /** Callback on save */
    onSave?: (draft: Draft) => void;
    /** Callback on error */
    onError?: (error: Error) => void;
    /** Callback on conflict */
    onConflict?: (conflict: DraftConflict) => void;
}
/**
 * Live preview configuration
 */
export interface LivePreviewConfig {
    /** Content identifier */
    contentId: string;
    /** WebSocket URL for real-time updates */
    websocketUrl?: string;
    /** Polling interval (fallback) in milliseconds */
    pollingInterval?: number;
    /** Update callback */
    onUpdate?: (data: any) => void;
    /** Connection status callback */
    onStatusChange?: (status: PreviewSyncStatus) => void;
    /** Error callback */
    onError?: (error: Error) => void;
}
/**
 * Draft list filter options
 */
export interface DraftListFilter {
    /** Filter by status */
    status?: DraftStatus[];
    /** Filter by creator */
    createdBy?: string[];
    /** Filter by tags */
    tags?: string[];
    /** Filter by date range */
    dateRange?: {
        start: Date;
        end: Date;
    };
    /** Search query */
    search?: string;
    /** Sort field */
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    /** Sort direction */
    sortOrder?: 'asc' | 'desc';
    /** Pagination limit */
    limit?: number;
    /** Pagination offset */
    offset?: number;
}
/**
 * Standard device viewport configurations
 */
export declare const DEVICE_VIEWPORTS: Record<string, DeviceViewport>;
/**
 * Standard responsive breakpoints
 */
export declare const PREVIEW_BREAKPOINTS: PreviewBreakpoint[];
/**
 * Hook for managing preview mode state
 *
 * @param initialMode - Initial preview mode
 * @returns Preview mode state and controls
 *
 * @example
 * ```tsx
 * const { isPreview, mode, enterPreview, exitPreview, setMode } = usePreviewMode();
 *
 * if (isPreview) {
 *   return <PreviewBanner onExit={exitPreview} mode={mode} />;
 * }
 * ```
 */
export declare function usePreviewMode(initialMode?: PreviewMode): {
    isPreview: any;
    mode: any;
    config: any;
    enterPreview: any;
    exitPreview: any;
    setMode: any;
    updateConfig: any;
};
/**
 * Hook for managing draft state
 *
 * @param contentId - Content identifier
 * @returns Draft state and management functions
 *
 * @example
 * ```tsx
 * const { draft, loading, saveDraft, deleteDraft, updateContent } = useDraft('content-123');
 *
 * const handleSave = async () => {
 *   await saveDraft({ title: 'Updated Draft' });
 * };
 * ```
 */
export declare function useDraft<T = any>(contentId: string): {
    draft: any;
    loading: any;
    error: any;
    isDirty: any;
    saveDraft: any;
    deleteDraft: any;
    updateContent: any;
    restoreDraft: any;
};
/**
 * Hook for generating and managing preview links
 *
 * @param config - Preview link configuration
 * @returns Preview link data and management functions
 *
 * @example
 * ```tsx
 * const { link, token, loading, generateLink, revokeLink } = usePreviewLink({
 *   contentId: 'content-123',
 *   expiresIn: 86400,
 *   password: 'secure123'
 * });
 *
 * console.log('Share this link:', link);
 * ```
 */
export declare function usePreviewLink(config: PreviewLinkConfig): {
    link: any;
    token: any;
    loading: any;
    error: any;
    generateLink: any;
    revokeLink: any;
    refreshLink: any;
};
/**
 * Hook for live preview with real-time synchronization
 *
 * @param config - Live preview configuration
 * @returns Preview data and sync controls
 *
 * @example
 * ```tsx
 * const { preview, status, sync, disconnect } = useLivePreview({
 *   contentId: 'content-123',
 *   onUpdate: (data) => console.log('Updated:', data)
 * });
 *
 * if (status === 'synced') {
 *   return <div>{preview.content}</div>;
 * }
 * ```
 */
export declare function useLivePreview(config: LivePreviewConfig): {
    preview: any;
    status: any;
    lastSync: any;
    sync: any;
    disconnect: any;
};
/**
 * Hook for draft auto-save functionality
 *
 * @param config - Auto-save configuration
 * @returns Auto-save state and controls
 *
 * @example
 * ```tsx
 * const { isSaving, lastSaved, conflicts } = useDraftAutoSave({
 *   draftId: 'draft-123',
 *   interval: 30000,
 *   onConflict: (conflict) => showConflictModal(conflict)
 * });
 *
 * return <div>Last saved: {lastSaved?.toLocaleString()}</div>;
 * ```
 */
export declare function useDraftAutoSave(config: AutoSaveConfig): {
    isSaving: any;
    lastSaved: any;
    conflicts: any;
    error: any;
    scheduleSave: any;
    resolveConflict: any;
    performSave: any;
};
/**
 * Hook for managing preview annotations
 *
 * @param previewId - Preview or draft ID
 * @returns Annotations state and management functions
 *
 * @example
 * ```tsx
 * const { annotations, addAnnotation, resolveAnnotation } = usePreviewAnnotations('preview-123');
 *
 * const handleAddComment = async (position, content) => {
 *   await addAnnotation({
 *     type: 'comment',
 *     position,
 *     content
 *   });
 * };
 * ```
 */
export declare function usePreviewAnnotations(previewId: string): {
    annotations: any;
    loading: any;
    error: any;
    addAnnotation: any;
    updateAnnotation: any;
    deleteAnnotation: any;
    resolveAnnotation: any;
    addReply: any;
};
/**
 * Hook for comparing versions/drafts
 *
 * @param leftId - Left version/draft ID
 * @param rightId - Right version/draft ID
 * @returns Comparison result and utilities
 *
 * @example
 * ```tsx
 * const { comparison, loading, refresh } = useVersionCompare(
 *   'draft-123',
 *   'published-456'
 * );
 *
 * console.log('Changes:', comparison?.changes.length);
 * ```
 */
export declare function useVersionCompare(leftId: string, rightId: string): {
    comparison: any;
    loading: any;
    error: any;
    refresh: any;
};
/**
 * Hook for managing preview history
 *
 * @param contentId - Content identifier
 * @returns History entries and utilities
 *
 * @example
 * ```tsx
 * const { history, loading, addEntry } = usePreviewHistory('content-123');
 *
 * console.log('Total views:', history.filter(h => h.action === 'view').length);
 * ```
 */
export declare function usePreviewHistory(contentId: string): {
    history: any;
    loading: any;
    error: any;
    addEntry: any;
};
/**
 * Preview panel component props
 */
export interface PreviewPanelProps {
    /** Panel content */
    children: ReactNode;
    /** Panel position */
    position?: 'left' | 'right' | 'top' | 'bottom';
    /** Panel width (for left/right) or height (for top/bottom) */
    size?: number | string;
    /** Resizable panel */
    resizable?: boolean;
    /** Collapsible panel */
    collapsible?: boolean;
    /** Initially collapsed */
    defaultCollapsed?: boolean;
    /** Panel title */
    title?: string;
    /** Custom className */
    className?: string;
    /** Custom styles */
    style?: CSSProperties;
}
/**
 * Preview panel component for side-by-side layouts
 *
 * @example
 * ```tsx
 * <PreviewPanel position="right" size="50%" resizable>
 *   <LivePreview contentId={id} />
 * </PreviewPanel>
 * ```
 */
export declare function PreviewPanel({ children, position, size, resizable, collapsible, defaultCollapsed, title, className, style, }: PreviewPanelProps): {
    panelRef: any;
};
/**
 * Preview frame component props
 */
export interface PreviewFrameProps {
    /** Frame content */
    children: ReactNode;
    /** Device viewport configuration */
    device?: DeviceViewport | string;
    /** Device orientation */
    orientation?: DeviceOrientation;
    /** Custom viewport dimensions */
    viewport?: {
        width: number;
        height: number;
    };
    /** Show device frame/chrome */
    showFrame?: boolean;
    /** Frame title */
    title?: string;
    /** Zoom level (0.1 to 2.0) */
    zoom?: number;
    /** Custom className */
    className?: string;
    /** Custom styles */
    style?: CSSProperties;
}
/**
 * Preview frame component for device simulation
 *
 * @example
 * ```tsx
 * <PreviewFrame device="iphone-12" orientation="portrait" showFrame>
 *   <YourApp />
 * </PreviewFrame>
 * ```
 */
export declare function PreviewFrame({ children, device, orientation, viewport, showFrame, title, zoom, className, style, }: PreviewFrameProps): any;
/**
 * Preview split view component props
 */
export interface PreviewSplitViewProps {
    /** Left panel content */
    left: ReactNode;
    /** Right panel content */
    right: ReactNode;
    /** Split direction */
    direction?: 'horizontal' | 'vertical';
    /** Initial split ratio (0-1) */
    defaultRatio?: number;
    /** Resizable split */
    resizable?: boolean;
    /** Custom className */
    className?: string;
    /** Custom styles */
    style?: CSSProperties;
}
/**
 * Split view component for side-by-side or top-bottom layouts
 *
 * @example
 * ```tsx
 * <PreviewSplitView
 *   left={<Editor />}
 *   right={<LivePreview />}
 *   resizable
 * />
 * ```
 */
export declare function PreviewSplitView({ left, right, direction, defaultRatio, resizable, className, style, }: PreviewSplitViewProps): {
    containerRef: any;
};
/**
 * Device preview component props
 */
export interface PreviewDeviceProps {
    /** Device content */
    children: ReactNode;
    /** Device type or viewport config */
    device?: DeviceType | DeviceViewport | string;
    /** Device orientation */
    orientation?: DeviceOrientation;
    /** Show device frame */
    showFrame?: boolean;
    /** Zoom level */
    zoom?: number;
    /** Custom className */
    className?: string;
}
/**
 * Device preview component with predefined device viewports
 *
 * @example
 * ```tsx
 * <PreviewDevice device="mobile" orientation="portrait">
 *   <MobileApp />
 * </PreviewDevice>
 * ```
 */
export declare function PreviewDevice({ children, device, orientation, showFrame, zoom, className, }: PreviewDeviceProps): {
    deviceConfig: any;
};
/**
 * Responsive preview component props
 */
export interface ResponsivePreviewProps {
    /** Preview content */
    children: ReactNode;
    /** Breakpoints to show */
    breakpoints?: PreviewBreakpoint[];
    /** Show all breakpoints simultaneously */
    showAll?: boolean;
    /** Custom className */
    className?: string;
}
/**
 * Responsive preview showing multiple breakpoints
 *
 * @example
 * ```tsx
 * <ResponsivePreview showAll>
 *   <YourResponsiveContent />
 * </ResponsivePreview>
 * ```
 */
export declare function ResponsivePreview({ children, breakpoints, showAll, className, }: ResponsivePreviewProps): any;
/**
 * Draft manager component props
 */
export interface DraftManagerProps {
    /** Content ID */
    contentId: string;
    /** Filter options */
    filter?: DraftListFilter;
    /** Draft selection callback */
    onSelect?: (draft: Draft) => void;
    /** Draft deletion callback */
    onDelete?: (draftId: string) => void;
    /** Custom className */
    className?: string;
}
/**
 * Draft manager component with list and controls
 *
 * @example
 * ```tsx
 * <DraftManager
 *   contentId="content-123"
 *   onSelect={(draft) => loadDraft(draft)}
 * />
 * ```
 */
export declare function DraftManager({ contentId, filter, onSelect, onDelete, className, }: DraftManagerProps): any;
/**
 * Side-by-side preview component props
 */
export interface SideBySidePreviewProps {
    /** Left version content */
    leftVersion: any;
    /** Right version content */
    rightVersion: any;
    /** Left version label */
    leftLabel?: string;
    /** Right version label */
    rightLabel?: string;
    /** Show diff highlighting */
    showDiff?: boolean;
    /** Custom render function */
    renderContent?: (content: any) => ReactNode;
    /** Custom className */
    className?: string;
}
/**
 * Side-by-side version comparison component
 *
 * @example
 * ```tsx
 * <SideBySidePreview
 *   leftVersion={draftContent}
 *   rightVersion={publishedContent}
 *   leftLabel="Draft"
 *   rightLabel="Published"
 *   showDiff
 * />
 * ```
 */
export declare function SideBySidePreview({ leftVersion, rightVersion, leftLabel, rightLabel, showDiff, renderContent, className, }: SideBySidePreviewProps): void;
/**
 * Preview banner component props
 */
export interface PreviewBannerProps {
    /** Preview mode */
    mode: PreviewMode;
    /** Exit callback */
    onExit: () => void;
    /** Additional actions */
    actions?: ReactNode;
    /** Custom message */
    message?: string;
    /** Custom className */
    className?: string;
}
/**
 * Preview mode banner/indicator component
 *
 * @example
 * ```tsx
 * <PreviewBanner
 *   mode="draft"
 *   onExit={exitPreview}
 *   actions={<button>Publish</button>}
 * />
 * ```
 */
export declare function PreviewBanner({ mode, onExit, actions, message, className, }: PreviewBannerProps): any;
/**
 * Create a new draft
 *
 * @param contentId - Content identifier
 * @param content - Draft content
 * @param metadata - Additional metadata
 * @returns Created draft
 *
 * @example
 * ```typescript
 * const draft = await createDraft('content-123', {
 *   title: 'My Draft',
 *   body: 'Content here...'
 * });
 * ```
 */
export declare function createDraft<T = any>(contentId: string, content: T, metadata?: Partial<Draft<T>>): Promise<Draft<T>>;
/**
 * Save draft changes
 *
 * @param draftId - Draft identifier
 * @param updates - Draft updates
 * @returns Updated draft
 *
 * @example
 * ```typescript
 * const updated = await saveDraft('draft-123', {
 *   content: newContent,
 *   title: 'Updated Title'
 * });
 * ```
 */
export declare function saveDraft<T = any>(draftId: string, updates: Partial<Draft<T>>): Promise<Draft<T>>;
/**
 * Delete a draft
 *
 * @param draftId - Draft identifier
 * @returns Deletion success
 *
 * @example
 * ```typescript
 * await deleteDraft('draft-123');
 * ```
 */
export declare function deleteDraft(draftId: string): Promise<void>;
/**
 * Restore a draft
 *
 * @param draftId - Draft identifier
 * @returns Restored draft
 *
 * @example
 * ```typescript
 * const restored = await restoreDraft('draft-123');
 * ```
 */
export declare function restoreDraft<T = any>(draftId: string): Promise<Draft<T>>;
/**
 * Generate shareable preview link
 *
 * @param config - Preview link configuration
 * @returns Preview link and token
 *
 * @example
 * ```typescript
 * const { link, token } = await generateShareablePreview({
 *   contentId: 'content-123',
 *   expiresIn: 86400,
 *   password: 'secret'
 * });
 * ```
 */
export declare function generateShareablePreview(config: PreviewLinkConfig): Promise<{
    link: string;
    token: PreviewToken;
}>;
/**
 * Verify preview token
 *
 * @param token - Preview token string
 * @param password - Optional password
 * @returns Token validation result
 *
 * @example
 * ```typescript
 * const isValid = await verifyPreviewToken('token-123', 'password');
 * if (isValid) {
 *   // Show preview
 * }
 * ```
 */
export declare function verifyPreviewToken(token: string, password?: string): Promise<{
    valid: boolean;
    contentId?: string;
    error?: string;
}>;
/**
 * Capture preview snapshot
 *
 * @param contentId - Content identifier
 * @param device - Device configuration
 * @param notes - Optional notes
 * @returns Created snapshot
 *
 * @example
 * ```typescript
 * const snapshot = await capturePreviewSnapshot(
 *   'content-123',
 *   DEVICE_VIEWPORTS.iphone12,
 *   'Mobile homepage view'
 * );
 * ```
 */
export declare function capturePreviewSnapshot(contentId: string, device: DeviceViewport, notes?: string): Promise<PreviewSnapshot>;
/**
 * Compare two versions and generate diff
 *
 * @param leftId - Left version ID
 * @param rightId - Right version ID
 * @returns Comparison result with changes
 *
 * @example
 * ```typescript
 * const comparison = await compareVersions('draft-123', 'published-456');
 * console.log(`${comparison.stats.additions} additions`);
 * ```
 */
export declare function compareVersions(leftId: string, rightId: string): Promise<VersionComparison>;
/**
 * Resolve draft conflict
 *
 * @param conflictId - Conflict identifier
 * @param resolution - Resolution strategy
 * @param customFields - Custom field resolutions
 * @returns Resolved draft
 *
 * @example
 * ```typescript
 * await resolveDraftConflict('conflict-123', 'ours');
 * // or with custom resolution
 * await resolveDraftConflict('conflict-123', 'merge', customFields);
 * ```
 */
export declare function resolveDraftConflict(conflictId: string, resolution: 'ours' | 'theirs' | 'merge', customFields?: ConflictField[]): Promise<Draft>;
/**
 * Get preview URL with parameters
 *
 * @param contentId - Content identifier
 * @param mode - Preview mode
 * @param options - Additional options
 * @returns Preview URL
 *
 * @example
 * ```typescript
 * const url = getPreviewUrl('content-123', 'draft', {
 *   device: 'mobile',
 *   token: 'preview-token-123'
 * });
 * ```
 */
export declare function getPreviewUrl(contentId: string, mode?: PreviewMode, options?: {
    device?: DeviceType;
    token?: string;
    baseUrl?: string;
}): string;
/**
 * Calculate content hash for change detection
 *
 * @param content - Content to hash
 * @returns Content hash string
 *
 * @example
 * ```typescript
 * const hash1 = calculateContentHash(content1);
 * const hash2 = calculateContentHash(content2);
 * if (hash1 !== hash2) {
 *   console.log('Content changed');
 * }
 * ```
 */
export declare function calculateContentHash(content: any): string;
/**
 * Check if preview token is expired
 *
 * @param token - Preview token
 * @returns True if expired
 *
 * @example
 * ```typescript
 * if (isPreviewExpired(token)) {
 *   console.log('Token expired');
 * }
 * ```
 */
export declare function isPreviewExpired(token: PreviewToken): boolean;
/**
 * Get device viewport by name or type
 *
 * @param deviceOrType - Device name or type
 * @returns Device viewport configuration
 *
 * @example
 * ```typescript
 * const device = getDeviceViewport('mobile');
 * console.log(device.width, device.height);
 * ```
 */
export declare function getDeviceViewport(deviceOrType: string): DeviceViewport | undefined;
/**
 * Get current breakpoint for viewport width
 *
 * @param width - Viewport width
 * @param breakpoints - Breakpoint definitions
 * @returns Current breakpoint
 *
 * @example
 * ```typescript
 * const bp = getCurrentBreakpoint(768);
 * console.log(bp.name); // 'tablet'
 * ```
 */
export declare function getCurrentBreakpoint(width: number, breakpoints?: PreviewBreakpoint[]): PreviewBreakpoint | undefined;
/**
 * Format preview link with password hint
 *
 * @param link - Preview link
 * @param hasPassword - Whether link is password protected
 * @returns Formatted link message
 *
 * @example
 * ```typescript
 * const message = formatPreviewLink(link, true);
 * // "Preview link: https://... (Password required)"
 * ```
 */
export declare function formatPreviewLink(link: string, hasPassword?: boolean): string;
/**
 * Exit preview mode and clean up
 *
 * @example
 * ```typescript
 * exitPreviewMode(); // Redirects to normal view
 * ```
 */
export declare function exitPreviewMode(): void;
/**
 * Check if currently in preview mode
 *
 * @returns True if in preview mode
 *
 * @example
 * ```typescript
 * if (isInPreviewMode()) {
 *   showPreviewBanner();
 * }
 * ```
 */
export declare function isInPreviewMode(): boolean;
declare const _default: {
    usePreviewMode: typeof usePreviewMode;
    useDraft: typeof useDraft;
    usePreviewLink: typeof usePreviewLink;
    useLivePreview: typeof useLivePreview;
    useDraftAutoSave: typeof useDraftAutoSave;
    usePreviewAnnotations: typeof usePreviewAnnotations;
    useVersionCompare: typeof useVersionCompare;
    usePreviewHistory: typeof usePreviewHistory;
    PreviewPanel: typeof PreviewPanel;
    PreviewFrame: typeof PreviewFrame;
    PreviewSplitView: typeof PreviewSplitView;
    PreviewDevice: typeof PreviewDevice;
    ResponsivePreview: typeof ResponsivePreview;
    DraftManager: typeof DraftManager;
    SideBySidePreview: typeof SideBySidePreview;
    PreviewBanner: typeof PreviewBanner;
    createDraft: typeof createDraft;
    saveDraft: typeof saveDraft;
    deleteDraft: typeof deleteDraft;
    restoreDraft: typeof restoreDraft;
    generateShareablePreview: typeof generateShareablePreview;
    verifyPreviewToken: typeof verifyPreviewToken;
    capturePreviewSnapshot: typeof capturePreviewSnapshot;
    compareVersions: typeof compareVersions;
    resolveDraftConflict: typeof resolveDraftConflict;
    getPreviewUrl: typeof getPreviewUrl;
    calculateContentHash: typeof calculateContentHash;
    isPreviewExpired: typeof isPreviewExpired;
    getDeviceViewport: typeof getDeviceViewport;
    getCurrentBreakpoint: typeof getCurrentBreakpoint;
    formatPreviewLink: typeof formatPreviewLink;
    exitPreviewMode: typeof exitPreviewMode;
    isInPreviewMode: typeof isInPreviewMode;
    DEVICE_VIEWPORTS: Record<string, DeviceViewport>;
    PREVIEW_BREAKPOINTS: PreviewBreakpoint[];
};
export default _default;
//# sourceMappingURL=preview-draft-kit.d.ts.map