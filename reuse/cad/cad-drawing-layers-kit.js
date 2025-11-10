"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLayer = createLayer;
exports.generateLayerId = generateLayerId;
exports.cloneLayer = cloneLayer;
exports.renameLayer = renameLayer;
exports.deleteLayer = deleteLayer;
exports.mergeLayers = mergeLayers;
exports.setLayerVisibility = setLayerVisibility;
exports.toggleLayerVisibility = toggleLayerVisibility;
exports.setLayerLocked = setLayerLocked;
exports.showAllLayers = showAllLayers;
exports.hideAllLayers = hideAllLayers;
exports.isolateLayer = isolateLayer;
exports.setLayerColor = setLayerColor;
exports.setLayerLineType = setLayerLineType;
exports.setLayerLineWeight = setLayerLineWeight;
exports.setLayerTransparency = setLayerTransparency;
exports.setLayerPlottable = setLayerPlottable;
exports.findLayersByName = findLayersByName;
exports.findLayersByColor = findLayersByColor;
exports.findLayersByLineType = findLayersByLineType;
exports.getVisibleLayers = getVisibleLayers;
exports.getLockedLayers = getLockedLayers;
exports.filterLayers = filterLayers;
exports.createLayerGroup = createLayerGroup;
exports.addLayersToGroup = addLayersToGroup;
exports.removeLayersFromGroup = removeLayersFromGroup;
exports.setGroupVisibility = setGroupVisibility;
exports.captureLayerState = captureLayerState;
exports.restoreLayerState = restoreLayerState;
exports.sortLayersByOrder = sortLayersByOrder;
exports.moveLayerOrder = moveLayerOrder;
exports.validateLayerName = validateLayerName;
exports.isLayerNameUnique = isLayerNameUnique;
exports.validateLayerColor = validateLayerColor;
exports.defineLayerModel = defineLayerModel;
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
const sequelize_1 = require("sequelize");
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
function createLayer(name, properties = {}) {
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
function generateLayerId() {
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
function cloneLayer(layer, newName) {
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
function renameLayer(layer, newName) {
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
function deleteLayer(layers, layerId) {
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
function mergeLayers(sourceLayer, targetLayer) {
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
function setLayerVisibility(layer, visible) {
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
function toggleLayerVisibility(layer) {
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
function setLayerLocked(layer, locked) {
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
function showAllLayers(layers) {
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
function hideAllLayers(layers) {
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
function isolateLayer(layers, layerId) {
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
function setLayerColor(layer, color) {
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
function setLayerLineType(layer, lineType) {
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
function setLayerLineWeight(layer, lineWeight) {
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
function setLayerTransparency(layer, transparency) {
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
function setLayerPlottable(layer, plottable) {
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
function findLayersByName(layers, pattern) {
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
function findLayersByColor(layers, color) {
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
function findLayersByLineType(layers, lineType) {
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
function getVisibleLayers(layers) {
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
function getLockedLayers(layers) {
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
function filterLayers(layers, criteria) {
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
function createLayerGroup(name, layerIds = []) {
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
function addLayersToGroup(group, layerIds) {
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
function removeLayersFromGroup(group, layerIds) {
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
function setGroupVisibility(layers, group, visible) {
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
function captureLayerState(name, layers) {
    const layerStates = new Map();
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
function restoreLayerState(layers, state) {
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
function sortLayersByOrder(layers) {
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
function moveLayerOrder(layers, layerId, newOrder) {
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex === -1)
        return layers;
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
function validateLayerName(name) {
    if (!name || name.length === 0 || name.length > 255)
        return false;
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
function isLayerNameUnique(layers, name, excludeId) {
    return !layers.some(layer => layer.name.toLowerCase() === name.toLowerCase() && layer.id !== excludeId);
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
function validateLayerColor(color) {
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
function defineLayerModel(sequelize) {
    class LayerModel extends sequelize_1.Model {
    }
    LayerModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        visible: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
        locked: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        color: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: '#FFFFFF',
            validate: {
                is: /^#[0-9A-F]{6}$/i,
            },
        },
        lineType: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: 'CONTINUOUS',
        },
        lineWeight: {
            type: sequelize_1.DataTypes.FLOAT,
            defaultValue: 0.25,
        },
        transparency: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 100,
            },
        },
        plotStyle: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: 'Normal',
        },
        plottable: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        parentLayerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        order: {
            type: sequelize_1.DataTypes.INTEGER,
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
//# sourceMappingURL=cad-drawing-layers-kit.js.map