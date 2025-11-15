/**
 * Next.js Drag-and-Drop GUI Builder - Zustand Store
 *
 * This is the main state management store using Zustand with Immer for immutable updates.
 * It provides a single source of truth for the entire page builder application.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type {
  ComponentId,
  ComponentInstance,
  PageBuilderState,
  CanvasState,
  SelectionState,
  ClipboardState,
  HistoryState,
  PreviewState,
  WorkflowState,
  PropertiesState,
  PreferencesState,
} from '../types';

// ============================================================================
// DEBOUNCE UTILITY
// ============================================================================

/**
 * Debounce helper to prevent excessive history saves during typing
 */
let debounceTimer: NodeJS.Timeout | null = null;

const debouncedSave = (callback: () => void, delay: number = 500) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(callback, delay);
};

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialCanvasState: CanvasState = {
  components: {
    byId: {},
    allIds: [],
    rootIds: [],
  },
  viewport: {
    zoom: 1,
    panX: 0,
    panY: 0,
  },
  grid: {
    enabled: true,
    size: 8,
    snapToGrid: true,
  },
};

const initialSelectionState: SelectionState = {
  selectedIds: [],
  hoveredId: null,
  focusedId: null,
};

const initialClipboardState: ClipboardState = {
  operation: null,
  components: [],
};

const initialHistoryState: HistoryState = {
  past: [],
  future: [],
  maxSize: 50,
};

const initialPreviewState: PreviewState = {
  isPreviewMode: false,
  device: 'desktop',
  orientation: 'portrait',
};

const initialWorkflowState: WorkflowState = {
  pages: [
    {
      id: nanoid(),
      name: 'Home',
      path: '/',
      canvasState: initialCanvasState,
    },
  ],
  currentPageId: '',
};

const initialPropertiesState: PropertiesState = {
  isPanelOpen: true,
  activeTab: 'properties',
};

const initialPreferencesState: PreferencesState = {
  theme: 'system',
  autoSave: true,
  autoSaveInterval: 30,
  showGrid: true,
  snapToGrid: true,
  gridSize: 8,
  zoom: 1,
};

// ============================================================================
// STORE ACTIONS INTERFACE
// ============================================================================

interface PageBuilderActions {
  // Canvas actions
  addComponent: (component: Omit<ComponentInstance, 'id' | 'createdAt' | 'updatedAt'>) => ComponentId;
  updateComponent: (id: ComponentId, updates: Partial<ComponentInstance>, debounce?: boolean) => void;
  deleteComponent: (id: ComponentId) => void;
  moveComponent: (id: ComponentId, parentId: ComponentId | null, position: { x: number; y: number }) => void;
  duplicateComponent: (id: ComponentId) => ComponentId | null;

  // Selection actions
  selectComponent: (id: ComponentId | null, multi?: boolean) => void;
  selectMultiple: (ids: ComponentId[]) => void;
  clearSelection: () => void;
  setHoveredComponent: (id: ComponentId | null) => void;
  setFocusedComponent: (id: ComponentId | null) => void;

  // Clipboard actions
  copy: () => void;
  cut: () => void;
  paste: () => void;

  // History actions
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  saveToHistoryDebounced: () => void;
  clearHistory: () => void;

  // Preview actions
  togglePreview: () => void;
  setDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  setOrientation: (orientation: 'portrait' | 'landscape') => void;

  // Workflow actions
  addPage: (name: string, path: string) => string;
  deletePage: (id: string) => void;
  setCurrentPage: (id: string) => void;
  renamePage: (id: string, name: string) => void;

  // Properties panel actions
  togglePropertiesPanel: () => void;
  setActiveTab: (tab: 'properties' | 'styles' | 'events') => void;

  // Viewport actions
  setZoom: (zoom: number) => void;
  setPan: (panX: number, panY: number) => void;
  resetViewport: () => void;

  // Grid actions
  toggleGrid: () => void;
  setGridSize: (size: number) => void;
  toggleSnapToGrid: () => void;

  // Preferences actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setAutoSave: (enabled: boolean) => void;
  setAutoSaveInterval: (seconds: number) => void;

  // Utility actions
  reset: () => void;
  loadProject: (state: Partial<PageBuilderState>) => void;
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const usePageBuilderStore = create<PageBuilderState & PageBuilderActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        canvas: initialCanvasState,
        selection: initialSelectionState,
        clipboard: initialClipboardState,
        history: initialHistoryState,
        preview: initialPreviewState,
        workflow: {
          ...initialWorkflowState,
          currentPageId: initialWorkflowState.pages[0].id,
        },
        properties: initialPropertiesState,
        preferences: initialPreferencesState,

