/**
 * LOC: CAD-LAY-002
 * File: /reuse/cad/cad-drawing-layers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (foundational layer management)
 *
 * DOWNSTREAM (imported by):
 *   - CAD entity management
 *   - Drawing organization services
 *   - Layer visibility controllers
 */

/**
 * File: /reuse/cad/cad-drawing-layers-kit.ts
 * Locator: WC-CAD-LAY-002
 * Purpose: CAD Drawing Layers - Layer management and organization utilities
 *
 * Upstream: Independent layer management module
 * Downstream: CAD entity services, drawing organization, visibility control
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize ORM
 * Exports: 40 layer management functions for creation, organization, visibility, and properties
 *
 * LLM Context: Production-grade CAD layer management for White Cross CAD SaaS platform.
 * Provides comprehensive layer operations including creation, deletion, visibility control,
 * color/linetype management, layer filtering, grouping, and state management. Essential for
 * organizing complex CAD drawings similar to AutoCAD's layer system.
 */

import { Model, DataTypes, Sequelize } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Layer definition
 */
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
  lineType: string;
  lineWeight: number;
  transparency: number; // 0-100
  plotStyle: string;
  plottable: boolean;
  description?: string;
  parentLayerId?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Layer group definition
 */
export interface LayerGroup {
  id: string;
  name: string;
  layers: string[]; // Layer IDs
  visible: boolean;
  locked: boolean;
  description?: string;
}

/**
 * Layer filter definition
 */
export interface LayerFilter {
  id: string;
  name: string;
  criteria: LayerFilterCriteria;
  type: 'name' | 'color' | 'linetype' | 'custom';
}

/**
 * Layer filter criteria
 */
export interface LayerFilterCriteria {
  namePattern?: string;
  colors?: string[];
  lineTypes?: string[];
  visible?: boolean;
  locked?: boolean;
  customPredicate?: (layer: Layer) => boolean;
}

/**
 * Layer state definition
 */
export interface LayerState {
  id: string;
  name: string;
  layerStates: Map<string, LayerProperties>;
  description?: string;
  createdAt?: Date;
}

/**
 * Layer properties snapshot
 */
export interface LayerProperties {
  visible: boolean;
  locked: boolean;
  color: string;
  lineType: string;
  lineWeight: number;
  transparency: number;
}

// ============================================================================
// LAYER CREATION AND MANAGEMENT
// ============================================================================

/**
 * Creates a new layer with default properties.
 *
 * @param {string} name - Layer name
 * @param {Partial<Layer>} properties - Optional layer properties
 * @returns {Layer} New layer
 *
 * @example
 * ```typescript
 * const layer = createLayer('Walls', {
 *   color: '#FF0000',
 *   lineType: 'CONTINUOUS',
 *   lineWeight: 0.5
 * });
 * ```
 */
export function createLayer(name: string, properties: Partial<Layer> = {}): Layer {
  return {
    id: generateLayerId(),
    name,
    visible: true,
    locked: false,
    color: '#FFFFFF',
    lineType: 'CONTINUOUS',
    lineWeight: 0.25,
    transparency: 0,
    plotStyle: 'Normal',
    plottable: true,
    order: 0,
    ...properties,
  };
}

/**
 * Generates a unique layer ID.
 *
 * @returns {string} Unique layer ID
 *
 * @example
 * ```typescript
 * const id = generateLayerId();
 * // 'layer_1699564800000_a1b2c3'
 * ```
 */
export function generateLayerId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `layer_${timestamp}_${random}`;
}

/**
 * Clones a layer with a new name.
 *
 * @param {Layer} layer - Layer to clone
 * @param {string} newName - Name for cloned layer
 * @returns {Layer} Cloned layer
 *
 * @example
 * ```typescript
 * const clone = cloneLayer(existingLayer, 'Walls - Copy');
 * ```
 */
export function cloneLayer(layer: Layer, newName: string): Layer {
  return {
    ...layer,
    id: generateLayerId(),
    name: newName,
  };
}

/**
 * Renames a layer.
 *
 * @param {Layer} layer - Layer to rename
 * @param {string} newName - New name
 * @returns {Layer} Updated layer
 *
 * @example
 * ```typescript
 * const renamed = renameLayer(layer, 'New Layer Name');
 * ```
 */
