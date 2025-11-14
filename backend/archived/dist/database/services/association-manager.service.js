"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssociation = createAssociation;
exports.setupBelongsTo = setupBelongsTo;
exports.setupHasMany = setupHasMany;
exports.setupHasOne = setupHasOne;
exports.setupBelongsToMany = setupBelongsToMany;
exports.setupBidirectionalBelongsToMany = setupBidirectionalBelongsToMany;
exports.setupPolymorphicBelongsTo = setupPolymorphicBelongsTo;
exports.setupPolymorphicHasMany = setupPolymorphicHasMany;
exports.setupSelfReferential = setupSelfReferential;
exports.setupHierarchicalTree = setupHierarchicalTree;
exports.handleCircularAssociations = handleCircularAssociations;
exports.optimizeEagerLoading = optimizeEagerLoading;
exports.buildNestedInclude = buildNestedInclude;
exports.applyAssociationScope = applyAssociationScope;
exports.createScopedAssociationGetter = createScopedAssociationGetter;
exports.getAssociationAliases = getAssociationAliases;
exports.findAssociationByAlias = findAssociationByAlias;
exports.getAssociationsByType = getAssociationsByType;
exports.configureCascade = configureCascade;
exports.setupCascadeDeleteAll = setupCascadeDeleteAll;
exports.manageConstraints = manageConstraints;
exports.disableConstraintsForBulkOp = disableConstraintsForBulkOp;
exports.enableConstraintsForBulkOp = enableConstraintsForBulkOp;
exports.syncBidirectionalAssociations = syncBidirectionalAssociations;
exports.validateAssociationConsistency = validateAssociationConsistency;
exports.createCompositeKeyAssociation = createCompositeKeyAssociation;
exports.preloadAssociations = preloadAssociations;
exports.createAssociationBatchLoader = createAssociationBatchLoader;
exports.getAssociationMetadata = getAssociationMetadata;
exports.cloneAssociation = cloneAssociation;
exports.removeAssociation = removeAssociation;
exports.listAssociations = listAssociations;
exports.hasAssociation = hasAssociation;
exports.getAssociationTarget = getAssociationTarget;
exports.createCountInclude = createCountInclude;
exports.createSeparateQueryInclude = createSeparateQueryInclude;
exports.analyzeAssociationComplexity = analyzeAssociationComplexity;
exports.generateAssociationMigration = generateAssociationMigration;
exports.manageAssociationHooks = manageAssociationHooks;
exports.createAssociationScopes = createAssociationScopes;
exports.configureLazyLoading = configureLazyLoading;
exports.createEagerLoadingPresets = createEagerLoadingPresets;
exports.validateAssociationIntegrity = validateAssociationIntegrity;
function createAssociation(config) {
    const { type, source, target, options } = config;
    switch (type) {
        case 'hasOne':
            return source.hasOne(target, options);
        case 'hasMany':
            return source.hasMany(target, options);
        case 'belongsTo':
            return source.belongsTo(target, options);
        case 'belongsToMany':
            return source.belongsToMany(target, options);
        default:
            throw new Error(`Unknown association type: ${type}`);
    }
}
function setupBelongsTo(source, target, options) {
    if (!options.as) {
        throw new Error(`Association alias 'as' is required for ${source.name} belongsTo ${target.name}`);
    }
    const defaultOptions = {
        foreignKey: {
            allowNull: options.foreignKey && typeof options.foreignKey === 'object'
                ? (options.foreignKey.allowNull ?? false)
                : false,
            name: options.foreignKey && typeof options.foreignKey === 'object'
                ? options.foreignKey.name
                : options.foreignKey,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        constraints: true,
        ...options,
    };
    return source.belongsTo(target, defaultOptions);
}
function setupHasMany(source, target, options) {
    const defaultOptions = {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        ...options,
    };
    return source.hasMany(target, defaultOptions);
}
function setupHasOne(source, target, options) {
    const defaultOptions = {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        ...options,
    };
    return source.hasOne(target, defaultOptions);
}
function setupBelongsToMany(source, target, throughModel, options) {
    const fullOptions = {
        through: throughModel,
        ...options,
    };
    return source.belongsToMany(target, fullOptions);
}
function setupBidirectionalBelongsToMany(model1, model2, throughModel, config) {
    const assoc1 = setupBelongsToMany(model1, model2, throughModel, config.model1Config);
    const assoc2 = setupBelongsToMany(model2, model1, throughModel, config.model2Config);
    return [assoc1, assoc2];
}
function setupPolymorphicBelongsTo(source, config) {
    const { foreignKey, discriminator, models } = config;
    if (!models || models.length === 0) {
        throw new Error('Polymorphic association requires at least one target model');
    }
    const discriminatorValues = new Set();
    const associations = [];
    for (const { model, discriminatorValue } of models) {
        if (discriminatorValues.has(discriminatorValue)) {
            throw new Error(`Duplicate discriminator value '${discriminatorValue}' in polymorphic association`);
        }
        discriminatorValues.add(discriminatorValue);
        if (discriminatorValue !== model.name) {
            console.warn(`Polymorphic discriminator '${discriminatorValue}' doesn't match model name '${model.name}'. ` +
                `This may cause issues with auto-loading.`);
        }
        const association = source.belongsTo(model, {
            foreignKey,
            constraints: false,
            scope: {
                [discriminator]: discriminatorValue,
            },
            as: `${discriminatorValue.toLowerCase()}Target`,
        });
        associations.push(association);
    }
    const sourceIndexes = source.options.indexes || [];
    const compositeIndexExists = sourceIndexes.some((idx) => idx.fields && idx.fields.length === 2 &&
        idx.fields.includes(foreignKey) && idx.fields.includes(discriminator));
    if (!compositeIndexExists) {
        sourceIndexes.push({
            name: `${source.tableName}_polymorphic_idx`,
            fields: [discriminator, foreignKey],
            type: 'BTREE',
        });
        source.options.indexes = sourceIndexes;
    }
    return associations;
}
function setupPolymorphicHasMany(targets, source, config, alias) {
    const { foreignKey, discriminator } = config;
    const associations = [];
    for (const { model, discriminatorValue } of targets) {
        const association = model.hasMany(source, {
            foreignKey,
            constraints: false,
            scope: {
                [discriminator]: discriminatorValue,
            },
            as: alias,
        });
        associations.push(association);
    }
    return associations;
}
function setupSelfReferential(model, config) {
    const { foreignKey, parentAlias, childrenAlias, onDelete = 'CASCADE', allowNullParent = true } = config;
    if (parentAlias === childrenAlias) {
        throw new Error('Parent and children aliases must be different');
    }
    const parent = model.belongsTo(model, {
        foreignKey: {
            name: foreignKey,
            allowNull: allowNullParent,
        },
        as: parentAlias,
        onDelete: onDelete,
        constraints: true,
    });
    const children = model.hasMany(model, {
        foreignKey,
        as: childrenAlias,
        onDelete: onDelete,
    });
    const indexes = model.options.indexes || [];
    const indexExists = indexes.some((idx) => idx.fields && idx.fields.length === 1 && idx.fields[0] === foreignKey);
    if (!indexExists) {
        indexes.push({
            name: `${model.tableName}_${foreignKey}_hierarchy_idx`,
            fields: [foreignKey],
            type: 'BTREE',
        });
        model.options.indexes = indexes;
    }
    return { parent, children };
}
function setupHierarchicalTree(model, config) {
    const { foreignKey } = config;
    const parent = model.belongsTo(model, {
        foreignKey,
        as: 'parent',
    });
    const children = model.hasMany(model, {
        foreignKey,
        as: 'children',
    });
    return { parent, children };
}
function handleCircularAssociations(models, associations) {
    const createdAssociations = [];
    for (const config of associations) {
        const association = createAssociation(config);
        createdAssociations.push(association);
    }
    return createdAssociations;
}
function optimizeEagerLoading(model, config) {
    const includes = [];
    for (const assocName of config.associations) {
        const association = model.associations[assocName];
        if (!association)
            continue;
        const includeConfig = {
            association: assocName,
            required: config.required ?? false,
        };
        if (config.separate !== undefined) {
            includeConfig.separate = config.separate;
        }
        if (config.limit) {
            includeConfig.limit = config.limit;
        }
        if (config.order) {
            includeConfig.order = config.order;
        }
        if (config.attributes) {
            includeConfig.attributes = config.attributes;
        }
        if (config.where) {
            includeConfig.where = config.where;
        }
        if (config.nested && config.nested[assocName]) {
            const nestedConfig = config.nested[assocName];
            includeConfig.include = optimizeEagerLoading(association.target, nestedConfig);
        }
        includes.push(includeConfig);
    }
    return includes;
}
function buildNestedInclude(model, includePath, options) {
    const parts = includePath.split('.');
    const firstPart = parts[0];
    const association = model.associations[firstPart];
    if (!association) {
        throw new Error(`Association '${firstPart}' not found on model ${model.name}`);
    }
    const includeConfig = {
        association: firstPart,
    };
    if (parts.length === 1) {
        Object.assign(includeConfig, options);
    }
    else {
        const remainingPath = parts.slice(1).join('.');
        includeConfig.include = [
            buildNestedInclude(association.target, remainingPath, options),
        ];
    }
    return includeConfig;
}
function applyAssociationScope(model, associationName, scope) {
    const association = model.associations[associationName];
    if (!association) {
        throw new Error(`Association '${associationName}' not found on model ${model.name}`);
    }
    return {
        association: associationName,
        where: scope,
    };
}
function createScopedAssociationGetter(model, associationName, scopeName, scopeWhere) {
    const methodName = `get${scopeName.charAt(0).toUpperCase() + scopeName.slice(1)}${associationName.charAt(0).toUpperCase() + associationName.slice(1)}`;
    return methodName;
}
function getAssociationAliases(models) {
    const aliasMap = {};
    for (const model of models) {
        const modelName = model.name;
        aliasMap[modelName] = {
            hasOne: [],
            hasMany: [],
            belongsTo: [],
            belongsToMany: [],
        };
        for (const [assocName, association] of Object.entries(model.associations)) {
            aliasMap[modelName][association.associationType].push(assocName);
        }
    }
    return aliasMap;
}
function findAssociationByAlias(model, alias) {
    return model.associations[alias];
}
function getAssociationsByType(model, type) {
    return Object.values(model.associations).filter((assoc) => assoc.associationType === type);
}
function configureCascade(model, associationName, cascadeConfig) {
    const association = model.associations[associationName];
    if (!association) {
        throw new Error(`Association '${associationName}' not found`);
    }
    return association;
}
function setupCascadeDeleteAll(model) {
    const hasManyAssocs = getAssociationsByType(model, 'hasMany');
    return hasManyAssocs.length;
}
function manageConstraints(model, associationName, constraintConfig) {
    const association = model.associations[associationName];
    if (!association) {
        throw new Error(`Association '${associationName}' not found`);
    }
    return constraintConfig;
}
async function disableConstraintsForBulkOp(sequelize, models) {
    const dialect = sequelize.getDialect();
    switch (dialect) {
        case 'postgres':
            await sequelize.query('SET CONSTRAINTS ALL DEFERRED');
            break;
        case 'mysql':
        case 'mariadb':
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
            break;
        case 'mssql':
            for (const model of models) {
                await sequelize.query(`ALTER TABLE ${model.tableName} NOCHECK CONSTRAINT ALL`);
            }
            break;
        case 'sqlite':
            await sequelize.query('PRAGMA foreign_keys = OFF');
            break;
        default:
            console.warn(`Constraint disabling not implemented for dialect: ${dialect}`);
    }
}
async function enableConstraintsForBulkOp(sequelize, models) {
    const dialect = sequelize.getDialect();
    switch (dialect) {
        case 'postgres':
            await sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
            break;
        case 'mysql':
        case 'mariadb':
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
            break;
        case 'mssql':
            for (const model of models) {
                await sequelize.query(`ALTER TABLE ${model.tableName} WITH CHECK CHECK CONSTRAINT ALL`);
            }
            break;
        case 'sqlite':
            await sequelize.query('PRAGMA foreign_keys = ON');
            break;
        default:
            console.warn(`Constraint enabling not implemented for dialect: ${dialect}`);
    }
}
function syncBidirectionalAssociations(model1, model2, assoc1Name, assoc2Name) {
    const forward = model1.associations[assoc1Name];
    const reverse = model2.associations[assoc2Name];
    if (!forward || !reverse) {
        throw new Error('One or both associations not found');
    }
    return { forward, reverse };
}
function validateAssociationConsistency(model) {
    const errors = [];
    for (const [assocName, association] of Object.entries(model.associations)) {
        if (!association.target) {
            errors.push(`Association '${assocName}' has no target model`);
            continue;
        }
        if (association.associationType === 'belongsToMany') {
            const btmAssoc = association;
            if (!btmAssoc.through) {
                errors.push(`BelongsToMany association '${assocName}' missing through model`);
            }
            else {
                const throughModel = btmAssoc.through.model;
                if (throughModel) {
                    const foreignKey = btmAssoc.foreignKey;
                    const otherKey = btmAssoc.otherKey;
                    if (!throughModel.rawAttributes[foreignKey]) {
                        errors.push(`Through model '${throughModel.name}' missing foreign key '${foreignKey}' for association '${assocName}'`);
                    }
                    if (!throughModel.rawAttributes[otherKey]) {
                        errors.push(`Through model '${throughModel.name}' missing foreign key '${otherKey}' for association '${assocName}'`);
                    }
                }
            }
        }
        if (association.associationType === 'belongsTo') {
            const foreignKey = association.foreignKey;
            if (foreignKey && !model.rawAttributes[foreignKey]) {
                errors.push(`Model '${model.name}' missing foreign key '${foreignKey}' for belongsTo association '${assocName}'`);
            }
        }
        if (!association.as) {
            errors.push(`Association '${assocName}' missing alias ('as' option)`);
        }
        if (association.target === model && association.associationType !== 'belongsToMany') {
            const foreignKey = association.foreignKey;
            if (!foreignKey) {
                errors.push(`Self-referential association '${assocName}' missing explicit foreignKey`);
            }
        }
    }
    return errors;
}
function createCompositeKeyAssociation(source, target, foreignKeys, targetKeys) {
    throw new Error('Composite foreign keys require custom implementation');
}
async function preloadAssociations(model, associationPaths, findOptions) {
    const includes = associationPaths.map((path) => buildNestedInclude(model, path));
    return model.findAll({
        ...findOptions,
        include: includes,
    });
}
function createAssociationBatchLoader(model, associationName, options = {}) {
    const association = model.associations[associationName];
    if (!association) {
        throw new Error(`Association '${associationName}' not found on model ${model.name}`);
    }
    const { batchWindow = 10, maxBatchSize = 100, cacheResults = false } = options;
    const batchCache = new Map();
    let batchQueue = [];
    let batchTimeout = null;
    const resultCache = cacheResults ? new Map() : null;
    const executeBatch = async () => {
        const ids = [...new Set(batchQueue)];
        batchQueue = [];
        if (ids.length === 0) {
            return new Map();
        }
        try {
            const results = await model.findAll({
                where: { id: ids },
                include: [{ association: associationName }],
            });
            const resultMap = new Map();
            for (const result of results) {
                const assocData = result[associationName];
                const dataArray = Array.isArray(assocData) ? assocData : (assocData ? [assocData] : []);
                const resultId = result.get('id');
                resultMap.set(resultId, dataArray);
                if (resultCache) {
                    resultCache.set(resultId, dataArray);
                }
            }
            for (const id of ids) {
                if (!resultMap.has(id)) {
                    resultMap.set(id, []);
                }
            }
            return resultMap;
        }
        catch (error) {
            console.error(`Batch load failed for ${model.name}.${associationName}:`, error);
            const errorMap = new Map();
            for (const id of ids) {
                errorMap.set(id, []);
            }
            return errorMap;
        }
    };
    return (id) => {
        if (resultCache && resultCache.has(id)) {
            return Promise.resolve(resultCache.get(id));
        }
        if (batchCache.has(id)) {
            return batchCache.get(id);
        }
        const promise = new Promise((resolve, reject) => {
            batchQueue.push(id);
            if (batchQueue.length >= maxBatchSize) {
                if (batchTimeout) {
                    clearTimeout(batchTimeout);
                    batchTimeout = null;
                }
                executeBatch()
                    .then((resultMap) => {
                    for (const [batchId, data] of resultMap) {
                        const cachedPromise = batchCache.get(batchId);
                        if (cachedPromise) {
                            batchCache.delete(batchId);
                        }
                    }
                    resolve(resultMap.get(id) || []);
                })
                    .catch(reject);
                return;
            }
            if (batchTimeout) {
                clearTimeout(batchTimeout);
            }
            batchTimeout = setTimeout(async () => {
                try {
                    const resultMap = await executeBatch();
                    for (const [batchId, data] of resultMap) {
                        const cachedPromise = batchCache.get(batchId);
                        if (cachedPromise) {
                            batchCache.delete(batchId);
                        }
                    }
                    resolve(resultMap.get(id) || []);
                }
                catch (error) {
                    reject(error);
                }
            }, batchWindow);
        });
        batchCache.set(id, promise);
        return promise;
    };
}
function getAssociationMetadata(model, associationName) {
    const association = model.associations[associationName];
    if (!association) {
        throw new Error(`Association '${associationName}' not found`);
    }
    return {
        type: association.associationType,
        foreignKey: association.foreignKey || '',
        targetModel: association.target.name,
        sourceModel: association.source.name,
        as: association.as,
    };
}
function cloneAssociation(source, target, associationName, newAlias) {
    const originalAssoc = source.associations[associationName];
    if (!originalAssoc) {
        throw new Error(`Association '${associationName}' not found`);
    }
    const assocTarget = originalAssoc.target;
    const options = {
        ...originalAssoc.options,
        as: newAlias || originalAssoc.as,
    };
    return createAssociation({
        type: originalAssoc.associationType,
        source: target,
        target: assocTarget,
        options,
    });
}
function removeAssociation(model, associationName) {
    if (model.associations[associationName]) {
        delete model.associations[associationName];
        return true;
    }
    return false;
}
function listAssociations(model) {
    return Object.keys(model.associations);
}
function hasAssociation(model, associationName) {
    return !!model.associations[associationName];
}
function getAssociationTarget(model, associationName) {
    const association = model.associations[associationName];
    if (!association) {
        throw new Error(`Association '${associationName}' not found`);
    }
    return association.target;
}
function createCountInclude(model, associationNames) {
    const attributes = {
        include: [],
    };
    for (const assocName of associationNames) {
        const association = model.associations[assocName];
        if (!association)
            continue;
        attributes.include.push([
            model.sequelize.fn('COUNT', model.sequelize.col(`${assocName}.id`)),
            `${assocName}Count`,
        ]);
    }
    const include = associationNames.map((assocName) => ({
        association: assocName,
        attributes: [],
    }));
    return {
        attributes,
        include,
        group: [`${model.name}.id`],
        subQuery: false,
    };
}
function createSeparateQueryInclude(model, associationNames) {
    const include = associationNames.map((assocName) => ({
        association: assocName,
        separate: true,
    }));
    return { include };
}
function analyzeAssociationComplexity(model, includes) {
    let maxDepth = 0;
    let totalIncludes = 0;
    let hasMultipleHasMany = false;
    const recommendations = [];
    function traverse(currentIncludes, depth) {
        maxDepth = Math.max(maxDepth, depth);
        totalIncludes += currentIncludes.length;
        let hasManyCount = 0;
        for (const inc of currentIncludes) {
            if (typeof inc === 'object' && 'association' in inc) {
                const assocName = inc.association;
                const association = model.associations[assocName];
                if (association?.associationType === 'hasMany') {
                    hasManyCount++;
                }
                if (inc.include) {
                    traverse(Array.isArray(inc.include) ? inc.include : [inc.include], depth + 1);
                }
            }
        }
        if (hasManyCount > 1) {
            hasMultipleHasMany = true;
        }
    }
    traverse(includes, 1);
    if (maxDepth > 3) {
        recommendations.push('Consider using separate queries for deep nesting');
    }
    if (hasMultipleHasMany) {
        recommendations.push('Multiple hasMany includes may cause cartesian product');
        recommendations.push('Use separate: true for hasMany associations');
    }
    if (totalIncludes > 5) {
        recommendations.push('High number of includes may impact performance');
    }
    return {
        depth: maxDepth,
        totalIncludes,
        hasCartesianProduct: hasMultipleHasMany,
        recommendations,
    };
}
function generateAssociationMigration(model, associationName) {
    const association = model.associations[associationName];
    if (!association) {
        throw new Error(`Association '${associationName}' not found`);
    }
    const foreignKey = association.foreignKey || `${associationName}Id`;
    const tableName = model.tableName;
    const targetTableName = association.target.tableName;
    const up = `
    await queryInterface.addColumn('${tableName}', '${foreignKey}', {
      type: Sequelize.UUID,
      references: {
        model: '${targetTableName}',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  `.trim();
    const down = `
    await queryInterface.removeColumn('${tableName}', '${foreignKey}');
  `.trim();
    return { up, down };
}
function manageAssociationHooks(model, associationName, hooks) {
    const association = model.associations[associationName];
    if (!association) {
        throw new Error(`Association '${associationName}' not found`);
    }
    const registeredHooks = [];
    if (hooks.afterAdd) {
        registeredHooks.push({ event: 'afterAdd', handler: hooks.afterAdd });
    }
    if (hooks.beforeRemove) {
        registeredHooks.push({ event: 'beforeRemove', handler: hooks.beforeRemove });
    }
    if (hooks.afterRemove) {
        registeredHooks.push({ event: 'afterRemove', handler: hooks.afterRemove });
    }
    return () => {
        registeredHooks.length = 0;
    };
}
function createAssociationScopes(model, associationName, scopes) {
    const association = model.associations[associationName];
    if (!association) {
        throw new Error(`Association '${associationName}' not found`);
    }
    const scopeConfigs = {};
    for (const [scopeName, whereCondition] of Object.entries(scopes)) {
        scopeConfigs[scopeName] = {
            association: associationName,
            where: whereCondition,
        };
    }
    return scopeConfigs;
}
function configureLazyLoading(model, associationName, config) {
    const association = model.associations[associationName];
    if (!association) {
        throw new Error(`Association '${associationName}' not found`);
    }
    return {
        cacheKey: config.cacheKey || `${model.name}-${associationName}`,
        ttl: config.ttl || 300,
        refreshOnAccess: config.refreshOnAccess ?? true,
    };
}
function createEagerLoadingPresets(model, presets) {
    const presetConfigs = {};
    for (const [presetName, associationNames] of Object.entries(presets)) {
        presetConfigs[presetName] = associationNames.map((assocName) => {
            const association = model.associations[assocName];
            if (!association) {
                throw new Error(`Association '${assocName}' not found on model ${model.name}`);
            }
            return { association: assocName };
        });
    }
    return presetConfigs;
}
function validateAssociationIntegrity(models) {
    const errors = [];
    const warnings = [];
    for (const model of models) {
        for (const [assocName, association] of Object.entries(model.associations)) {
            const targetModel = association.target;
            if (!models.includes(targetModel)) {
                warnings.push(`Model ${model.name} has association '${assocName}' to ${targetModel.name} which is not in validation set`);
            }
            if (association.associationType === 'belongsTo') {
                const reverseAssoc = Object.values(targetModel.associations).find((assoc) => assoc.target === model && (assoc.associationType === 'hasMany' || assoc.associationType === 'hasOne'));
                if (!reverseAssoc) {
                    warnings.push(`Model ${model.name} has belongsTo '${assocName}' to ${targetModel.name}, but no reverse hasMany/hasOne found`);
                }
            }
            if (association.associationType === 'belongsToMany') {
                const btmAssoc = association;
                if (!btmAssoc.through) {
                    errors.push(`Model ${model.name} has belongsToMany '${assocName}' without through model`);
                }
            }
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
//# sourceMappingURL=association-manager.service.js.map