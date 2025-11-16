/**
 * State Serialization Utilities
 *
 * Provides export/import functionality for page builder state with
 * schema validation, version migration, and conflict resolution.
 */

import { nanoid } from 'nanoid';
import type {
  PageBuilderState,
  CanvasState,
  ComponentInstance,
  NextJSPageConfig,
  ProjectExport,
} from '../types';

// ============================================================================
// CONSTANTS
// ============================================================================

const CURRENT_VERSION = '1.0.0';
const SUPPORTED_VERSIONS = ['1.0.0'];

// ============================================================================
// TYPES
// ============================================================================

export interface SerializedProject {
  version: string;
  name: string;
  description: string;
  exportedAt: string;
  exportedBy: string;
  pages: SerializedPage[];
  preferences?: any;
  metadata?: Record<string, any>;
}

export interface SerializedPage {
  id: string;
  name: string;
  path: string;
  components: ComponentInstance[];
  metadata?: NextJSPageConfig['metadata'];
}

export interface ImportOptions {
  mode: 'merge' | 'replace' | 'selective';
  selectedPages?: string[]; 
  handleConflicts?: 'skip' | 'rename' | 'replace';
  preserveIds?: boolean;
}

export interface ImportResult {
  success: boolean;
  imported: {
    pages: number;
    components: number;
  };
  skipped: string[];
  conflicts: Array<{
    type: 'page' | 'component';
    id: string;
    name: string;
    resolution: string;
  }>;
  errors: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

export function exportProject(
  state: PageBuilderState,
  metadata?: {
    name?: string;
    description?: string;
    author?: string;
  }
): SerializedProject {
  return {
    version: CURRENT_VERSION,
    name: metadata?.name || 'Untitled Project',
    description: metadata?.description || '',
    exportedAt: new Date().toISOString(),
    exportedBy: metadata?.author || 'Unknown',
    pages: state.workflow.pages.map((page) => ({
      id: page.id,
      name: page.name,
      path: page.path,
      components: convertCanvasToComponentArray(page.canvasState),
    })),
    preferences: state.preferences,
    metadata: {
      componentCount: state.canvas.components.allIds.length,
      pageCount: state.workflow.pages.length,
    },
  };
}

export function exportPages(
  state: PageBuilderState,
  pageIds: string[],
  metadata?: {
    name?: string;
    description?: string;
  }
): SerializedProject {
  const selectedPages = state.workflow.pages.filter((page) =>
    pageIds.includes(page.id)
  );

  return {
    version: CURRENT_VERSION,
    name: metadata?.name || 'Page Export',
    description: metadata?.description || '',
    exportedAt: new Date().toISOString(),
    exportedBy: 'Unknown',
    pages: selectedPages.map((page) => ({
      id: page.id,
      name: page.name,
      path: page.path,
      components: convertCanvasToComponentArray(page.canvasState),
    })),
  };
}

export function exportCanvas(canvas: CanvasState, pageName: string = 'Exported Page'): SerializedProject {
  return {
    version: CURRENT_VERSION,
    name: pageName,
    description: '',
    exportedAt: new Date().toISOString(),
    exportedBy: 'Unknown',
    pages: [
      {
        id: nanoid(),
        name: pageName,
        path: '/exported',
        components: convertCanvasToComponentArray(canvas),
      },
    ],
  };
}

function convertCanvasToComponentArray(canvas: CanvasState): ComponentInstance[] {
  return canvas.components.allIds.map((id) => canvas.components.byId[id]);
}

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

export function importProject(
  serialized: SerializedProject,
  currentState: PageBuilderState,
  options: ImportOptions = { mode: 'merge', handleConflicts: 'rename' }
): ImportResult {
  const result: ImportResult = {
    success: true,
    imported: { pages: 0, components: 0 },
    skipped: [],
    conflicts: [],
    errors: [],
  };

  const validationErrors = validateSerializedProject(serialized);
  if (validationErrors.some((e) => e.severity === 'error')) {
    result.success = false;
    result.errors = validationErrors.map((e) => e.field + ': ' + e.message);
    return result;
  }

  let migratedData = serialized;
  if (serialized.version !== CURRENT_VERSION) {
    try {
      migratedData = migrateToCurrentVersion(serialized);
    } catch (error) {
      result.success = false;
      const msg = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push('Migration failed: ' + msg);
      return result;
    }
  }

  const pagesToImport = options.selectedPages
    ? migratedData.pages.filter((page) => options.selectedPages!.includes(page.id))
    : migratedData.pages;

  for (const page of pagesToImport) {
    const existingPage = currentState.workflow.pages.find((p) => p.path === page.path);

    if (existingPage) {
      if (options.handleConflicts === 'skip') {
        result.skipped.push(page.name);
        result.conflicts.push({
          type: 'page',
          id: page.id,
          name: page.name,
          resolution: 'skipped',
        });
        continue;
      } else if (options.handleConflicts === 'rename') {
        page.name = page.name + ' (Imported)';
        page.path = page.path + '-imported';
        result.conflicts.push({
          type: 'page',
          id: page.id,
          name: page.name,
          resolution: 'renamed',
        });
      } else if (options.handleConflicts === 'replace') {
        result.conflicts.push({
          type: 'page',
          id: page.id,
          name: page.name,
          resolution: 'replaced',
        });
      }
    }

    const canvasState = convertComponentArrayToCanvas(
      page.components,
      !options.preserveIds
    );

    result.imported.pages++;
    result.imported.components += page.components.length;
  }

  return result;
}

function convertComponentArrayToCanvas(
  components: ComponentInstance[],
  regenerateIds: boolean
): CanvasState {
  const idMap = new Map<string, string>();

  if (regenerateIds) {
    components.forEach((comp) => {
      const newId = nanoid();
      idMap.set(comp.id, newId);
    });
  }

  const byId: Record<string, ComponentInstance> = {};
  const allIds: string[] = [];
  const rootIds: string[] = [];

  components.forEach((comp) => {
    const id = regenerateIds ? idMap.get(comp.id)! : comp.id;
    const parentId = comp.parentId && regenerateIds ? idMap.get(comp.parentId)! : comp.parentId;
    const childIds = regenerateIds
      ? comp.childIds.map((childId) => idMap.get(childId)!).filter(Boolean)
      : comp.childIds;

    const newComp = {
      ...comp,
      id,
      parentId,
      childIds,
    };

    byId[id] = newComp;
    allIds.push(id);

    if (parentId === null) {
      rootIds.push(id);
    }
  });

  return {
    components: { byId, allIds, rootIds },
    viewport: { zoom: 1, panX: 0, panY: 0 },
    grid: { enabled: true, size: 8, snapToGrid: true },
  };
}

// ============================================================================
// VALIDATION
// ============================================================================

export function validateSerializedProject(data: SerializedProject): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.version) {
    errors.push({
      field: 'version',
      message: 'Version is required',
      severity: 'error',
    });
  } else if (!SUPPORTED_VERSIONS.includes(data.version)) {
    errors.push({
      field: 'version',
      message: 'Version ' + data.version + ' is not supported',
      severity: 'error',
    });
  }

  if (!Array.isArray(data.pages)) {
    errors.push({
      field: 'pages',
      message: 'Pages must be an array',
      severity: 'error',
    });
  } else if (data.pages.length === 0) {
    errors.push({
      field: 'pages',
      message: 'At least one page is required',
      severity: 'warning',
    });
  } else {
    data.pages.forEach((page, index) => {
      if (!page.id) {
        errors.push({
          field: 'pages[' + index + '].id',
          message: 'Page ID is required',
          severity: 'error',
        });
      }
      if (!page.name) {
        errors.push({
          field: 'pages[' + index + '].name',
          message: 'Page name is required',
          severity: 'error',
        });
      }
      if (!page.path) {
        errors.push({
          field: 'pages[' + index + '].path',
          message: 'Page path is required',
          severity: 'error',
        });
      }
      if (!Array.isArray(page.components)) {
        errors.push({
          field: 'pages[' + index + '].components',
          message: 'Page components must be an array',
          severity: 'error',
        });
      }
    });
  }

  return errors;
}

