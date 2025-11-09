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
import React, { type ReactNode, type ComponentType, type CSSProperties } from 'react';
/**
 * Unique identifier for blocks
 */
export type BlockId = string;
/**
 * Block type identifier
 */
export type BlockType = 'text' | 'image' | 'video' | 'code' | 'container' | 'columns' | 'grid' | 'hero' | 'cta' | 'feature' | 'custom';
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
type PageBuilderAction = {
    type: 'ADD_BLOCK';
    block: Block;
    parentId?: BlockId;
} | {
    type: 'UPDATE_BLOCK';
    blockId: BlockId;
    updates: Partial<Block>;
} | {
    type: 'DELETE_BLOCK';
    blockId: BlockId;
} | {
    type: 'MOVE_BLOCK';
    blockId: BlockId;
    parentId?: BlockId;
    index?: number;
} | {
    type: 'SELECT_BLOCK';
    blockId: BlockId | null;
} | {
    type: 'EDIT_BLOCK';
    blockId: BlockId | null;
} | {
    type: 'SET_LAYOUT';
    layout: Layout;
} | {
    type: 'UNDO';
} | {
    type: 'REDO';
} | {
    type: 'START_DRAG';
    block: Block;
} | {
    type: 'END_DRAG';
} | {
    type: 'SET_DROP_TARGET';
    blockId: BlockId | null;
} | {
    type: 'LOAD_TEMPLATE';
    template: PageTemplate;
} | {
    type: 'CLEAR_ALL';
};
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
export declare function usePageBuilderContext(): PageBuilderContextValue;
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
export declare function PageBuilderProvider({ children, initialBlocks, initialLayout, config, onSave, }: PageBuilderProviderProps): boolean;
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
export declare const PageBuilder: any;
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
export declare const DragDropCanvas: any;
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
export declare const DropZone: any;
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
export declare const DragHandle: any;
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
export declare const BlockLibrary: any;
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
export declare const BlockPalette: any;
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
export declare const BlockBrowser: any;
/**
 * Text Block Component
 *
 * Editable text content block with rich formatting support.
 *
 * @param props - Block component props
 * @returns Text block component
 */
export declare const TextBlock: any;
/**
 * Image Block Component
 *
 * Image display block with upload and configuration options.
 *
 * @param props - Block component props
 * @returns Image block component
 */
export declare const ImageBlock: any;
/**
 * Video Block Component
 *
 * Video embed block supporting various video platforms.
 *
 * @param props - Block component props
 * @returns Video block component
 */
export declare const VideoBlock: any;
/**
 * Code Block Component
 *
 * Syntax-highlighted code display block.
 *
 * @param props - Block component props
 * @returns Code block component
 */
export declare const CodeBlock: any;
/**
 * Container Block Component
 *
 * Generic container block that can hold other blocks.
 * Provides spacing, backgrounds, and layout options.
 *
 * @param props - Block component props
 * @returns Container block component
 */
export declare const ContainerBlock: any;
/**
 * Column Layout Component
 *
 * Multi-column layout block with configurable column widths.
 *
 * @param props - Block component props
 * @returns Column layout component
 */
export declare const ColumnLayout: any;
/**
 * Grid Layout Component
 *
 * CSS Grid-based layout block with full control.
 *
 * @param props - Block component props
 * @returns Grid layout component
 */
export declare const GridLayout: any;
/**
 * Hero Section Component
 *
 * Full-width hero section with heading, subheading, and CTA.
 *
 * @param props - Block component props
 * @returns Hero section component
 */
export declare const HeroSection: any;
/**
 * CTA Block Component
 *
 * Call-to-action block with button and text.
 *
 * @param props - Block component props
 * @returns CTA block component
 */
export declare const CTABlock: any;
/**
 * Feature Block Component
 *
 * Feature showcase block with icon, heading, and description.
 *
 * @param props - Block component props
 * @returns Feature block component
 */
export declare const FeatureBlock: any;
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
export declare const BlockSettings: any;
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
export declare const ResponsivePreview: any;
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
export declare const DeviceSimulator: any;
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
export declare const TemplateSelector: any;
/**
 * Template Library Component
 *
 * Comprehensive template browsing with categories and search.
 *
 * @returns Template library component
 */
