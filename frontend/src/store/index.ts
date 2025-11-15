/**
 * Main Zustand Store for Page Builder
 *
 * This file integrates all slices and middleware into a single store.
 * Uses Zustand v5 with TypeScript for type-safe state management.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';

import type { PageBuilderStore, ComponentNode, StateSnapshot } from './types';
import {
  initialPageBuilderState,
  initialCanvasState,
  initialPreferencesState,
} from './utils/initial-state';
import {
  cloneComponentTree,
  removeComponentFromMap,
  insertComponentIntoMap,
  moveComponentInMap,
  isAncestor,
} from './utils/normalization';
import { indexedDBStorage } from './middleware/persistence';

/**
 * Main Page Builder Store
 *
 * This store uses a monolithic approach with logical slices for better
 * undo/redo and cross-domain operations.
 */
export const usePageBuilderStore = create<PageBuilderStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // ====================================================================
        // Initial State
        // ====================================================================
        ...initialPageBuilderState,

        // ====================================================================
        // Canvas Actions
        // ====================================================================

        addComponent: (componentData) => {
          const id = nanoid();
          const now = Date.now();

          const component: ComponentNode = {
            ...componentData,
            id,
            createdAt: now,
            updatedAt: now,
          };

          set(
            (state) => {
              state.canvas.components = insertComponentIntoMap(
                component,
                state.canvas.components,
                component.parentId
              );
            },
            false,
            'addComponent'
          );

          return id;
        },

        removeComponent: (componentId) => {
          set(
            (state) => {
              const result = removeComponentFromMap(
                componentId,
                state.canvas.components,
                true // Remove children
              );
              state.canvas.components = result.updatedMap;

              // Clear selection if removed component was selected
              state.selection.selectedIds = state.selection.selectedIds.filter(
                (id) => !result.removedIds.includes(id)
              );

              // Clear hover/focus if removed
              if (result.removedIds.includes(state.selection.hoveredId || '')) {
                state.selection.hoveredId = null;
              }
              if (result.removedIds.includes(state.selection.focusedId || '')) {
                state.selection.focusedId = null;
              }
            },
            false,
            'removeComponent'
          );
        },

        updateComponent: (componentId, updates) => {
          set(
            (state) => {
              const component = state.canvas.components.byId[componentId];
              if (component) {
                Object.assign(component, updates);
                component.updatedAt = Date.now();
              }
            },
            false,
            'updateComponent'
          );
        },

        moveComponent: (componentId, newParentId, index) => {
          set(
            (state) => {
              state.canvas.components = moveComponentInMap(
                componentId,
                newParentId,
                state.canvas.components,
                index
              );

              const component = state.canvas.components.byId[componentId];
              if (component) {
                component.updatedAt = Date.now();
              }
            },
            false,
            'moveComponent'
          );
        },

        duplicateComponent: (componentId) => {
          const state = get();
          const component = state.canvas.components.byId[componentId];

          if (!component) {
            console.warn(`Component ${componentId} not found`);
            return null;
          }

          const { clonedComponents, rootId } = cloneComponentTree(
            componentId,
            state.canvas.components,
            () => nanoid()
          );

          set(
            (state) => {
              clonedComponents.forEach((clonedComponent) => {
                state.canvas.components.byId[clonedComponent.id] = clonedComponent;
                state.canvas.components.allIds.push(clonedComponent.id);
              });

              // Add root to appropriate parent
              const clonedRoot = state.canvas.components.byId[rootId];
              if (clonedRoot.parentId === null) {
                state.canvas.components.rootIds.push(rootId);
              }
            },
            false,
            'duplicateComponent'
          );

          return rootId;
        },

        clearCanvas: () => {
          set(
            (state) => {
              state.canvas = initialCanvasState;
              state.selection.selectedIds = [];
              state.selection.hoveredId = null;
              state.selection.focusedId = null;
            },
            false,
            'clearCanvas'
          );
        },

        setActivePageId: (pageId) => {
          set(
            (state) => {
              state.canvas.activePageId = pageId;
            },
            false,
            'setActivePageId'
          );
        },

        // ====================================================================
        // Selection Actions
        // ====================================================================

        select: (componentId, multiSelect = false) => {
          set((state) => {
            if (multiSelect) {
              if (!state.selection.selectedIds.includes(componentId)) {
                state.selection.selectedIds.push(componentId);
              }
            } else {
              state.selection.selectedIds = [componentId];
            }
            state.selection.focusedId = componentId;
          });
        },

        deselect: (componentId) => {
          set((state) => {
            state.selection.selectedIds = state.selection.selectedIds.filter(
              (id) => id !== componentId
            );
            if (state.selection.focusedId === componentId) {
              state.selection.focusedId =
                state.selection.selectedIds[0] || null;
            }
          });
        },

        selectMultiple: (componentIds) => {
          set((state) => {
            state.selection.selectedIds = componentIds;
            state.selection.focusedId = componentIds[0] || null;
          });
        },

        clearSelection: () => {
          set((state) => {
            state.selection.selectedIds = [];
            state.selection.focusedId = null;
          });
        },

        setHovered: (componentId) => {
          set((state) => {
            state.selection.hoveredId = componentId;
          });
        },

        setFocused: (componentId) => {
          set((state) => {
            state.selection.focusedId = componentId;
          });
        },

        // ====================================================================
        // Clipboard Actions
        // ====================================================================

        copy: (componentIds) => {
          const state = get();
          const components = componentIds
            .map((id) => state.canvas.components.byId[id])
            .filter((c): c is ComponentNode => c !== undefined);

          set((state) => {
            state.clipboard.copiedComponents = components;
            state.clipboard.operation = 'copy';
          });
        },

        cut: (componentIds) => {
          const state = get();
          const components = componentIds
            .map((id) => state.canvas.components.byId[id])
            .filter((c): c is ComponentNode => c !== undefined);

          set(
            (state) => {
              state.clipboard.copiedComponents = components;
              state.clipboard.operation = 'cut';
            },
            false,
            'cut'
          );
        },

        paste: (targetParentId = null) => {
          const state = get();
          const { copiedComponents, operation } = state.clipboard;

          if (copiedComponents.length === 0) return [];

          const pastedIds: string[] = [];

          set(
            (state) => {
              copiedComponents.forEach((component) => {
                const { clonedComponents, rootId } = cloneComponentTree(
                  component.id,
                  { byId: { [component.id]: component }, allIds: [component.id], rootIds: [component.id] },
                  () => nanoid()
                );

                // Update parent for pasted component
                const clonedRoot = clonedComponents[0];
                if (clonedRoot) {
                  clonedRoot.parentId = targetParentId;
                }

                // Add all cloned components to canvas
                clonedComponents.forEach((clonedComponent) => {
                  state.canvas.components.byId[clonedComponent.id] = clonedComponent;
                  state.canvas.components.allIds.push(clonedComponent.id);
                });

                // Add root to appropriate parent
                if (targetParentId === null) {
                  state.canvas.components.rootIds.push(rootId);
                } else {
                  const parent = state.canvas.components.byId[targetParentId];
                  if (parent) {
                    parent.childIds.push(rootId);
                  }
                }

                pastedIds.push(rootId);
              });

              // If operation was cut, clear clipboard
              if (operation === 'cut') {
                state.clipboard.copiedComponents = [];
                state.clipboard.operation = null;
              }
            },
            false,
            'paste'
          );

          return pastedIds;
        },

        clearClipboard: () => {
          set((state) => {
            state.clipboard.copiedComponents = [];
            state.clipboard.operation = null;
          });
        },

        // ====================================================================
        // History Actions
        // ====================================================================

        undo: () => {
          const state = get();
          const { past, future } = state.history;

          if (past.length === 0) {
            console.warn('Nothing to undo');
            return;
          }

          const previous = past[past.length - 1];
          const newPast = past.slice(0, -1);

          // Create snapshot of current state for redo
          const currentSnapshot: StateSnapshot = {
            id: nanoid(),
            timestamp: Date.now(),
            canvas: state.canvas,
            selection: state.selection,
            properties: state.properties,
            actionType: 'undo',
          };

          set((state) => {
            // Restore previous state
            state.canvas = previous.canvas;
            state.selection = previous.selection;
            state.properties = previous.properties;

            // Update history
            state.history.past = newPast;
            state.history.future = [currentSnapshot, ...future];
          });
        },

        redo: () => {
          const state = get();
          const { past, future } = state.history;

          if (future.length === 0) {
            console.warn('Nothing to redo');
            return;
          }

          const next = future[0];
          const newFuture = future.slice(1);

          // Create snapshot of current state
          const currentSnapshot: StateSnapshot = {
            id: nanoid(),
            timestamp: Date.now(),
            canvas: state.canvas,
            selection: state.selection,
            properties: state.properties,
            actionType: 'redo',
          };

          set((state) => {
            // Restore next state
            state.canvas = next.canvas;
            state.selection = next.selection;
            state.properties = next.properties;

            // Update history
            state.history.past = [...past, currentSnapshot];
            state.history.future = newFuture;
          });
        },

        clearHistory: () => {
          set((state) => {
            state.history.past = [];
            state.history.future = [];
          });
        },

        takeSnapshot: (actionType, actionPayload) => {
          const state = get();
          const snapshot: StateSnapshot = {
            id: nanoid(),
            timestamp: Date.now(),
            canvas: state.canvas,
            selection: state.selection,
            properties: state.properties,
            actionType,
            actionPayload,
          };

          set((state) => {
            state.history.past = [...state.history.past, snapshot];
            state.history.future = []; // Clear future on new action

            // Trim past if exceeds limit
            if (state.history.past.length > state.history.maxSnapshots) {
              state.history.past.shift();
            }
          });
        },

        // ====================================================================
        // Preview Actions
        // ====================================================================

        togglePreview: () => {
          set((state) => {
            state.preview.isPreviewMode = !state.preview.isPreviewMode;
          });
        },

        setPreviewMode: (isPreview) => {
          set((state) => {
            state.preview.isPreviewMode = isPreview;
          });
        },

        setViewport: (viewport) => {
          set((state) => {
            state.preview.viewport = { ...state.preview.viewport, ...viewport };
          });
        },

        setDevice: (device) => {
          set((state) => {
            state.preview.viewport.device = device;

            // Update viewport size based on device
            switch (device) {
              case 'desktop':
                state.preview.viewport.width = 1920;
                state.preview.viewport.height = 1080;
                break;
              case 'tablet':
                state.preview.viewport.width = 768;
                state.preview.viewport.height = 1024;
                break;
              case 'mobile':
                state.preview.viewport.width = 375;
                state.preview.viewport.height = 667;
                break;
            }
          });
        },

        // ====================================================================
        // Workflow Actions
        // ====================================================================

        addPage: (pageData) => {
          const id = nanoid();
          const now = Date.now();

          const page = {
            ...pageData,
            id,
            createdAt: now,
            updatedAt: now,
          };

          set(
            (state) => {
              state.workflow.pages.byId[id] = page;
              state.workflow.pages.allIds.push(id);
            },
            false,
            'addPage'
          );

          return id;
        },

        removePage: (pageId) => {
          set(
            (state) => {
              delete state.workflow.pages.byId[pageId];
              state.workflow.pages.allIds = state.workflow.pages.allIds.filter(
                (id) => id !== pageId
              );

              if (state.workflow.currentPageId === pageId) {
                state.workflow.currentPageId = state.workflow.pages.allIds[0] || null;
              }
            },
            false,
            'removePage'
          );
        },

        updatePage: (pageId, updates) => {
          set(
            (state) => {
              const page = state.workflow.pages.byId[pageId];
              if (page) {
                Object.assign(page, updates);
                page.updatedAt = Date.now();
              }
            },
            false,
            'updatePage'
          );
        },

        setCurrentPage: (pageId) => {
          set((state) => {
            state.workflow.currentPageId = pageId;
          });
        },

        reorderPages: (pageIds) => {
          set(
            (state) => {
              state.workflow.pages.allIds = pageIds;
            },
            false,
            'reorderPages'
          );
        },

        // ====================================================================
        // Properties Actions
        // ====================================================================

        updateProperty: (componentId, propertyKey, value) => {
          set(
            (state) => {
              if (!state.properties.componentProperties[componentId]) {
                state.properties.componentProperties[componentId] = {};
              }
              state.properties.componentProperties[componentId][propertyKey] = value;

              // Also update component
              const component = state.canvas.components.byId[componentId];
              if (component) {
                component.properties[propertyKey] = value;
                component.updatedAt = Date.now();
              }
            },
            false,
            'updateProperty'
          );
        },

        updateProperties: (componentId, properties) => {
          set(
            (state) => {
              if (!state.properties.componentProperties[componentId]) {
                state.properties.componentProperties[componentId] = {};
              }
              Object.assign(state.properties.componentProperties[componentId], properties);

              // Also update component
              const component = state.canvas.components.byId[componentId];
              if (component) {
                Object.assign(component.properties, properties);
                component.updatedAt = Date.now();
              }
            },
            false,
            'updateProperties'
          );
        },

        resetProperties: (componentId) => {
          set(
            (state) => {
              delete state.properties.componentProperties[componentId];

              // Reset component properties
              const component = state.canvas.components.byId[componentId];
              if (component) {
                component.properties = {};
                component.updatedAt = Date.now();
              }
            },
            false,
            'resetProperties'
          );
        },

        // ====================================================================
        // Preferences Actions
        // ====================================================================

        updatePreference: (key, value) => {
          set((state) => {
            state.preferences[key] = value;
          });
        },

        resetPreferences: () => {
          set((state) => {
            state.preferences = initialPreferencesState;
          });
        },

        // ====================================================================
        // Collaboration Actions
        // ====================================================================

        joinSession: (sessionId, user) => {
          set((state) => {
            state.collaboration.sessionId = sessionId;
            state.collaboration.isConnected = true;
            state.collaboration.activeUsers.push({
              ...user,
              lastActive: Date.now(),
            });
          });
        },

        leaveSession: () => {
          set((state) => {
            state.collaboration.sessionId = null;
            state.collaboration.isConnected = false;
            state.collaboration.activeUsers = [];
            state.collaboration.cursors = {};
            state.collaboration.locks = {};
          });
        },

        updateCursor: (userId, cursor) => {
          set((state) => {
            if (cursor === null) {
              delete state.collaboration.cursors[userId];
            } else {
              state.collaboration.cursors[userId] = cursor;
            }

            // Update user's last active time
            const user = state.collaboration.activeUsers.find((u) => u.id === userId);
            if (user) {
              user.lastActive = Date.now();
              user.cursor = cursor;
            }
          });
        },

        lockComponent: (componentId, userId) => {
          set((state) => {
            state.collaboration.locks[componentId] = userId;
          });
        },

        unlockComponent: (componentId) => {
          set((state) => {
            delete state.collaboration.locks[componentId];
          });
        },

        setConnectionStatus: (isConnected) => {
          set((state) => {
            state.collaboration.isConnected = isConnected;
          });
        },

        updateActiveUsers: (users) => {
          set((state) => {
            state.collaboration.activeUsers = users;
          });
        },
      })),
      {
        name: 'page-builder-storage',
        storage: indexedDBStorage,
        // Only persist certain slices
        partialize: (state) => ({
          canvas: state.canvas,
          properties: state.properties,
          workflow: state.workflow,
          preferences: state.preferences,
        }),
        version: 1,
      }
    ),
    {
      name: 'PageBuilderStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// Export store type for external use
export type { PageBuilderStore };
