"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOneToOneAssociation = createOneToOneAssociation;
exports.createOneToManyAssociation = createOneToManyAssociation;
exports.createManyToManyAssociation = createManyToManyAssociation;
exports.createPolymorphicBelongsTo = createPolymorphicBelongsTo;
exports.createPolymorphicHasMany = createPolymorphicHasMany;
exports.getPolymorphicTarget = getPolymorphicTarget;
exports.setPolymorphicTarget = setPolymorphicTarget;
exports.createSelfReferencingAssociation = createSelfReferencingAssociation;
exports.traverseHierarchy = traverseHierarchy;
exports.findRootNodes = findRootNodes;
exports.findLeafNodes = findLeafNodes;
exports.calculateTreeDepth = calculateTreeDepth;
exports.createManyToManyWithThrough = createManyToManyWithThrough;
exports.queryThroughTable = queryThroughTable;
exports.updateThroughTableAttributes = updateThroughTableAttributes;
exports.configureCascadeDelete = configureCascadeDelete;
exports.configureCascadeUpdate = configureCascadeUpdate;
exports.configureSoftCascadeDelete = configureSoftCascadeDelete;
exports.hasAssociation = hasAssociation;
exports.countAssociation = countAssociation;
exports.addAssociationWithThrough = addAssociationWithThrough;
exports.removeAssociation = removeAssociation;
exports.validateAssociationConfig = validateAssociationConfig;
exports.listModelAssociations = listModelAssociations;
const sequelize_1 = require("sequelize");
function createOneToOneAssociation(sourceModel, targetModel, options) {
    const foreignKey = options.foreignKey || `${sourceModel.name.toLowerCase()}Id`;
    const sourceAs = options.sourceAs || targetModel.name.toLowerCase();
    const targetAs = options.targetAs || sourceModel.name.toLowerCase();
    const hasOneAssoc = sourceModel.hasOne(targetModel, {
        foreignKey,
        as: sourceAs,
        onDelete: options.cascade?.onDelete || 'CASCADE',
        onUpdate: options.cascade?.onUpdate || 'CASCADE',
    });
    const belongsToAssoc = targetModel.belongsTo(sourceModel, {
        foreignKey,
        as: targetAs,
        onDelete: options.cascade?.onDelete || 'CASCADE',
        onUpdate: options.cascade?.onUpdate || 'CASCADE',
    });
    return {
        hasOne: hasOneAssoc,
        belongsTo: belongsToAssoc,
    };
}
function createOneToManyAssociation(sourceModel, targetModel, options) {
    const foreignKey = options.foreignKey || `${sourceModel.name.toLowerCase()}Id`;
    const sourceAs = options.sourceAs || `${targetModel.name.toLowerCase()}s`;
    const targetAs = options.targetAs || sourceModel.name.toLowerCase();
    const hasManyAssoc = sourceModel.hasMany(targetModel, {
        foreignKey,
        as: sourceAs,
        onDelete: options.cascade?.onDelete || 'CASCADE',
        onUpdate: options.cascade?.onUpdate || 'CASCADE',
    });
    const belongsToAssoc = targetModel.belongsTo(sourceModel, {
        foreignKey,
        as: targetAs,
        onDelete: options.cascade?.onDelete || 'CASCADE',
        onUpdate: options.cascade?.onUpdate || 'CASCADE',
    });
    return {
        hasMany: hasManyAssoc,
        belongsTo: belongsToAssoc,
    };
}
function createManyToManyAssociation(model1, model2, config) {
    const model1As = config.model1As || `${model2.name.toLowerCase()}s`;
    const model2As = config.model2As || `${model1.name.toLowerCase()}s`;
    const assoc1 = model1.belongsToMany(model2, {
        through: config.throughModel,
        foreignKey: config.foreignKey || `${model1.name.toLowerCase()}Id`,
        otherKey: config.otherKey || `${model2.name.toLowerCase()}Id`,
        as: model1As,
        ...config.scope && { scope: config.scope },
    });
    const assoc2 = model2.belongsToMany(model1, {
        through: config.throughModel,
        foreignKey: config.otherKey || `${model2.name.toLowerCase()}Id`,
        otherKey: config.foreignKey || `${model1.name.toLowerCase()}Id`,
        as: model2As,
        ...config.scope && { scope: config.scope },
    });
    return {
        assoc1,
        assoc2,
    };
}
function createPolymorphicBelongsTo(sourceModel, config) {
    const associations = [];
    if (!config.models || config.models.length === 0) {
        throw new Error('Polymorphic association requires at least one target model');
    }
    if (!sourceModel.rawAttributes[config.typeField]) {
        sourceModel.rawAttributes[config.typeField] = {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        };
    }
    if (!sourceModel.rawAttributes[config.idField]) {
        sourceModel.rawAttributes[config.idField] = {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        };
    }
    for (const { model, as, type } of config.models) {
        const assoc = sourceModel.belongsTo(model, {
            foreignKey: config.idField,
            constraints: false,
            as,
            scope: {
                [config.typeField]: type,
                ...config.scope,
            },
        });
        associations.push(assoc);
    }
    const indexes = sourceModel.options.indexes || [];
    const indexExists = indexes.some((idx) => idx.fields?.includes(config.typeField) && idx.fields?.includes(config.idField));
    if (!indexExists) {
        indexes.push({
            name: `${sourceModel.tableName}_polymorphic_idx`,
            fields: [config.typeField, config.idField],
            type: 'BTREE',
        });
        sourceModel.options.indexes = indexes;
    }
    return associations;
}
function createPolymorphicHasMany(targetModels, sourceModel, config) {
    const associations = [];
    for (const { model, type } of targetModels) {
        const assoc = model.hasMany(sourceModel, {
            foreignKey: config.idField,
            constraints: false,
            as: config.as,
            scope: {
                [config.typeField]: type,
                ...config.scope,
            },
        });
        associations.push(assoc);
    }
    return associations;
}
async function getPolymorphicTarget(instance, config) {
    const type = instance[config.typeField];
    const id = instance[config.idField];
    if (!type || !id)
        return null;
    const targetConfig = config.models.find((m) => m.type === type);
    if (!targetConfig)
        return null;
    return targetConfig.model.findByPk(id);
}
async function setPolymorphicTarget(instance, target, config) {
    const targetType = target.constructor.name;
    const targetConfig = config.models.find((m) => m.type === targetType);
    if (!targetConfig) {
        throw new Error(`Model type ${targetType} not configured for polymorphic association`);
    }
    instance[config.typeField] = targetType;
    instance[config.idField] = target.id;
}
function createSelfReferencingAssociation(model, config) {
    if (config.parentAs === config.childrenAs) {
        throw new Error('Parent and children aliases must be different');
    }
    const parent = model.belongsTo(model, {
        foreignKey: {
            name: config.foreignKey,
            allowNull: true,
        },
        as: config.parentAs,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    const children = model.hasMany(model, {
        foreignKey: config.foreignKey,
        as: config.childrenAs,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    const indexes = model.options.indexes || [];
    const indexExists = indexes.some((idx) => idx.fields?.length === 1 && idx.fields[0] === config.foreignKey);
    if (!indexExists) {
        indexes.push({
            name: `${model.tableName}_${config.foreignKey}_hierarchy_idx`,
            fields: [config.foreignKey],
            type: 'BTREE',
        });
        model.options.indexes = indexes;
    }
    return { parent, children };
}
async function traverseHierarchy(instance, direction, options = {}) {
    const maxDepth = options.maxDepth || 10;
    const results = [];
    const visited = new Set();
    const traverse = async (node, depth) => {
        if (depth >= maxDepth)
            return;
        const nodeId = node.id;
        if (visited.has(nodeId))
            return;
        visited.add(nodeId);
        const associationName = direction === 'descendants' ? 'children' : 'parent';
        const findOptions = {
            attributes: options.includeAttributes,
            where: options.where,
        };
        if (direction === 'descendants') {
            const children = await node[`get${capitalize(associationName)}`](findOptions);
            for (const child of children) {
                results.push(child);
                await traverse(child, depth + 1);
            }
        }
        else {
            const parent = await node[`get${capitalize(associationName)}`](findOptions);
            if (parent) {
                results.push(parent);
                await traverse(parent, depth + 1);
            }
        }
    };
    await traverse(instance, 0);
    if (options.orderBy) {
        const [field, direction] = options.orderBy;
        results.sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];
            if (direction === 'ASC') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            }
            else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });
    }
    return results;
}
async function findRootNodes(model, foreignKey, options = {}) {
    return model.findAll({
        ...options,
        where: {
            ...options.where,
            [foreignKey]: null,
        },
    });
}
async function findLeafNodes(model, foreignKey, options = {}) {
    const sequelize = model.sequelize;
    const query = `
    SELECT t1.*
    FROM ${model.tableName} t1
    LEFT JOIN ${model.tableName} t2 ON t1.id = t2.${foreignKey}
    WHERE t2.id IS NULL
  `;
    const [results] = await sequelize.query(query);
    return results;
}
async function calculateTreeDepth(instance, parentAs = 'parent') {
    let depth = 0;
    let current = instance;
    while (current) {
        const parent = await current[`get${capitalize(parentAs)}`]();
        if (!parent)
            break;
        depth++;
        current = parent;
        if (depth > 100) {
            throw new Error('Maximum tree depth exceeded (possible cycle detected)');
        }
    }
    return depth;
}
function createManyToManyWithThrough(model1, model2, throughConfig) {
    const foreignKey1 = throughConfig.foreignKey1 || `${model1.name.toLowerCase()}Id`;
    const foreignKey2 = throughConfig.foreignKey2 || `${model2.name.toLowerCase()}Id`;
    const as1 = throughConfig.as1 || `${model2.name.toLowerCase()}s`;
    const as2 = throughConfig.as2 || `${model1.name.toLowerCase()}s`;
    const assoc1 = model1.belongsToMany(model2, {
        through: {
            model: throughConfig.model,
            ...throughConfig.scope && { scope: throughConfig.scope },
        },
        foreignKey: foreignKey1,
        otherKey: foreignKey2,
        as: as1,
    });
    const assoc2 = model2.belongsToMany(model1, {
        through: {
            model: throughConfig.model,
            ...throughConfig.scope && { scope: throughConfig.scope },
        },
        foreignKey: foreignKey2,
        otherKey: foreignKey1,
        as: as2,
    });
    return { assoc1, assoc2 };
}
async function queryThroughTable(instance, associationName, throughWhere, options = {}) {
    const getterName = `get${capitalize(associationName)}`;
    return instance[getterName]({
        ...options,
        through: {
            where: throughWhere,
        },
    });
}
async function updateThroughTableAttributes(instance, target, throughModel, updates, foreignKeys) {
    const throughInstance = await throughModel.findOne({
        where: {
            [foreignKeys.source]: instance.id,
            [foreignKeys.target]: target.id,
        },
    });
    if (!throughInstance) {
        throw new Error('Association not found in through table');
    }
    return throughInstance.update(updates);
}
function configureCascadeDelete(model, associations) {
    model.addHook('beforeDestroy', async (instance, options) => {
        for (const [assocName, config] of Object.entries(associations)) {
            const association = model.associations[assocName];
            if (!association)
                continue;
            if (config.onDelete === 'CASCADE') {
                const getterName = `get${capitalize(assocName)}`;
                const relatedRecords = await instance[getterName]({
                    transaction: options.transaction,
                });
                if (Array.isArray(relatedRecords)) {
                    for (const record of relatedRecords) {
                        await record.destroy({
                            transaction: options.transaction,
                            hooks: config.hooks,
                        });
                    }
                }
                else if (relatedRecords) {
                    await relatedRecords.destroy({
                        transaction: options.transaction,
                        hooks: config.hooks,
                    });
                }
            }
            else if (config.onDelete === 'SET NULL') {
                const foreignKey = association.foreignKey;
                if (foreignKey) {
                    const targetModel = association.target;
                    await targetModel.update({ [foreignKey]: null }, {
                        where: { [foreignKey]: instance.id },
                        transaction: options.transaction,
                    });
                }
            }
        }
    });
}
function configureCascadeUpdate(model, cascadeRules) {
    model.addHook('afterUpdate', async (instance, options) => {
        for (const [assocName, rule] of Object.entries(cascadeRules)) {
            if (rule.condition && !rule.condition(instance))
                continue;
            const association = model.associations[assocName];
            if (!association)
                continue;
            const targetModel = association.target;
            const foreignKey = association.foreignKey;
            if (!foreignKey)
                continue;
            const updates = {};
            for (const [targetField, sourceField] of Object.entries(rule.fields)) {
                if (instance.changed(sourceField)) {
                    updates[targetField] = instance[sourceField];
                }
            }
            if (Object.keys(updates).length > 0) {
                await targetModel.update(updates, {
                    where: { [foreignKey]: instance.id },
                    transaction: options.transaction,
                });
            }
        }
    });
}
function configureSoftCascadeDelete(model, associations, deletedAtField = 'deletedAt') {
    model.addHook('beforeDestroy', async (instance, options) => {
        for (const assocName of associations) {
            const association = model.associations[assocName];
            if (!association)
                continue;
            const getterName = `get${capitalize(assocName)}`;
            const relatedRecords = await instance[getterName]({
                transaction: options.transaction,
                paranoid: false,
            });
            const records = Array.isArray(relatedRecords) ? relatedRecords : [relatedRecords].filter(Boolean);
            for (const record of records) {
                if (record[deletedAtField] === null) {
                    await record.update({ [deletedAtField]: new Date() }, { transaction: options.transaction });
                }
            }
        }
    });
}
async function hasAssociation(instance, associationName, targetId) {
    const hasMethodName = `has${capitalize(associationName)}`;
    const hasSingleMethodName = `has${capitalize(associationName).replace(/s$/, '')}`;
    if (typeof instance[hasMethodName] === 'function') {
        return instance[hasMethodName](targetId);
    }
    else if (typeof instance[hasSingleMethodName] === 'function') {
        return instance[hasSingleMethodName](targetId);
    }
    const getterName = `get${capitalize(associationName)}`;
    const associated = await instance[getterName]({
        where: { id: targetId },
        attributes: ['id'],
    });
    return Array.isArray(associated) ? associated.length > 0 : !!associated;
}
async function countAssociation(instance, associationName, where) {
    const countMethodName = `count${capitalize(associationName)}`;
    if (typeof instance[countMethodName] === 'function') {
        return instance[countMethodName]({ where });
    }
    const getterName = `get${capitalize(associationName)}`;
    const associated = await instance[getterName]({
        where,
        attributes: ['id'],
    });
    return Array.isArray(associated) ? associated.length : (associated ? 1 : 0);
}
async function addAssociationWithThrough(instance, targets, associationName, throughAttributes = {}) {
    const addMethodName = `add${capitalize(associationName)}`;
    const targetArray = Array.isArray(targets) ? targets : [targets];
    return instance[addMethodName](targetArray, { through: throughAttributes });
}
async function removeAssociation(instance, targets, associationName, options = {}) {
    const removeMethodName = `remove${capitalize(associationName)}`;
    const targetArray = Array.isArray(targets) ? targets : [targets];
    await instance[removeMethodName](targetArray, options);
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function validateAssociationConfig(model, associationName) {
    const errors = [];
    const warnings = [];
    const association = model.associations[associationName];
    if (!association) {
        errors.push(`Association '${associationName}' not found on model ${model.name}`);
        return { valid: false, errors, warnings };
    }
    if (association.associationType === 'belongsTo') {
        const foreignKey = association.foreignKey;
        const hasIndex = model.options.indexes?.some((idx) => idx.fields?.includes(foreignKey));
        if (!hasIndex) {
            warnings.push(`Foreign key '${foreignKey}' has no index (may impact performance)`);
        }
    }
    if (association.associationType === 'belongsToMany') {
        const through = association.through;
        if (!through) {
            errors.push('BelongsToMany association requires through model');
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
function listModelAssociations(model) {
    const associations = [];
    for (const [name, assoc] of Object.entries(model.associations)) {
        associations.push({
            name,
            type: assoc.associationType,
            target: assoc.target.name,
            foreignKey: assoc.foreignKey,
            through: assoc.through?.model?.name,
        });
    }
    return associations;
}
//# sourceMappingURL=model-association-strategies.service.js.map