export declare const TemplateLibrary: any;
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
export declare const ComponentComposer: any;
/**
 * Widget Manager Component
 *
 * Manage reusable widgets and components.
 *
 * @returns Widget manager component
 */
export declare const WidgetManager: any;
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
export declare const UndoRedo: any;
/**
 * Block History Component
 *
 * View and manage block-specific history.
 *
 * @returns Block history component
 */
export declare const BlockHistory: any;
/**
 * Block Versioning Component
 *
 * Manage block versions and snapshots.
 *
 * @returns Block versioning component
 */
export declare const BlockVersioning: any;
/**
 * Block Export Component
 *
 * Export blocks in various formats (JSON, HTML, React, Markdown).
 *
 * @returns Block export component
 */
export declare const BlockExport: any;
/**
 * Block Import Component
 *
 * Import blocks from various formats.
 *
 * @returns Block import component
 */
export declare const BlockImport: any;
/**
 * Block Sharing Component
 *
 * Share blocks with teams or publish to library.
 *
 * @returns Block sharing component
 */
export declare const BlockSharing: any;
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
export declare function useCustomBlock(type: string, component: ComponentType<BlockComponentProps>, validator?: (block: Block) => BlockValidation): {
    type: string;
    component: ComponentType<BlockComponentProps>;
    validator: ((block: Block) => BlockValidation) | undefined;
};
/**
 * Custom Blocks Registry
 *
 * Registry for managing custom block types.
 *
 * @returns Custom blocks component
 */
export declare const CustomBlocks: any;
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
export declare function useExtensibleBlock(type: BlockType, extensions: {
    props?: string[];
    handlers?: Record<string, (...args: any[]) => void>;
    styles?: CSSProperties;
    validators?: Array<(block: Block) => BlockValidation>;
}): {
    type: BlockType;
    getExtensions: () => any;
};
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
export declare function usePageBuilder(initialConfig?: Partial<PageBuilderConfig>): {
    blocks: Map<string, Block>;
    selectedBlock: Block | null | undefined;
    editingBlock: Block | null | undefined;
    layout: Layout;
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
};
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
export declare function useBlockEditor(blockId: BlockId): {
    block: Block | undefined;
    content: any;
    updateContent: any;
    save: any;
    reset: any;
    isDirty: any;
};
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
export declare function useLayoutDesigner(): {
    layout: Layout;
    updateLayout: any;
    applyBreakpoint: any;
};
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
export declare function validateBlock(block: Block): BlockValidation;
/**
 * Validate layout configuration
 *
 * @param layout - Layout to validate
 * @returns Validation result
 */
export declare function validateLayout(layout: Layout): BlockValidation;
declare const _default: {
    PageBuilderProvider: typeof PageBuilderProvider;
    PageBuilder: any;
    usePageBuilderContext: typeof usePageBuilderContext;
    usePageBuilder: typeof usePageBuilder;
    useBlockEditor: typeof useBlockEditor;
    useLayoutDesigner: typeof useLayoutDesigner;
    useCustomBlock: typeof useCustomBlock;
    useExtensibleBlock: typeof useExtensibleBlock;
    DragDropCanvas: any;
    DropZone: any;
    DragHandle: any;
    BlockLibrary: any;
    BlockPalette: any;
    BlockBrowser: any;
    TextBlock: any;
    ImageBlock: any;
    VideoBlock: any;
    CodeBlock: any;
    ContainerBlock: any;
    ColumnLayout: any;
    GridLayout: any;
    HeroSection: any;
    CTABlock: any;
    FeatureBlock: any;
    BlockSettings: any;
    ResponsivePreview: any;
    DeviceSimulator: any;
    TemplateSelector: any;
    TemplateLibrary: any;
    ComponentComposer: any;
    WidgetManager: any;
    UndoRedo: any;
    BlockHistory: any;
    BlockVersioning: any;
    BlockExport: any;
    BlockImport: any;
    BlockSharing: any;
    CustomBlocks: any;
    validateBlock: typeof validateBlock;
    validateLayout: typeof validateLayout;
};
export default _default;
//# sourceMappingURL=page-builder-kit.d.ts.map