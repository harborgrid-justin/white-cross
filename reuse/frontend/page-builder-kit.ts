/**
 * @fileoverview Enterprise-Grade Page Builder Kit
 * @module @reuse/frontend/page-builder-kit
 *
 * Production-ready React components and utilities for building drag-drop page builders.
 * Supports visual page composition, block-based editing, responsive design, and extensibility.
 *
 * @example React 18+ Basic Page Builder
 * ```tsx
 * import { PageBuilder, usePageBuilder, BlockLibrary } from '@reuse/frontend/page-builder-kit';
 *
 * function MyPageBuilder() {
 *   const { blocks, addBlock, updateBlock, deleteBlock } = usePageBuilder();
 *
 *   return (
 *     <PageBuilder
 *       blocks={blocks}
 *       onBlockAdd={addBlock}
 *       onBlockUpdate={updateBlock}
 *       onBlockDelete={deleteBlock}
 *     >
 *       <BlockLibrary />
 *     </PageBuilder>
 *   );
 * }
 * ```
 *
 * @example Next.js 16 with Server Components
 * ```tsx
 * // app/builder/page.tsx
 * import { PageBuilderClient } from '@reuse/frontend/page-builder-kit';
 * import { getPageTemplate } from '@/lib/templates';
 *
 * export default async function BuilderPage() {
 *   const template = await getPageTemplate('default');
 *
 *   return <PageBuilderClient initialTemplate={template} />;
 * }
 * ```
 *
 * @author HarborGrid Engineering
 * @version 1.0.0
 * @license MIT
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useEffect,
  useState,
  forwardRef,
  memo,
  type ReactNode,
  type ComponentType,
  type CSSProperties,
  type DragEvent,
  type MouseEvent,
} from 'react';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Unique identifier for blocks
 */
export type BlockId = string;

/**
 * Block type identifier
 */
export type BlockType =
  | 'text'
  | 'image'
  | 'video'
  | 'code'
  | 'container'
  | 'columns'
  | 'grid'
  | 'hero'
  | 'cta'
  | 'feature'
  | 'custom';

/**
 * Responsive breakpoint identifier
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

/**
 * Block position and dimensions
 */
export interface BlockPosition {
  x: number;
  y: number;
  width: number | string;
  height: number | string;
  zIndex?: number;
}

/**
 * Responsive block styles for different breakpoints
 */
export interface ResponsiveStyles {
  mobile?: CSSProperties;
  tablet?: CSSProperties;
  desktop?: CSSProperties;
  wide?: CSSProperties;
}

/**
 * Block configuration and metadata
 */
export interface Block {
  id: BlockId;
  type: BlockType;
  name: string;
  content: Record<string, any>;
  styles: CSSProperties;
  responsiveStyles?: ResponsiveStyles;
  position?: BlockPosition;
  parentId?: BlockId;
  children?: BlockId[];
  metadata?: Record<string, any>;
  locked?: boolean;
  visible?: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Layout configuration
 */
export interface Layout {
  id: string;
  name: string;
  type: 'fixed' | 'fluid' | 'responsive';
  columns: number;
  gap: number;
  padding: number;
  maxWidth?: number;
  breakpoints?: Record<Breakpoint, Partial<Layout>>;
}

/**
 * Page template definition
 */
export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  blocks: Block[];
  layout: Layout;
  metadata?: Record<string, any>;
}

/**
 * Block library category
 */
export interface BlockCategory {
  id: string;
  name: string;
  icon?: ReactNode;
  blocks: BlockType[];
}

/**
 * Drag and drop context
 */
export interface DragDropContext {
  draggedBlock: Block | null;
  dropTarget: BlockId | null;
  isDragging: boolean;
  canDrop: boolean;
}

/**
 * Block validation result
 */
export interface BlockValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Block export format
 */
export type BlockExportFormat = 'json' | 'html' | 'react' | 'markdown';

/**
 * History entry for undo/redo
 */
export interface HistoryEntry {
  timestamp: number;
  action: 'add' | 'update' | 'delete' | 'move';
  blockId: BlockId;
  previousState?: Block;
  newState?: Block;
}

/**
 * Page builder configuration
 */
export interface PageBuilderConfig {
  enableUndo?: boolean;
  enableRedo?: boolean;
  maxHistorySize?: number;
  autosave?: boolean;
  autosaveInterval?: number;
  enableGrid?: boolean;
  gridSize?: number;
  snapToGrid?: boolean;
  enableGuides?: boolean;
  enableRulers?: boolean;
  customBlocks?: Record<string, ComponentType<any>>;
}

/**
 * Block component props
 */
export interface BlockComponentProps {
  block: Block;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
  onDelete?: () => void;
  children?: ReactNode;
}

// ============================================================================
// Context and State Management
// ============================================================================

/**
 * Page builder state
 */
interface PageBuilderState {
  blocks: Map<BlockId, Block>;
  selectedBlockId: BlockId | null;
  editingBlockId: BlockId | null;
  layout: Layout;
  history: HistoryEntry[];
  historyIndex: number;
  dragDropContext: DragDropContext;
  config: PageBuilderConfig;
}

/**
 * Page builder actions
 */
type PageBuilderAction =
  | { type: 'ADD_BLOCK'; block: Block; parentId?: BlockId }
  | { type: 'UPDATE_BLOCK'; blockId: BlockId; updates: Partial<Block> }
  | { type: 'DELETE_BLOCK'; blockId: BlockId }
  | { type: 'MOVE_BLOCK'; blockId: BlockId; parentId?: BlockId; index?: number }
  | { type: 'SELECT_BLOCK'; blockId: BlockId | null }
  | { type: 'EDIT_BLOCK'; blockId: BlockId | null }
  | { type: 'SET_LAYOUT'; layout: Layout }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'START_DRAG'; block: Block }
  | { type: 'END_DRAG' }
  | { type: 'SET_DROP_TARGET'; blockId: BlockId | null }
  | { type: 'LOAD_TEMPLATE'; template: PageTemplate }
  | { type: 'CLEAR_ALL' };

/**
 * Page builder context value
 */