// ============================================================================
// MIGRATION
// ============================================================================

function migrateToCurrentVersion(data: SerializedProject): SerializedProject {
  const migrated = { ...data };
  migrated.version = CURRENT_VERSION;
  return migrated;
}

// ============================================================================
// LOCAL STORAGE HELPERS
// ============================================================================

export function saveToLocalStorage(
  key: string,
  project: SerializedProject
): boolean {
  try {
    const json = JSON.stringify(project);
    localStorage.setItem(key, json);
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

export function loadFromLocalStorage(key: string): SerializedProject | null {
  try {
    const json = localStorage.getItem(key);
    if (!json) return null;
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

export function listSavedProjects(prefix: string = 'pagebuilder_'): Array<{
  key: string;
  name: string;
  savedAt: string;
}> {
  const projects: Array<{ key: string; name: string; savedAt: string }> = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      try {
        const json = localStorage.getItem(key);
        if (json) {
          const project: SerializedProject = JSON.parse(json);
          projects.push({
            key,
            name: project.name,
            savedAt: project.exportedAt,
          });
        }
      } catch (error) {
        console.error('Failed to parse project ' + key + ':', error);
      }
    }
  }

  return projects.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function deleteFromLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to delete from localStorage:', error);
    return false;
  }
}

// ============================================================================
// FILE DOWNLOAD/UPLOAD
// ============================================================================

export function downloadAsFile(project: SerializedProject, filename?: string): void {
  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || project.name.replace(/\s+/g, '-').toLowerCase() + '.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function uploadFromFile(): Promise<SerializedProject> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = event.target?.result as string;
          const project: SerializedProject = JSON.parse(json);
          resolve(project);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    };

    input.click();
  });
}