        // ====================================================================
        // CANVAS ACTIONS
        // ====================================================================

        addComponent: (component) => {
          const id = nanoid() as ComponentId;
          const now = new Date().toISOString();

          set((state) => {
            const newComponent: ComponentInstance = {
              ...component,
              id,
              createdAt: now,
              updatedAt: now,
            };

            state.canvas.components.byId[id] = newComponent;
            state.canvas.components.allIds.push(id);

            if (newComponent.parentId === null) {
              state.canvas.components.rootIds.push(id);
            } else if (newComponent.parentId) {
              const parent = state.canvas.components.byId[newComponent.parentId];
              if (parent) {
                parent.childIds.push(id);
              }
            }

            // Auto-select new component
            state.selection.selectedIds = [id];
          });

          get().saveToHistory();
          return id;
        },

        updateComponent: (id, updates, debounce = false) => {
          set((state) => {
            const component = state.canvas.components.byId[id];
            if (component) {
              Object.assign(component, updates);
              component.updatedAt = new Date().toISOString();
            }
          });

          // Use debounced save for property changes (typing), immediate for structural changes
          if (debounce) {
            get().saveToHistoryDebounced();
          } else {
            get().saveToHistory();
          }
        },

        deleteComponent: (id) => {
          set((state) => {
            const component = state.canvas.components.byId[id];
            if (!component) return;

            // Remove from parent's children
            if (component.parentId) {
              const parent = state.canvas.components.byId[component.parentId];
              if (parent) {
                parent.childIds = parent.childIds.filter((childId) => childId !== id);
              }
            } else {
              state.canvas.components.rootIds = state.canvas.components.rootIds.filter(
                (rootId) => rootId !== id
              );
            }

            // Recursively delete children
            const deleteRecursive = (compId: ComponentId) => {
              const comp = state.canvas.components.byId[compId];
              if (!comp) return;

              comp.childIds.forEach(deleteRecursive);

              delete state.canvas.components.byId[compId];
              state.canvas.components.allIds = state.canvas.components.allIds.filter(
                (cId) => cId !== compId
              );
            };

            deleteRecursive(id);

            // Clear selection if deleted component was selected
            state.selection.selectedIds = state.selection.selectedIds.filter(
              (selectedId) => selectedId !== id
            );
          });

          get().saveToHistory();
        },

        moveComponent: (id, parentId, position) => {
          set((state) => {
            const component = state.canvas.components.byId[id];
            if (!component) return;

            // Remove from old parent
            if (component.parentId) {
              const oldParent = state.canvas.components.byId[component.parentId];
              if (oldParent) {
                oldParent.childIds = oldParent.childIds.filter((childId) => childId !== id);
              }
            } else {
              state.canvas.components.rootIds = state.canvas.components.rootIds.filter(
                (rootId) => rootId !== id
              );
            }

            // Add to new parent
            component.parentId = parentId;
            component.position = position;
            component.updatedAt = new Date().toISOString();

            if (parentId === null) {
              state.canvas.components.rootIds.push(id);
            } else {
              const newParent = state.canvas.components.byId[parentId];
              if (newParent) {
                newParent.childIds.push(id);
              }
            }
          });

          get().saveToHistory();
        },

        duplicateComponent: (id) => {
          const component = get().canvas.components.byId[id];
          if (!component) return null;

          const duplicateRecursive = (comp: ComponentInstance, newParentId: ComponentId | null): ComponentId => {
            const newId = nanoid() as ComponentId;
            const now = new Date().toISOString();

            const newComponent: ComponentInstance = {
              ...comp,
              id: newId,
              name: `${comp.name} (Copy)`,
              parentId: newParentId,
              childIds: [],
              position: {
                x: comp.position.x + 20,
                y: comp.position.y + 20,
              },
              createdAt: now,
              updatedAt: now,
            };

            set((state) => {
              state.canvas.components.byId[newId] = newComponent;
              state.canvas.components.allIds.push(newId);

              if (newParentId === null) {
                state.canvas.components.rootIds.push(newId);
              }
            });

            // Duplicate children
            comp.childIds.forEach((childId) => {
              const child = get().canvas.components.byId[childId];
              if (child) {
                const newChildId = duplicateRecursive(child, newId);
                set((state) => {
                  state.canvas.components.byId[newId].childIds.push(newChildId);
                });
              }
            });

            return newId;
          };

          const newId = duplicateRecursive(component, component.parentId);
          get().saveToHistory();
          return newId;
        },