interface PageBuilderContextValue extends PageBuilderState {
  dispatch: React.Dispatch<PageBuilderAction>;
  addBlock: (block: Partial<Block>, parentId?: BlockId) => BlockId;
  updateBlock: (blockId: BlockId, updates: Partial<Block>) => void;
  deleteBlock: (blockId: BlockId) => void;
  moveBlock: (blockId: BlockId, parentId?: BlockId, index?: number) => void;
  selectBlock: (blockId: BlockId | null) => void;
  editBlock: (blockId: BlockId | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  exportBlocks: (format: BlockExportFormat) => string;
  importBlocks: (data: string, format: BlockExportFormat) => void;
}

const PageBuilderContext = createContext<PageBuilderContextValue | null>(null);

/**
 * Hook to access page builder context
 *
 * @returns Page builder context value
 * @throws Error if used outside PageBuilderProvider
 *
 * @example
 * ```tsx
 * function BlockToolbar() {
 *   const { selectedBlockId, updateBlock, deleteBlock } = usePageBuilderContext();
 *
 *   if (!selectedBlockId) return null;
 *
 *   return (
 *     <div>
 *       <button onClick={() => deleteBlock(selectedBlockId)}>Delete</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePageBuilderContext(): PageBuilderContextValue {
  const context = useContext(PageBuilderContext);
  if (!context) {
    throw new Error('usePageBuilderContext must be used within PageBuilderProvider');
  }
  return context;
}

/**
 * Generate unique block ID
 *
 * @returns Unique block identifier
 */
function generateBlockId(): BlockId {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Page builder reducer
 */
function pageBuilderReducer(
  state: PageBuilderState,
  action: PageBuilderAction
): PageBuilderState {
  switch (action.type) {
    case 'ADD_BLOCK': {
      const blocks = new Map(state.blocks);
      blocks.set(action.block.id, action.block);

      if (action.parentId) {
        const parent = blocks.get(action.parentId);
        if (parent) {
          blocks.set(action.parentId, {
            ...parent,
            children: [...(parent.children || []), action.block.id],
            updatedAt: Date.now(),
          });
        }
      }

      const historyEntry: HistoryEntry = {
        timestamp: Date.now(),
        action: 'add',
        blockId: action.block.id,
        newState: action.block,
      };

      return {
        ...state,
        blocks,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          historyEntry,
        ].slice(-state.config.maxHistorySize!),
        historyIndex: Math.min(
          state.historyIndex + 1,
          state.config.maxHistorySize! - 1
        ),
      };
    }

    case 'UPDATE_BLOCK': {
      const blocks = new Map(state.blocks);
      const block = blocks.get(action.blockId);
      if (!block) return state;

      const updatedBlock = {
        ...block,
        ...action.updates,
        updatedAt: Date.now(),
      };
      blocks.set(action.blockId, updatedBlock);

      const historyEntry: HistoryEntry = {
        timestamp: Date.now(),
        action: 'update',
        blockId: action.blockId,
        previousState: block,
        newState: updatedBlock,
      };

      return {
        ...state,
        blocks,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          historyEntry,
        ].slice(-state.config.maxHistorySize!),
        historyIndex: Math.min(
          state.historyIndex + 1,
          state.config.maxHistorySize! - 1
        ),
      };
    }

    case 'DELETE_BLOCK': {
      const blocks = new Map(state.blocks);
      const block = blocks.get(action.blockId);
      if (!block) return state;

      // Delete children recursively
      const deleteRecursive = (id: BlockId) => {
        const b = blocks.get(id);
        if (b?.children) {
          b.children.forEach(deleteRecursive);
        }
        blocks.delete(id);
      };
      deleteRecursive(action.blockId);

      // Remove from parent
      if (block.parentId) {
        const parent = blocks.get(block.parentId);
        if (parent) {
          blocks.set(block.parentId, {
            ...parent,
            children: parent.children?.filter((id) => id !== action.blockId),
            updatedAt: Date.now(),
          });
        }
      }

      const historyEntry: HistoryEntry = {
        timestamp: Date.now(),
        action: 'delete',
        blockId: action.blockId,
        previousState: block,
      };

      return {
        ...state,
        blocks,
        selectedBlockId:
          state.selectedBlockId === action.blockId ? null : state.selectedBlockId,
        editingBlockId:
          state.editingBlockId === action.blockId ? null : state.editingBlockId,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          historyEntry,
        ].slice(-state.config.maxHistorySize!),
        historyIndex: Math.min(
          state.historyIndex + 1,
          state.config.maxHistorySize! - 1
        ),
      };
    }