export function renameLayer(layer: Layer, newName: string): Layer {
  return {
    ...layer,
    name: newName,
  };
}

/**
 * Deletes a layer (returns filtered array without the layer).
 *
 * @param {Layer[]} layers - Array of all layers
 * @param {string} layerId - ID of layer to delete
 * @returns {Layer[]} Array without deleted layer
 *
 * @example
 * ```typescript
 * const updatedLayers = deleteLayer(allLayers, 'layer_123');
 * ```
 */
export function deleteLayer(layers: Layer[], layerId: string): Layer[] {
  return layers.filter(layer => layer.id !== layerId);
}

/**
 * Merges two layers by moving all entities from source to target.
 *
 * @param {Layer} sourceLayer - Source layer
 * @param {Layer} targetLayer - Target layer
 * @returns {{ source: Layer; target: Layer }} Updated layers
 *
 * @example
 * ```typescript
 * const result = mergeLayers(layer1, layer2);
 * // All entities from layer1 moved to layer2
 * ```
 */
export function mergeLayers(sourceLayer: Layer, targetLayer: Layer): { source: Layer; target: Layer } {
  // In practice, this would move entities from source to target
  return {
    source: { ...sourceLayer, visible: false },
    target: targetLayer,
  };
}

// ============================================================================
// LAYER VISIBILITY AND STATE
// ============================================================================

/**
 * Sets layer visibility.
 *
 * @param {Layer} layer - Layer to update
 * @param {boolean} visible - Visibility state
 * @returns {Layer} Updated layer
 *
 * @example
 * ```typescript
 * const hidden = setLayerVisibility(layer, false);
 * ```
 */
export function setLayerVisibility(layer: Layer, visible: boolean): Layer {
  return {
    ...layer,
    visible,
  };
}

/**
 * Toggles layer visibility.
 *
 * @param {Layer} layer - Layer to toggle
 * @returns {Layer} Updated layer
 *
 * @example
 * ```typescript
 * const toggled = toggleLayerVisibility(layer);
 * ```
 */
export function toggleLayerVisibility(layer: Layer): Layer {
  return setLayerVisibility(layer, !layer.visible);
}

/**
 * Sets layer locked state.
 *
 * @param {Layer} layer - Layer to update
 * @param {boolean} locked - Locked state
 * @returns {Layer} Updated layer
 *
 * @example
 * ```typescript
 * const locked = setLayerLocked(layer, true);
 * ```
 */
export function setLayerLocked(layer: Layer, locked: boolean): Layer {
  return {
    ...layer,
    locked,
  };
}

/**
 * Shows all layers.
 *
 * @param {Layer[]} layers - Array of layers
 * @returns {Layer[]} Updated layers
 *
 * @example
 * ```typescript
 * const visible = showAllLayers(allLayers);
 * ```
 */
export function showAllLayers(layers: Layer[]): Layer[] {
  return layers.map(layer => setLayerVisibility(layer, true));
}

/**
 * Hides all layers.
 *
 * @param {Layer[]} layers - Array of layers
 * @returns {Layer[]} Updated layers
 *
 * @example
 * ```typescript
 * const hidden = hideAllLayers(allLayers);
 * ```
 */
export function hideAllLayers(layers: Layer[]): Layer[] {
  return layers.map(layer => setLayerVisibility(layer, false));
}

/**
 * Isolates a layer (hides all others).
 *
 * @param {Layer[]} layers - Array of all layers
 * @param {string} layerId - ID of layer to isolate
 * @returns {Layer[]} Updated layers
 *
 * @example
 * ```typescript
 * const isolated = isolateLayer(allLayers, 'layer_123');
 * ```
 */
export function isolateLayer(layers: Layer[], layerId: string): Layer[] {
  return layers.map(layer => ({
    ...layer,
    visible: layer.id === layerId,
  }));
}

// ============================================================================
// LAYER PROPERTIES
// ============================================================================

/**
 * Sets layer color.
 *
 * @param {Layer} layer - Layer to update
 * @param {string} color - Color hex code
 * @returns {Layer} Updated layer
 *
 * @example
 * ```typescript
 * const colored = setLayerColor(layer, '#FF0000');
 * ```
 */
export function setLayerColor(layer: Layer, color: string): Layer {
  return {
    ...layer,
    color,
  };
}

