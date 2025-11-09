"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomBlocks = exports.BlockSharing = exports.BlockImport = exports.BlockExport = exports.BlockVersioning = exports.BlockHistory = exports.UndoRedo = exports.WidgetManager = exports.ComponentComposer = exports.TemplateLibrary = exports.TemplateSelector = exports.DeviceSimulator = exports.ResponsivePreview = exports.BlockSettings = exports.FeatureBlock = exports.CTABlock = exports.HeroSection = exports.GridLayout = exports.ColumnLayout = exports.ContainerBlock = exports.CodeBlock = exports.VideoBlock = exports.ImageBlock = exports.TextBlock = exports.BlockBrowser = exports.BlockPalette = exports.BlockLibrary = exports.DragHandle = exports.DropZone = exports.DragDropCanvas = exports.PageBuilder = void 0;
exports.usePageBuilderContext = usePageBuilderContext;
exports.PageBuilderProvider = PageBuilderProvider;
exports.useCustomBlock = useCustomBlock;
exports.useExtensibleBlock = useExtensibleBlock;
exports.usePageBuilder = usePageBuilder;
exports.useBlockEditor = useBlockEditor;
exports.useLayoutDesigner = useLayoutDesigner;
exports.validateBlock = validateBlock;
exports.validateLayout = validateLayout;
const react_1 = __importStar(require("react"));
const PageBuilderContext = (0, react_1.createContext)(null);
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
function usePageBuilderContext() {
    const context = (0, react_1.useContext)(PageBuilderContext);
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
function generateBlockId() {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Page builder reducer
 */
function pageBuilderReducer(state, action) {
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
            const historyEntry = {
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
                ].slice(-state.config.maxHistorySize),
                historyIndex: Math.min(state.historyIndex + 1, state.config.maxHistorySize - 1),
            };
        }
        case 'UPDATE_BLOCK': {
            const blocks = new Map(state.blocks);
            const block = blocks.get(action.blockId);
            if (!block)
                return state;
            const updatedBlock = {
                ...block,
                ...action.updates,
                updatedAt: Date.now(),
            };
            blocks.set(action.blockId, updatedBlock);
            const historyEntry = {
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
                ].slice(-state.config.maxHistorySize),
                historyIndex: Math.min(state.historyIndex + 1, state.config.maxHistorySize - 1),
            };
        }
        case 'DELETE_BLOCK': {
            const blocks = new Map(state.blocks);
            const block = blocks.get(action.blockId);
            if (!block)
                return state;
            // Delete children recursively
            const deleteRecursive = (id) => {
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
            const historyEntry = {
                timestamp: Date.now(),
                action: 'delete',
                blockId: action.blockId,
                previousState: block,
            };
            return {
                ...state,
                blocks,
                selectedBlockId: state.selectedBlockId === action.blockId ? null : state.selectedBlockId,
                editingBlockId: state.editingBlockId === action.blockId ? null : state.editingBlockId,
                history: [
                    ...state.history.slice(0, state.historyIndex + 1),
                    historyEntry,
                ].slice(-state.config.maxHistorySize),
                historyIndex: Math.min(state.historyIndex + 1, state.config.maxHistorySize - 1),
            };
        }
        case 'MOVE_BLOCK': {
            const blocks = new Map(state.blocks);
            const block = blocks.get(action.blockId);
            if (!block)
                return state;
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
                    }
                    else {
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
            const historyEntry = {
                timestamp: Date.now(),
                action: 'move',
                blockId: action.blockId,
                previousState: block,
                newState: blocks.get(action.blockId),
            };
            return {
                ...state,
                blocks,
                history: [
                    ...state.history.slice(0, state.historyIndex + 1),
                    historyEntry,
                ].slice(-state.config.maxHistorySize),
                historyIndex: Math.min(state.historyIndex + 1, state.config.maxHistorySize - 1),
            };
        }
        case 'SELECT_BLOCK':
            return { ...state, selectedBlockId: action.blockId };
        case 'EDIT_BLOCK':
            return { ...state, editingBlockId: action.blockId };
        case 'SET_LAYOUT':
            return { ...state, layout: action.layout };
        case 'UNDO': {
            if (state.historyIndex < 0)
                return state;
            const entry = state.history[state.historyIndex];
            const blocks = new Map(state.blocks);
            if (entry.action === 'add' && entry.newState) {
                blocks.delete(entry.blockId);
            }
            else if (entry.action === 'delete' && entry.previousState) {
                blocks.set(entry.blockId, entry.previousState);
            }
            else if (entry.action === 'update' && entry.previousState) {
                blocks.set(entry.blockId, entry.previousState);
            }
            return {
                ...state,
                blocks,
                historyIndex: state.historyIndex - 1,
            };
        }
        case 'REDO': {
            if (state.historyIndex >= state.history.length - 1)
                return state;
            const entry = state.history[state.historyIndex + 1];
            const blocks = new Map(state.blocks);
            if (entry.action === 'add' && entry.newState) {
                blocks.set(entry.blockId, entry.newState);
            }
            else if (entry.action === 'delete') {
                blocks.delete(entry.blockId);
            }
            else if (entry.action === 'update' && entry.newState) {
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
            const blocks = new Map();
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
/**
 * Default page builder configuration
 */
const defaultConfig = {
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
const defaultLayout = {
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
function PageBuilderProvider({ children, initialBlocks = [], initialLayout = defaultLayout, config = {}, onSave, }) {
    const mergedConfig = (0, react_1.useMemo)(() => ({ ...defaultConfig, ...config }), [config]);
    const [state, dispatch] = (0, react_1.useReducer)(pageBuilderReducer, {
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
    (0, react_1.useEffect)(() => {
        if (!mergedConfig.autosave || !onSave)
            return;
        const interval = setInterval(() => {
            onSave(Array.from(state.blocks.values()), state.layout);
        }, mergedConfig.autosaveInterval);
        return () => clearInterval(interval);
    }, [mergedConfig.autosave, mergedConfig.autosaveInterval, onSave, state.blocks, state.layout]);
    const addBlock = (0, react_1.useCallback)((blockData, parentId) => {
        const id = generateBlockId();
        const block = {
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
    }, []);
    const updateBlock = (0, react_1.useCallback)((blockId, updates) => {
        dispatch({ type: 'UPDATE_BLOCK', blockId, updates });
    }, []);
    const deleteBlock = (0, react_1.useCallback)((blockId) => {
        dispatch({ type: 'DELETE_BLOCK', blockId });
    }, []);
    const moveBlock = (0, react_1.useCallback)((blockId, parentId, index) => {
        dispatch({ type: 'MOVE_BLOCK', blockId, parentId, index });
    }, []);
    const selectBlock = (0, react_1.useCallback)((blockId) => {
        dispatch({ type: 'SELECT_BLOCK', blockId });
    }, []);
    const editBlock = (0, react_1.useCallback)((blockId) => {
        dispatch({ type: 'EDIT_BLOCK', blockId });
    }, []);
    const undo = (0, react_1.useCallback)(() => {
        dispatch({ type: 'UNDO' });
    }, []);
    const redo = (0, react_1.useCallback)(() => {
        dispatch({ type: 'REDO' });
    }, []);
    const canUndo = state.historyIndex >= 0;
    const canRedo = state.historyIndex < state.history.length - 1;
    const exportBlocks = (0, react_1.useCallback)((format) => {
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
    }, [state.blocks, state.layout]);
    const importBlocks = (0, react_1.useCallback)((data, format) => {
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
        }
        catch (error) {
            console.error('Failed to import blocks:', error);
        }
    }, []);
    const value = (0, react_1.useMemo)(() => ({
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
    }), [
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
    ]);
    return value = { value } >
        { children }
        < /PageBuilderContext.Provider>;
    ;
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
exports.PageBuilder = (0, react_1.memo)(function PageBuilder({ children, className = '', style, showToolbar = true, showSidebar = true, }) {
    return className = {} `page-builder ${className}`;
}, style = {}, {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    ...style,
});
    >
        { showToolbar } && />;
style;
{
    {
        display: 'flex', flex;
        1, overflow;
        'hidden';
    }
}
 >
    { showSidebar } && />;
style;
{
    {
        flex: 1, overflow;
        'auto';
    }
}
 > { children } < /main>
    < /div>
    < /div>;
;
;
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
    return style = {};
    {
        display: 'flex',
            alignItems;
        'center',
            gap;
        8,
            padding;
        '8px 16px',
            borderBottom;
        '1px solid #e0e0e0',
            backgroundColor;
        '#f5f5f5',
        ;
    }
}
    >
        onClick;
{
    undo;
}
disabled = {};
canUndo;
 >
    Undo
    < /button>
    < button;
onClick = { redo };
disabled = {};
canRedo;
 >
    Redo
    < /button>
    < div;
style = {};
{
    flex: 1;
}
/>
    < button;
onClick = { handleExport } > Export < /button>
    < button > Preview < /button>
    < button > Save < /button>
    < /div>;
;
/**
 * Page Builder Sidebar Component
 *
 * Left sidebar with block library and properties panel
 *
 * @returns Sidebar component
 */
function PageBuilderSidebar() {
    const { selectedBlockId } = usePageBuilderContext();
    return style = {};
    {
        width: 280,
            borderRight;
        '1px solid #e0e0e0',
            backgroundColor;
        '#fafafa',
            overflow;
        'auto',
        ;
    }
}
    >
        {} /  > ;
/>;
/aside>;
;
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
exports.DragDropCanvas = (0, react_1.memo)(function DragDropCanvas({ children, className = '', style, showGrid = true, gridSize = 8, }) {
    const { dragDropContext, dispatch } = usePageBuilderContext();
    const handleDragOver = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);
    const handleDrop = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        dispatch({ type: 'END_DRAG' });
    }, [dispatch]);
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
    return className = {} `drag-drop-canvas ${className}`;
}, onDragOver = { handleDragOver }, onDrop = { handleDrop }, style = {}, {
    position: 'relative',
    minHeight: '100%',
    padding: 24,
    background: gridBackground,
    ...style,
});
    >
        { dragDropContext, : .isDragging && style };
{
    {
        position: 'absolute',
            inset;
        0,
            backgroundColor;
        'rgba(0, 0, 0, 0.05)',
            pointerEvents;
        'none',
        ;
    }
}
/>;
{
    children;
}
/div>;
;
;
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
exports.DropZone = (0, react_1.memo)(function DropZone({ blockId, onDrop, className = '', style, children, }) {
    const { dragDropContext, dispatch } = usePageBuilderContext();
    const [isOver, setIsOver] = (0, react_1.useState)(false);
    const handleDragEnter = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        setIsOver(true);
        if (blockId) {
            dispatch({ type: 'SET_DROP_TARGET', blockId });
        }
    }, [blockId, dispatch]);
    const handleDragLeave = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        setIsOver(false);
    }, []);
    const handleDrop = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);
        if (dragDropContext.draggedBlock && onDrop) {
            onDrop(dragDropContext.draggedBlock.id);
        }
    }, [dragDropContext.draggedBlock, onDrop]);
    return className = {} `drop-zone ${className}`;
}, onDragEnter = { handleDragEnter }, onDragLeave = { handleDragLeave }, onDragOver = {}(e));
e.preventDefault();
onDrop = { handleDrop };
style = {};
{
    minHeight: 100,
        border;
    `2px dashed ${isOver ? '#2196f3' : '#e0e0e0'}`,
        borderRadius;
    4,
        backgroundColor;
    isOver ? 'rgba(33, 150, 243, 0.05)' : 'transparent',
        transition;
    'all 0.2s ease',
    ;
    style,
    ;
}
    >
        { children }
    < /div>;