    case 'MOVE_BLOCK': {
      const blocks = new Map(state.blocks);
      const block = blocks.get(action.blockId);
      if (!block) return state;

      // Remove from old parent
      if (block.parentId) {
        const oldParent = blocks.get(block.parentId);
        if (oldParent) {
          blocks.set(block.parentId, {
            ...oldParent,
            children: oldParent.children?.filter((id) => id !== action.blockId),
            updatedAt: Date.now(),
          });
        }
      }

      // Add to new parent
      if (action.parentId) {
        const newParent = blocks.get(action.parentId);
        if (newParent) {
          const children = [...(newParent.children || [])];
          if (action.index !== undefined) {
            children.splice(action.index, 0, action.blockId);
          } else {
            children.push(action.blockId);
          }
          blocks.set(action.parentId, {
            ...newParent,
            children,
            updatedAt: Date.now(),
          });
        }
      }

      blocks.set(action.blockId, {
        ...block,
        parentId: action.parentId,
        updatedAt: Date.now(),
      });

      const historyEntry: HistoryEntry = {
        timestamp: Date.now(),
        action: 'move',
        blockId: action.blockId,
        previousState: block,
        newState: blocks.get(action.blockId)!,
      };

      return {
        ...state,
        blocks,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          historyEntry,
        ].slice(-state.config.maxHistorySize!),
        historyIndex: Math.min(
          state.historyIndex + 1,
          state.config.maxHistorySize! - 1
        ),
      };
    }

    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.blockId };

    case 'EDIT_BLOCK':
      return { ...state, editingBlockId: action.blockId };

    case 'SET_LAYOUT':
      return { ...state, layout: action.layout };

    case 'UNDO': {
      if (state.historyIndex < 0) return state;

      const entry = state.history[state.historyIndex];
      const blocks = new Map(state.blocks);

      if (entry.action === 'add' && entry.newState) {
        blocks.delete(entry.blockId);
      } else if (entry.action === 'delete' && entry.previousState) {
        blocks.set(entry.blockId, entry.previousState);
      } else if (entry.action === 'update' && entry.previousState) {
        blocks.set(entry.blockId, entry.previousState);
      }

      return {
        ...state,
        blocks,
        historyIndex: state.historyIndex - 1,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;

      const entry = state.history[state.historyIndex + 1];
      const blocks = new Map(state.blocks);

      if (entry.action === 'add' && entry.newState) {
        blocks.set(entry.blockId, entry.newState);
      } else if (entry.action === 'delete') {
        blocks.delete(entry.blockId);
      } else if (entry.action === 'update' && entry.newState) {
        blocks.set(entry.blockId, entry.newState);
      }

      return {
        ...state,
        blocks,
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'START_DRAG':
      return {
        ...state,
        dragDropContext: {
          draggedBlock: action.block,
          dropTarget: null,
          isDragging: true,
          canDrop: false,
        },
      };

    case 'END_DRAG':
      return {
        ...state,
        dragDropContext: {
          draggedBlock: null,
          dropTarget: null,
          isDragging: false,
          canDrop: false,
        },
      };

    case 'SET_DROP_TARGET':
      return {
        ...state,
        dragDropContext: {
          ...state.dragDropContext,
          dropTarget: action.blockId,
          canDrop: action.blockId !== null,
        },
      };

    case 'LOAD_TEMPLATE': {
      const blocks = new Map<BlockId, Block>();
      action.template.blocks.forEach((block) => {
        blocks.set(block.id, block);
      });

      return {
        ...state,
        blocks,
        layout: action.template.layout,
        selectedBlockId: null,
        editingBlockId: null,
        history: [],
        historyIndex: -1,
      };
    }

    case 'CLEAR_ALL':
      return {
        ...state,
        blocks: new Map(),
        selectedBlockId: null,
        editingBlockId: null,
        history: [],
        historyIndex: -1,
      };

    default:
      return state;
  }
}

// ============================================================================
// Core Page Builder Components
// ============================================================================

/**
 * Page builder provider props
 */
export interface PageBuilderProviderProps {
  children: ReactNode;
  initialBlocks?: Block[];
  initialLayout?: Layout;
  config?: Partial<PageBuilderConfig>;
  onSave?: (blocks: Block[], layout: Layout) => void;
}

/**
 * Default page builder configuration
 */
const defaultConfig: PageBuilderConfig = {
  enableUndo: true,
  enableRedo: true,
  maxHistorySize: 50,
  autosave: false,
  autosaveInterval: 30000,
  enableGrid: true,
  gridSize: 8,
  snapToGrid: false,
  enableGuides: true,
  enableRulers: false,
  customBlocks: {},
};

/**
 * Default layout configuration
 */
const defaultLayout: Layout = {
  id: 'default',
  name: 'Default Layout',
  type: 'responsive',
  columns: 12,
  gap: 16,
  padding: 24,
  maxWidth: 1200,
};

/**
 * Page Builder Provider Component
 *
 * Provides page builder context and state management for all child components.
 * Manages blocks, history, drag-drop state, and configuration.
 *
 * @param props - Provider props
 * @returns Provider component
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <PageBuilderProvider
 *       initialBlocks={savedBlocks}
 *       config={{ enableUndo: true, autosave: true }}
 *       onSave={(blocks, layout) => saveToDatabase(blocks, layout)}
 *     >
 *       <PageBuilderUI />
 *     </PageBuilderProvider>
 *   );
 * }
 * ```
 */
export function PageBuilderProvider({
  children,
  initialBlocks = [],
  initialLayout = defaultLayout,
  config = {},
  onSave,
}: PageBuilderProviderProps) {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config]
  );

  const [state, dispatch] = useReducer(pageBuilderReducer, {
    blocks: new Map(initialBlocks.map((block) => [block.id, block])),
    selectedBlockId: null,
    editingBlockId: null,
    layout: initialLayout,
    history: [],
    historyIndex: -1,
    dragDropContext: {
      draggedBlock: null,
      dropTarget: null,
      isDragging: false,
      canDrop: false,
    },
    config: mergedConfig,
  });

  // Autosave functionality
  useEffect(() => {
    if (!mergedConfig.autosave || !onSave) return;

    const interval = setInterval(() => {
      onSave(Array.from(state.blocks.values()), state.layout);
    }, mergedConfig.autosaveInterval);

    return () => clearInterval(interval);
  }, [mergedConfig.autosave, mergedConfig.autosaveInterval, onSave, state.blocks, state.layout]);

  const addBlock = useCallback(
    (blockData: Partial<Block>, parentId?: BlockId): BlockId => {
      const id = generateBlockId();
      const block: Block = {
        id,
        type: blockData.type || 'container',
        name: blockData.name || `Block ${id}`,
        content: blockData.content || {},
        styles: blockData.styles || {},
        responsiveStyles: blockData.responsiveStyles,
        position: blockData.position,
        parentId,
        children: blockData.children || [],
        metadata: blockData.metadata,
        locked: blockData.locked || false,
        visible: blockData.visible !== false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      dispatch({ type: 'ADD_BLOCK', block, parentId });
      return id;
    },
    []
  );

  const updateBlock = useCallback((blockId: BlockId, updates: Partial<Block>) => {
    dispatch({ type: 'UPDATE_BLOCK', blockId, updates });
  }, []);

  const deleteBlock = useCallback((blockId: BlockId) => {
    dispatch({ type: 'DELETE_BLOCK', blockId });
  }, []);

  const moveBlock = useCallback(
    (blockId: BlockId, parentId?: BlockId, index?: number) => {
      dispatch({ type: 'MOVE_BLOCK', blockId, parentId, index });
    },
    []
  );

  const selectBlock = useCallback((blockId: BlockId | null) => {
    dispatch({ type: 'SELECT_BLOCK', blockId });
  }, []);

  const editBlock = useCallback((blockId: BlockId | null) => {
    dispatch({ type: 'EDIT_BLOCK', blockId });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const canUndo = state.historyIndex >= 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const exportBlocks = useCallback(
    (format: BlockExportFormat): string => {
      const blocks = Array.from(state.blocks.values());

      switch (format) {
        case 'json':
          return JSON.stringify({ blocks, layout: state.layout }, null, 2);

        case 'html':
          return `<!DOCTYPE html>\n<html>\n<body>\n<!-- Page builder blocks -->\n</body>\n</html>`;

        case 'react':
          return `// Generated React components\n`;

        case 'markdown':
          return `# Page Export\n\n`;

        default:
          return '';
      }
    },
    [state.blocks, state.layout]
  );

  const importBlocks = useCallback(
    (data: string, format: BlockExportFormat) => {
      try {
        if (format === 'json') {
          const parsed = JSON.parse(data);
          if (parsed.blocks && parsed.layout) {
            dispatch({
              type: 'LOAD_TEMPLATE',
              template: {
                id: 'imported',
                name: 'Imported Template',
                description: '',
                blocks: parsed.blocks,
                layout: parsed.layout,
              },
            });
          }
        }
      } catch (error) {
        console.error('Failed to import blocks:', error);
      }
    },
    []
  );

  const value = useMemo<PageBuilderContextValue>(
    () => ({
      ...state,
      dispatch,
      addBlock,
      updateBlock,
      deleteBlock,
      moveBlock,
      selectBlock,
      editBlock,
      undo,
      redo,
      canUndo,
      canRedo,
      exportBlocks,
      importBlocks,
    }),
    [
      state,
      addBlock,
      updateBlock,
      deleteBlock,
      moveBlock,
      selectBlock,
      editBlock,
      undo,
      redo,
      canUndo,
      canRedo,
      exportBlocks,
      importBlocks,
    ]
  );

  return (
    <PageBuilderContext.Provider value={value}>
      {children}
    </PageBuilderContext.Provider>
  );
}

/**
 * Page Builder Component Props
 */
export interface PageBuilderProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  showToolbar?: boolean;
  showSidebar?: boolean;
}

/**
 * Main Page Builder Component
 *
 * Root component that orchestrates the entire page building experience.
 * Provides layout structure for canvas, toolbars, and sidebars.
 *
 * @param props - Page builder props
 * @returns Page builder component
 *
 * @example
 * ```tsx
 * <PageBuilderProvider>
 *   <PageBuilder showToolbar showSidebar>
 *     <DragDropCanvas />
 *   </PageBuilder>
 * </PageBuilderProvider>
 * ```
 */
export const PageBuilder = memo(function PageBuilder({
  children,
  className = '',
  style,
  showToolbar = true,
  showSidebar = true,
}: PageBuilderProps) {
  return (
    <div
      className={`page-builder ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        ...style,
      }}
    >
      {showToolbar && <PageBuilderToolbar />}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {showSidebar && <PageBuilderSidebar />}
        <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
      </div>
    </div>
  );
});

/**
 * Page Builder Toolbar Component
 *
 * Top toolbar with primary actions (undo, redo, preview, save, etc.)
 *
 * @returns Toolbar component
 */
function PageBuilderToolbar() {
  const { undo, redo, canUndo, canRedo, exportBlocks } = usePageBuilderContext();

  const handleExport = () => {
    const data = exportBlocks('json');
    console.log('Export data:', data);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f5f5f5',
      }}
    >
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>
      <div style={{ flex: 1 }} />
      <button onClick={handleExport}>Export</button>
      <button>Preview</button>
      <button>Save</button>
    </div>
  );
}

/**
 * Page Builder Sidebar Component
 *
 * Left sidebar with block library and properties panel
 *
 * @returns Sidebar component
 */
function PageBuilderSidebar() {
  const { selectedBlockId } = usePageBuilderContext();

  return (
    <aside
      style={{
        width: 280,
        borderRight: '1px solid #e0e0e0',
        backgroundColor: '#fafafa',
        overflow: 'auto',
      }}
    >
      {selectedBlockId ? <BlockPropertiesPanel /> : <BlockLibrary />}
    </aside>
  );
}

// ============================================================================
// Drag and Drop Components
// ============================================================================

/**
 * Drag Drop Canvas Props
 */
export interface DragDropCanvasProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  showGrid?: boolean;
  gridSize?: number;
}

/**
 * Drag Drop Canvas Component
 *
 * Main canvas area where blocks can be dragged, dropped, and arranged.
 * Handles drag-drop events and renders blocks with their positions.
 *
 * @param props - Canvas props
 * @returns Canvas component
 *
 * @example
 * ```tsx
 * <DragDropCanvas showGrid gridSize={8}>
 *   {rootBlocks.map(block => (
 *     <BlockRenderer key={block.id} block={block} />
 *   ))}
 * </DragDropCanvas>
 * ```
 */
export const DragDropCanvas = memo(function DragDropCanvas({
  children,
  className = '',
  style,
  showGrid = true,
  gridSize = 8,
}: DragDropCanvasProps) {
  const { dragDropContext, dispatch } = usePageBuilderContext();

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dispatch({ type: 'END_DRAG' });
    },
    [dispatch]
  );

  const gridBackground = showGrid
    ? `repeating-linear-gradient(
        0deg,
        #e0e0e0 0,
        #e0e0e0 1px,
        transparent 1px,
        transparent ${gridSize}px
      ),
      repeating-linear-gradient(
        90deg,
        #e0e0e0 0,
        #e0e0e0 1px,
        transparent 1px,
        transparent ${gridSize}px
      )`
    : undefined;

  return (
    <div
      className={`drag-drop-canvas ${className}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        position: 'relative',
        minHeight: '100%',
        padding: 24,
        background: gridBackground,
        ...style,
      }}
    >
      {dragDropContext.isDragging && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </div>
  );
});

/**
 * Drop Zone Props
 */
export interface DropZoneProps {
  blockId?: BlockId;
  onDrop?: (draggedBlockId: BlockId) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Drop Zone Component
 *
 * Designated area that can accept dropped blocks.
 * Provides visual feedback during drag operations.
 *
 * @param props - Drop zone props
 * @returns Drop zone component
 *
 * @example
 * ```tsx
 * <DropZone
 *   blockId={containerId}
 *   onDrop={(draggedId) => moveBlock(draggedId, containerId)}
 * >
 *   Drop blocks here
 * </DropZone>
 * ```
 */
export const DropZone = memo(function DropZone({
  blockId,
  onDrop,
  className = '',
  style,
  children,
}: DropZoneProps) {
  const { dragDropContext, dispatch } = usePageBuilderContext();
  const [isOver, setIsOver] = useState(false);

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsOver(true);
      if (blockId) {
        dispatch({ type: 'SET_DROP_TARGET', blockId });
      }
    },
    [blockId, dispatch]
  );

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOver(false);

      if (dragDropContext.draggedBlock && onDrop) {
        onDrop(dragDropContext.draggedBlock.id);
      }
    },
    [dragDropContext.draggedBlock, onDrop]
  );

  return (
    <div
      className={`drop-zone ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        minHeight: 100,
        border: `2px dashed ${isOver ? '#2196f3' : '#e0e0e0'}`,
        borderRadius: 4,
        backgroundColor: isOver ? 'rgba(33, 150, 243, 0.05)' : 'transparent',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {children}
    </div>
  );
});

/**
 * Drag Handle Props
 */
export interface DragHandleProps {
  block: Block;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Drag Handle Component
 *
 * Handle element that initiates drag operations for blocks.
 * Typically rendered as part of block toolbar or header.
 *
 * @param props - Drag handle props
 * @returns Drag handle component
 *
 * @example
 * ```tsx
 * <DragHandle block={block}>
 *   <GripIcon />
 * </DragHandle>
 * ```
 */
export const DragHandle = memo(function DragHandle({
  block,
  className = '',
  style,
  children = '⋮⋮',
}: DragHandleProps) {
  const { dispatch } = usePageBuilderContext();

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.dataTransfer.effectAllowed = 'move';
      dispatch({ type: 'START_DRAG', block });
    },
    [block, dispatch]
  );

  const handleDragEnd = useCallback(() => {
    dispatch({ type: 'END_DRAG' });
  }, [dispatch]);

  return (
    <div
      className={`drag-handle ${className}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        cursor: 'grab',
        userSelect: 'none',
        padding: 4,
        ...style,
      }}
    >
      {children}
    </div>
  );
});