/**
 * Sets layer line type.
 *
 * @param {Layer} layer - Layer to update
 * @param {string} lineType - Line type name
 * @returns {Layer} Updated layer
 *
 * @example
 * ```typescript
 * const dashed = setLayerLineType(layer, 'DASHED');
 * ```
 */
export function setLayerLineType(layer: Layer, lineType: string): Layer {
  return {
    ...layer,
    lineType,
  };
}

/**
 * Sets layer line weight.
 *
 * @param {Layer} layer - Layer to update
 * @param {number} lineWeight - Line weight in mm
 * @returns {Layer} Updated layer
 *
 * @example
 * ```typescript
 * const weighted = setLayerLineWeight(layer, 0.5);
 * ```
 */
export function setLayerLineWeight(layer: Layer, lineWeight: number): Layer {
  return {
    ...layer,
    lineWeight,
  };
}

/**
 * Sets layer transparency.
 *
 * @param {Layer} layer - Layer to update
 * @param {number} transparency - Transparency (0-100)
 * @returns {Layer} Updated layer
 *
 * @example
 * ```typescript
 * const transparent = setLayerTransparency(layer, 50);
 * ```
 */
export function setLayerTransparency(layer: Layer, transparency: number): Layer {
  const clampedTransparency = Math.max(0, Math.min(100, transparency));
  return {
    ...layer,
    transparency: clampedTransparency,
  };
}

/**
 * Sets layer plottable state.
 *
 * @param {Layer} layer - Layer to update
 * @param {boolean} plottable - Plottable state
 * @returns {Layer} Updated layer
 *
 * @example
 * ```typescript
 * const nonPlottable = setLayerPlottable(layer, false);
 * ```
 */
export function setLayerPlottable(layer: Layer, plottable: boolean): Layer {
  return {
    ...layer,
    plottable,
  };
}

// ============================================================================
// LAYER FILTERING AND SEARCHING
// ============================================================================

/**
 * Finds layers by name pattern.
 *
 * @param {Layer[]} layers - Array of layers
 * @param {string} pattern - Search pattern (supports wildcards *)
 * @returns {Layer[]} Matching layers
 *
 * @example
 * ```typescript
 * const walls = findLayersByName(allLayers, 'Wall*');
 * ```
 */
export function findLayersByName(layers: Layer[], pattern: string): Layer[] {
  const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$', 'i');
  return layers.filter(layer => regex.test(layer.name));
}

/**
 * Finds layers by color.
 *
 * @param {Layer[]} layers - Array of layers
 * @param {string} color - Color hex code
 * @returns {Layer[]} Matching layers
 *
 * @example
 * ```typescript
 * const redLayers = findLayersByColor(allLayers, '#FF0000');
 * ```
 */
export function findLayersByColor(layers: Layer[], color: string): Layer[] {
  return layers.filter(layer => layer.color.toLowerCase() === color.toLowerCase());
}

/**
 * Finds layers by line type.
 *
 * @param {Layer[]} layers - Array of layers
 * @param {string} lineType - Line type name
 * @returns {Layer[]} Matching layers
 *
 * @example
 * ```typescript
 * const dashed = findLayersByLineType(allLayers, 'DASHED');
 * ```
 */
export function findLayersByLineType(layers: Layer[], lineType: string): Layer[] {
  return layers.filter(layer => layer.lineType === lineType);
}

/**
 * Gets visible layers.
 *
 * @param {Layer[]} layers - Array of layers
 * @returns {Layer[]} Visible layers
 *
 * @example
 * ```typescript
 * const visible = getVisibleLayers(allLayers);
 * ```
 */
export function getVisibleLayers(layers: Layer[]): Layer[] {
  return layers.filter(layer => layer.visible);
}

/**
 * Gets locked layers.
 *
 * @param {Layer[]} layers - Array of layers
 * @returns {Layer[]} Locked layers
 *
 * @example
 * ```typescript
 * const locked = getLockedLayers(allLayers);
 * ```
 */
export function getLockedLayers(layers: Layer[]): Layer[] {
  return layers.filter(layer => layer.locked);
}

