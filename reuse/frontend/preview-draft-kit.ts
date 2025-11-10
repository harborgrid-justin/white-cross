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

'use client';

import { useState, useEffect, useCallback, useRef, useMemo, useReducer } from 'react';
import type { ReactNode, CSSProperties } from 'react';

/* ========================================================================
   TYPE DEFINITIONS
   ======================================================================== */

/**
 * Preview mode enumeration
 */
export type PreviewMode =
  | 'draft'
  | 'published'
  | 'scheduled'
  | 'archived'
  | 'comparison';

/**
 * Device type for preview simulation
 */
export type DeviceType =
  | 'mobile'
  | 'tablet'
  | 'desktop'
  | 'watch'
  | 'tv'
  | 'custom';

/**
 * Device orientation
 */
export type DeviceOrientation =
  | 'portrait'
  | 'landscape'
  | 'auto';

/**
 * Preview sync status
 */
export type PreviewSyncStatus =
  | 'idle'
  | 'syncing'
  | 'synced'
  | 'error'
  | 'conflict';

/**
 * Draft status enumeration
 */
export type DraftStatus =
  | 'creating'
  | 'editing'
  | 'saving'
  | 'saved'
  | 'error'
  | 'conflict';

/**
 * Annotation type
 */
export type AnnotationType =
  | 'comment'
  | 'highlight'
  | 'drawing'
  | 'suggestion'
  | 'issue';

/**
 * Preview access level
 */
export type PreviewAccessLevel =
  | 'public'
  | 'authenticated'
  | 'password'
  | 'token'
  | 'private';

/**
 * Diff operation type
 */
export type DiffOperationType =
  | 'insert'
  | 'delete'
  | 'replace'
  | 'move'
  | 'unchanged';

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
  viewport?: { width: number; height: number };
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
  viewport: { width: number; height: number };
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
  position?: { start: number; end: number };
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
  dateRange?: { start: Date; end: Date };
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

/* ========================================================================
   PREDEFINED DEVICE VIEWPORTS
   ======================================================================== */

/**
 * Standard device viewport configurations
 */
export const DEVICE_VIEWPORTS: Record<string, DeviceViewport> = {
  // Mobile devices
  iphoneSE: {
    id: 'iphone-se',
    name: 'iPhone SE',
    type: 'mobile',
    width: 375,
    height: 667,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    hasTouch: true,
    isMobile: true,
    defaultOrientation: 'portrait',
  },
  iphone12: {
    id: 'iphone-12',
    name: 'iPhone 12/13/14',
    type: 'mobile',
    width: 390,
    height: 844,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    hasTouch: true,
    isMobile: true,
    defaultOrientation: 'portrait',
  },
  iphone14ProMax: {
    id: 'iphone-14-pro-max',
    name: 'iPhone 14 Pro Max',
    type: 'mobile',
    width: 430,
    height: 932,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    hasTouch: true,
    isMobile: true,
    defaultOrientation: 'portrait',
  },
  pixel5: {
    id: 'pixel-5',
    name: 'Google Pixel 5',
    type: 'mobile',
    width: 393,
    height: 851,
    pixelRatio: 2.75,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5)',
    hasTouch: true,
    isMobile: true,
    defaultOrientation: 'portrait',
  },
  galaxyS21: {
    id: 'galaxy-s21',
    name: 'Samsung Galaxy S21',
    type: 'mobile',
    width: 360,
    height: 800,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)',
    hasTouch: true,
    isMobile: true,
    defaultOrientation: 'portrait',
  },

  // Tablets
  ipadMini: {
    id: 'ipad-mini',
    name: 'iPad Mini',
    type: 'tablet',
    width: 768,
    height: 1024,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)',
    hasTouch: true,
    isMobile: false,
    defaultOrientation: 'portrait',
  },
  ipadAir: {
    id: 'ipad-air',
    name: 'iPad Air',
    type: 'tablet',
    width: 820,
    height: 1180,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)',
    hasTouch: true,
    isMobile: false,
    defaultOrientation: 'portrait',
  },
  ipadPro: {
    id: 'ipad-pro',
    name: 'iPad Pro 12.9"',
    type: 'tablet',
    width: 1024,
    height: 1366,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)',
    hasTouch: true,
    isMobile: false,
    defaultOrientation: 'portrait',
  },

  // Desktop
  desktop1080: {
    id: 'desktop-1080',
    name: 'Desktop 1080p',
    type: 'desktop',
    width: 1920,
    height: 1080,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    hasTouch: false,
    isMobile: false,
    defaultOrientation: 'landscape',
  },
  desktop1440: {
    id: 'desktop-1440',
    name: 'Desktop 1440p',
    type: 'desktop',
    width: 2560,
    height: 1440,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    hasTouch: false,
    isMobile: false,
    defaultOrientation: 'landscape',
  },
  desktop4k: {
    id: 'desktop-4k',
    name: 'Desktop 4K',
    type: 'desktop',
    width: 3840,
    height: 2160,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    hasTouch: false,
    isMobile: false,
    defaultOrientation: 'landscape',
  },
};