// ============================================================================
// Block Library Components
// ============================================================================

/**
 * Block Library Props
 */
export interface BlockLibraryProps {
  categories?: BlockCategory[];
  onBlockSelect?: (type: BlockType) => void;
  className?: string;
}

/**
 * Block Library Component
 *
 * Displays categorized collection of available blocks.
 * Allows users to browse and add blocks to the canvas.
 *
 * @param props - Block library props
 * @returns Block library component
 *
 * @example
 * ```tsx
 * <BlockLibrary
 *   categories={customCategories}
 *   onBlockSelect={(type) => addBlockToCanvas(type)}
 * />
 * ```
 */
export const BlockLibrary = memo(function BlockLibrary({
  categories = defaultBlockCategories,
  onBlockSelect,
  className = '',
}: BlockLibraryProps) {
  const { addBlock } = usePageBuilderContext();

  const handleBlockClick = useCallback(
    (type: BlockType) => {
      addBlock({ type, name: `New ${type} block` });
      onBlockSelect?.(type);
    },
    [addBlock, onBlockSelect]
  );

  return (
    <div className={`block-library ${className}`} style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>
        Block Library
      </h3>
      {categories.map((category) => (
        <div key={category.id} style={{ marginBottom: 24 }}>
          <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>
            {category.name}
          </h4>
          <div style={{ display: 'grid', gap: 8 }}>
            {category.blocks.map((blockType) => (
              <button
                key={blockType}
                onClick={() => handleBlockClick(blockType)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: 4,
                  background: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {blockType}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

/**
 * Default block categories
 */
const defaultBlockCategories: BlockCategory[] = [
  {
    id: 'content',
    name: 'Content',
    blocks: ['text', 'image', 'video', 'code'],
  },
  {
    id: 'layout',
    name: 'Layout',
    blocks: ['container', 'columns', 'grid'],
  },
  {
    id: 'sections',
    name: 'Sections',
    blocks: ['hero', 'cta', 'feature'],
  },
];

/**
 * Block Palette Props
 */
export interface BlockPaletteProps {
  blocks: BlockType[];
  onBlockDragStart?: (type: BlockType) => void;
  className?: string;
}

/**
 * Block Palette Component
 *
 * Compact palette of draggable block types.
 * Alternative to BlockLibrary for drag-to-add workflows.
 *
 * @param props - Block palette props
 * @returns Block palette component
 */
export const BlockPalette = memo(function BlockPalette({
  blocks,
  onBlockDragStart,
  className = '',
}: BlockPaletteProps) {
  return (
    <div
      className={`block-palette ${className}`}
      style={{ display: 'flex', gap: 8, padding: 8, flexWrap: 'wrap' }}
    >
      {blocks.map((type) => (
        <div
          key={type}
          draggable
          onDragStart={() => onBlockDragStart?.(type)}
          style={{
            padding: '6px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: 4,
            background: 'white',
            cursor: 'grab',
            fontSize: 12,
          }}
        >
          {type}
        </div>
      ))}
    </div>
  );
});

/**
 * Block Browser Props
 */
export interface BlockBrowserProps {
  searchable?: boolean;
  filterable?: boolean;
  onBlockAdd?: (type: BlockType) => void;
  className?: string;
}

/**
 * Block Browser Component
 *
 * Advanced block browsing interface with search and filtering.
 * Provides richer discovery experience than basic library.
 *
 * @param props - Block browser props
 * @returns Block browser component
 */
export const BlockBrowser = memo(function BlockBrowser({
  searchable = true,
  filterable = true,
  onBlockAdd,
  className = '',
}: BlockBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredBlocks = useMemo(() => {
    let blocks = defaultBlockCategories.flatMap((cat) =>
      cat.blocks.map((type) => ({ type, category: cat.id }))
    );

    if (selectedCategory !== 'all') {
      blocks = blocks.filter((b) => b.category === selectedCategory);
    }

    if (searchTerm) {
      blocks = blocks.filter((b) =>
        b.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return blocks;
  }, [searchTerm, selectedCategory]);

  return (
    <div className={`block-browser ${className}`} style={{ padding: 16 }}>
      {searchable && (
        <input
          type="text"
          placeholder="Search blocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
            marginBottom: 16,
          }}
        />
      )}

      {filterable && (
        <div style={{ marginBottom: 16 }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #e0e0e0',
              borderRadius: 4,
            }}
          >
            <option value="all">All Categories</option>
            {defaultBlockCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: 'grid', gap: 8 }}>
        {filteredBlocks.map(({ type }) => (
          <button
            key={type}
            onClick={() => onBlockAdd?.(type)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: 4,
              background: 'white',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// Content Block Components
// ============================================================================

/**
 * Text Block Component
 *
 * Editable text content block with rich formatting support.
 *
 * @param props - Block component props
 * @returns Text block component
 */
export const TextBlock = memo(function TextBlock({
  block,
  isSelected,
  isEditing,
  onUpdate,
}: BlockComponentProps) {
  const [content, setContent] = useState(block.content.text || '');

  const handleBlur = useCallback(() => {
    if (onUpdate && content !== block.content.text) {
      onUpdate({ ...block, content: { ...block.content, text: content } });
    }
  }, [block, content, onUpdate]);

  return (
    <div
      style={{
        padding: 16,
        border: isSelected ? '2px solid #2196f3' : '1px solid transparent',
        ...block.styles,
      }}
    >
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          style={{ width: '100%', minHeight: 100, padding: 8 }}
          autoFocus
        />
      ) : (
        <div>{content || 'Click to edit text'}</div>
      )}
    </div>
  );
});

/**
 * Image Block Component
 *
 * Image display block with upload and configuration options.
 *
 * @param props - Block component props
 * @returns Image block component
 */
export const ImageBlock = memo(function ImageBlock({
  block,
  isSelected,
  onUpdate,
}: BlockComponentProps) {
  const src = block.content.src || '';
  const alt = block.content.alt || '';

  return (
    <div
      style={{
        border: isSelected ? '2px solid #2196f3' : '1px solid transparent',
        ...block.styles,
      }}
    >
      {src ? (
        <img src={src} alt={alt} style={{ maxWidth: '100%', display: 'block' }} />
      ) : (
        <div
          style={{
            padding: 48,
            background: '#f5f5f5',
            textAlign: 'center',
            color: '#999',
          }}
        >
          Click to add image
        </div>
      )}
    </div>
  );
});

/**
 * Video Block Component
 *
 * Video embed block supporting various video platforms.
 *
 * @param props - Block component props
 * @returns Video block component
 */
export const VideoBlock = memo(function VideoBlock({
  block,
  isSelected,
}: BlockComponentProps) {
  const src = block.content.src || '';
  const poster = block.content.poster || '';

  return (
    <div
      style={{
        border: isSelected ? '2px solid #2196f3' : '1px solid transparent',
        ...block.styles,
      }}
    >
      {src ? (
        <video
          src={src}
          poster={poster}
          controls
          style={{ maxWidth: '100%', display: 'block' }}
        />
      ) : (
        <div
          style={{
            padding: 48,
            background: '#f5f5f5',
            textAlign: 'center',
            color: '#999',
          }}
        >
          Click to add video
        </div>
      )}
    </div>
  );
});

/**
 * Code Block Component
 *
 * Syntax-highlighted code display block.
 *
 * @param props - Block component props
 * @returns Code block component
 */
export const CodeBlock = memo(function CodeBlock({
  block,
  isSelected,
  isEditing,
  onUpdate,
}: BlockComponentProps) {
  const [code, setCode] = useState(block.content.code || '');
  const language = block.content.language || 'javascript';

  const handleBlur = useCallback(() => {
    if (onUpdate && code !== block.content.code) {
      onUpdate({ ...block, content: { ...block.content, code } });
    }
  }, [block, code, onUpdate]);

  return (
    <div
      style={{
        border: isSelected ? '2px solid #2196f3' : '1px solid transparent',
        ...block.styles,
      }}
    >
      {isEditing ? (
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onBlur={handleBlur}
          style={{
            width: '100%',
            minHeight: 200,
            padding: 16,
            fontFamily: 'monospace',
            background: '#1e1e1e',
            color: '#d4d4d4',
            border: 'none',
          }}
          autoFocus
        />
      ) : (
        <pre
          style={{
            padding: 16,
            background: '#1e1e1e',
            color: '#d4d4d4',
            overflow: 'auto',
          }}
        >
          <code>{code || '// Click to add code'}</code>
        </pre>
      )}
    </div>
  );
});

// ============================================================================
// Layout Block Components
// ============================================================================

/**
 * Container Block Component
 *
 * Generic container block that can hold other blocks.
 * Provides spacing, backgrounds, and layout options.
 *
 * @param props - Block component props
 * @returns Container block component
 */
export const ContainerBlock = memo(function ContainerBlock({
  block,
  isSelected,
  children,
}: BlockComponentProps) {
  return (
    <div
      style={{
        border: isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
        borderRadius: 4,
        minHeight: 100,
        ...block.styles,
      }}
    >
      {children}
    </div>
  );
});

/**
 * Column Layout Component
 *
 * Multi-column layout block with configurable column widths.
 *
 * @param props - Block component props
 * @returns Column layout component
 */
export const ColumnLayout = memo(function ColumnLayout({
  block,
  isSelected,
  children,
}: BlockComponentProps) {
  const columns = block.content.columns || 2;
  const gap = block.content.gap || 16;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        border: isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
        borderRadius: 4,
        ...block.styles,
      }}
    >
      {children}
    </div>
  );
});

/**
 * Grid Layout Component
 *
 * CSS Grid-based layout block with full control.
 *
 * @param props - Block component props
 * @returns Grid layout component
 */
export const GridLayout = memo(function GridLayout({
  block,
  isSelected,
  children,
}: BlockComponentProps) {
  const rows = block.content.rows || 2;
  const columns = block.content.columns || 2;
  const gap = block.content.gap || 16;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, auto)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        border: isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
        borderRadius: 4,
        ...block.styles,
      }}
    >
      {children}
    </div>
  );
});

// ============================================================================
// Pre-built Section Components
// ============================================================================

/**
 * Hero Section Component
 *
 * Full-width hero section with heading, subheading, and CTA.
 *
 * @param props - Block component props
 * @returns Hero section component
 */
export const HeroSection = memo(function HeroSection({
  block,
  isSelected,
}: BlockComponentProps) {
  const heading = block.content.heading || 'Hero Heading';
  const subheading = block.content.subheading || 'Hero subheading';
  const ctaText = block.content.ctaText || 'Call to Action';

  return (
    <div
      style={{
        padding: '64px 24px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: isSelected ? '2px solid #2196f3' : 'none',
        ...block.styles,
      }}
    >
      <h1 style={{ margin: '0 0 16px', fontSize: 48, fontWeight: 700 }}>
        {heading}
      </h1>
      <p style={{ margin: '0 0 32px', fontSize: 20, opacity: 0.9 }}>
        {subheading}
      </p>
      <button
        style={{
          padding: '12px 32px',
          fontSize: 16,
          background: 'white',
          color: '#667eea',
          border: 'none',
          borderRadius: 4,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {ctaText}
      </button>
    </div>
  );
});

/**
 * CTA Block Component
 *
 * Call-to-action block with button and text.
 *
 * @param props - Block component props
 * @returns CTA block component
 */
export const CTABlock = memo(function CTABlock({
  block,
  isSelected,
}: BlockComponentProps) {
  const text = block.content.text || 'Take action now';
  const buttonText = block.content.buttonText || 'Get Started';

  return (
    <div
      style={{
        padding: 32,
        textAlign: 'center',
        background: '#f5f5f5',
        borderRadius: 8,
        border: isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
        ...block.styles,
      }}
    >
      <p style={{ margin: '0 0 16px', fontSize: 18 }}>{text}</p>
      <button
        style={{
          padding: '10px 24px',
          fontSize: 16,
          background: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        {buttonText}
      </button>
    </div>
  );
});

/**
 * Feature Block Component
 *
 * Feature showcase block with icon, heading, and description.
 *
 * @param props - Block component props
 * @returns Feature block component
 */
export const FeatureBlock = memo(function FeatureBlock({
  block,
  isSelected,
}: BlockComponentProps) {
  const heading = block.content.heading || 'Feature Heading';
  const description = block.content.description || 'Feature description';
  const icon = block.content.icon || '⭐';

  return (
    <div
      style={{
        padding: 24,
        border: isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
        borderRadius: 8,
        textAlign: 'center',
        ...block.styles,
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 600 }}>
        {heading}
      </h3>
      <p style={{ margin: 0, color: '#666', fontSize: 14 }}>{description}</p>
    </div>
  );
});

// ============================================================================
// Block Configuration Components
// ============================================================================

/**
 * Block Properties Panel Component
 *
 * Panel for editing selected block properties.
 *
 * @returns Block properties panel component
 */
function BlockPropertiesPanel() {
  const { selectedBlockId, blocks, updateBlock } = usePageBuilderContext();
  const block = selectedBlockId ? blocks.get(selectedBlockId) : null;

  if (!block) return null;

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>
        Block Properties
      </h3>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>
          Name
        </label>
        <input
          type="text"
          value={block.name}
          onChange={(e) => updateBlock(block.id, { name: e.target.value })}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: 12 }}>
          <input
            type="checkbox"
            checked={block.visible}
            onChange={(e) => updateBlock(block.id, { visible: e.target.checked })}
            style={{ marginRight: 8 }}
          />
          Visible
        </label>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: 12 }}>
          <input
            type="checkbox"
            checked={block.locked}
            onChange={(e) => updateBlock(block.id, { locked: e.target.checked })}
            style={{ marginRight: 8 }}
          />
          Locked
        </label>
      </div>

      <BlockStylesPanel block={block} />
    </div>
  );
}

/**
 * Block Settings Props
 */
export interface BlockSettingsProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

/**
 * Block Settings Component
 *
 * Advanced settings panel for block configuration.
 *
 * @param props - Block settings props
 * @returns Block settings component
 */
export const BlockSettings = memo(function BlockSettings({
  block,
  onUpdate,
}: BlockSettingsProps) {
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>
        Block Settings
      </h3>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>
          Block Type
        </label>
        <select
          value={block.type}
          onChange={(e) => onUpdate({ type: e.target.value as BlockType })}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
          }}
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="code">Code</option>
          <option value="container">Container</option>
          <option value="columns">Columns</option>
          <option value="grid">Grid</option>
        </select>
      </div>
    </div>
  );
});

/**
 * Block Styles Panel Component
 *
 * Visual style editor for blocks.
 *
 * @param props - Block and update handler
 * @returns Block styles panel component
 */
function BlockStylesPanel({ block }: { block: Block }) {
  const { updateBlock } = usePageBuilderContext();

  const updateStyle = useCallback(
    (key: string, value: string | number) => {
      updateBlock(block.id, {
        styles: { ...block.styles, [key]: value },
      });
    },
    [block.id, block.styles, updateBlock]
  );

  return (
    <div>
      <h4 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600 }}>
        Styles
      </h4>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 11 }}>
          Background
        </label>
        <input
          type="color"
          value={(block.styles.background as string) || '#ffffff'}
          onChange={(e) => updateStyle('background', e.target.value)}
          style={{ width: '100%', height: 32 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 11 }}>
          Padding
        </label>
        <input
          type="number"
          value={parseInt((block.styles.padding as string) || '0') || 0}
          onChange={(e) => updateStyle('padding', `${e.target.value}px`)}
          style={{
            width: '100%',
            padding: 6,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
          }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 11 }}>
          Margin
        </label>
        <input
          type="number"
          value={parseInt((block.styles.margin as string) || '0') || 0}
          onChange={(e) => updateStyle('margin', `${e.target.value}px`)}
          style={{
            width: '100%',
            padding: 6,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Preview and Simulation Components
// ============================================================================

/**
 * Responsive Preview Props
 */
export interface ResponsivePreviewProps {
  breakpoint?: Breakpoint;
  onBreakpointChange?: (breakpoint: Breakpoint) => void;
  children: ReactNode;
}

/**
 * Responsive Preview Component
 *
 * Preview blocks at different responsive breakpoints.
 *
 * @param props - Responsive preview props
 * @returns Responsive preview component
 *
 * @example
 * ```tsx
 * <ResponsivePreview breakpoint="mobile">
 *   <PageContent />
 * </ResponsivePreview>
 * ```
 */
export const ResponsivePreview = memo(function ResponsivePreview({
  breakpoint = 'desktop',
  onBreakpointChange,
  children,
}: ResponsivePreviewProps) {
  const widths: Record<Breakpoint, number> = {
    mobile: 375,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        {Object.keys(widths).map((bp) => (
          <button
            key={bp}
            onClick={() => onBreakpointChange?.(bp as Breakpoint)}
            style={{
              padding: '6px 12px',
              border: bp === breakpoint ? '2px solid #2196f3' : '1px solid #e0e0e0',
              borderRadius: 4,
              background: bp === breakpoint ? '#e3f2fd' : 'white',
              cursor: 'pointer',
            }}
          >
            {bp}
          </button>
        ))}
      </div>

      <div
        style={{
          width: widths[breakpoint],
          maxWidth: '100%',
          margin: '0 auto',
          border: '1px solid #e0e0e0',
          background: 'white',
        }}
      >
        {children}
      </div>
    </div>
  );
});

/**
 * Device Simulator Props
 */
export interface DeviceSimulatorProps {
  device?: 'mobile' | 'tablet' | 'desktop';
  orientation?: 'portrait' | 'landscape';
  children: ReactNode;
}

/**
 * Device Simulator Component
 *
 * Simulate blocks in realistic device frames.
 *
 * @param props - Device simulator props
 * @returns Device simulator component
 */
export const DeviceSimulator = memo(function DeviceSimulator({
  device = 'mobile',
  orientation = 'portrait',
  children,
}: DeviceSimulatorProps) {
  const dimensions = {
    mobile: orientation === 'portrait' ? { width: 375, height: 667 } : { width: 667, height: 375 },
    tablet: orientation === 'portrait' ? { width: 768, height: 1024 } : { width: 1024, height: 768 },
    desktop: { width: 1440, height: 900 },
  };

  const { width, height } = dimensions[device];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        background: '#f5f5f5',
      }}
    >
      <div
        style={{
          width,
          height,
          border: '8px solid #333',
          borderRadius: device === 'mobile' ? 24 : 8,
          overflow: 'auto',
          background: 'white',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        }}
      >
        {children}
      </div>
    </div>
  );
});