;
;
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
exports.DragHandle = (0, react_1.memo)(function DragHandle({ block, className = '', style, children = '⋮⋮', }) {
    const { dispatch } = usePageBuilderContext();
    const handleDragStart = (0, react_1.useCallback)((e) => {
        e.dataTransfer.effectAllowed = 'move';
        dispatch({ type: 'START_DRAG', block });
    }, [block, dispatch]);
    const handleDragEnd = (0, react_1.useCallback)(() => {
        dispatch({ type: 'END_DRAG' });
    }, [dispatch]);
    return className = {} `drag-handle ${className}`;
}, draggable, onDragStart = { handleDragStart }, onDragEnd = { handleDragEnd }, style = {}, {
    cursor: 'grab',
    userSelect: 'none',
    padding: 4,
    ...style,
});
    >
        { children }
    < /div>;
;
;
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
exports.BlockLibrary = (0, react_1.memo)(function BlockLibrary({ categories = defaultBlockCategories, onBlockSelect, className = '', }) {
    const { addBlock } = usePageBuilderContext();
    const handleBlockClick = (0, react_1.useCallback)((type) => {
        addBlock({ type, name: `New ${type} block` });
        onBlockSelect?.(type);
    }, [addBlock, onBlockSelect]);
    return className = {} `block-library ${className}`;
}, style = {}, { padding: 16 });
 >
    style;
{
    {
        margin: '0 0 16px', fontSize;
        14, fontWeight;
        600;
    }
}
 >
    Block;
Library
    < /h3>;
{
    categories.map((category) => key = { category, : .id }, style = {}, { marginBottom: 24 });
}
 >
    style;
{
    {
        margin: '0 0 8px', fontSize;
        12, color;
        '#666';
    }
}
 >
    { category, : .name }
    < /h4>
    < div;
style = {};
{
    display: 'grid', gap;
    8;
}
 >
    { category, : .blocks.map((blockType) => key = { blockType }, onClick = {}(), handleBlockClick(blockType)) };
style = {};
{
    padding: '8px 12px',
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
        background;
    'white',
        textAlign;
    'left',
        cursor;
    'pointer',
    ;
}
    >
        { blockType }
    < /button>;