        // ====================================================================
        // SELECTION ACTIONS
        // ====================================================================

        selectComponent: (id, multi = false) => {
          set((state) => {
            if (id === null) {
              state.selection.selectedIds = [];
            } else if (multi) {
              if (state.selection.selectedIds.includes(id)) {
                state.selection.selectedIds = state.selection.selectedIds.filter((i) => i !== id);
              } else {
                state.selection.selectedIds.push(id);
              }
            } else {
              state.selection.selectedIds = [id];
            }
          });
        },

        selectMultiple: (ids) => {
          set((state) => {
            state.selection.selectedIds = ids;
          });
        },

        clearSelection: () => {
          set((state) => {
            state.selection.selectedIds = [];
          });
        },

        setHoveredComponent: (id) => {
          set((state) => {
            state.selection.hoveredId = id;
          });
        },

        setFocusedComponent: (id) => {
          set((state) => {
            state.selection.focusedId = id;
          });
        },

        // ====================================================================
        // CLIPBOARD ACTIONS
        // ====================================================================

        copy: () => {
          const selectedIds = get().selection.selectedIds;
          const components = selectedIds.map((id) => get().canvas.components.byId[id]).filter(Boolean);

          set((state) => {
            state.clipboard.operation = 'copy';
            state.clipboard.components = components as ComponentInstance[];
          });
        },

        cut: () => {
          const selectedIds = get().selection.selectedIds;
          const components = selectedIds.map((id) => get().canvas.components.byId[id]).filter(Boolean);

          set((state) => {
            state.clipboard.operation = 'cut';
            state.clipboard.components = components as ComponentInstance[];
          });

          // Delete components
          selectedIds.forEach((id) => get().deleteComponent(id));
        },

        paste: () => {
          const { operation, components } = get().clipboard;
          if (!components.length) return;

          const newIds: ComponentId[] = [];

          components.forEach((comp) => {
            const newId = get().addComponent({
              ...comp,
              position: {
                x: comp.position.x + 20,
                y: comp.position.y + 20,
              },
            });
            newIds.push(newId);
          });

          // Select pasted components
          get().selectMultiple(newIds);

          // Clear clipboard if it was a cut operation
          if (operation === 'cut') {
            set((state) => {
              state.clipboard.operation = null;
              state.clipboard.components = [];
            });
          }
        },

        // ====================================================================
        // HISTORY ACTIONS
        // ====================================================================

        saveToHistory: () => {
          set((state) => {
            // Save current canvas state to history using structuredClone (10-100x faster than JSON.parse/stringify)
            const snapshot = structuredClone(state.canvas) as CanvasState;

            state.history.past.push(snapshot);

            // Limit history size
            if (state.history.past.length > state.history.maxSize) {
              state.history.past.shift();
            }

            // Clear future history
            state.history.future = [];
          });
        },

        saveToHistoryDebounced: () => {
          // Debounce history saves by 500ms to avoid saving on every keystroke
          debouncedSave(() => {
            get().saveToHistory();
          }, 500);
        },

        undo: () => {
          const pastState = get().history.past.at(-1);
          if (!pastState) return;

          set((state) => {
            // Save current state to future using structuredClone
            const currentSnapshot = structuredClone(state.canvas) as CanvasState;
            state.history.future.push(currentSnapshot);

            // Restore past state
            state.canvas = pastState;

            // Remove from past
            state.history.past.pop();
          });
        },

        redo: () => {
          const futureState = get().history.future.at(-1);
          if (!futureState) return;

          set((state) => {
            // Save current state to past using structuredClone
            const currentSnapshot = structuredClone(state.canvas) as CanvasState;
            state.history.past.push(currentSnapshot);

            // Restore future state
            state.canvas = futureState;

            // Remove from future
            state.history.future.pop();
          });
        },

        clearHistory: () => {
          set((state) => {
            state.history.past = [];
            state.history.future = [];
          });
        },

        // ====================================================================
        // PREVIEW ACTIONS
        // ====================================================================

        togglePreview: () => {
          set((state) => {
            state.preview.isPreviewMode = !state.preview.isPreviewMode;
          });
        },

        setDevice: (device) => {
          set((state) => {
            state.preview.device = device;
          });
        },

        setOrientation: (orientation) => {
          set((state) => {
            state.preview.orientation = orientation;
          });
        },