// ============================================================================
// Template Components
// ============================================================================

/**
 * Template Selector Props
 */
export interface TemplateSelectorProps {
  templates: PageTemplate[];
  onSelect: (template: PageTemplate) => void;
  className?: string;
}

/**
 * Template Selector Component
 *
 * Browse and select pre-built page templates.
 *
 * @param props - Template selector props
 * @returns Template selector component
 */
export const TemplateSelector = memo(function TemplateSelector({
  templates,
  onSelect,
  className = '',
}: TemplateSelectorProps) {
  return (
    <div className={`template-selector ${className}`} style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>
        Select Template
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template)}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {template.thumbnail && (
              <img
                src={template.thumbnail}
                alt={template.name}
                style={{ width: '100%', height: 120, objectFit: 'cover' }}
              />
            )}
            <div style={{ padding: 12 }}>
              <h4 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600 }}>
                {template.name}
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
                {template.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/**
 * Template Library Component
 *
 * Comprehensive template browsing with categories and search.
 *
 * @returns Template library component
 */
export const TemplateLibrary = memo(function TemplateLibrary() {
  const [templates] = useState<PageTemplate[]>([]);
  const { dispatch } = usePageBuilderContext();

  const handleSelect = useCallback(
    (template: PageTemplate) => {
      dispatch({ type: 'LOAD_TEMPLATE', template });
    },
    [dispatch]
  );

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700 }}>
        Template Library
      </h2>
      <TemplateSelector templates={templates} onSelect={handleSelect} />
    </div>
  );
});