/**
 * Standard responsive breakpoints
 */
export const PREVIEW_BREAKPOINTS: PreviewBreakpoint[] = [
  { name: 'mobile', minWidth: 0, maxWidth: 767, deviceType: 'mobile', icon: 'smartphone' },
  { name: 'tablet', minWidth: 768, maxWidth: 1023, deviceType: 'tablet', icon: 'tablet' },
  { name: 'desktop', minWidth: 1024, maxWidth: 1439, deviceType: 'desktop', icon: 'monitor' },
  { name: 'wide', minWidth: 1440, maxWidth: Infinity, deviceType: 'desktop', icon: 'tv' },
];

/* ========================================================================
   CORE HOOKS
   ======================================================================== */

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
export function usePreviewMode(initialMode?: PreviewMode) {
  const [isPreview, setIsPreview] = useState(false);
  const [mode, setMode] = useState<PreviewMode>(initialMode || 'draft');
  const [config, setConfig] = useState<PreviewConfig>({ mode: mode });

  const enterPreview = useCallback((newMode?: PreviewMode, newConfig?: Partial<PreviewConfig>) => {
    setIsPreview(true);
    if (newMode) setMode(newMode);
    if (newConfig) {
      setConfig(prev => ({ ...prev, ...newConfig, mode: newMode || prev.mode }));
    }
  }, []);

  const exitPreview = useCallback(() => {
    setIsPreview(false);
    // Optionally redirect or refresh
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('preview');
      url.searchParams.delete('draft');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const updateConfig = useCallback((updates: Partial<PreviewConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Check URL params for preview mode on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('preview') || params.has('draft')) {
        setIsPreview(true);
        const previewMode = params.get('mode') as PreviewMode;
        if (previewMode) setMode(previewMode);
      }
    }
  }, []);

  return {
    isPreview,
    mode,
    config,
    enterPreview,
    exitPreview,
    setMode,
    updateConfig,
  };
}

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
export function useDraft<T = any>(contentId: string) {
  const [draft, setDraft] = useState<Draft<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Load draft on mount
  useEffect(() => {
    let mounted = true;

    const loadDraft = async () => {
      try {
        setLoading(true);
        // Simulate API call - replace with actual implementation
        const response = await fetch(`/api/drafts/${contentId}`);
        if (!response.ok) throw new Error('Failed to load draft');
        const data = await response.json();

        if (mounted) {
          setDraft(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDraft();

    return () => {
      mounted = false;
    };
  }, [contentId]);

  const saveDraft = useCallback(async (updates?: Partial<Draft<T>>) => {
    if (!draft) throw new Error('No draft to save');

    try {
      const updatedDraft = { ...draft, ...updates, updatedAt: new Date() };

      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/drafts/${draft.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDraft),
      });

      if (!response.ok) throw new Error('Failed to save draft');

      const savedDraft = await response.json();
      setDraft(savedDraft);
      setIsDirty(false);
      return savedDraft;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [draft]);

  const deleteDraft = useCallback(async () => {
    if (!draft) throw new Error('No draft to delete');

    try {
      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/drafts/${draft.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete draft');

      setDraft(null);
      setIsDirty(false);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [draft]);

  const updateContent = useCallback((content: T) => {
    if (!draft) return;
    setDraft(prev => prev ? { ...prev, content, updatedAt: new Date() } : null);
    setIsDirty(true);
  }, [draft]);

  const restoreDraft = useCallback(async (draftId: string) => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/drafts/${draftId}/restore`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to restore draft');

      const restoredDraft = await response.json();
      setDraft(restoredDraft);
      setIsDirty(false);
      return restoredDraft;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    draft,
    loading,
    error,
    isDirty,
    saveDraft,
    deleteDraft,
    updateContent,
    restoreDraft,
  };
}

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
export function usePreviewLink(config: PreviewLinkConfig) {
  const [link, setLink] = useState<string | null>(null);
  const [token, setToken] = useState<PreviewToken | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateLink = useCallback(async (customConfig?: Partial<PreviewLinkConfig>) => {
    const finalConfig = { ...config, ...customConfig };

    try {
      setLoading(true);
      // Simulate API call - replace with actual implementation
      const response = await fetch('/api/preview/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalConfig),
      });

      if (!response.ok) throw new Error('Failed to generate preview link');

      const data = await response.json();
      setToken(data.token);
      setLink(data.link);
      setError(null);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [config]);

  const revokeLink = useCallback(async () => {
    if (!token) throw new Error('No token to revoke');

    try {
      setLoading(true);
      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/preview/links/${token.token}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to revoke link');

      setLink(null);
      setToken(null);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const refreshLink = useCallback(async () => {
    return generateLink();
  }, [generateLink]);

  return {
    link,
    token,
    loading,
    error,
    generateLink,
    revokeLink,
    refreshLink,
  };
}

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
export function useLivePreview(config: LivePreviewConfig) {
  const [preview, setPreview] = useState<any>(null);
  const [status, setStatus] = useState<PreviewSyncStatus>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const sync = useCallback(async () => {
    try {
      setStatus('syncing');

      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/preview/${config.contentId}`);
      if (!response.ok) throw new Error('Failed to sync preview');

      const data = await response.json();
      setPreview(data);
      setStatus('synced');
      setLastSync(new Date());

      config.onUpdate?.(data);
    } catch (err) {
      setStatus('error');
      config.onError?.(err as Error);
    }
  }, [config]);

  const connectWebSocket = useCallback(() => {
    if (!config.websocketUrl) return;

    try {
      const ws = new WebSocket(config.websocketUrl);

      ws.onopen = () => {
        setStatus('synced');
        config.onStatusChange?.('synced');
        ws.send(JSON.stringify({ type: 'subscribe', contentId: config.contentId }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setPreview(data);
        setLastSync(new Date());
        config.onUpdate?.(data);
      };

      ws.onerror = () => {
        setStatus('error');
        config.onStatusChange?.('error');
      };

      ws.onclose = () => {
        setStatus('idle');
        config.onStatusChange?.('idle');
      };

      wsRef.current = ws;
    } catch (err) {
      config.onError?.(err as Error);
      setStatus('error');
    }
  }, [config]);

  const startPolling = useCallback(() => {
    const interval = config.pollingInterval || 5000;

    pollingRef.current = setInterval(() => {
      sync();
    }, interval);
  }, [config.pollingInterval, sync]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    setStatus('idle');
  }, []);

  // Initialize connection
  useEffect(() => {
    if (config.websocketUrl) {
      connectWebSocket();
    } else {
      startPolling();
      sync(); // Initial sync
    }

    return () => {
      disconnect();
    };
  }, [config.websocketUrl, config.contentId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    preview,
    status,
    lastSync,
    sync,
    disconnect,
  };
}

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
export function useDraftAutoSave(config: AutoSaveConfig) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [conflicts, setConflicts] = useState<DraftConflict[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<any>(null);

  const performSave = useCallback(async () => {
    if (!contentRef.current) return;

    try {
      setIsSaving(true);
      setError(null);

      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/drafts/${config.draftId}/autosave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: contentRef.current }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          // Conflict detected
          const conflictData = await response.json();
          setConflicts(prev => [...prev, conflictData.conflict]);
          config.onConflict?.(conflictData.conflict);
          return;
        }
        throw new Error('Auto-save failed');
      }

      const savedDraft = await response.json();
      setLastSaved(new Date());
      config.onSave?.(savedDraft);
    } catch (err) {
      setError(err as Error);
      config.onError?.(err as Error);
    } finally {
      setIsSaving(false);
    }
  }, [config]);

  const scheduleSave = useCallback((content: any) => {
    contentRef.current = content;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    const delay = config.debounce ? (config.debounceDelay || 1000) : 0;

    saveTimeoutRef.current = setTimeout(() => {
      performSave();
    }, delay);
  }, [config.debounce, config.debounceDelay, performSave]);

  const resolveConflict = useCallback(async (
    conflictId: string,
    resolution: 'ours' | 'theirs' | 'merge',
    customFields?: ConflictField[]
  ) => {
    try {
      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/drafts/${config.draftId}/conflicts/${conflictId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution, customFields }),
      });

      if (!response.ok) throw new Error('Failed to resolve conflict');

      setConflicts(prev => prev.filter(c => c.id !== conflictId));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [config.draftId]);

  // Set up auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (contentRef.current) {
        performSave();
      }
    }, config.interval);

    return () => {
      clearInterval(interval);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [config.interval, performSave]);

  return {
    isSaving,
    lastSaved,
    conflicts,
    error,
    scheduleSave,
    resolveConflict,
    performSave,
  };
}

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
export function usePreviewAnnotations(previewId: string) {
  const [annotations, setAnnotations] = useState<PreviewAnnotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load annotations
  useEffect(() => {
    let mounted = true;

    const loadAnnotations = async () => {
      try {
        setLoading(true);
        // Simulate API call - replace with actual implementation
        const response = await fetch(`/api/preview/${previewId}/annotations`);
        if (!response.ok) throw new Error('Failed to load annotations');

        const data = await response.json();
        if (mounted) {
          setAnnotations(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAnnotations();

    return () => {
      mounted = false;
    };
  }, [previewId]);

  const addAnnotation = useCallback(async (
    annotationData: Omit<PreviewAnnotation, 'id' | 'previewId' | 'createdAt' | 'resolved' | 'replies'>
  ) => {
    try {
      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/preview/${previewId}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(annotationData),
      });

      if (!response.ok) throw new Error('Failed to add annotation');

      const newAnnotation = await response.json();
      setAnnotations(prev => [...prev, newAnnotation]);
      return newAnnotation;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [previewId]);

  const updateAnnotation = useCallback(async (
    annotationId: string,
    updates: Partial<PreviewAnnotation>
  ) => {
    try {
      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/preview/${previewId}/annotations/${annotationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update annotation');

      const updated = await response.json();
      setAnnotations(prev => prev.map(a => a.id === annotationId ? updated : a));
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [previewId]);

  const deleteAnnotation = useCallback(async (annotationId: string) => {
    try {
      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/preview/${previewId}/annotations/${annotationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete annotation');

      setAnnotations(prev => prev.filter(a => a.id !== annotationId));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [previewId]);

  const resolveAnnotation = useCallback(async (annotationId: string) => {
    return updateAnnotation(annotationId, {
      resolved: true,
      resolvedAt: new Date(),
    });
  }, [updateAnnotation]);

  const addReply = useCallback(async (
    annotationId: string,
    replyContent: string,
    authorId: string,
    authorName: string
  ) => {
    try {
      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/preview/${previewId}/annotations/${annotationId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent, authorId, authorName }),
      });

      if (!response.ok) throw new Error('Failed to add reply');

      const newReply = await response.json();
      setAnnotations(prev => prev.map(a =>
        a.id === annotationId
          ? { ...a, replies: [...a.replies, newReply] }
          : a
      ));
      return newReply;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [previewId]);

  return {
    annotations,
    loading,
    error,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    resolveAnnotation,
    addReply,
  };
}

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
export function useVersionCompare(leftId: string, rightId: string) {
  const [comparison, setComparison] = useState<VersionComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const compare = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/compare?left=${leftId}&right=${rightId}`);
      if (!response.ok) throw new Error('Failed to compare versions');

      const data = await response.json();
      setComparison(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [leftId, rightId]);

  useEffect(() => {
    compare();
  }, [compare]);

  const refresh = useCallback(() => {
    return compare();
  }, [compare]);

  return {
    comparison,
    loading,
    error,
    refresh,
  };
}

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
export function usePreviewHistory(contentId: string) {
  const [history, setHistory] = useState<PreviewHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
      try {
        setLoading(true);
        // Simulate API call - replace with actual implementation
        const response = await fetch(`/api/preview/${contentId}/history`);
        if (!response.ok) throw new Error('Failed to load history');

        const data = await response.json();
        if (mounted) {
          setHistory(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      mounted = false;
    };
  }, [contentId]);

  const addEntry = useCallback(async (
    action: PreviewHistoryEntry['action'],
    details?: Record<string, any>
  ) => {
    try {
      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/preview/${contentId}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, details }),
      });

      if (!response.ok) throw new Error('Failed to add history entry');

      const newEntry = await response.json();
      setHistory(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [contentId]);

  return {
    history,
    loading,
    error,
    addEntry,
  };
}

/* ========================================================================
   COMPONENT FUNCTIONS
   ======================================================================== */

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
export function PreviewPanel({
  children,
  position = 'right',
  size = '50%',
  resizable = false,
  collapsible = false,
  defaultCollapsed = false,
  title,
  className = '',
  style = {},
}: PreviewPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [currentSize, setCurrentSize] = useState(size);
  const panelRef = useRef<HTMLDivElement>(null);

  const isHorizontal = position === 'left' || position === 'right';

  const panelStyle: CSSProperties = {
    ...style,
    position: 'relative',
    [isHorizontal ? 'width' : 'height']: isCollapsed ? 0 : currentSize,
    overflow: isCollapsed ? 'hidden' : 'auto',
    transition: 'all 0.3s ease',
    borderLeft: position === 'right' ? '1px solid #e5e7eb' : undefined,
    borderRight: position === 'left' ? '1px solid #e5e7eb' : undefined,
    borderTop: position === 'bottom' ? '1px solid #e5e7eb' : undefined,
    borderBottom: position === 'top' ? '1px solid #e5e7eb' : undefined,
  };

  return (
    <div ref={panelRef} className={`preview-panel ${className}`} style={panelStyle}>
      {title && (
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 600,
        }}>
          <span>{title}</span>
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {isCollapsed ? '▶' : '◀'}
            </button>
          )}
        </div>
      )}
      {!isCollapsed && children}
    </div>
  );
}

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
  viewport?: { width: number; height: number };
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
export function PreviewFrame({
  children,
  device,
  orientation = 'portrait',
  viewport,
  showFrame = true,
  title,
  zoom = 1,
  className = '',
  style = {},
}: PreviewFrameProps) {
  const deviceConfig = typeof device === 'string'
    ? DEVICE_VIEWPORTS[device]
    : device;

  const finalOrientation = orientation === 'auto'
    ? (deviceConfig?.defaultOrientation || 'portrait')
    : orientation;

  const isLandscape = finalOrientation === 'landscape';

  const width = viewport?.width ||
    (deviceConfig ? (isLandscape ? deviceConfig.height : deviceConfig.width) : 375);
  const height = viewport?.height ||
    (deviceConfig ? (isLandscape ? deviceConfig.width : deviceConfig.height) : 667);

  const frameStyle: CSSProperties = {
    ...style,
    width: `${width * zoom}px`,
    height: `${height * zoom}px`,
    margin: '0 auto',
    border: showFrame ? '12px solid #1f2937' : 'none',
    borderRadius: showFrame ? '36px' : 0,
    overflow: 'hidden',
    boxShadow: showFrame ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : 'none',
    position: 'relative',
  };

  const contentStyle: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    overflow: 'auto',
  };

  return (
    <div className={`preview-frame ${className}`}>
      {title && (
        <div style={{
          textAlign: 'center',
          marginBottom: '16px',
          fontWeight: 600,
          color: '#6b7280',
        }}>
          {title}
        </div>
      )}
      <div style={frameStyle}>
        <div style={contentStyle}>
          {children}
        </div>
      </div>
      {deviceConfig && (
        <div style={{
          textAlign: 'center',
          marginTop: '8px',
          fontSize: '12px',
          color: '#9ca3af',
        }}>
          {deviceConfig.name} ({width} × {height})
        </div>
      )}
    </div>
  );
}

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
export function PreviewSplitView({
  left,
  right,
  direction = 'horizontal',
  defaultRatio = 0.5,
  resizable = true,
  className = '',
  style = {},
}: PreviewSplitViewProps) {
  const [ratio, setRatio] = useState(defaultRatio);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    if (resizable) setIsDragging(true);
  }, [resizable]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newRatio = direction === 'horizontal'
      ? (e.clientX - rect.left) / rect.width
      : (e.clientY - rect.top) / rect.height;

    setRatio(Math.max(0.1, Math.min(0.9, newRatio)));
  }, [isDragging, direction]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const isHorizontal = direction === 'horizontal';

  const containerStyle: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  };

  const leftStyle: CSSProperties = {
    [isHorizontal ? 'width' : 'height']: `${ratio * 100}%`,
    overflow: 'auto',
  };

  const rightStyle: CSSProperties = {
    [isHorizontal ? 'width' : 'height']: `${(1 - ratio) * 100}%`,
    overflow: 'auto',
  };

  const dividerStyle: CSSProperties = {
    [isHorizontal ? 'width' : 'height']: '4px',
    backgroundColor: '#e5e7eb',
    cursor: isHorizontal ? 'col-resize' : 'row-resize',
    flexShrink: 0,
    ...(isDragging && { backgroundColor: '#3b82f6' }),
  };

  return (
    <div ref={containerRef} className={`preview-split-view ${className}`} style={containerStyle}>
      <div style={leftStyle}>{left}</div>
      {resizable && (
        <div
          style={dividerStyle}
          onMouseDown={handleMouseDown}
        />
      )}
      <div style={rightStyle}>{right}</div>
    </div>
  );
}

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
export function PreviewDevice({
  children,
  device = 'mobile',
  orientation = 'portrait',
  showFrame = true,
  zoom = 1,
  className = '',
}: PreviewDeviceProps) {
  const deviceConfig = useMemo(() => {
    if (typeof device === 'object') return device;
    if (typeof device === 'string' && DEVICE_VIEWPORTS[device]) {
      return DEVICE_VIEWPORTS[device];
    }

    // Default device based on type
    const defaults: Record<DeviceType, string> = {
      mobile: 'iphone12',
      tablet: 'ipadAir',
      desktop: 'desktop1080',
      watch: 'iphone12',
      tv: 'desktop4k',
      custom: 'iphone12',
    };

    return DEVICE_VIEWPORTS[defaults[device as DeviceType]] || DEVICE_VIEWPORTS.iphone12;
  }, [device]);

  return (
    <PreviewFrame
      device={deviceConfig}
      orientation={orientation}
      showFrame={showFrame}
      zoom={zoom}
      className={className}
    >
      {children}
    </PreviewFrame>
  );
}

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
export function ResponsivePreview({
  children,
  breakpoints = PREVIEW_BREAKPOINTS,
  showAll = false,
  className = '',
}: ResponsivePreviewProps) {
  const [selectedBreakpoint, setSelectedBreakpoint] = useState(breakpoints[0]);

  if (showAll) {
    return (
      <div className={`responsive-preview-all ${className}`} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        padding: '24px',
      }}>
        {breakpoints.map((bp) => (
          <div key={bp.name} style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>
              {bp.name}
            </h3>
            <PreviewFrame
              viewport={{ width: bp.minWidth + 100, height: 600 }}
              showFrame={false}
              zoom={0.5}
            >
              {children}
            </PreviewFrame>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`responsive-preview ${className}`}>
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        justifyContent: 'center',
      }}>
        {breakpoints.map((bp) => (
          <button
            key={bp.name}
            onClick={() => setSelectedBreakpoint(bp)}
            style={{
              padding: '8px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              background: selectedBreakpoint.name === bp.name ? '#3b82f6' : 'white',
              color: selectedBreakpoint.name === bp.name ? 'white' : '#374151',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {bp.name}
          </button>
        ))}
      </div>
      <div style={{ padding: '24px' }}>
        <PreviewFrame
          viewport={{ width: selectedBreakpoint.minWidth + 100, height: 800 }}
          title={`${selectedBreakpoint.name.toUpperCase()} (${selectedBreakpoint.minWidth}px+)`}
        >
          {children}
        </PreviewFrame>
      </div>
    </div>
  );
}

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
export function DraftManager({
  contentId,
  filter,
  onSelect,
  onDelete,
  className = '',
}: DraftManagerProps) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        setLoading(true);
        // Simulate API call - replace with actual implementation
        const params = new URLSearchParams();
        if (filter?.status) params.append('status', filter.status.join(','));
        if (filter?.search) params.append('search', filter.search);

        const response = await fetch(`/api/drafts?contentId=${contentId}&${params}`);
        const data = await response.json();
        setDrafts(data);
      } catch (err) {
        console.error('Failed to load drafts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDrafts();
  }, [contentId, filter]);

  const handleSelect = useCallback((draft: Draft) => {
    setSelectedId(draft.id);
    onSelect?.(draft);
  }, [onSelect]);

  const handleDelete = useCallback(async (draftId: string) => {
    try {
      await fetch(`/api/drafts/${draftId}`, { method: 'DELETE' });
      setDrafts(prev => prev.filter(d => d.id !== draftId));
      onDelete?.(draftId);
    } catch (err) {
      console.error('Failed to delete draft:', err);
    }
  }, [onDelete]);

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Loading drafts...</div>;
  }

  return (
    <div className={`draft-manager ${className}`} style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        fontWeight: 600,
      }}>
        Drafts ({drafts.length})
      </div>
      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
        {drafts.map((draft) => (
          <div
            key={draft.id}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f3f4f6',
              cursor: 'pointer',
              background: selectedId === draft.id ? '#eff6ff' : 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onClick={() => handleSelect(draft)}
          >
            <div>
              <div style={{ fontWeight: 500 }}>{draft.title}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Updated {new Date(draft.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(draft.id);
              }}
              style={{
                padding: '4px 8px',
                border: '1px solid #ef4444',
                borderRadius: '4px',
                background: 'white',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

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
export function SideBySidePreview({
  leftVersion,
  rightVersion,
  leftLabel = 'Version A',
  rightLabel = 'Version B',
  showDiff = false,
  renderContent,
  className = '',
}: SideBySidePreviewProps) {
  const defaultRender = (content: any) => (
    <pre style={{
      padding: '16px',
      background: '#f9fafb',
      borderRadius: '4px',
      overflow: 'auto',
      fontSize: '14px',
    }}>
      {JSON.stringify(content, null, 2)}
    </pre>
  );

  const render = renderContent || defaultRender;

  return (
    <div className={`side-by-side-preview ${className}`} style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      height: '100%',
    }}>
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          fontWeight: 600,
          background: '#f9fafb',
        }}>
          {leftLabel}
        </div>
        <div style={{ padding: '16px', overflow: 'auto', height: 'calc(100% - 48px)' }}>
          {render(leftVersion)}
        </div>
      </div>
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          fontWeight: 600,
          background: '#f9fafb',
        }}>
          {rightLabel}
        </div>
        <div style={{ padding: '16px', overflow: 'auto', height: 'calc(100% - 48px)' }}>
          {render(rightVersion)}
        </div>
      </div>
    </div>
  );
}

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
export function PreviewBanner({
  mode,
  onExit,
  actions,
  message,
  className = '',
}: PreviewBannerProps) {
  const modeColors: Record<PreviewMode, { bg: string; text: string }> = {
    draft: { bg: '#fef3c7', text: '#92400e' },
    published: { bg: '#d1fae5', text: '#065f46' },
    scheduled: { bg: '#dbeafe', text: '#1e40af' },
    archived: { bg: '#e5e7eb', text: '#374151' },
    comparison: { bg: '#e9d5ff', text: '#6b21a8' },
  };

  const colors = modeColors[mode];
  const defaultMessage = `Viewing ${mode} version`;

  return (
    <div
      className={`preview-banner ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: colors.bg,
        color: colors.text,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '12px' }}>
          {mode} Preview
        </span>
        <span style={{ fontSize: '14px' }}>
          {message || defaultMessage}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {actions}
        <button
          onClick={onExit}
          style={{
            padding: '6px 12px',
            border: `1px solid ${colors.text}`,
            borderRadius: '4px',
            background: 'white',
            color: colors.text,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          Exit Preview
        </button>
      </div>
    </div>
  );
}

/* ========================================================================
   UTILITY FUNCTIONS
   ======================================================================== */

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
export async function createDraft<T = any>(
  contentId: string,
  content: T,
  metadata?: Partial<Draft<T>>
): Promise<Draft<T>> {
  try {
    // Simulate API call - replace with actual implementation
    const response = await fetch('/api/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentId,
        content,
        ...metadata,
      }),
    });

    if (!response.ok) throw new Error('Failed to create draft');

    return await response.json();
  } catch (error) {
    throw new Error(`Create draft failed: ${(error as Error).message}`);
  }
}

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
export async function saveDraft<T = any>(
  draftId: string,
  updates: Partial<Draft<T>>
): Promise<Draft<T>> {
  try {
    // Simulate API call - replace with actual implementation
    const response = await fetch(`/api/drafts/${draftId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to save draft');

    return await response.json();
  } catch (error) {
    throw new Error(`Save draft failed: ${(error as Error).message}`);
  }
}

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
export async function deleteDraft(draftId: string): Promise<void> {
  try {
    // Simulate API call - replace with actual implementation
    const response = await fetch(`/api/drafts/${draftId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete draft');
  } catch (error) {
    throw new Error(`Delete draft failed: ${(error as Error).message}`);
  }
}

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
export async function restoreDraft<T = any>(draftId: string): Promise<Draft<T>> {
  try {
    // Simulate API call - replace with actual implementation
    const response = await fetch(`/api/drafts/${draftId}/restore`, {
      method: 'POST',
    });

    if (!response.ok) throw new Error('Failed to restore draft');

    return await response.json();
  } catch (error) {
    throw new Error(`Restore draft failed: ${(error as Error).message}`);
  }
}

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
export async function generateShareablePreview(
  config: PreviewLinkConfig
): Promise<{ link: string; token: PreviewToken }> {
  try {
    // Simulate API call - replace with actual implementation
    const response = await fetch('/api/preview/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    if (!response.ok) throw new Error('Failed to generate preview link');

    return await response.json();
  } catch (error) {
    throw new Error(`Generate preview link failed: ${(error as Error).message}`);
  }
}

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
export async function verifyPreviewToken(
  token: string,
  password?: string
): Promise<{ valid: boolean; contentId?: string; error?: string }> {
  try {
    // Simulate API call - replace with actual implementation
    const response = await fetch(`/api/preview/links/${token}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { valid: false, error: error.message };
    }

    const data = await response.json();
    return { valid: true, contentId: data.contentId };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
}

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
export async function capturePreviewSnapshot(
  contentId: string,
  device: DeviceViewport,
  notes?: string
): Promise<PreviewSnapshot> {
  try {
    // Simulate API call - replace with actual implementation
    const response = await fetch(`/api/preview/${contentId}/snapshots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device, notes }),
    });

    if (!response.ok) throw new Error('Failed to capture snapshot');

    return await response.json();
  } catch (error) {
    throw new Error(`Capture snapshot failed: ${(error as Error).message}`);
  }
}

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
export async function compareVersions(
  leftId: string,
  rightId: string
): Promise<VersionComparison> {
  try {
    // Simulate API call - replace with actual implementation
    const response = await fetch(`/api/compare?left=${leftId}&right=${rightId}`);

    if (!response.ok) throw new Error('Failed to compare versions');

    return await response.json();
  } catch (error) {
    throw new Error(`Compare versions failed: ${(error as Error).message}`);
  }
}

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
export async function resolveDraftConflict(
  conflictId: string,
  resolution: 'ours' | 'theirs' | 'merge',
  customFields?: ConflictField[]
): Promise<Draft> {
  try {
    // Simulate API call - replace with actual implementation
    const response = await fetch(`/api/conflicts/${conflictId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution, customFields }),
    });

    if (!response.ok) throw new Error('Failed to resolve conflict');

    return await response.json();
  } catch (error) {
    throw new Error(`Resolve conflict failed: ${(error as Error).message}`);
  }
}

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
export function getPreviewUrl(
  contentId: string,
  mode: PreviewMode = 'draft',
  options?: {
    device?: DeviceType;
    token?: string;
    baseUrl?: string;
  }
): string {
  const base = options?.baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const url = new URL(`${base}/preview/${contentId}`);

  url.searchParams.set('mode', mode);
  if (options?.device) url.searchParams.set('device', options.device);
  if (options?.token) url.searchParams.set('token', options.token);

  return url.toString();
}

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
export function calculateContentHash(content: any): string {
  // Simple hash implementation - replace with crypto in production
  const str = JSON.stringify(content);
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

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
export function isPreviewExpired(token: PreviewToken): boolean {
  return new Date() > new Date(token.expiresAt);
}

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
export function getDeviceViewport(deviceOrType: string): DeviceViewport | undefined {
  // Try exact match first
  if (DEVICE_VIEWPORTS[deviceOrType]) {
    return DEVICE_VIEWPORTS[deviceOrType];
  }

  // Try type match
  const deviceType = deviceOrType as DeviceType;
  const defaults: Record<DeviceType, string> = {
    mobile: 'iphone12',
    tablet: 'ipadAir',
    desktop: 'desktop1080',
    watch: 'iphone12',
    tv: 'desktop4k',
    custom: 'iphone12',
  };

  return DEVICE_VIEWPORTS[defaults[deviceType]];
}

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
export function getCurrentBreakpoint(
  width: number,
  breakpoints: PreviewBreakpoint[] = PREVIEW_BREAKPOINTS
): PreviewBreakpoint | undefined {
  return breakpoints.find(bp => width >= bp.minWidth && width <= bp.maxWidth);
}

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
export function formatPreviewLink(link: string, hasPassword: boolean = false): string {
  const suffix = hasPassword ? ' (Password required)' : '';
  return `Preview link: ${link}${suffix}`;
}

/**
 * Exit preview mode and clean up
 *
 * @example
 * ```typescript
 * exitPreviewMode(); // Redirects to normal view
 * ```
 */
export function exitPreviewMode(): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.delete('preview');
  url.searchParams.delete('draft');
  url.searchParams.delete('mode');
  url.searchParams.delete('token');

  window.location.href = url.toString();
}

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
export function isInPreviewMode(): boolean {
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);
  return params.has('preview') || params.has('draft') || params.has('mode');
}

/* ========================================================================
   EXPORTS
   ======================================================================== */

export default {
  // Hooks
  usePreviewMode,
  useDraft,
  usePreviewLink,
  useLivePreview,
  useDraftAutoSave,
  usePreviewAnnotations,
  useVersionCompare,
  usePreviewHistory,

  // Components
  PreviewPanel,
  PreviewFrame,
  PreviewSplitView,
  PreviewDevice,
  ResponsivePreview,
  DraftManager,
  SideBySidePreview,
  PreviewBanner,

  // Utilities
  createDraft,
  saveDraft,
  deleteDraft,
  restoreDraft,
  generateShareablePreview,
  verifyPreviewToken,
  capturePreviewSnapshot,
  compareVersions,
  resolveDraftConflict,
  getPreviewUrl,
  calculateContentHash,
  isPreviewExpired,
  getDeviceViewport,
  getCurrentBreakpoint,
  formatPreviewLink,
  exitPreviewMode,
  isInPreviewMode,

  // Constants
  DEVICE_VIEWPORTS,
  PREVIEW_BREAKPOINTS,
};
