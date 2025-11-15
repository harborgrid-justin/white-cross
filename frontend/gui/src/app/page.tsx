/**
 * Main Page - Next.js GUI Builder
 * Entry point for the drag-and-drop page builder
 */

'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { BuilderLayout } from '../components/BuilderLayout';
import { useKeyboardShortcuts } from '../hooks/usePageBuilder';
import { usePageBuilderStore } from '../store';

export default function PageBuilder() {
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const handleKeyDown = useKeyboardShortcuts();

  // Auto-save configuration
  const autoSave = usePageBuilderStore((state) => state.preferences.autoSave);
  const autoSaveInterval = usePageBuilderStore((state) => state.preferences.autoSaveInterval);
  const canvasState = usePageBuilderStore((state) => state.canvas);
  const workflowState = usePageBuilderStore((state) => state.workflow);

  // Save function
  const saveProject = useCallback(() => {
    try {
      const projectData = {
        canvas: canvasState,
        workflow: workflowState,
        savedAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem('gui-builder-project', JSON.stringify(projectData));

      console.log('[Auto-save] Project saved successfully');
    } catch (error) {
      console.error('[Auto-save] Failed to save project:', error);
    }
  }, [canvasState, workflowState]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      saveProject();
    }, autoSaveInterval * 1000);

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [autoSave, autoSaveInterval, canvasState, workflowState, saveProject]);

  // Keyboard shortcuts effect
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Load saved project on mount
  useEffect(() => {
    try {
      const savedProject = localStorage.getItem('gui-builder-project');
      if (savedProject) {
        const projectData = JSON.parse(savedProject);
        usePageBuilderStore.getState().loadProject(projectData);
        console.log('[Load] Project loaded from localStorage');
      }
    } catch (error) {
      console.error('[Load] Failed to load project:', error);
    }
  }, []);

  // Prevent default drag behaviors
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Prevent file drops on the page
    window.addEventListener('dragover', preventDefaults);
    window.addEventListener('drop', preventDefaults);

    return () => {
      window.removeEventListener('dragover', preventDefaults);
      window.removeEventListener('drop', preventDefaults);
    };
  }, []);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasComponents = canvasState.components.allIds.length > 0;

      if (hasComponents) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [canvasState.components.allIds.length]);

  return (
    <main className="w-full h-screen overflow-hidden">
      <BuilderLayout />
    </main>
  );
}
