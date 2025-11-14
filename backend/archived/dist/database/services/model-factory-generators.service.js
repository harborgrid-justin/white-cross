"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModelFromSchema = createModelFromSchema;
exports.generateModelFromTable = generateModelFromTable;
exports.createModelsFromBlueprints = createModelsFromBlueprints;
exports.cloneModelWithModifications = cloneModelWithModifications;
exports.createTemporaryModel = createTemporaryModel;
exports.inferSchemaFromTable = inferSchemaFromTable;
exports.inferModelRelationships = inferModelRelationships;
exports.extractValidationRules = extractValidationRules;
exports.generateOptimalIndexes = generateOptimalIndexes;
exports.detectPartitioningStrategy = detectPartitioningStrategy;
exports.generateCreateTableMigration = generateCreateTableMigration;
exports.generateAlterTableMigration = generateAlterTableMigration;
exports.generateSeedDataMigration = generateSeedDataMigration;
exports.generateIndexMigration = generateIndexMigration;
exports.createModelFromTemplate = createModelFromTemplate;
exports.getAvailableTemplates = getAvailableTemplates;
exports.getModelTemplate = getModelTemplate;
exports.generateTypeScriptInterface = generateTypeScriptInterface;
exports.validateModelDefinition = validateModelDefinition;
exports.generateGraphQLSchema = generateGraphQLSchema;
const sequelize_1 = require("sequelize");
function createModelFromSchema(schemaDefinition, modelName, sequelize, options = {}) {
    const attributes = {};
    if (schemaDefinition.properties) {
        for (const [key, prop] of Object.entries(schemaDefinition.properties)) {
            const propSchema = prop;
            const attr = {
                type: mapJsonSchemaTypeToSequelize(propSchema),
                allowNull: !schemaDefinition.required?.includes(key),
            };
            if (propSchema.minimum !== undefined || propSchema.maximum !== undefined) {
                attr.validate = attr.validate || {};
                if (propSchema.minimum !== undefined)
                    attr.validate.min = propSchema.minimum;
                if (propSchema.maximum !== undefined)
                    attr.validate.max = propSchema.maximum;
            }
            if (propSchema.minLength !== undefined || propSchema.maxLength !== undefined) {
                attr.validate = attr.validate || {};
                attr.validate.len = [propSchema.minLength || 0, propSchema.maxLength || Infinity];
            }
            if (propSchema.pattern) {
                attr.validate = attr.validate || {};
                attr.validate.is = new RegExp(propSchema.pattern);
            }
            if (propSchema.format === 'email') {
                attr.validate = attr.validate || {};
                attr.validate.isEmail = true;
            }
            if (propSchema.format === 'url' || propSchema.format === 'uri') {
                attr.validate = attr.validate || {};
                attr.validate.isUrl = true;
            }
            if (propSchema.enum) {
                attr.validate = attr.validate || {};
                attr.validate.isIn = [propSchema.enum];
            }
            if (propSchema.default !== undefined) {
                attr.defaultValue = propSchema.default;
            }
            attributes[key] = attr;
        }
    }
    class DynamicModel extends sequelize_1.Model {
    }
    const modelOptions = {
        sequelize,
        modelName,
        tableName: options.tableName || modelName.toLowerCase() + 's',
        timestamps: true,
        underscored: true,
        ...options,
    };
    DynamicModel.init(attributes, modelOptions);
    return DynamicModel;
}
async function generateModelFromTable(tableName, sequelize, modelName) {
    const queryInterface = sequelize.getQueryInterface();
    const tableDescription = await queryInterface.describeTable(tableName);
    const attributes = {};
    for (const [columnName, columnInfo] of Object.entries(tableDescription)) {
        const attr = {
            type: mapDatabaseTypeToSequelize(columnInfo.type, sequelize.getDialect()),
            allowNull: columnInfo.allowNull,
            primaryKey: columnInfo.primaryKey,
            autoIncrement: columnInfo.autoIncrement,
            defaultValue: columnInfo.defaultValue,
            unique: columnInfo.unique,
        };
        if (columnInfo.references) {
            attr.references = {
                model: columnInfo.references.model,
                key: columnInfo.references.key || 'id',
            };
        }
        attributes[columnName] = attr;
    }
    class ReversedModel extends sequelize_1.Model {
    }
    const finalModelName = modelName || tableName.replace(/_/g, '');
    ReversedModel.init(attributes, {
        sequelize,
        tableName,
        modelName: finalModelName,
        timestamps: false,
        freezeTableName: true,
    });
    return ReversedModel;
}
function createModelsFromBlueprints(blueprints, sequelize) {
    const models = new Map();
    for (const blueprint of blueprints) {
        class DynamicModel extends sequelize_1.Model {
        }
        DynamicModel.init(blueprint.attributes, {
            ...blueprint.options,
            sequelize,
            modelName: blueprint.name,
        });
        for (const hook of blueprint.hooks || []) {
            DynamicModel.addHook(hook.event, hook.handler);
        }
        if (blueprint.scopes) {
            for (const [scopeName, scopeConfig] of Object.entries(blueprint.scopes)) {
                DynamicModel.addScope(scopeName, scopeConfig);
            }
        }
        models.set(blueprint.name, DynamicModel);
    }
    for (const blueprint of blueprints) {
        const sourceModel = models.get(blueprint.name);
        if (!sourceModel)
            continue;
        for (const assocBlueprint of blueprint.associations || []) {
            const targetModel = models.get(assocBlueprint.target);
            if (!targetModel)
                continue;
            switch (assocBlueprint.type) {
                case 'hasOne':
                    sourceModel.hasOne(targetModel, assocBlueprint.options);
                    break;
                case 'hasMany':
                    sourceModel.hasMany(targetModel, assocBlueprint.options);
                    break;
                case 'belongsTo':
                    sourceModel.belongsTo(targetModel, assocBlueprint.options);
                    break;
                case 'belongsToMany':
                    sourceModel.belongsToMany(targetModel, assocBlueprint.options);
                    break;
            }
        }
    }
    return models;
}
function cloneModelWithModifications(sourceModel, newModelName, modifications, sequelize) {
    const sourceAttrs = sourceModel.getAttributes();
    const newAttrs = {};
    for (const [key, attr] of Object.entries(sourceAttrs)) {
        if (modifications.removeAttributes?.includes(key))
            continue;
        newAttrs[key] = { ...attr };
        if (modifications.modifyAttributes?.[key]) {
            Object.assign(newAttrs[key], modifications.modifyAttributes[key]);
        }
    }
    if (modifications.addAttributes) {
        Object.assign(newAttrs, modifications.addAttributes);
    }
    class ClonedModel extends sequelize_1.Model {
    }
    const newOptions = {
        ...sourceModel.options,
        ...modifications.addOptions,
        sequelize,
        modelName: newModelName,
        tableName: modifications.tableName || newModelName.toLowerCase() + 's',
    };
    ClonedModel.init(newAttrs, newOptions);
    return ClonedModel;
}
async function createTemporaryModel(modelName, attributes, data) {
    const tempSequelize = new sequelize_1.Sequelize('sqlite::memory:', {
        logging: false,
    });
    class TempModel extends sequelize_1.Model {
    }
    TempModel.init(attributes, {
        sequelize: tempSequelize,
        modelName,
        tableName: modelName.toLowerCase(),
        timestamps: false,
    });
    await tempSequelize.sync({ force: true });
    if (data && data.length > 0) {
        await TempModel.bulkCreate(data);
    }
    return {
        model: TempModel,
        sequelize: tempSequelize,
    };
}
async function inferSchemaFromTable(tableName, sequelize) {
    const queryInterface = sequelize.getQueryInterface();
    const tableDescription = await queryInterface.describeTable(tableName);
    const indexes = await queryInterface.showIndex(tableName);
    const attributes = {};
    const primaryKeys = [];
    const foreignKeys = [];
    const uniqueFields = [];
    for (const [columnName, columnInfo] of Object.entries(tableDescription)) {
        attributes[columnName] = {
            type: mapDatabaseTypeToSequelize(columnInfo.type, sequelize.getDialect()),
            allowNull: columnInfo.allowNull,
            primaryKey: columnInfo.primaryKey,
            autoIncrement: columnInfo.autoIncrement,
            defaultValue: columnInfo.defaultValue,
            unique: columnInfo.unique,
        };
        if (columnInfo.primaryKey) {
            primaryKeys.push(columnName);
        }
        if (columnInfo.unique) {
            uniqueFields.push(columnName);
        }
        if (columnInfo.references) {
            foreignKeys.push({
                field: columnName,
                references: `${columnInfo.references.model}.${columnInfo.references.key}`,
            });
            attributes[columnName].references = {
                model: columnInfo.references.model,
                key: columnInfo.references.key,
            };
        }
    }
    const constraints = [];
    return {
        attributes,
        indexes: indexes,
        constraints,
        metadata: {
            tableName,
            primaryKeys,
            foreignKeys,
            uniqueFields,
        },
    };
}
async function inferModelRelationships(models, sequelize) {
    const recommendations = [];
    for (const sourceModel of models) {
        const sourceAttrs = sourceModel.getAttributes();
        for (const [attrName, attr] of Object.entries(sourceAttrs)) {
            if (attr.references) {
                const ref = attr.references;
                const targetModel = models.find((m) => m.tableName === ref.model);
                if (targetModel) {
                    recommendations.push({
                        source: sourceModel.name,
                        target: targetModel.name,
                        type: 'belongsTo',
                        foreignKey: attrName,
                        confidence: 1.0,
                        reasoning: `Foreign key ${attrName} references ${ref.model}.${ref.key}`,
                    });
                    const isSingular = attrName.endsWith('Id') && !attrName.includes('_');
                    recommendations.push({
                        source: targetModel.name,
                        target: sourceModel.name,
                        type: isSingular ? 'hasOne' : 'hasMany',
                        foreignKey: attrName,
                        confidence: 0.8,
                        reasoning: `Inverse relationship inferred from foreign key pattern`,
                    });
                }
            }
        }
    }
    return recommendations;
}
async function extractValidationRules(tableName, sequelize) {
    const validations = {};
    const tableDescription = await sequelize.getQueryInterface().describeTable(tableName);
    for (const [columnName, columnInfo] of Object.entries(tableDescription)) {
        const fieldValidations = {};
        if (!columnInfo.allowNull) {
            fieldValidations.notNull = true;
        }
        if (columnInfo.type.includes('VARCHAR')) {
            const match = columnInfo.type.match(/VARCHAR\((\d+)\)/);
            if (match) {
                fieldValidations.len = [0, parseInt(match[1])];
            }
        }
        if (Object.keys(fieldValidations).length > 0) {
            validations[columnName] = fieldValidations;
        }
    }
    return validations;
}
function generateOptimalIndexes(model, queryPatterns) {
    const indexMap = new Map();
    const singleFieldFrequency = new Map();
    for (const pattern of queryPatterns) {
        const fields = Object.keys(pattern);
        for (const field of fields) {
            singleFieldFrequency.set(field, (singleFieldFrequency.get(field) || 0) + 1);
        }
        if (fields.length > 1) {
            const sortedFields = fields.sort().join(',');
            if (!indexMap.has(sortedFields)) {
                indexMap.set(sortedFields, new Set(fields));
            }
        }
    }
    const indexes = [];
    for (const [field, frequency] of Array.from(singleFieldFrequency.entries())) {
        if (frequency >= queryPatterns.length * 0.3) {
            indexes.push({
                fields: [field],
                type: 'BTREE',
                name: `${model.tableName}_${field}_idx`,
            });
        }
    }
    for (const [key, fields] of Array.from(indexMap.entries())) {
        const fieldArray = Array.from(fields);
        indexes.push({
            fields: fieldArray,
            type: 'BTREE',
            name: `${model.tableName}_${fieldArray.join('_')}_idx`,
        });
    }
    const attributes = model.getAttributes();
    for (const [attrName, attr] of Object.entries(attributes)) {
        if (attr.references) {
            const hasExisting = indexes.some((idx) => idx.fields.length === 1 && idx.fields[0] === attrName);
            if (!hasExisting) {
                indexes.push({
                    fields: [attrName],
                    type: 'BTREE',
                    name: `${model.tableName}_${attrName}_fk_idx`,
                });
            }
        }
    }
    return indexes;
}
async function detectPartitioningStrategy(model, sampleSize = 10000) {
    const totalCount = await model.count();
    if (totalCount < 1000000) {
        return {
            recommended: false,
            strategy: null,
            key: null,
            reasoning: 'Table size does not warrant partitioning',
            estimatedImprovement: 'N/A',
        };
    }
    const attributes = model.getAttributes();
    const dateFields = Object.entries(attributes)
        .filter(([_, attr]) => attr.type instanceof sequelize_1.DataTypes.DATE || attr.type instanceof sequelize_1.DataTypes.DATEONLY)
        .map(([name, _]) => name);
    if (dateFields.length > 0) {
        const dateField = dateFields.includes('createdAt') ? 'createdAt' : dateFields[0];
        return {
            recommended: true,
            strategy: 'range',
            key: dateField,
            reasoning: `Large table (${totalCount} rows) with date field ${dateField} suitable for range partitioning`,
            estimatedImprovement: 'Query performance improvement: 30-70% for date-range queries',
        };
    }
    const stringFields = Object.entries(attributes)
        .filter(([_, attr]) => attr.type instanceof sequelize_1.DataTypes.STRING || attr.type instanceof sequelize_1.DataTypes.CHAR)
        .map(([name, _]) => name);
    if (stringFields.length > 0 && stringFields.includes('status')) {
        return {
            recommended: true,
            strategy: 'list',
            key: 'status',
            reasoning: `Status field detected, suitable for list partitioning by status values`,
            estimatedImprovement: 'Query performance improvement: 20-50% for status-filtered queries',
        };
    }
    return {
        recommended: true,
        strategy: 'hash',
        key: 'id',
        reasoning: 'No obvious partitioning key, hash partitioning on primary key recommended',
        estimatedImprovement: 'Improved write distribution and parallel query execution',
    };
}
function generateCreateTableMigration(model, options = {}) {
    const { version = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14) } = options;
    const tableName = model.tableName;
    const attributes = model.getAttributes();
    let upScript = `'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('${tableName}', {
`;
    for (const [attrName, attr] of Object.entries(attributes)) {
        upScript += `      ${attrName}: {\n`;
        upScript += `        type: ${serializeDataType(attr.type)},\n`;
        upScript += `        allowNull: ${attr.allowNull !== false},\n`;
        if (attr.primaryKey)
            upScript += `        primaryKey: true,\n`;
        if (attr.autoIncrement)
            upScript += `        autoIncrement: true,\n`;
        if (attr.unique)
            upScript += `        unique: true,\n`;
        if (attr.defaultValue !== undefined) {
            upScript += `        defaultValue: ${JSON.stringify(attr.defaultValue)},\n`;
        }
        if (attr.references) {
            const ref = attr.references;
            upScript += `        references: {\n`;
            upScript += `          model: '${ref.model}',\n`;
            upScript += `          key: '${ref.key || 'id'}'\n`;
            upScript += `        },\n`;
            upScript += `        onUpdate: 'CASCADE',\n`;
            upScript += `        onDelete: 'CASCADE',\n`;
        }
        upScript += `      },\n`;
    }
    upScript += `    });\n`;
    if (options.includeIndexes && model.options.indexes) {
        for (const index of model.options.indexes) {
            const indexName = index.name || `${tableName}_${index.fields.join('_')}_idx`;
            upScript += `\n    await queryInterface.addIndex('${tableName}', ${JSON.stringify(index.fields)}, {\n`;
            upScript += `      name: '${indexName}',\n`;
            if (index.unique)
                upScript += `      unique: true,\n`;
            if (index.type)
                upScript += `      type: '${index.type}',\n`;
            upScript += `    });\n`;
        }
    }
    upScript += `  },\n\n`;
    let downScript = `  async down(queryInterface, Sequelize) {\n`;
    downScript += `    await queryInterface.dropTable('${tableName}');\n`;
    downScript += `  }\n`;
    downScript += `};\n`;
    return {
        up: upScript + downScript,
        down: downScript,
        dependencies: [],
        version,
    };
}
function generateAlterTableMigration(oldModel, newModel, options = {}) {
    const { version = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14), safeMode = true } = options;
    const tableName = newModel.tableName;
    const oldAttrs = oldModel.getAttributes();
    const newAttrs = newModel.getAttributes();
    const addedFields = [];
    const removedFields = [];
    const modifiedFields = [];
    for (const key of Object.keys(newAttrs)) {
        if (!oldAttrs[key]) {
            addedFields.push(key);
        }
    }
    for (const key of Object.keys(oldAttrs)) {
        if (!newAttrs[key]) {
            removedFields.push(key);
        }
    }
    for (const key of Object.keys(newAttrs)) {
        if (oldAttrs[key] && newAttrs[key]) {
            const oldType = serializeDataType(oldAttrs[key].type);
            const newType = serializeDataType(newAttrs[key].type);
            if (oldType !== newType || oldAttrs[key].allowNull !== newAttrs[key].allowNull) {
                modifiedFields.push(key);
            }
        }
    }
    let upScript = `'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
`;
    for (const field of addedFields) {
        const attr = newAttrs[field];
        upScript += `    await queryInterface.addColumn('${tableName}', '${field}', {\n`;
        upScript += `      type: ${serializeDataType(attr.type)},\n`;
        upScript += `      allowNull: ${attr.allowNull !== false},\n`;
        if (attr.defaultValue !== undefined) {
            upScript += `      defaultValue: ${JSON.stringify(attr.defaultValue)},\n`;
        }
        upScript += `    });\n`;
    }
    for (const field of modifiedFields) {
        const attr = newAttrs[field];
        upScript += `    await queryInterface.changeColumn('${tableName}', '${field}', {\n`;
        upScript += `      type: ${serializeDataType(attr.type)},\n`;
        upScript += `      allowNull: ${attr.allowNull !== false},\n`;
        upScript += `    });\n`;
    }
    if (!safeMode) {
        for (const field of removedFields) {
            upScript += `    await queryInterface.removeColumn('${tableName}', '${field}');\n`;
        }
    }
    else if (removedFields.length > 0) {
        upScript += `    // Safe mode: Column removal commented out\n`;
        for (const field of removedFields) {
            upScript += `    // await queryInterface.removeColumn('${tableName}', '${field}');\n`;
        }
    }
    upScript += `  },\n\n`;
    let downScript = `  async down(queryInterface, Sequelize) {\n`;
    downScript += `    // Reverse operations\n`;
    for (const field of addedFields) {
        downScript += `    await queryInterface.removeColumn('${tableName}', '${field}');\n`;
    }
    for (const field of modifiedFields) {
        const attr = oldAttrs[field];
        downScript += `    await queryInterface.changeColumn('${tableName}', '${field}', {\n`;
        downScript += `      type: ${serializeDataType(attr.type)},\n`;
        downScript += `      allowNull: ${attr.allowNull !== false},\n`;
        downScript += `    });\n`;
    }
    downScript += `  }\n`;
    downScript += `};\n`;
    return {
        up: upScript + downScript,
        down: downScript,
        dependencies: [],
        version,
    };
}
function generateSeedDataMigration(model, seedData, options = {}) {
    const { version = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14) } = options;
    const tableName = model.tableName;
    let upScript = `'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('${tableName}', ${JSON.stringify(seedData, null, 6)}, {
      updateOnDuplicate: ${JSON.stringify(options.updateOnDuplicate || [])}
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('${tableName}', null, {});
  }
};
`;
    return {
        up: upScript,
        down: `await queryInterface.bulkDelete('${tableName}', null, {});`,
        dependencies: [],
        version,
    };
}
function generateIndexMigration(model, indexConfigs, operation) {
    const tableName = model.tableName;
    let upScript = `'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
`;
    if (operation === 'add') {
        for (const indexConfig of indexConfigs) {
            const indexName = indexConfig.name || `${tableName}_${indexConfig.fields.join('_')}_idx`;
            upScript += `    await queryInterface.addIndex('${tableName}', ${JSON.stringify(indexConfig.fields)}, {\n`;
            upScript += `      name: '${indexName}',\n`;
            if (indexConfig.unique)
                upScript += `      unique: true,\n`;
            if (indexConfig.type)
                upScript += `      type: '${indexConfig.type}',\n`;
            upScript += `      concurrently: true // PostgreSQL concurrent index creation\n`;
            upScript += `    });\n`;
        }
    }
    else {
        for (const indexConfig of indexConfigs) {
            const indexName = indexConfig.name || `${tableName}_${indexConfig.fields.join('_')}_idx`;
            upScript += `    await queryInterface.removeIndex('${tableName}', '${indexName}');\n`;
        }
    }
    upScript += `  },\n\n`;
    let downScript = `  async down(queryInterface, Sequelize) {\n`;
    if (operation === 'add') {
        for (const indexConfig of indexConfigs) {
            const indexName = indexConfig.name || `${tableName}_${indexConfig.fields.join('_')}_idx`;
            downScript += `    await queryInterface.removeIndex('${tableName}', '${indexName}');\n`;
        }
    }
    else {
        for (const indexConfig of indexConfigs) {
            const indexName = indexConfig.name || `${tableName}_${indexConfig.fields.join('_')}_idx`;
            downScript += `    await queryInterface.addIndex('${tableName}', ${JSON.stringify(indexConfig.fields)}, {\n`;
            downScript += `      name: '${indexName}',\n`;
            if (indexConfig.unique)
                downScript += `      unique: true,\n`;
            if (indexConfig.type)
                downScript += `      type: '${indexConfig.type}',\n`;
            downScript += `    });\n`;
        }
    }
    downScript += `  }\n`;
    downScript += `};\n`;
    return {
        up: upScript + downScript,
        down: downScript,
        dependencies: [],
        version: new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14),
    };
}
function createModelFromTemplate(templateName, modelName, sequelize, customizations = {}) {
    const template = getModelTemplate(templateName);
    if (!template) {
        throw new Error(`Template '${templateName}' not found`);
    }
    let attributes = { ...template.baseAttributes };
    if (customizations.removeFields) {
        for (const field of customizations.removeFields) {
            delete attributes[field];
        }
    }
    if (customizations.additionalFields) {
        attributes = { ...attributes, ...customizations.additionalFields };
    }
    class TemplateModel extends sequelize_1.Model {
    }
    const modelOptions = {
        ...template.requiredOptions,
        ...customizations.options,
        sequelize,
        modelName,
        tableName: customizations.options?.tableName || modelName.toLowerCase() + 's',
    };
    TemplateModel.init(attributes, modelOptions);
    return TemplateModel;
}
function getAvailableTemplates() {
    return ['user', 'product', 'order', 'payment', 'article', 'comment', 'audit', 'notification'];
}
function getModelTemplate(templateName) {
    const templates = {
        user: {
            category: 'authentication',
            baseAttributes: {
                id: {
                    type: sequelize_1.DataTypes.UUID,
                    defaultValue: sequelize_1.DataTypes.UUIDV4,
                    primaryKey: true,
                },
                email: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: { isEmail: true },
                },
                password: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                },
                firstName: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                },
                lastName: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                },
                status: {
                    type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'suspended'),
                    defaultValue: 'active',
                },
                lastLoginAt: {
                    type: sequelize_1.DataTypes.DATE,
                    allowNull: true,
                },
            },
            requiredOptions: {
                timestamps: true,
                paranoid: true,
                underscored: true,
            },
            recommendedIndexes: [
                { fields: ['email'], unique: true, name: 'users_email_unique' },
                { fields: ['status'], name: 'users_status_idx' },
            ],
        },
        product: {
            category: 'ecommerce',
            baseAttributes: {
                id: {
                    type: sequelize_1.DataTypes.UUID,
                    defaultValue: sequelize_1.DataTypes.UUIDV4,
                    primaryKey: true,
                },
                sku: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                name: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: true,
                },
                price: {
                    type: sequelize_1.DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                    validate: { min: 0 },
                },
                stock: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                    validate: { min: 0 },
                },
                status: {
                    type: sequelize_1.DataTypes.ENUM('draft', 'published', 'archived'),
                    defaultValue: 'draft',
                },
            },
            requiredOptions: {
                timestamps: true,
                underscored: true,
            },
            recommendedIndexes: [
                { fields: ['sku'], unique: true, name: 'products_sku_unique' },
                { fields: ['status'], name: 'products_status_idx' },
            ],
        },
        order: {
            category: 'ecommerce',
            baseAttributes: {
                id: {
                    type: sequelize_1.DataTypes.UUID,
                    defaultValue: sequelize_1.DataTypes.UUIDV4,
                    primaryKey: true,
                },
                orderNumber: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                status: {
                    type: sequelize_1.DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
                    defaultValue: 'pending',
                },
                totalAmount: {
                    type: sequelize_1.DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                    validate: { min: 0 },
                },
                currency: {
                    type: sequelize_1.DataTypes.STRING(3),
                    allowNull: false,
                    defaultValue: 'USD',
                },
            },
            requiredOptions: {
                timestamps: true,
                underscored: true,
            },
            recommendedIndexes: [
                { fields: ['orderNumber'], unique: true, name: 'orders_number_unique' },
                { fields: ['status'], name: 'orders_status_idx' },
            ],
        },
        audit: {
            category: 'logging',
            baseAttributes: {
                id: {
                    type: sequelize_1.DataTypes.UUID,
                    defaultValue: sequelize_1.DataTypes.UUIDV4,
                    primaryKey: true,
                },
                modelName: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                },
                recordId: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                },
                action: {
                    type: sequelize_1.DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE'),
                    allowNull: false,
                },
                changes: {
                    type: sequelize_1.DataTypes.JSONB,
                    allowNull: true,
                },
                userId: {
                    type: sequelize_1.DataTypes.UUID,
                    allowNull: true,
                },
                ipAddress: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                },
                userAgent: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: true,
                },
            },
            requiredOptions: {
                timestamps: true,
                underscored: true,
                indexes: [
                    { fields: ['modelName', 'recordId'], name: 'audit_model_record_idx' },
                    { fields: ['action'], name: 'audit_action_idx' },
                    { fields: ['userId'], name: 'audit_user_idx' },
                ],
            },
            recommendedIndexes: [],
        },
    };
    return templates[templateName] || null;
}
function mapJsonSchemaTypeToSequelize(jsonSchemaType) {
    const typeMap = {
        string: sequelize_1.DataTypes.STRING,
        integer: sequelize_1.DataTypes.INTEGER,
        number: sequelize_1.DataTypes.DECIMAL,
        boolean: sequelize_1.DataTypes.BOOLEAN,
        object: sequelize_1.DataTypes.JSONB,
        array: sequelize_1.DataTypes.JSONB,
    };
    const baseType = jsonSchemaType.type || 'string';
    if (jsonSchemaType.format === 'date-time') {
        return sequelize_1.DataTypes.DATE;
    }
    if (jsonSchemaType.format === 'date') {
        return sequelize_1.DataTypes.DATEONLY;
    }
    if (jsonSchemaType.format === 'uuid') {
        return sequelize_1.DataTypes.UUID;
    }
    return typeMap[baseType] || sequelize_1.DataTypes.STRING;
}
function mapDatabaseTypeToSequelize(dbType, dialect) {
    const upperType = dbType.toUpperCase();
    if (upperType.includes('VARCHAR') || upperType.includes('CHARACTER VARYING')) {
        return sequelize_1.DataTypes.STRING;
    }
    if (upperType.includes('TEXT')) {
        return sequelize_1.DataTypes.TEXT;
    }
    if (upperType.includes('INT') && !upperType.includes('BIGINT')) {
        return sequelize_1.DataTypes.INTEGER;
    }
    if (upperType.includes('BIGINT')) {
        return sequelize_1.DataTypes.BIGINT;
    }
    if (upperType.includes('DECIMAL') || upperType.includes('NUMERIC')) {
        return sequelize_1.DataTypes.DECIMAL;
    }
    if (upperType.includes('FLOAT') || upperType.includes('REAL')) {
        return sequelize_1.DataTypes.FLOAT;
    }
    if (upperType.includes('DOUBLE')) {
        return sequelize_1.DataTypes.DOUBLE;
    }
    if (upperType.includes('BOOL')) {
        return sequelize_1.DataTypes.BOOLEAN;
    }
    if (upperType.includes('DATE') && !upperType.includes('DATETIME')) {
        return sequelize_1.DataTypes.DATEONLY;
    }
    if (upperType.includes('TIMESTAMP') || upperType.includes('DATETIME')) {
        return sequelize_1.DataTypes.DATE;
    }
    if (upperType.includes('TIME') && !upperType.includes('TIMESTAMP')) {
        return sequelize_1.DataTypes.TIME;
    }
    if (upperType.includes('UUID')) {
        return sequelize_1.DataTypes.UUID;
    }
    if (upperType.includes('JSON')) {
        return dialect === 'postgres' ? sequelize_1.DataTypes.JSONB : sequelize_1.DataTypes.JSON;
    }
    if (upperType.includes('BLOB') || upperType.includes('BYTEA')) {
        return sequelize_1.DataTypes.BLOB;
    }
    return sequelize_1.DataTypes.STRING;
}
function serializeDataType(dataType) {
    const typeString = dataType.toString();
    if (typeString.includes('VARCHAR')) {
        const match = typeString.match(/VARCHAR\((\d+)\)/);
        return match ? `Sequelize.STRING(${match[1]})` : 'Sequelize.STRING';
    }
    if (typeString.includes('INTEGER'))
        return 'Sequelize.INTEGER';
    if (typeString.includes('BIGINT'))
        return 'Sequelize.BIGINT';
    if (typeString.includes('TEXT'))
        return 'Sequelize.TEXT';
    if (typeString.includes('BOOLEAN'))
        return 'Sequelize.BOOLEAN';
    if (typeString.includes('DATE'))
        return 'Sequelize.DATE';
    if (typeString.includes('DATEONLY'))
        return 'Sequelize.DATEONLY';
    if (typeString.includes('TIME'))
        return 'Sequelize.TIME';
    if (typeString.includes('UUID'))
        return 'Sequelize.UUID';
    if (typeString.includes('DECIMAL')) {
        const match = typeString.match(/DECIMAL\((\d+),\s*(\d+)\)/);
        return match ? `Sequelize.DECIMAL(${match[1]}, ${match[2]})` : 'Sequelize.DECIMAL';
    }
    if (typeString.includes('FLOAT'))
        return 'Sequelize.FLOAT';
    if (typeString.includes('DOUBLE'))
        return 'Sequelize.DOUBLE';
    if (typeString.includes('JSONB'))
        return 'Sequelize.JSONB';
    if (typeString.includes('JSON'))
        return 'Sequelize.JSON';
    if (typeString.includes('ENUM')) {
        return typeString.replace(/ENUM/, 'Sequelize.ENUM');
    }
    return 'Sequelize.STRING';
}
function generateTypeScriptInterface(model, interfaceName) {
    const attributes = model.getAttributes();
    let interfaceStr = `export interface ${interfaceName} {\n`;
    for (const [attrName, attr] of Object.entries(attributes)) {
        const tsType = mapSequelizeTypeToTypeScript(attr.type);
        const optional = attr.allowNull ? '?' : '';
        interfaceStr += `  ${attrName}${optional}: ${tsType};\n`;
    }
    interfaceStr += `}\n`;
    return interfaceStr;
}
function mapSequelizeTypeToTypeScript(dataType) {
    const typeString = dataType.toString();
    if (typeString.includes('STRING') || typeString.includes('TEXT') || typeString.includes('UUID') || typeString.includes('CHAR')) {
        return 'string';
    }
    if (typeString.includes('INTEGER') || typeString.includes('BIGINT') || typeString.includes('FLOAT') || typeString.includes('DOUBLE') || typeString.includes('DECIMAL')) {
        return 'number';
    }
    if (typeString.includes('BOOLEAN')) {
        return 'boolean';
    }
    if (typeString.includes('DATE') || typeString.includes('TIME')) {
        return 'Date';
    }
    if (typeString.includes('JSON')) {
        return 'any';
    }
    if (typeString.includes('ARRAY')) {
        return 'any[]';
    }
    if (typeString.includes('ENUM')) {
        return 'string';
    }
    return 'any';
}
function validateModelDefinition(model) {
    const errors = [];
    const warnings = [];
    const attributes = model.getAttributes();
    const hasPrimaryKey = Object.values(attributes).some((attr) => attr.primaryKey);
    if (!hasPrimaryKey) {
        errors.push('Model has no primary key defined');
    }
    if (model.name !== model.name[0].toUpperCase() + model.name.slice(1)) {
        warnings.push('Model name should start with uppercase letter');
    }
    if (model.options.timestamps === undefined) {
        warnings.push('Timestamps option not explicitly set');
    }
    if (model.options.paranoid && !model.options.timestamps) {
        errors.push('Paranoid mode requires timestamps to be enabled');
    }
    for (const [attrName, attr] of Object.entries(attributes)) {
        if (attr.references) {
            const hasIndex = model.options.indexes?.some((idx) => idx.fields && idx.fields.includes(attrName));
            if (!hasIndex) {
                warnings.push(`Foreign key '${attrName}' has no index`);
            }
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
function generateGraphQLSchema(model, typeName) {
    const attributes = model.getAttributes();
    let schema = `type ${typeName} {\n`;
    for (const [attrName, attr] of Object.entries(attributes)) {
        const gqlType = mapSequelizeTypeToGraphQL(attr.type);
        const nonNull = !attr.allowNull ? '!' : '';
        schema += `  ${attrName}: ${gqlType}${nonNull}\n`;
    }
    schema += `}\n\n`;
    schema += `type Query {\n`;
    schema += `  ${typeName.toLowerCase()}(id: ID!): ${typeName}\n`;
    schema += `  ${typeName.toLowerCase()}s(limit: Int, offset: Int): [${typeName}!]!\n`;
    schema += `}\n\n`;
    schema += `type Mutation {\n`;
    schema += `  create${typeName}(input: Create${typeName}Input!): ${typeName}!\n`;
    schema += `  update${typeName}(id: ID!, input: Update${typeName}Input!): ${typeName}!\n`;
    schema += `  delete${typeName}(id: ID!): Boolean!\n`;
    schema += `}\n`;
    return schema;
}
function mapSequelizeTypeToGraphQL(dataType) {
    const typeString = dataType.toString();
    if (typeString.includes('INTEGER') || typeString.includes('BIGINT')) {
        return 'Int';
    }
    if (typeString.includes('FLOAT') || typeString.includes('DOUBLE') || typeString.includes('DECIMAL')) {
        return 'Float';
    }
    if (typeString.includes('BOOLEAN')) {
        return 'Boolean';
    }
    if (typeString.includes('DATE') || typeString.includes('TIME')) {
        return 'String';
    }
    if (typeString.includes('UUID')) {
        return 'ID';
    }
    if (typeString.includes('JSON')) {
        return 'JSON';
    }
    return 'String';
}
//# sourceMappingURL=model-factory-generators.service.js.map