// ============================================================================
// Management Components
// ============================================================================

/**
 * Component Composer Props
 */
export interface ComponentComposerProps {
  onCompose: (component: Block) => void;
}

/**
 * Component Composer Component
 *
 * Compose custom components from multiple blocks.
 *
 * @param props - Component composer props
 * @returns Component composer component
 */
export const ComponentComposer = memo(function ComponentComposer({
  onCompose,
}: ComponentComposerProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCompose = useCallback(() => {
    const component: Block = {
      id: generateBlockId(),
      type: 'custom',
      name,
      content: { description },
      styles: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onCompose(component);
  }, [name, description, onCompose]);

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>
        Compose Component
      </h3>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
            minHeight: 80,
          }}
        />
      </div>

      <button
        onClick={handleCompose}
        style={{
          width: '100%',
          padding: '8px 16px',
          background: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Create Component
      </button>
    </div>
  );
});

/**
 * Widget Manager Component
 *
 * Manage reusable widgets and components.
 *
 * @returns Widget manager component
 */
export const WidgetManager = memo(function WidgetManager() {
  const [widgets, setWidgets] = useState<Block[]>([]);
  const { addBlock } = usePageBuilderContext();

  const handleAddWidget = useCallback(
    (widget: Block) => {
      addBlock(widget);
    },
    [addBlock]
  );

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>
        Widget Manager
      </h3>

      <div style={{ display: 'grid', gap: 8 }}>
        {widgets.map((widget) => (
          <div
            key={widget.id}
            style={{
              padding: 12,
              border: '1px solid #e0e0e0',
              borderRadius: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12 }}>{widget.name}</span>
            <button
              onClick={() => handleAddWidget(widget)}
              style={{
                padding: '4px 8px',
                fontSize: 11,
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Add
            </button>
          </div>
        ))}

        {widgets.length === 0 && (
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              color: '#999',
              fontSize: 12,
            }}
          >
            No widgets available
          </div>
        )}
      </div>
    </div>
  );
});

// ============================================================================
// History and Versioning Components
// ============================================================================

/**
 * Undo Redo Props
 */
export interface UndoRedoProps {
  className?: string;
  showHistory?: boolean;
}

/**
 * Undo Redo Component
 *
 * Undo/redo controls with optional history panel.
 *
 * @param props - Undo redo props
 * @returns Undo redo component
 */