        // ====================================================================
        // WORKFLOW ACTIONS
        // ====================================================================

        addPage: (name, path) => {
          const id = nanoid();
          set((state) => {
            state.workflow.pages.push({
              id,
              name,
              path,
              canvasState: structuredClone(initialCanvasState),
            });
          });
          return id;
        },

        deletePage: (id) => {
          set((state) => {
            state.workflow.pages = state.workflow.pages.filter((page) => page.id !== id);

            // If current page was deleted, switch to first page
            if (state.workflow.currentPageId === id && state.workflow.pages.length > 0) {
              state.workflow.currentPageId = state.workflow.pages[0].id;
            }
          });
        },

        setCurrentPage: (id) => {
          set((state) => {
            state.workflow.currentPageId = id;
          });
        },

        renamePage: (id, name) => {
          set((state) => {
            const page = state.workflow.pages.find((p) => p.id === id);
            if (page) {
              page.name = name;
            }
          });
        },

        // ====================================================================
        // PROPERTIES PANEL ACTIONS
        // ====================================================================

        togglePropertiesPanel: () => {
          set((state) => {
            state.properties.isPanelOpen = !state.properties.isPanelOpen;
          });
        },

        setActiveTab: (tab) => {
          set((state) => {
            state.properties.activeTab = tab;
          });
        },

        // ====================================================================
        // VIEWPORT ACTIONS
        // ====================================================================

        setZoom: (zoom) => {
          set((state) => {
            state.canvas.viewport.zoom = Math.max(0.1, Math.min(5, zoom));
          });
        },

        setPan: (panX, panY) => {
          set((state) => {
            state.canvas.viewport.panX = panX;
            state.canvas.viewport.panY = panY;
          });
        },

        resetViewport: () => {
          set((state) => {
            state.canvas.viewport.zoom = 1;
            state.canvas.viewport.panX = 0;
            state.canvas.viewport.panY = 0;
          });
        },

        // ====================================================================
        // GRID ACTIONS
        // ====================================================================

        toggleGrid: () => {
          set((state) => {
            state.canvas.grid.enabled = !state.canvas.grid.enabled;
          });
        },

        setGridSize: (size) => {
          set((state) => {
            state.canvas.grid.size = size;
          });
        },

        toggleSnapToGrid: () => {
          set((state) => {
            state.canvas.grid.snapToGrid = !state.canvas.grid.snapToGrid;
          });
        },

        // ====================================================================
        // PREFERENCES ACTIONS
        // ====================================================================

        setTheme: (theme) => {
          set((state) => {
            state.preferences.theme = theme;
          });
        },

        setAutoSave: (enabled) => {
          set((state) => {
            state.preferences.autoSave = enabled;
          });
        },

        setAutoSaveInterval: (seconds) => {
          set((state) => {
            state.preferences.autoSaveInterval = seconds;
          });
        },

        // ====================================================================
        // UTILITY ACTIONS
        // ====================================================================

        reset: () => {
          set({
            canvas: initialCanvasState,
            selection: initialSelectionState,
            clipboard: initialClipboardState,
            history: initialHistoryState,
            preview: initialPreviewState,
            workflow: {
              ...initialWorkflowState,
              currentPageId: initialWorkflowState.pages[0].id,
            },
            properties: initialPropertiesState,
            preferences: initialPreferencesState,
          });
        },

        loadProject: (state) => {
          set((currentState) => {
            Object.assign(currentState, state);
          });
        },
      })),
      {
        name: 'page-builder-storage',
        partialize: (state) => ({
          canvas: state.canvas,
          workflow: state.workflow,
          preferences: state.preferences,
        }),
      }
    ),
    {
      name: 'PageBuilder',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useSelectedComponents = () =>
  usePageBuilderStore((state) =>
    state.selection.selectedIds.map((id) => state.canvas.components.byId[id]).filter(Boolean)
  );

export const useComponent = (id: ComponentId) =>
  usePageBuilderStore((state) => state.canvas.components.byId[id]);

export const useRootComponents = () =>
  usePageBuilderStore((state) =>
    state.canvas.components.rootIds.map((id) => state.canvas.components.byId[id]).filter(Boolean)
  );

export const useCanUndo = () => usePageBuilderStore((state) => state.history.past.length > 0);

export const useCanRedo = () => usePageBuilderStore((state) => state.history.future.length > 0);

export const useCurrentPage = () =>
  usePageBuilderStore((state) =>
    state.workflow.pages.find((page) => page.id === state.workflow.currentPageId)
  );