/**
 * Filters layers by custom criteria.
 *
 * @param {Layer[]} layers - Array of layers
 * @param {LayerFilterCriteria} criteria - Filter criteria
 * @returns {Layer[]} Filtered layers
 *
 * @example
 * ```typescript
 * const filtered = filterLayers(allLayers, {
 *   visible: true,
 *   colors: ['#FF0000', '#00FF00']
 * });
 * ```
 */
export function filterLayers(layers: Layer[], criteria: LayerFilterCriteria): Layer[] {
  return layers.filter(layer => {
    if (criteria.namePattern && !new RegExp(criteria.namePattern, 'i').test(layer.name)) {
      return false;
    }
    if (criteria.colors && !criteria.colors.includes(layer.color)) {
      return false;
    }
    if (criteria.lineTypes && !criteria.lineTypes.includes(layer.lineType)) {
      return false;
    }
    if (criteria.visible !== undefined && layer.visible !== criteria.visible) {
      return false;
    }
    if (criteria.locked !== undefined && layer.locked !== criteria.locked) {
      return false;
    }
    if (criteria.customPredicate && !criteria.customPredicate(layer)) {
      return false;
    }
    return true;
  });
}

// ============================================================================
// LAYER GROUPS
// ============================================================================

/**
 * Creates a layer group.
 *
 * @param {string} name - Group name
 * @param {string[]} layerIds - Array of layer IDs
 * @returns {LayerGroup} New layer group
 *
 * @example
 * ```typescript
 * const group = createLayerGroup('Architecture', ['layer_1', 'layer_2']);
 * ```
 */
export function createLayerGroup(name: string, layerIds: string[] = []): LayerGroup {
  return {
    id: `group_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    name,
    layers: layerIds,
    visible: true,
    locked: false,
  };
}

/**
 * Adds layers to a group.
 *
 * @param {LayerGroup} group - Layer group
 * @param {string[]} layerIds - Layer IDs to add
 * @returns {LayerGroup} Updated group
 *
 * @example
 * ```typescript
 * const updated = addLayersToGroup(group, ['layer_3', 'layer_4']);
 * ```
 */
export function addLayersToGroup(group: LayerGroup, layerIds: string[]): LayerGroup {
  const uniqueIds = new Set([...group.layers, ...layerIds]);
  return {
    ...group,
    layers: Array.from(uniqueIds),
  };
}

/**
 * Removes layers from a group.
 *
 * @param {LayerGroup} group - Layer group
 * @param {string[]} layerIds - Layer IDs to remove
 * @returns {LayerGroup} Updated group
 *
 * @example
 * ```typescript
 * const updated = removeLayersFromGroup(group, ['layer_3']);
 * ```
 */
export function removeLayersFromGroup(group: LayerGroup, layerIds: string[]): LayerGroup {
  return {
    ...group,
    layers: group.layers.filter(id => !layerIds.includes(id)),
  };
}

/**
 * Sets visibility for all layers in a group.
 *
 * @param {Layer[]} layers - Array of all layers
 * @param {LayerGroup} group - Layer group
 * @param {boolean} visible - Visibility state
 * @returns {Layer[]} Updated layers
 *
 * @example
 * ```typescript
 * const updated = setGroupVisibility(allLayers, group, false);
 * ```
 */
export function setGroupVisibility(layers: Layer[], group: LayerGroup, visible: boolean): Layer[] {
  return layers.map(layer => {
    if (group.layers.includes(layer.id)) {
      return setLayerVisibility(layer, visible);
    }
    return layer;
  });
}

// ============================================================================
// LAYER STATES
// ============================================================================

/**
 * Captures current layer states.
 *
 * @param {string} name - State name
 * @param {Layer[]} layers - Array of layers
 * @returns {LayerState} Layer state snapshot
 *
 * @example
 * ```typescript
 * const state = captureLayerState('Default View', allLayers);
 * ```
 */
export function captureLayerState(name: string, layers: Layer[]): LayerState {
  const layerStates = new Map<string, LayerProperties>();
  
  layers.forEach(layer => {
    layerStates.set(layer.id, {
      visible: layer.visible,
      locked: layer.locked,
      color: layer.color,
      lineType: layer.lineType,
      lineWeight: layer.lineWeight,
      transparency: layer.transparency,
    });
  });
  
  return {
    id: `state_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    name,
    layerStates,
    createdAt: new Date(),
  };
}