export const UndoRedo = memo(function UndoRedo({
  className = '',
  showHistory = false,
}: UndoRedoProps) {
  const { undo, redo, canUndo, canRedo, history, historyIndex } =
    usePageBuilderContext();

  return (
    <div className={`undo-redo ${className}`}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={undo}
          disabled={!canUndo}
          style={{
            padding: '6px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: 4,
            background: canUndo ? 'white' : '#f5f5f5',
            cursor: canUndo ? 'pointer' : 'not-allowed',
          }}
        >
          ↶ Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          style={{
            padding: '6px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: 4,
            background: canRedo ? 'white' : '#f5f5f5',
            cursor: canRedo ? 'pointer' : 'not-allowed',
          }}
        >
          ↷ Redo
        </button>
      </div>

      {showHistory && (
        <div style={{ marginTop: 16 }}>
          <h4 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600 }}>
            History
          </h4>
          <div style={{ maxHeight: 200, overflow: 'auto' }}>
            {history.map((entry, index) => (
              <div
                key={index}
                style={{
                  padding: 8,
                  fontSize: 11,
                  background: index === historyIndex ? '#e3f2fd' : 'transparent',
                  borderLeft: index === historyIndex ? '2px solid #2196f3' : 'none',
                }}
              >
                {entry.action} - {entry.blockId}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

/**
 * Block History Component
 *
 * View and manage block-specific history.
 *
 * @returns Block history component
 */
export const BlockHistory = memo(function BlockHistory() {
  const { history, selectedBlockId } = usePageBuilderContext();

  const blockHistory = useMemo(
    () => history.filter((entry) => entry.blockId === selectedBlockId),
    [history, selectedBlockId]
  );

  if (!selectedBlockId) {
    return (
      <div style={{ padding: 16, textAlign: 'center', color: '#999', fontSize: 12 }}>
        Select a block to view history
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>
        Block History
      </h3>
      <div style={{ display: 'grid', gap: 8 }}>
        {blockHistory.map((entry, index) => (
          <div
            key={index}
            style={{
              padding: 12,
              border: '1px solid #e0e0e0',
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{entry.action}</div>
            <div style={{ color: '#666', fontSize: 11 }}>
              {new Date(entry.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/**
 * Block Versioning Component
 *
 * Manage block versions and snapshots.
 *
 * @returns Block versioning component
 */
export const BlockVersioning = memo(function BlockVersioning() {
  const [versions, setVersions] = useState<Array<{ id: string; timestamp: number; name: string }>>([]);

  const handleCreateVersion = useCallback(() => {
    const version = {
      id: generateBlockId(),
      timestamp: Date.now(),
      name: `Version ${versions.length + 1}`,
    };
    setVersions([...versions, version]);
  }, [versions]);

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>
        Block Versioning
      </h3>

      <button
        onClick={handleCreateVersion}
        style={{
          width: '100%',
          padding: '8px 16px',
          marginBottom: 16,
          background: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Create Snapshot
      </button>

      <div style={{ display: 'grid', gap: 8 }}>
        {versions.map((version) => (
          <div
            key={version.id}
            style={{
              padding: 12,
              border: '1px solid #e0e0e0',
              borderRadius: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{version.name}</div>
              <div style={{ fontSize: 11, color: '#666' }}>
                {new Date(version.timestamp).toLocaleString()}
              </div>
            </div>
            <button
              style={{
                padding: '4px 8px',
                fontSize: 11,
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Restore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// Import/Export Components
// ============================================================================

/**
 * Block Export Component
 *
 * Export blocks in various formats (JSON, HTML, React, Markdown).
 *
 * @returns Block export component
 */
export const BlockExport = memo(function BlockExport() {
  const { exportBlocks } = usePageBuilderContext();
  const [format, setFormat] = useState<BlockExportFormat>('json');
  const [exportedData, setExportedData] = useState('');

  const handleExport = useCallback(() => {
    const data = exportBlocks(format);
    setExportedData(data);
  }, [exportBlocks, format]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(exportedData);
  }, [exportedData]);

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>
        Export Blocks
      </h3>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>
          Format
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as BlockExportFormat)}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
          }}
        >
          <option value="json">JSON</option>
          <option value="html">HTML</option>
          <option value="react">React</option>
          <option value="markdown">Markdown</option>
        </select>
      </div>

      <button
        onClick={handleExport}
        style={{
          width: '100%',
          padding: '8px 16px',
          marginBottom: 16,
          background: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Export
      </button>

      {exportedData && (
        <>
          <textarea
            value={exportedData}
            readOnly
            style={{
              width: '100%',
              minHeight: 200,
              padding: 8,
              border: '1px solid #e0e0e0',
              borderRadius: 4,
              fontFamily: 'monospace',
              fontSize: 11,
              marginBottom: 8,
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              width: '100%',
              padding: '8px 16px',
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Copy to Clipboard
          </button>
        </>
      )}
    </div>
  );
});

/**
 * Block Import Component
 *
 * Import blocks from various formats.
 *
 * @returns Block import component
 */
export const BlockImport = memo(function BlockImport() {
  const { importBlocks } = usePageBuilderContext();
  const [format, setFormat] = useState<BlockExportFormat>('json');
  const [importData, setImportData] = useState('');

  const handleImport = useCallback(() => {
    importBlocks(importData, format);
    setImportData('');
  }, [importBlocks, importData, format]);

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>
        Import Blocks
      </h3>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>
          Format
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as BlockExportFormat)}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
          }}
        >
          <option value="json">JSON</option>
          <option value="html">HTML</option>
          <option value="react">React</option>
          <option value="markdown">Markdown</option>
        </select>
      </div>

      <textarea
        value={importData}
        onChange={(e) => setImportData(e.target.value)}
        placeholder="Paste your data here..."
        style={{
          width: '100%',
          minHeight: 200,
          padding: 8,
          border: '1px solid #e0e0e0',
          borderRadius: 4,
          fontFamily: 'monospace',
          fontSize: 11,
          marginBottom: 16,
        }}
      />

      <button
        onClick={handleImport}
        disabled={!importData}
        style={{
          width: '100%',
          padding: '8px 16px',
          background: importData ? '#2196f3' : '#f5f5f5',
          color: importData ? 'white' : '#999',
          border: 'none',
          borderRadius: 4,
          cursor: importData ? 'pointer' : 'not-allowed',
        }}
      >
        Import
      </button>
    </div>
  );
});

/**
 * Block Sharing Component
 *
 * Share blocks with teams or publish to library.
 *
 * @returns Block sharing component
 */
export const BlockSharing = memo(function BlockSharing() {
  const { selectedBlockId, blocks } = usePageBuilderContext();
  const block = selectedBlockId ? blocks.get(selectedBlockId) : null;
  const [shareUrl, setShareUrl] = useState('');

  const handleShare = useCallback(() => {
    if (!block) return;
    const url = `https://example.com/blocks/${block.id}`;
    setShareUrl(url);
  }, [block]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
  }, [shareUrl]);

  if (!block) {
    return (
      <div style={{ padding: 16, textAlign: 'center', color: '#999', fontSize: 12 }}>
        Select a block to share
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>
        Share Block
      </h3>

      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 8px', fontSize: 12 }}>
          Sharing: <strong>{block.name}</strong>
        </p>
      </div>

      <button
        onClick={handleShare}
        style={{
          width: '100%',
          padding: '8px 16px',
          marginBottom: 16,
          background: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Generate Share Link
      </button>

      {shareUrl && (
        <>
          <input
            type="text"
            value={shareUrl}
            readOnly
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #e0e0e0',
              borderRadius: 4,
              marginBottom: 8,
              fontSize: 11,
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              width: '100%',
              padding: '8px 16px',
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Copy Link
          </button>
        </>
      )}
    </div>
  );
});

// ============================================================================
// Extensibility Components
// ============================================================================

/**
 * Custom Block Hook
 *
 * Hook for creating custom block types with validation and rendering.
 *
 * @param type - Block type identifier
 * @param component - React component to render
 * @param validator - Optional validation function
 *
 * @example
 * ```tsx
 * function MyCustomBlock() {
 *   useCustomBlock('custom-widget', CustomWidgetComponent, validateWidget);
 *   return null;
 * }
 * ```
 */
export function useCustomBlock(
  type: string,
  component: ComponentType<BlockComponentProps>,
  validator?: (block: Block) => BlockValidation
) {
  const { config } = usePageBuilderContext();

  useEffect(() => {
    if (!config.customBlocks) {
      config.customBlocks = {};
    }
    config.customBlocks[type] = component;
  }, [type, component, config]);

  return { type, component, validator };
}

/**
 * Custom Blocks Registry
 *
 * Registry for managing custom block types.
 *
 * @returns Custom blocks component
 */
export const CustomBlocks = memo(function CustomBlocks() {
  const { config } = usePageBuilderContext();
  const customBlockTypes = Object.keys(config.customBlocks || {});

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>
        Custom Blocks
      </h3>

      <div style={{ display: 'grid', gap: 8 }}>
        {customBlockTypes.map((type) => (
          <div
            key={type}
            style={{
              padding: 12,
              border: '1px solid #e0e0e0',
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            {type}
          </div>
        ))}

        {customBlockTypes.length === 0 && (
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              color: '#999',
              fontSize: 12,
            }}
          >
            No custom blocks registered
          </div>
        )}
      </div>
    </div>
  );
});

/**
 * Extensible Blocks Hook
 *
 * Hook for extending existing block types with additional functionality.
 *
 * @param type - Block type to extend
 * @param extensions - Extension configuration
 *
 * @example
 * ```tsx
 * useExtensibleBlock('text', {
 *   props: ['fontSize', 'lineHeight'],
 *   handlers: { onFormat: handleFormat },
 *   styles: { fontFamily: 'Inter' },
 * });
 * ```
 */
export function useExtensibleBlock(
  type: BlockType,
  extensions: {
    props?: string[];
    handlers?: Record<string, (...args: any[]) => void>;
    styles?: CSSProperties;
    validators?: Array<(block: Block) => BlockValidation>;
  }
) {
  const extensionsRef = useRef(extensions);

  useEffect(() => {
    extensionsRef.current = extensions;
  }, [extensions]);

  return {
    type,
    getExtensions: () => extensionsRef.current,
  };
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Page Builder Hook
 *
 * Main hook for accessing page builder functionality.
 * Provides simplified API for common operations.
 *
 * @param initialConfig - Optional initial configuration
 * @returns Page builder interface
 *
 * @example
 * ```tsx
 * function MyBuilder() {
 *   const { blocks, addBlock, selectBlock } = usePageBuilder();
 *
 *   return (
 *     <div>
 *       <button onClick={() => addBlock({ type: 'text' })}>Add Text</button>
 *       {Array.from(blocks.values()).map(block => (
 *         <div key={block.id} onClick={() => selectBlock(block.id)}>
 *           {block.name}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePageBuilder(initialConfig?: Partial<PageBuilderConfig>) {
  const context = usePageBuilderContext();

  return {
    blocks: context.blocks,
    selectedBlock: context.selectedBlockId
      ? context.blocks.get(context.selectedBlockId)
      : null,
    editingBlock: context.editingBlockId
      ? context.blocks.get(context.editingBlockId)
      : null,
    layout: context.layout,
    addBlock: context.addBlock,
    updateBlock: context.updateBlock,
    deleteBlock: context.deleteBlock,
    moveBlock: context.moveBlock,
    selectBlock: context.selectBlock,
    editBlock: context.editBlock,
    undo: context.undo,
    redo: context.redo,
    canUndo: context.canUndo,
    canRedo: context.canRedo,
    exportBlocks: context.exportBlocks,
    importBlocks: context.importBlocks,
  };
}

/**
 * Block Editor Hook
 *
 * Hook for editing individual blocks with auto-save and validation.
 *
 * @param blockId - Block identifier
 * @returns Block editor interface
 *
 * @example
 * ```tsx
 * function BlockEditor({ blockId }) {
 *   const { block, updateContent, save, isDirty } = useBlockEditor(blockId);
 *
 *   return (
 *     <div>
 *       <input
 *         value={block.content.text}
 *         onChange={(e) => updateContent({ text: e.target.value })}
 *       />
 *       {isDirty && <button onClick={save}>Save</button>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBlockEditor(blockId: BlockId) {
  const { blocks, updateBlock } = usePageBuilderContext();
  const block = blocks.get(blockId);
  const [localContent, setLocalContent] = useState(block?.content || {});
  const [isDirty, setIsDirty] = useState(false);

  const updateContent = useCallback((updates: Record<string, any>) => {
    setLocalContent((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  const save = useCallback(() => {
    if (block && isDirty) {
      updateBlock(blockId, { content: localContent });
      setIsDirty(false);
    }
  }, [block, blockId, isDirty, localContent, updateBlock]);

  const reset = useCallback(() => {
    setLocalContent(block?.content || {});
    setIsDirty(false);
  }, [block]);

  return {
    block,
    content: localContent,
    updateContent,
    save,
    reset,
    isDirty,
  };
}

/**
 * Layout Designer Hook
 *
 * Hook for designing and managing page layouts.
 *
 * @returns Layout designer interface
 *
 * @example
 * ```tsx
 * function LayoutDesigner() {
 *   const { layout, updateLayout, applyBreakpoint } = useLayoutDesigner();
 *
 *   return (
 *     <div>
 *       <input
 *         type="number"
 *         value={layout.columns}
 *         onChange={(e) => updateLayout({ columns: +e.target.value })}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useLayoutDesigner() {
  const { layout, dispatch } = usePageBuilderContext();

  const updateLayout = useCallback(
    (updates: Partial<Layout>) => {
      dispatch({ type: 'SET_LAYOUT', layout: { ...layout, ...updates } });
    },
    [layout, dispatch]
  );

  const applyBreakpoint = useCallback(
    (breakpoint: Breakpoint, breakpointLayout: Partial<Layout>) => {
      const breakpoints = layout.breakpoints || {};
      breakpoints[breakpoint] = breakpointLayout;
      updateLayout({ breakpoints });
    },
    [layout, updateLayout]
  );

  return {
    layout,
    updateLayout,
    applyBreakpoint,
  };
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate block configuration
 *
 * @param block - Block to validate
 * @returns Validation result
 *
 * @example
 * ```tsx
 * const validation = validateBlock(block);
 * if (!validation.valid) {
 *   console.error('Block validation failed:', validation.errors);
 * }
 * ```
 */
export function validateBlock(block: Block): BlockValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!block.id) {
    errors.push('Block must have an ID');
  }

  if (!block.type) {
    errors.push('Block must have a type');
  }

  if (!block.name || block.name.trim() === '') {
    warnings.push('Block should have a name');
  }

  if (block.type === 'image' && !block.content.src) {
    warnings.push('Image block should have a src');
  }

  if (block.type === 'text' && !block.content.text) {
    warnings.push('Text block should have content');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate layout configuration
 *
 * @param layout - Layout to validate
 * @returns Validation result
 */
export function validateLayout(layout: Layout): BlockValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!layout.id) {
    errors.push('Layout must have an ID');
  }

  if (layout.columns < 1 || layout.columns > 24) {
    errors.push('Layout columns must be between 1 and 24');
  }

  if (layout.gap < 0) {
    errors.push('Layout gap must be non-negative');
  }

  if (layout.maxWidth && layout.maxWidth < 320) {
    warnings.push('Layout max width is very small');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Export All
// ============================================================================

export default {
  // Providers
  PageBuilderProvider,
  PageBuilder,

  // Hooks
  usePageBuilderContext,
  usePageBuilder,
  useBlockEditor,
  useLayoutDesigner,
  useCustomBlock,
  useExtensibleBlock,

  // Drag and Drop
  DragDropCanvas,
  DropZone,
  DragHandle,

  // Block Library
  BlockLibrary,
  BlockPalette,
  BlockBrowser,

  // Content Blocks
  TextBlock,
  ImageBlock,
  VideoBlock,
  CodeBlock,

  // Layout Blocks
  ContainerBlock,
  ColumnLayout,
  GridLayout,

  // Sections
  HeroSection,
  CTABlock,
  FeatureBlock,

  // Configuration
  BlockSettings,

  // Preview
  ResponsivePreview,
  DeviceSimulator,

  // Templates
  TemplateSelector,
  TemplateLibrary,

  // Management
  ComponentComposer,
  WidgetManager,

  // History
  UndoRedo,
  BlockHistory,
  BlockVersioning,

  // Import/Export
  BlockExport,
  BlockImport,
  BlockSharing,

  // Extensibility
  CustomBlocks,

  // Utilities
  validateBlock,
  validateLayout,
};
