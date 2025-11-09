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
import { Model, Sequelize } from 'sequelize';
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
    transparency: number;
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
    layers: string[];
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
export declare function createLayer(name: string, properties?: Partial<Layer>): Layer;
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
export declare function generateLayerId(): string;
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
export declare function cloneLayer(layer: Layer, newName: string): Layer;
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
export declare function renameLayer(layer: Layer, newName: string): Layer;
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
export declare function deleteLayer(layers: Layer[], layerId: string): Layer[];
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
export declare function mergeLayers(sourceLayer: Layer, targetLayer: Layer): {
    source: Layer;
    target: Layer;
};
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
export declare function setLayerVisibility(layer: Layer, visible: boolean): Layer;
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
export declare function toggleLayerVisibility(layer: Layer): Layer;
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
export declare function setLayerLocked(layer: Layer, locked: boolean): Layer;
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
export declare function showAllLayers(layers: Layer[]): Layer[];
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
export declare function hideAllLayers(layers: Layer[]): Layer[];
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
export declare function isolateLayer(layers: Layer[], layerId: string): Layer[];
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
export declare function setLayerColor(layer: Layer, color: string): Layer;
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
export declare function setLayerLineType(layer: Layer, lineType: string): Layer;
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
export declare function setLayerLineWeight(layer: Layer, lineWeight: number): Layer;
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
export declare function setLayerTransparency(layer: Layer, transparency: number): Layer;
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
export declare function setLayerPlottable(layer: Layer, plottable: boolean): Layer;
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
export declare function findLayersByName(layers: Layer[], pattern: string): Layer[];
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
export declare function findLayersByColor(layers: Layer[], color: string): Layer[];
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
export declare function findLayersByLineType(layers: Layer[], lineType: string): Layer[];
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
export declare function getVisibleLayers(layers: Layer[]): Layer[];
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
export declare function getLockedLayers(layers: Layer[]): Layer[];
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
export declare function filterLayers(layers: Layer[], criteria: LayerFilterCriteria): Layer[];
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
export declare function createLayerGroup(name: string, layerIds?: string[]): LayerGroup;
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
export declare function addLayersToGroup(group: LayerGroup, layerIds: string[]): LayerGroup;
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
export declare function removeLayersFromGroup(group: LayerGroup, layerIds: string[]): LayerGroup;
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
export declare function setGroupVisibility(layers: Layer[], group: LayerGroup, visible: boolean): Layer[];
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
export declare function captureLayerState(name: string, layers: Layer[]): LayerState;
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
export declare function restoreLayerState(layers: Layer[], state: LayerState): Layer[];
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
export declare function sortLayersByOrder(layers: Layer[]): Layer[];
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
export declare function moveLayerOrder(layers: Layer[], layerId: string, newOrder: number): Layer[];
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
export declare function validateLayerName(name: string): boolean;
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
export declare function isLayerNameUnique(layers: Layer[], name: string, excludeId?: string): boolean;
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
export declare function validateLayerColor(color: string): boolean;
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
export declare function defineLayerModel(sequelize: Sequelize): typeof Model;
//# sourceMappingURL=cad-drawing-layers-kit.d.ts.map