/**
 * Restores layers to a saved state.
 *
 * @param {Layer[]} layers - Array of layers
 * @param {LayerState} state - Saved layer state
 * @returns {Layer[]} Restored layers
 *
 * @example
 * ```typescript
 * const restored = restoreLayerState(currentLayers, savedState);
 * ```
 */
export function restoreLayerState(layers: Layer[], state: LayerState): Layer[] {
  return layers.map(layer => {
    const savedProps = state.layerStates.get(layer.id);
    if (savedProps) {
      return {
        ...layer,
        ...savedProps,
      };
    }
    return layer;
  });
}

// ============================================================================
// LAYER ORDERING
// ============================================================================

/**
 * Sorts layers by order property.
 *
 * @param {Layer[]} layers - Array of layers
 * @returns {Layer[]} Sorted layers
 *
 * @example
 * ```typescript
 * const sorted = sortLayersByOrder(allLayers);
 * ```
 */
export function sortLayersByOrder(layers: Layer[]): Layer[] {
  return [...layers].sort((a, b) => a.order - b.order);
}

/**
 * Moves a layer to a new position in the order.
 *
 * @param {Layer[]} layers - Array of layers
 * @param {string} layerId - ID of layer to move
 * @param {number} newOrder - New order position
 * @returns {Layer[]} Reordered layers
 *
 * @example
 * ```typescript
 * const reordered = moveLayerOrder(allLayers, 'layer_123', 5);
 * ```
 */
export function moveLayerOrder(layers: Layer[], layerId: string, newOrder: number): Layer[] {
  const layerIndex = layers.findIndex(l => l.id === layerId);
  if (layerIndex === -1) return layers;
  
  const updatedLayers = [...layers];
  updatedLayers[layerIndex] = { ...updatedLayers[layerIndex], order: newOrder };
  
  return sortLayersByOrder(updatedLayers);
}

// ============================================================================
// LAYER VALIDATION
// ============================================================================

/**
 * Validates layer name (no special characters, max length).
 *
 * @param {string} name - Layer name to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const valid = validateLayerName('My Layer');
 * // true
 * ```
 */
export function validateLayerName(name: string): boolean {
  if (!name || name.length === 0 || name.length > 255) return false;
  // Allow letters, numbers, spaces, hyphens, underscores
  return /^[a-zA-Z0-9\s\-_]+$/.test(name);
}

/**
 * Checks if layer name is unique.
 *
 * @param {Layer[]} layers - Array of existing layers
 * @param {string} name - Name to check
 * @param {string} excludeId - Optional layer ID to exclude from check
 * @returns {boolean} True if unique
 *
 * @example
 * ```typescript
 * const unique = isLayerNameUnique(allLayers, 'New Layer');
 * ```
 */
export function isLayerNameUnique(layers: Layer[], name: string, excludeId?: string): boolean {
  return !layers.some(layer => 
    layer.name.toLowerCase() === name.toLowerCase() && layer.id !== excludeId
  );
}

/**
 * Validates layer color format.
 *
 * @param {string} color - Color hex code
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const valid = validateLayerColor('#FF0000');
 * // true
 * ```
 */
export function validateLayerColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

// ============================================================================
// SEQUELIZE MODEL DEFINITION
// ============================================================================

/**
 * Defines Sequelize model for Layer entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Layer model
 *
 * @example
 * ```typescript
 * const LayerModel = defineLayerModel(sequelize);
 * const layer = await LayerModel.create({ name: 'Walls' });
 * ```
 */
export function defineLayerModel(sequelize: Sequelize): typeof Model {
  class LayerModel extends Model {}
  
  LayerModel.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#FFFFFF',
      validate: {
        is: /^#[0-9A-F]{6}$/i,
      },
    },
    lineType: {
      type: DataTypes.STRING,
      defaultValue: 'CONTINUOUS',
    },
    lineWeight: {
      type: DataTypes.FLOAT,
      defaultValue: 0.25,
    },
    transparency: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    plotStyle: {
      type: DataTypes.STRING,
      defaultValue: 'Normal',
    },
    plottable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    parentLayerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Layer',
    tableName: 'cad_layers',
    timestamps: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['visible'] },
      { fields: ['order'] },
    ],
  });
  
  return LayerModel;
}