/div>
    < /div>;
/div>;
;
;
/**
 * Default block categories
 */
const defaultBlockCategories = [
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
 * Block Palette Component
 *
 * Compact palette of draggable block types.
 * Alternative to BlockLibrary for drag-to-add workflows.
 *
 * @param props - Block palette props
 * @returns Block palette component
 */
exports.BlockPalette = (0, react_1.memo)(function BlockPalette({ blocks, onBlockDragStart, className = '', }) {
    return className = {} `block-palette ${className}`;
}, style = {}, { display: 'flex', gap: 8, padding: 8, flexWrap: 'wrap' });
    >
        { blocks, : .map((type) => key = { type }, draggable, onDragStart = {}(), onBlockDragStart?.(type)) };
style = {};
{
    padding: '6px 12px',
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
        background;
    'white',
        cursor;
    'grab',
        fontSize;
    12,
    ;
}
    >
        { type }
    < /div>;
/div>;
;
;
/**
 * Block Browser Component
 *
 * Advanced block browsing interface with search and filtering.
 * Provides richer discovery experience than basic library.
 *
 * @param props - Block browser props
 * @returns Block browser component
 */
exports.BlockBrowser = (0, react_1.memo)(function BlockBrowser({ searchable = true, filterable = true, onBlockAdd, className = '', }) {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('all');
    const filteredBlocks = (0, react_1.useMemo)(() => {
        let blocks = defaultBlockCategories.flatMap((cat) => cat.blocks.map((type) => ({ type, category: cat.id })));
        if (selectedCategory !== 'all') {
            blocks = blocks.filter((b) => b.category === selectedCategory);
        }
        if (searchTerm) {
            blocks = blocks.filter((b) => b.type.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return blocks;
    }, [searchTerm, selectedCategory]);
    return className = {} `block-browser ${className}`;
}, style = {}, { padding: 16 });
 >
    { searchable } && type;
"text";
placeholder = "Search blocks...";
value = { searchTerm };
onChange = {}(e);
setSearchTerm(e.target.value);
style = {};
{
    width: '100%',
        padding;
    8,
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
        marginBottom;
    16,
    ;
}
/>;
{
    filterable && style;
    {
        {
            marginBottom: 16;
        }
    }
     >
        value;
    {
        selectedCategory;
    }
    onChange = {}(e);
    setSelectedCategory(e.target.value);
}
style = {};
{
    width: '100%',
        padding;
    8,
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
    ;
}
    >
        value;
"all" > All;
Categories < /option>;
{
    defaultBlockCategories.map((cat) => key = { cat, : .id }, value = { cat, : .id } >
        { cat, : .name }
        < /option>);
}
/select>
    < /div>;
style;
{
    {
        display: 'grid', gap;
        8;
    }
}
 >
    { filteredBlocks, : .map(({ type }) => key = { type }, onClick = {}(), onBlockAdd?.(type)) };
style = {};
{
    padding: '8px 12px',
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
        background;
    'white',
        textAlign;
    'left',
        cursor;
    'pointer',
    ;
}
    >
        { type }
    < /button>;
/div>
    < /div>;
;
;
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
exports.TextBlock = (0, react_1.memo)(function TextBlock({ block, isSelected, isEditing, onUpdate, }) {
    const [content, setContent] = (0, react_1.useState)(block.content.text || '');
    const handleBlur = (0, react_1.useCallback)(() => {
        if (onUpdate && content !== block.content.text) {
            onUpdate({ ...block, content: { ...block.content, text: content } });
        }
    }, [block, content, onUpdate]);
    return style = {};
    {
        padding: 16,
            border;
        isSelected ? '2px solid #2196f3' : '1px solid transparent',
        ;
    }
}, ...block.styles);
    >
        {}(e.target.value);
onBlur = { handleBlur };
style = {};
{
    width: '100%', minHeight;
    100, padding;
    8;
}
autoFocus
    /  >
;
({ content } || 'Click to edit text');
/div>;
/div>;
;
;
/**
 * Image Block Component
 *
 * Image display block with upload and configuration options.
 *
 * @param props - Block component props
 * @returns Image block component
 */
exports.ImageBlock = (0, react_1.memo)(function ImageBlock({ block, isSelected, onUpdate, }) {
    const src = block.content.src || '';
    const alt = block.content.alt || '';
    return style = {};
    {
        border: isSelected ? '2px solid #2196f3' : '1px solid transparent',
        ;
    }
}, ...block.styles);
    >
        {} /  >
;
style = {};
{
    padding: 48,
        background;
    '#f5f5f5',
        textAlign;
    'center',
        color;
    '#999',
    ;
}
    >
        Click;
to;
add;
image
    < /div>;
/div>;
;
;
/**
 * Video Block Component
 *
 * Video embed block supporting various video platforms.
 *
 * @param props - Block component props
 * @returns Video block component
 */
exports.VideoBlock = (0, react_1.memo)(function VideoBlock({ block, isSelected, }) {
    const src = block.content.src || '';
    const poster = block.content.poster || '';
    return style = {};
    {
        border: isSelected ? '2px solid #2196f3' : '1px solid transparent',
        ;
    }
}, ...block.styles);
    >
        {}
            /  >
;
style = {};
{
    padding: 48,
        background;
    '#f5f5f5',
        textAlign;
    'center',
        color;
    '#999',
    ;
}
    >
        Click;
to;
add;
video
    < /div>;
/div>;
;
;
/**
 * Code Block Component
 *
 * Syntax-highlighted code display block.
 *
 * @param props - Block component props
 * @returns Code block component
 */
exports.CodeBlock = (0, react_1.memo)(function CodeBlock({ block, isSelected, isEditing, onUpdate, }) {
    const [code, setCode] = (0, react_1.useState)(block.content.code || '');
    const language = block.content.language || 'javascript';
    const handleBlur = (0, react_1.useCallback)(() => {
        if (onUpdate && code !== block.content.code) {
            onUpdate({ ...block, content: { ...block.content, code } });
        }
    }, [block, code, onUpdate]);
    return style = {};
    {
        border: isSelected ? '2px solid #2196f3' : '1px solid transparent',
        ;
    }
}, ...block.styles);
    >
        {}(e.target.value);
onBlur = { handleBlur };
style = {};
{
    width: '100%',
        minHeight;
    200,
        padding;
    16,
        fontFamily;
    'monospace',
        background;
    '#1e1e1e',
        color;
    '#d4d4d4',
        border;
    'none',
    ;
}
autoFocus
    /  >
;
style = {};
{
    padding: 16,
        background;
    '#1e1e1e',
        color;
    '#d4d4d4',
        overflow;
    'auto',
    ;
}
    >
        { code } || '// Click to add code';
/code>
    < /pre>;
/div>;
;
;
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
exports.ContainerBlock = (0, react_1.memo)(function ContainerBlock({ block, isSelected, children, }) {
    return style = {};
    {
        border: isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
            borderRadius;
        4,
            minHeight;
        100,
        ;
    }
}, ...block.styles);
    >
        { children }
    < /div>;
;
;
/**
 * Column Layout Component
 *
 * Multi-column layout block with configurable column widths.
 *
 * @param props - Block component props
 * @returns Column layout component
 */
exports.ColumnLayout = (0, react_1.memo)(function ColumnLayout({ block, isSelected, children, }) {
    const columns = block.content.columns || 2;
    const gap = block.content.gap || 16;
    return style = {};
    {
        display: 'grid',
            gridTemplateColumns;
        `repeat(${columns}, 1fr)`,
            gap,
            border;
        isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
            borderRadius;
        4,
        ;
    }
}, ...block.styles);
    >
        { children }
    < /div>;
;
;
/**
 * Grid Layout Component
 *
 * CSS Grid-based layout block with full control.
 *
 * @param props - Block component props
 * @returns Grid layout component
 */
exports.GridLayout = (0, react_1.memo)(function GridLayout({ block, isSelected, children, }) {
    const rows = block.content.rows || 2;
    const columns = block.content.columns || 2;
    const gap = block.content.gap || 16;
    return style = {};
    {
        display: 'grid',
            gridTemplateRows;
        `repeat(${rows}, auto)`,
            gridTemplateColumns;
        `repeat(${columns}, 1fr)`,
            gap,
            border;
        isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
            borderRadius;
        4,
        ;
    }
}, ...block.styles);
    >
        { children }
    < /div>;
;
;
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
exports.HeroSection = (0, react_1.memo)(function HeroSection({ block, isSelected, }) {
    const heading = block.content.heading || 'Hero Heading';
    const subheading = block.content.subheading || 'Hero subheading';
    const ctaText = block.content.ctaText || 'Call to Action';
    return style = {};
    {
        padding: '64px 24px',
            textAlign;
        'center',
            background;
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color;
        'white',
            border;
        isSelected ? '2px solid #2196f3' : 'none',
        ;
    }
}, ...block.styles);
    >
        style;
{
    {
        margin: '0 0 16px', fontSize;
        48, fontWeight;
        700;
    }
}
 >
    { heading }
    < /h1>
    < p;
style = {};
{
    margin: '0 0 32px', fontSize;
    20, opacity;
    0.9;
}
 >
    { subheading }
    < /p>
    < button;
style = {};
{
    padding: '12px 32px',
        fontSize;
    16,
        background;
    'white',
        color;
    '#667eea',
        border;
    'none',
        borderRadius;
    4,
        fontWeight;
    600,
        cursor;
    'pointer',
    ;
}
    >
        { ctaText }
    < /button>
    < /div>;
;
;
/**
 * CTA Block Component
 *
 * Call-to-action block with button and text.
 *
 * @param props - Block component props
 * @returns CTA block component
 */
exports.CTABlock = (0, react_1.memo)(function CTABlock({ block, isSelected, }) {
    const text = block.content.text || 'Take action now';
    const buttonText = block.content.buttonText || 'Get Started';
    return style = {};
    {
        padding: 32,
            textAlign;
        'center',
            background;
        '#f5f5f5',
            borderRadius;
        8,
            border;
        isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
        ;
    }
}, ...block.styles);
    >
        style;
{
    {
        margin: '0 0 16px', fontSize;
        18;
    }
}
 > { text } < /p>
    < button;
style = {};
{
    padding: '10px 24px',
        fontSize;
    16,
        background;
    '#2196f3',
        color;
    'white',
        border;
    'none',
        borderRadius;
    4,
        cursor;
    'pointer',
    ;
}
    >
        { buttonText }
    < /button>
    < /div>;
;
;
/**
 * Feature Block Component
 *
 * Feature showcase block with icon, heading, and description.
 *
 * @param props - Block component props
 * @returns Feature block component
 */
exports.FeatureBlock = (0, react_1.memo)(function FeatureBlock({ block, isSelected, }) {
    const heading = block.content.heading || 'Feature Heading';
    const description = block.content.description || 'Feature description';
    const icon = block.content.icon || '⭐';
    return style = {};
    {
        padding: 24,
            border;
        isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
            borderRadius;
        8,
            textAlign;
        'center',
        ;
    }
}, ...block.styles);
    >
        style;
{
    {
        fontSize: 48, marginBottom;
        16;
    }
}
 > { icon } < /div>
    < h3;
style = {};
{
    margin: '0 0 8px', fontSize;
    20, fontWeight;
    600;
}
 >
    { heading }
    < /h3>
    < p;
style = {};
{
    margin: 0, color;
    '#666', fontSize;
    14;
}
 > { description } < /p>
    < /div>;
;
;
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
    if (!block)
        return null;
    return style = {};
    {
        padding: 16;
    }
}
 >
    style;
{
    {
        margin: '0 0 16px', fontSize;
        14, fontWeight;
        600;
    }
}
 >
    Block;
Properties
    < /h3>
    < div;
style = {};
{
    marginBottom: 16;
}
 >
    style;
{
    {
        display: 'block', marginBottom;
        4, fontSize;
        12;
    }
}
 >
    Name
    < /label>
    < input;
type = "text";
value = { block, : .name };
onChange = {}(e);
updateBlock(block.id, { name: e.target.value });
style = {};
{
    width: '100%',
        padding;
    8,
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
    ;
}
/>
    < /div>
    < div;
style = {};
{
    marginBottom: 16;
}
 >
    style;
{
    {
        display: 'flex', alignItems;
        'center', fontSize;
        12;
    }
}
 >
    type;
"checkbox";
checked = { block, : .visible };
onChange = {}(e);
updateBlock(block.id, { visible: e.target.checked });
style = {};
{
    marginRight: 8;
}
/>;
Visible
    < /label>
    < /div>
    < div;
style = {};
{
    marginBottom: 16;
}
 >
    style;
{
    {
        display: 'flex', alignItems;
        'center', fontSize;
        12;
    }
}
 >
    type;
"checkbox";
checked = { block, : .locked };
onChange = {}(e);
updateBlock(block.id, { locked: e.target.checked });
style = {};
{
    marginRight: 8;
}
/>;
Locked
    < /label>
    < /div>
    < BlockStylesPanel;
block = { block } /  >
    /div>;
;
/**
 * Block Settings Component
 *
 * Advanced settings panel for block configuration.
 *
 * @param props - Block settings props
 * @returns Block settings component
 */
exports.BlockSettings = (0, react_1.memo)(function BlockSettings({ block, onUpdate, }) {
    return style = {};
    {
        padding: 16;
    }
} >
    style, {}, { margin: '0 0 16px', fontSize: 14, fontWeight: 600 });
 >
    Block;
Settings
    < /h3>
    < div;
style = {};
{
    marginBottom: 16;
}
 >
    style;
{
    {
        display: 'block', marginBottom;
        4, fontSize;
        12;
    }
}
 >
    Block;
Type
    < /label>
    < select;
value = { block, : .type };
onChange = {}(e);
onUpdate({ type: e.target.value });
style = {};
{
    width: '100%',
        padding;
    8,
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
    ;
}
    >
        value;
"text" > Text < /option>
    < option;
value = "image" > Image < /option>
    < option;
value = "video" > Video < /option>
    < option;
value = "code" > Code < /option>
    < option;
value = "container" > Container < /option>
    < option;
value = "columns" > Columns < /option>
    < option;
value = "grid" > Grid < /option>
    < /select>
    < /div>
    < /div>;
;
;
/**
 * Block Styles Panel Component
 *
 * Visual style editor for blocks.
 *
 * @param props - Block and update handler
 * @returns Block styles panel component
 */
function BlockStylesPanel({ block }) {
    const { updateBlock } = usePageBuilderContext();
    const updateStyle = (0, react_1.useCallback)((key, value) => {
        updateBlock(block.id, {
            styles: { ...block.styles, [key]: value },
        });
    }, [block.id, block.styles, updateBlock]);
    return style = {};
    {
        margin: '0 0 12px', fontSize;
        12, fontWeight;
        600;
    }
}
 >
    Styles
    < /h4>
    < div;
style = {};
{
    marginBottom: 12;
}
 >
    style;
{
    {
        display: 'block', marginBottom;
        4, fontSize;
        11;
    }
}
 >
    Background
    < /label>
    < input;
type = "color";
value = {}(block.styles.background) || '#ffffff';
onChange = {}(e);
updateStyle('background', e.target.value);
style = {};
{
    width: '100%', height;
    32;
}
/>
    < /div>
    < div;
style = {};
{
    marginBottom: 12;
}
 >
    style;
{
    {
        display: 'block', marginBottom;
        4, fontSize;
        11;
    }
}
 >
    Padding
    < /label>
    < input;
type = "number";
value = { parseInt() { } }(block.styles.padding) || '0';
 || 0;
onChange = {}(e);
updateStyle('padding', `${e.target.value}px`);
style = {};
{
    width: '100%',
        padding;
    6,
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
    ;
}
/>
    < /div>
    < div;
style = {};
{
    marginBottom: 12;
}
 >
    style;
{
    {
        display: 'block', marginBottom;
        4, fontSize;
        11;
    }
}
 >
    Margin
    < /label>
    < input;
type = "number";
value = { parseInt() { } }(block.styles.margin) || '0';
 || 0;
onChange = {}(e);
updateStyle('margin', `${e.target.value}px`);
style = {};
{
    width: '100%',
        padding;
    6,
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
    ;
}
/>
    < /div>
    < /div>;
;
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
exports.ResponsivePreview = (0, react_1.memo)(function ResponsivePreview({ breakpoint = 'desktop', onBreakpointChange, children, }) {
    const widths = {
        mobile: 375,
        tablet: 768,
        desktop: 1024,
        wide: 1440,
    };
    return style = {};
    {
        padding: 16;
    }
} >
    style, {}, { marginBottom: 16, display: 'flex', gap: 8 });
 >
    { Object, : .keys(widths).map((bp) => key = { bp }, onClick = {}(), onBreakpointChange?.(bp)) };
style = {};
{
    padding: '6px 12px',
        border;
    bp === breakpoint ? '2px solid #2196f3' : '1px solid #e0e0e0',
        borderRadius;
    4,
        background;
    bp === breakpoint ? '#e3f2fd' : 'white',
        cursor;
    'pointer',
    ;
}
    >
        { bp }
    < /button>;
/div>
    < div;
style = {};
{
    width: widths[breakpoint],
        maxWidth;
    '100%',
        margin;
    '0 auto',
        border;
    '1px solid #e0e0e0',
        background;
    'white',
    ;
}
    >
        { children }
    < /div>
    < /div>;
;
;
/**
 * Device Simulator Component
 *
 * Simulate blocks in realistic device frames.
 *
 * @param props - Device simulator props
 * @returns Device simulator component
 */
exports.DeviceSimulator = (0, react_1.memo)(function DeviceSimulator({ device = 'mobile', orientation = 'portrait', children, }) {
    const dimensions = {
        mobile: orientation === 'portrait' ? { width: 375, height: 667 } : { width: 667, height: 375 },
        tablet: orientation === 'portrait' ? { width: 768, height: 1024 } : { width: 1024, height: 768 },
        desktop: { width: 1440, height: 900 },
    };
    const { width, height } = dimensions[device];
    return style = {};
    {
        display: 'flex',
            justifyContent;
        'center',
            alignItems;
        'center',
            padding;
        32,
            background;
        '#f5f5f5',
        ;
    }
}
    >
        style, {}, {
    width,
    height,
    border: '8px solid #333',
    borderRadius: device === 'mobile' ? 24 : 8,
    overflow: 'auto',
    background: 'white',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
});
    >
        { children }
    < /div>
    < /div>;
;
;
/**
 * Template Selector Component
 *
 * Browse and select pre-built page templates.
 *
 * @param props - Template selector props
 * @returns Template selector component
 */
exports.TemplateSelector = (0, react_1.memo)(function TemplateSelector({ templates, onSelect, className = '', }) {
    return className = {} `template-selector ${className}`;
}, style = {}, { padding: 16 });
 >
    style;
{
    {
        margin: '0 0 16px', fontSize;
        14, fontWeight;
        600;
    }
}
 >
    Select;
Template
    < /h3>
    < div;
style = {};
{
    display: 'grid', gridTemplateColumns;
    'repeat(auto-fill, minmax(200px, 1fr))', gap;
    16;
}
 >
    { templates, : .map((template) => key = { template, : .id }, onClick = {}(), onSelect(template)) };
style = {};
{
    border: '1px solid #e0e0e0',
        borderRadius;
    8,
        overflow;
    'hidden',
        cursor;
    'pointer',
        transition;
    'transform 0.2s',
    ;
}
onMouseEnter = {}(e);
{
    e.currentTarget.style.transform = 'translateY(-4px)';
}
onMouseLeave = {}(e);
{
    e.currentTarget.style.transform = 'translateY(0)';
}
    >
        { template, : .thumbnail && src };
{
    template.thumbnail;
}
alt = { template, : .name };
style = {};
{
    width: '100%', height;
    120, objectFit;
    'cover';
}
/>;
style;
{
    {
        padding: 12;
    }
}
 >
    style;
{
    {
        margin: '0 0 4px', fontSize;
        14, fontWeight;
        600;
    }
}
 >
    { template, : .name }
    < /h4>
    < p;
style = {};
{
    margin: 0, fontSize;
    12, color;
    '#666';
}
 >
    { template, : .description }
    < /p>
    < /div>
    < /div>;
/div>
    < /div>;
;
;
/**
 * Template Library Component
 *
 * Comprehensive template browsing with categories and search.
 *
 * @returns Template library component
 */
exports.TemplateLibrary = (0, react_1.memo)(function TemplateLibrary() {
    const [templates] = (0, react_1.useState)([]);
    const { dispatch } = usePageBuilderContext();
    const handleSelect = (0, react_1.useCallback)((template) => {
        dispatch({ type: 'LOAD_TEMPLATE', template });
    }, [dispatch]);
    return style = {};
    {
        padding: 24;
    }
} >
    style, {}, { margin: '0 0 24px', fontSize: 24, fontWeight: 700 });
 >
    Template;
Library
    < /h2>
    < exports.TemplateSelector;
templates = { templates };
onSelect = { handleSelect } /  >
    /div>;
;
;
/**
 * Component Composer Component
 *
 * Compose custom components from multiple blocks.
 *
 * @param props - Component composer props
 * @returns Component composer component
 */
exports.ComponentComposer = (0, react_1.memo)(function ComponentComposer({ onCompose, }) {
    const [name, setName] = (0, react_1.useState)('');
    const [description, setDescription] = (0, react_1.useState)('');
    const handleCompose = (0, react_1.useCallback)(() => {
        const component = {
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
    return style = {};
    {
        padding: 16;
    }
} >
    style, {}, { margin: '0 0 16px', fontSize: 14, fontWeight: 600 });
 >
    Compose;
Component
    < /h3>
    < div;
style = {};
{
    marginBottom: 16;
}
 >
    style;
{
    {
        display: 'block', marginBottom;
        4, fontSize;
        12;
    }
}
 >
    Name
    < /label>
    < input;
type = "text";
value = { name };
onChange = {}(e);
setName(e.target.value);
style = {};
{
    width: '100%',
        padding;
    8,
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
    ;
}
/>
    < /div>
    < div;
style = {};
{
    marginBottom: 16;
}
 >
    style;
{
    {
        display: 'block', marginBottom;
        4, fontSize;
        12;
    }
}
 >
    Description
    < /label>
    < textarea;
value = { description };
onChange = {}(e);
setDescription(e.target.value);
style = {};
{
    width: '100%',
        padding;
    8,
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
        minHeight;
    80,
    ;
}
/>
    < /div>
    < button;
onClick = { handleCompose };
style = {};
{
    width: '100%',
        padding;
    '8px 16px',
        background;
    '#2196f3',
        color;
    'white',
        border;
    'none',
        borderRadius;
    4,
        cursor;
    'pointer',
    ;
}
    >
        Create;
Component
    < /button>
    < /div>;
;
;
/**
 * Widget Manager Component
 *
 * Manage reusable widgets and components.
 *
 * @returns Widget manager component
 */
exports.WidgetManager = (0, react_1.memo)(function WidgetManager() {
    const [widgets, setWidgets] = (0, react_1.useState)([]);
    const { addBlock } = usePageBuilderContext();
    const handleAddWidget = (0, react_1.useCallback)((widget) => {
        addBlock(widget);
    }, [addBlock]);
    return style = {};
    {
        padding: 16;
    }
} >
    style, {}, { margin: '0 0 16px', fontSize: 14, fontWeight: 600 });
 >
    Widget;
Manager
    < /h3>
    < div;
style = {};
{
    display: 'grid', gap;
    8;
}
 >
    { widgets, : .map((widget) => key = { widget, : .id }, style = {}, {
            padding: 12,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }) }
    >
        style;
{
    {
        fontSize: 12;
    }
}
 > { widget, : .name } < /span>
    < button;
onClick = {}();
handleAddWidget(widget);
style = {};
{
    padding: '4px 8px',
        fontSize;
    11,
        background;
    '#2196f3',
        color;
    'white',
        border;
    'none',
        borderRadius;
    4,
        cursor;
    'pointer',
    ;
}
    >
        Add
    < /button>
    < /div>;
{
    widgets.length === 0 && style;
    {
        {
            padding: 24,
                textAlign;
            'center',
                color;
            '#999',
                fontSize;
            12,
            ;
        }
    }
        >
            No;
    widgets;
    available
        < /div>;
}
/div>
    < /div>;
;
;
/**
 * Undo Redo Component
 *
 * Undo/redo controls with optional history panel.
 *
 * @param props - Undo redo props
 * @returns Undo redo component
 */
exports.UndoRedo = (0, react_1.memo)(function UndoRedo({ className = '', showHistory = false, }) {
    const { undo, redo, canUndo, canRedo, history, historyIndex } = usePageBuilderContext();
    return className = {} `undo-redo ${className}`;
} >
    style, {}, { display: 'flex', gap: 8 });
 >
    onClick;
{
    undo;
}
disabled = {};
canUndo;
style = {};
{
    padding: '6px 12px',
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
        background;
    canUndo ? 'white' : '#f5f5f5',
        cursor;
    canUndo ? 'pointer' : 'not-allowed',
    ;
}
    >
;
Undo
    < /button>
    < button;
onClick = { redo };
disabled = {};
canRedo;
style = {};
{
    padding: '6px 12px',
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
        background;
    canRedo ? 'white' : '#f5f5f5',
        cursor;
    canRedo ? 'pointer' : 'not-allowed',
    ;
}
    >
;
Redo
    < /button>
    < /div>;
{
    showHistory && style;
    {
        {
            marginTop: 16;
        }
    }
     >
        style;
    {
        {
            margin: '0 0 8px', fontSize;
            12, fontWeight;
            600;
        }
    }
     >
        History
        < /h4>
        < div;
    style = {};
    {
        maxHeight: 200, overflow;
        'auto';
    }
}
 >
    { history, : .map((entry, index) => key = { index }, style = {}, {
            padding: 8,
            fontSize: 11,
            background: index === historyIndex ? '#e3f2fd' : 'transparent',
            borderLeft: index === historyIndex ? '2px solid #2196f3' : 'none',
        }) }
    >
        { entry, : .action } - { entry, : .blockId }
    < /div>;
/div>
    < /div>;
/div>;
;
;
/**
 * Block History Component
 *
 * View and manage block-specific history.
 *
 * @returns Block history component
 */
exports.BlockHistory = (0, react_1.memo)(function BlockHistory() {
    const { history, selectedBlockId } = usePageBuilderContext();
    const blockHistory = (0, react_1.useMemo)(() => history.filter((entry) => entry.blockId === selectedBlockId), [history, selectedBlockId]);
    if (!selectedBlockId) {
        return style = {};
        {
            padding: 16, textAlign;
            'center', color;
            '#999', fontSize;
            12;
        }
    }
     >
        Select;
    a;
    block;
    to;
    view;
    history
        < /div>;
});
return style = {};
{
    padding: 16;
}
 >
    style;
{
    {
        margin: '0 0 16px', fontSize;
        14, fontWeight;
        600;
    }
}
 >
    Block;
History
    < /h3>
    < div;
style = {};
{
    display: 'grid', gap;
    8;
}
 >
    { blockHistory, : .map((entry, index) => key = { index }, style = {}, {
            padding: 12,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
            fontSize: 12,
        }) }
    >
        style;
{
    {
        fontWeight: 600, marginBottom;
        4;
    }
}
 > { entry, : .action } < /div>
    < div;
style = {};
{
    color: '#666', fontSize;
    11;
}
 >
    { new: Date(entry.timestamp).toLocaleString() }
    < /div>
    < /div>;
/div>
    < /div>;
;
;
/**
 * Block Versioning Component
 *
 * Manage block versions and snapshots.
 *
 * @returns Block versioning component
 */
exports.BlockVersioning = (0, react_1.memo)(function BlockVersioning() {
    const [versions, setVersions] = (0, react_1.useState)([]);
    const handleCreateVersion = (0, react_1.useCallback)(() => {
        const version = {
            id: generateBlockId(),
            timestamp: Date.now(),
            name: `Version ${versions.length + 1}`,
        };
        setVersions([...versions, version]);
    }, [versions]);
    return style = {};
    {
        padding: 16;
    }
} >
    style, {}, { margin: '0 0 16px', fontSize: 14, fontWeight: 600 });
 >
    Block;
Versioning
    < /h3>
    < button;
onClick = { handleCreateVersion };
style = {};
{
    width: '100%',
        padding;
    '8px 16px',
        marginBottom;
    16,
        background;
    '#2196f3',
        color;
    'white',
        border;
    'none',
        borderRadius;
    4,
        cursor;
    'pointer',
    ;
}
    >
        Create;
Snapshot
    < /button>
    < div;
style = {};
{
    display: 'grid', gap;
    8;
}
 >
    { versions, : .map((version) => key = { version, : .id }, style = {}, {
            padding: 12,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }) }
    >
        style;
{
    {
        fontSize: 12, fontWeight;
        600;
    }
}
 > { version, : .name } < /div>
    < div;
style = {};
{
    fontSize: 11, color;
    '#666';
}
 >
    { new: Date(version.timestamp).toLocaleString() }
    < /div>
    < /div>
    < button;
style = {};
{
    padding: '4px 8px',
        fontSize;
    11,
        background;
    'white',
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
        cursor;
    'pointer',
    ;
}
    >
        Restore
    < /button>
    < /div>;
/div>
    < /div>;
;
;
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
exports.BlockExport = (0, react_1.memo)(function BlockExport() {
    const { exportBlocks } = usePageBuilderContext();
    const [format, setFormat] = (0, react_1.useState)('json');
    const [exportedData, setExportedData] = (0, react_1.useState)('');
    const handleExport = (0, react_1.useCallback)(() => {
        const data = exportBlocks(format);
        setExportedData(data);
    }, [exportBlocks, format]);
    const handleCopy = (0, react_1.useCallback)(() => {
        navigator.clipboard.writeText(exportedData);
    }, [exportedData]);
    return style = {};
    {
        padding: 16;
    }
} >
    style, {}, { margin: '0 0 16px', fontSize: 14, fontWeight: 600 });
 >
    Export;
Blocks
    < /h3>
    < div;
style = {};
{
    marginBottom: 16;
}
 >
    style;
{
    {
        display: 'block', marginBottom;
        4, fontSize;
        12;
    }
}
 >
    Format
    < /label>
    < select;
value = { format };
onChange = {}(e);
setFormat(e.target.value);
style = {};
{
    width: '100%',
        padding;
    8,
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
    ;
}
    >
        value;
"json" > JSON < /option>
    < option;
value = "html" > HTML < /option>
    < option;
value = "react" > react_1.default < /option>
    < option;
value = "markdown" > Markdown < /option>
    < /select>
    < /div>
    < button;
onClick = { handleExport };
style = {};
{
    width: '100%',
        padding;
    '8px 16px',
        marginBottom;
    16,
        background;
    '#2196f3',
        color;
    'white',
        border;
    'none',
        borderRadius;
    4,
        cursor;
    'pointer',
    ;
}
    >
        Export
    < /button>;
{
    exportedData && value;
    {
        exportedData;
    }
    readOnly;
    style = {};
    {
        width: '100%',
            minHeight;
        200,
            padding;
        8,
            border;
        '1px solid #e0e0e0',
            borderRadius;
        4,
            fontFamily;
        'monospace',
            fontSize;
        11,
            marginBottom;
        8,
        ;
    }
}
/>
    < button;
onClick = { handleCopy };
style = {};
{
    width: '100%',
        padding;
    '8px 16px',
        background;
    'white',
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
        cursor;
    'pointer',
    ;
}
    >
        Copy;
to;
Clipboard
    < /button>
    < />;
/div>;
;
;
/**
 * Block Import Component
 *
 * Import blocks from various formats.
 *
 * @returns Block import component
 */
exports.BlockImport = (0, react_1.memo)(function BlockImport() {
    const { importBlocks } = usePageBuilderContext();
    const [format, setFormat] = (0, react_1.useState)('json');
    const [importData, setImportData] = (0, react_1.useState)('');
    const handleImport = (0, react_1.useCallback)(() => {
        importBlocks(importData, format);
        setImportData('');
    }, [importBlocks, importData, format]);
    return style = {};
    {
        padding: 16;
    }
} >
    style, {}, { margin: '0 0 16px', fontSize: 14, fontWeight: 600 });
 >
    Import;
Blocks
    < /h3>
    < div;
style = {};
{
    marginBottom: 16;
}
 >
    style;
{
    {
        display: 'block', marginBottom;
        4, fontSize;
        12;
    }
}
 >
    Format
    < /label>
    < select;
value = { format };
onChange = {}(e);
setFormat(e.target.value);
style = {};
{
    width: '100%',
        padding;
    8,
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
    ;
}
    >
        value;
"json" > JSON < /option>
    < option;
value = "html" > HTML < /option>
    < option;
value = "react" > react_1.default < /option>
    < option;
value = "markdown" > Markdown < /option>
    < /select>
    < /div>
    < textarea;
value = { importData };
onChange = {}(e);
setImportData(e.target.value);
placeholder = "Paste your data here...";
style = {};
{
    width: '100%',
        minHeight;
    200,
        padding;
    8,
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
        fontFamily;
    'monospace',
        fontSize;
    11,
        marginBottom;
    16,
    ;
}
/>
    < button;
onClick = { handleImport };
disabled = {};
importData;
style = {};
{
    width: '100%',
        padding;
    '8px 16px',
        background;
    importData ? '#2196f3' : '#f5f5f5',
        color;
    importData ? 'white' : '#999',
        border;
    'none',
        borderRadius;
    4,
        cursor;
    importData ? 'pointer' : 'not-allowed',
    ;
}
    >
        Import
    < /button>
    < /div>;
;
;
/**
 * Block Sharing Component
 *
 * Share blocks with teams or publish to library.
 *
 * @returns Block sharing component
 */
exports.BlockSharing = (0, react_1.memo)(function BlockSharing() {
    const { selectedBlockId, blocks } = usePageBuilderContext();
    const block = selectedBlockId ? blocks.get(selectedBlockId) : null;
    const [shareUrl, setShareUrl] = (0, react_1.useState)('');
    const handleShare = (0, react_1.useCallback)(() => {
        if (!block)
            return;
        const url = `https://example.com/blocks/${block.id}`;
        setShareUrl(url);
    }, [block]);
    const handleCopy = (0, react_1.useCallback)(() => {
        navigator.clipboard.writeText(shareUrl);
    }, [shareUrl]);
    if (!block) {
        return style = {};
        {
            padding: 16, textAlign;
            'center', color;
            '#999', fontSize;
            12;
        }
    }
     >
        Select;
    a;
    block;
    to;
    share
        < /div>;
});
return style = {};
{
    padding: 16;
}
 >
    style;
{
    {
        margin: '0 0 16px', fontSize;
        14, fontWeight;
        600;
    }
}
 >
    Share;
Block
    < /h3>
    < div;
style = {};
{
    marginBottom: 16;
}
 >
    style;
{
    {
        margin: '0 0 8px', fontSize;
        12;
    }
}
 >
    Sharing;
({ block, : .name } < /strong>
    < /p>
    < /div>
    < button);
onClick = { handleShare };
style = {};
{
    width: '100%',
        padding;
    '8px 16px',
        marginBottom;
    16,
        background;
    '#2196f3',
        color;
    'white',
        border;
    'none',
        borderRadius;
    4,
        cursor;
    'pointer',
    ;
}
    >
        Generate;
Share;
Link
    < /button>;
{
    shareUrl && type;
    "text";
    value = { shareUrl };
    readOnly;
    style = {};
    {
        width: '100%',
            padding;
        8,
            border;
        '1px solid #e0e0e0',
            borderRadius;
        4,
            marginBottom;
        8,
            fontSize;
        11,
        ;
    }
}
/>
    < button;
onClick = { handleCopy };
style = {};
{
    width: '100%',
        padding;
    '8px 16px',
        background;
    'white',
        border;
    '1px solid #e0e0e0',
        borderRadius;
    4,
        cursor;
    'pointer',
    ;
}
    >
        Copy;
Link
    < /button>
    < />;
/div>;
;
;
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
function useCustomBlock(type, component, validator) {
    const { config } = usePageBuilderContext();
    (0, react_1.useEffect)(() => {
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
exports.CustomBlocks = (0, react_1.memo)(function CustomBlocks() {
    const { config } = usePageBuilderContext();
    const customBlockTypes = Object.keys(config.customBlocks || {});
    return style = {};
    {
        padding: 16;
    }
} >
    style, {}, { margin: '0 0 16px', fontSize: 14, fontWeight: 600 });
 >
    Custom;
Blocks
    < /h3>
    < div;
style = {};
{
    display: 'grid', gap;
    8;
}
 >
    { customBlockTypes, : .map((type) => key = { type }, style = {}, {
            padding: 12,
            border: '1px solid #e0e0e0',
            borderRadius: 4,
            fontSize: 12,
        }) }
    >
        { type }
    < /div>;
{
    customBlockTypes.length === 0 && style;
    {
        {
            padding: 24,
                textAlign;
            'center',
                color;
            '#999',
                fontSize;
            12,
            ;
        }
    }
        >
            No;
    custom;
    blocks;
    registered
        < /div>;
}
/div>
    < /div>;
;
;
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
function useExtensibleBlock(type, extensions) {
    const extensionsRef = (0, react_1.useRef)(extensions);
    (0, react_1.useEffect)(() => {
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
function usePageBuilder(initialConfig) {
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
function useBlockEditor(blockId) {
    const { blocks, updateBlock } = usePageBuilderContext();
    const block = blocks.get(blockId);
    const [localContent, setLocalContent] = (0, react_1.useState)(block?.content || {});
    const [isDirty, setIsDirty] = (0, react_1.useState)(false);
    const updateContent = (0, react_1.useCallback)((updates) => {
        setLocalContent((prev) => ({ ...prev, ...updates }));
        setIsDirty(true);
    }, []);
    const save = (0, react_1.useCallback)(() => {
        if (block && isDirty) {
            updateBlock(blockId, { content: localContent });
            setIsDirty(false);
        }
    }, [block, blockId, isDirty, localContent, updateBlock]);
    const reset = (0, react_1.useCallback)(() => {
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
function useLayoutDesigner() {
    const { layout, dispatch } = usePageBuilderContext();
    const updateLayout = (0, react_1.useCallback)((updates) => {
        dispatch({ type: 'SET_LAYOUT', layout: { ...layout, ...updates } });
    }, [layout, dispatch]);
    const applyBreakpoint = (0, react_1.useCallback)((breakpoint, breakpointLayout) => {
        const breakpoints = layout.breakpoints || {};
        breakpoints[breakpoint] = breakpointLayout;
        updateLayout({ breakpoints });
    }, [layout, updateLayout]);
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
function validateBlock(block) {
    const errors = [];
    const warnings = [];
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
function validateLayout(layout) {
    const errors = [];
    const warnings = [];
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
exports.default = {
    // Providers
    PageBuilderProvider,
    PageBuilder: exports.PageBuilder,
    // Hooks
    usePageBuilderContext,
    usePageBuilder,
    useBlockEditor,
    useLayoutDesigner,
    useCustomBlock,
    useExtensibleBlock,
    // Drag and Drop
    DragDropCanvas: exports.DragDropCanvas,
    DropZone: exports.DropZone,
    DragHandle: exports.DragHandle,
    // Block Library
    BlockLibrary: exports.BlockLibrary,
    BlockPalette: exports.BlockPalette,
    BlockBrowser: exports.BlockBrowser,
    // Content Blocks
    TextBlock: exports.TextBlock,
    ImageBlock: exports.ImageBlock,
    VideoBlock: exports.VideoBlock,
    CodeBlock: exports.CodeBlock,
    // Layout Blocks
    ContainerBlock: exports.ContainerBlock,
    ColumnLayout: exports.ColumnLayout,
    GridLayout: exports.GridLayout,
    // Sections
    HeroSection: exports.HeroSection,
    CTABlock: exports.CTABlock,
    FeatureBlock: exports.FeatureBlock,
    // Configuration
    BlockSettings: exports.BlockSettings,
    // Preview
    ResponsivePreview: exports.ResponsivePreview,
    DeviceSimulator: exports.DeviceSimulator,
    // Templates
    TemplateSelector: exports.TemplateSelector,
    TemplateLibrary: exports.TemplateLibrary,
    // Management
    ComponentComposer: exports.ComponentComposer,
    WidgetManager: exports.WidgetManager,
    // History
    UndoRedo: exports.UndoRedo,
    BlockHistory: exports.BlockHistory,
    BlockVersioning: exports.BlockVersioning,
    // Import/Export
    BlockExport: exports.BlockExport,
    BlockImport: exports.BlockImport,
    BlockSharing: exports.BlockSharing,
    // Extensibility
    CustomBlocks: exports.CustomBlocks,
    // Utilities
    validateBlock,
    validateLayout,
};
//# sourceMappingURL=page-builder-kit.js.map