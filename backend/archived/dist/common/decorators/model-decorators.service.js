"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = Table;
exports.RegisterModel = RegisterModel;
exports.Timestamps = Timestamps;
exports.Paranoid = Paranoid;
exports.Underscored = Underscored;
exports.Field = Field;
exports.PrimaryKey = PrimaryKey;
exports.Required = Required;
exports.Default = Default;
exports.IsEmail = IsEmail;
exports.IsUrl = IsUrl;
exports.Length = Length;
exports.Range = Range;
exports.Validate = Validate;
exports.IsIn = IsIn;
exports.IsAlphanumeric = IsAlphanumeric;
exports.Lowercase = Lowercase;
exports.Uppercase = Uppercase;
exports.Trim = Trim;
exports.Transform = Transform;
exports.Computed = Computed;
exports.Encrypted = Encrypted;
exports.Index = Index;
exports.UniqueIndex = UniqueIndex;
exports.Unique = Unique;
exports.CompositeUnique = CompositeUnique;
exports.ForeignKey = ForeignKey;
exports.CompositeKey = CompositeKey;
exports.Virtual = Virtual;
exports.Getter = Getter;
exports.Setter = Setter;
exports.BeforeCreate = BeforeCreate;
exports.AfterCreate = AfterCreate;
exports.BeforeUpdate = BeforeUpdate;
exports.AfterUpdate = AfterUpdate;
exports.BeforeDestroy = BeforeDestroy;
exports.AfterDestroy = AfterDestroy;
exports.DefaultScope = DefaultScope;
exports.Scope = Scope;
exports.getModelMetadata = getModelMetadata;
exports.initializeModel = initializeModel;
require("reflect-metadata");
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
const METADATA_KEYS = {
    MODEL_OPTIONS: 'sequelize:model:options',
    ATTRIBUTES: 'sequelize:model:attributes',
    INDEXES: 'sequelize:model:indexes',
    VALIDATIONS: 'sequelize:field:validations',
    TRANSFORMS: 'sequelize:field:transforms',
    HOOKS: 'sequelize:model:hooks',
    SCOPES: 'sequelize:model:scopes',
    ASSOCIATIONS: 'sequelize:model:associations',
    COMPUTED: 'sequelize:field:computed',
    ENCRYPTED: 'sequelize:field:encrypted',
    VIRTUAL: 'sequelize:field:virtual',
    FOREIGN_KEYS: 'sequelize:field:foreign_keys',
    COMPOSITE_KEYS: 'sequelize:model:composite_keys',
    GETTERS: 'sequelize:field:getters',
    SETTERS: 'sequelize:field:setters',
};
function Table(tableName, options) {
    return function (target) {
        const modelOptions = {
            ...options,
            tableName: tableName || target.name.toLowerCase() + 's',
            modelName: target.name,
        };
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
        return target;
    };
}
function RegisterModel(sequelize) {
    return function (target) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target.prototype) || {};
        const options = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        target.init(attributes, {
            ...options,
            sequelize,
        });
        return target;
    };
}
function Timestamps(createdAt = 'createdAt', updatedAt = 'updatedAt') {
    return function (target) {
        const options = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        options.timestamps = true;
        options.createdAt = createdAt;
        options.updatedAt = updatedAt;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, options, target);
        return target;
    };
}
function Paranoid(deletedAt = 'deletedAt') {
    return function (target) {
        const options = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        options.paranoid = true;
        options.deletedAt = deletedAt;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, options, target);
        return target;
    };
}
function Underscored() {
    return function (target) {
        const options = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        options.underscored = true;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, options, target);
        return target;
    };
}
function Field(options) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const fieldConfig = {
            type: options.type || sequelize_1.DataTypes.STRING,
            allowNull: options.allowNull ?? false,
            ...options,
        };
        if (fieldConfig.references && !fieldConfig.unique) {
            const indexes = Reflect.getMetadata(METADATA_KEYS.INDEXES, target.constructor) || [];
            const indexExists = indexes.some((idx) => idx.fields.length === 1 && idx.fields[0] === propertyKey);
            if (!indexExists) {
                indexes.push({
                    name: `${propertyKey.toString()}_fk_idx`,
                    fields: [propertyKey],
                    type: 'BTREE',
                });
                Reflect.defineMetadata(METADATA_KEYS.INDEXES, indexes, target.constructor);
            }
        }
        attributes[propertyKey] = fieldConfig;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function PrimaryKey(autoIncrement = false) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        attributes[propertyKey] = {
            ...(attributes[propertyKey] || {}),
            primaryKey: true,
            autoIncrement,
        };
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function Required() {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        attributes[propertyKey] = {
            ...(attributes[propertyKey] || {}),
            allowNull: false,
        };
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function Default(value) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        attributes[propertyKey] = {
            ...(attributes[propertyKey] || {}),
            defaultValue: value,
        };
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function IsEmail(message) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        attr.validate = attr.validate || {};
        attr.validate.isEmail = {
            msg: message || 'Invalid email address',
        };
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function IsUrl(message) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        attr.validate = attr.validate || {};
        attr.validate.isUrl = {
            msg: message || 'Invalid URL',
        };
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function Length(min, max, message) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        attr.validate = attr.validate || {};
        attr.validate.len = {
            args: [min, max],
            msg: message || `Length must be between ${min} and ${max}`,
        };
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function Range(min, max, message) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        attr.validate = attr.validate || {};
        attr.validate.min = min;
        attr.validate.max = max;
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function Validate(validatorFn, message) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        attr.validate = attr.validate || {};
        const validatorName = `custom_${propertyKey.toString()}`;
        attr.validate[validatorName] = async function (value) {
            const isValid = await validatorFn(value);
            if (!isValid) {
                throw new Error(message || `Validation failed for ${propertyKey.toString()}`);
            }
        };
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function IsIn(values, message) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        attr.validate = attr.validate || {};
        attr.validate.isIn = {
            args: [values],
            msg: message || `Value must be one of: ${values.join(', ')}`,
        };
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function IsAlphanumeric(message) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        attr.validate = attr.validate || {};
        attr.validate.isAlphanumeric = {
            msg: message || 'Only alphanumeric characters allowed',
        };
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function Lowercase() {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        const originalSet = attr.set;
        attr.set = function (value) {
            if (value === null || value === undefined) {
                if (originalSet) {
                    originalSet.call(this, value);
                }
                else {
                    this.setDataValue(propertyKey, value);
                }
                return;
            }
            const transformed = typeof value === 'string' ? value.toLowerCase() : value;
            if (originalSet) {
                originalSet.call(this, transformed);
            }
            else {
                this.setDataValue(propertyKey, transformed);
            }
        };
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function Uppercase() {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        const originalSet = attr.set;
        attr.set = function (value) {
            if (value === null || value === undefined) {
                if (originalSet) {
                    originalSet.call(this, value);
                }
                else {
                    this.setDataValue(propertyKey, value);
                }
                return;
            }
            const transformed = typeof value === 'string' ? value.toUpperCase() : value;
            if (originalSet) {
                originalSet.call(this, transformed);
            }
            else {
                this.setDataValue(propertyKey, transformed);
            }
        };
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function Trim() {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        const originalSet = attr.set;
        attr.set = function (value) {
            const transformed = typeof value === 'string' ? value.trim() : value;
            if (originalSet) {
                originalSet.call(this, transformed);
            }
            else {
                this.setDataValue(propertyKey, transformed);
            }
        };
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function Transform(transformFn) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        const originalSet = attr.set;
        attr.set = function (value) {
            const transformed = transformFn(value);
            if (originalSet) {
                originalSet.call(this, transformed);
            }
            else {
                this.setDataValue(propertyKey, transformed);
            }
        };
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function Computed(dependencies) {
    return function (target, propertyKey) {
        const computed = Reflect.getMetadata(METADATA_KEYS.COMPUTED, target) || {};
        computed[propertyKey] = { dependencies: dependencies || [] };
        Reflect.defineMetadata(METADATA_KEYS.COMPUTED, computed, target);
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        attributes[propertyKey] = {
            type: sequelize_1.DataTypes.VIRTUAL,
            get() {
                const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
                return descriptor?.get?.call(this);
            },
        };
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function Encrypted(options) {
    return function (target, propertyKey) {
        if (!options.key) {
            throw new Error(`Encryption key is required for field '${propertyKey.toString()}'`);
        }
        const algorithm = options.algorithm || 'aes-256-cbc';
        let key;
        try {
            key = Buffer.from(options.key, 'hex');
            if (algorithm.includes('256') && key.length !== 32) {
                throw new Error(`AES-256 requires a 32-byte (64 hex character) key, got ${key.length} bytes`);
            }
        }
        catch (error) {
            throw new Error(`Invalid encryption key format for field '${propertyKey.toString()}': ${error.message}`);
        }
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        attr.set = function (value) {
            if (value === null || value === undefined) {
                this.setDataValue(propertyKey, value);
                return;
            }
            try {
                const iv = crypto.randomBytes(16);
                const cipher = crypto.createCipheriv(algorithm, key, iv);
                let encrypted = cipher.update(String(value), 'utf8', 'hex');
                encrypted += cipher.final('hex');
                this.setDataValue(propertyKey, `${iv.toString('hex')}:${encrypted}`);
            }
            catch (error) {
                throw new Error(`Encryption failed for field '${propertyKey.toString()}': ${error.message}`);
            }
        };
        attr.get = function () {
            const value = this.getDataValue(propertyKey);
            if (value === null || value === undefined) {
                return value;
            }
            if (typeof value !== 'string' || !value.includes(':')) {
                return value;
            }
            try {
                const [ivHex, encrypted] = value.split(':');
                const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
                let decrypted = decipher.update(encrypted, 'hex', 'utf8');
                decrypted += decipher.final('utf8');
                return decrypted;
            }
            catch (error) {
                throw new Error(`Decryption failed for field '${propertyKey.toString()}': ${error.message}`);
            }
        };
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
        const encrypted = Reflect.getMetadata(METADATA_KEYS.ENCRYPTED, target) || {};
        encrypted[propertyKey] = options;
        Reflect.defineMetadata(METADATA_KEYS.ENCRYPTED, encrypted, target);
    };
}
function Index(options) {
    return function (target, propertyKey) {
        const indexes = Reflect.getMetadata(METADATA_KEYS.INDEXES, target.constructor) || [];
        const indexConfig = {
            name: options?.name || `${propertyKey.toString()}_idx`,
            fields: [propertyKey],
            unique: options?.unique || false,
        };
        if (options?.type)
            indexConfig.type = options.type;
        if (options?.using)
            indexConfig.using = options.using;
        if (options?.operator)
            indexConfig.operator = options.operator;
        if (options?.prefix)
            indexConfig.prefix = options.prefix;
        if (options?.parser)
            indexConfig.parser = options.parser;
        indexes.push(indexConfig);
        Reflect.defineMetadata(METADATA_KEYS.INDEXES, indexes, target.constructor);
        const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target.constructor) || {};
        modelOptions.indexes = indexes;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target.constructor);
    };
}
function UniqueIndex(indexName) {
    return function (target, propertyKey) {
        return Index({
            name: indexName || `${propertyKey.toString()}_unique_idx`,
            unique: true,
        })(target, propertyKey);
    };
}
function Unique(constraintName) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        attr.unique = constraintName || true;
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
    };
}
function CompositeUnique(constraintName, fields) {
    return function (target) {
        const indexes = Reflect.getMetadata(METADATA_KEYS.INDEXES, target) || [];
        indexes.push({
            name: constraintName,
            fields,
            unique: true,
        });
        Reflect.defineMetadata(METADATA_KEYS.INDEXES, indexes, target);
        const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        modelOptions.indexes = indexes;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
        return target;
    };
}
function ForeignKey(targetModel, targetKey = 'id', options) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        attr.references = {
            model: targetModel,
            key: targetKey,
        };
        attr.onDelete = options?.onDelete || 'CASCADE';
        attr.onUpdate = options?.onUpdate || 'CASCADE';
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
        const foreignKeys = Reflect.getMetadata(METADATA_KEYS.FOREIGN_KEYS, target) || {};
        foreignKeys[propertyKey] = { targetModel, targetKey, options };
        Reflect.defineMetadata(METADATA_KEYS.FOREIGN_KEYS, foreignKeys, target);
        const indexes = Reflect.getMetadata(METADATA_KEYS.INDEXES, target.constructor) || [];
        const indexExists = indexes.some((idx) => idx.fields.length === 1 && idx.fields[0] === propertyKey);
        if (!indexExists) {
            indexes.push({
                name: `${propertyKey.toString()}_fk_idx`,
                fields: [propertyKey],
                type: 'BTREE',
            });
            Reflect.defineMetadata(METADATA_KEYS.INDEXES, indexes, target.constructor);
        }
    };
}
function CompositeKey(fields) {
    return function (target) {
        const compositeKeys = Reflect.getMetadata(METADATA_KEYS.COMPOSITE_KEYS, target) || [];
        compositeKeys.push(fields);
        Reflect.defineMetadata(METADATA_KEYS.COMPOSITE_KEYS, compositeKeys, target);
        fields.forEach((field) => {
            const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target.prototype) || {};
            const attr = attributes[field] || {};
            attr.primaryKey = true;
            attributes[field] = attr;
            Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target.prototype);
        });
        return target;
    };
}
function Virtual() {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        attributes[propertyKey] = {
            type: sequelize_1.DataTypes.VIRTUAL,
            get: descriptor?.get,
            set: descriptor?.set,
        };
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
        const virtuals = Reflect.getMetadata(METADATA_KEYS.VIRTUAL, target) || {};
        virtuals[propertyKey] = true;
        Reflect.defineMetadata(METADATA_KEYS.VIRTUAL, virtuals, target);
    };
}
function Getter(getterFn) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        attr.get = getterFn;
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
        const getters = Reflect.getMetadata(METADATA_KEYS.GETTERS, target) || {};
        getters[propertyKey] = getterFn;
        Reflect.defineMetadata(METADATA_KEYS.GETTERS, getters, target);
    };
}
function Setter(setterFn) {
    return function (target, propertyKey) {
        const attributes = Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target) || {};
        const attr = attributes[propertyKey] || {};
        attr.set = setterFn;
        attributes[propertyKey] = attr;
        Reflect.defineMetadata(METADATA_KEYS.ATTRIBUTES, attributes, target);
        const setters = Reflect.getMetadata(METADATA_KEYS.SETTERS, target) || {};
        setters[propertyKey] = setterFn;
        Reflect.defineMetadata(METADATA_KEYS.SETTERS, setters, target);
    };
}
function BeforeCreate() {
    return function (target, propertyKey, descriptor) {
        const hooks = Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {};
        hooks.beforeCreate = hooks.beforeCreate || [];
        hooks.beforeCreate.push(descriptor.value);
        Reflect.defineMetadata(METADATA_KEYS.HOOKS, hooks, target);
        const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        modelOptions.hooks = modelOptions.hooks || {};
        modelOptions.hooks.beforeCreate = descriptor.value;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
    };
}
function AfterCreate() {
    return function (target, propertyKey, descriptor) {
        const hooks = Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {};
        hooks.afterCreate = hooks.afterCreate || [];
        hooks.afterCreate.push(descriptor.value);
        Reflect.defineMetadata(METADATA_KEYS.HOOKS, hooks, target);
        const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        modelOptions.hooks = modelOptions.hooks || {};
        modelOptions.hooks.afterCreate = descriptor.value;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
    };
}
function BeforeUpdate() {
    return function (target, propertyKey, descriptor) {
        const hooks = Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {};
        hooks.beforeUpdate = hooks.beforeUpdate || [];
        hooks.beforeUpdate.push(descriptor.value);
        Reflect.defineMetadata(METADATA_KEYS.HOOKS, hooks, target);
        const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        modelOptions.hooks = modelOptions.hooks || {};
        modelOptions.hooks.beforeUpdate = descriptor.value;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
    };
}
function AfterUpdate() {
    return function (target, propertyKey, descriptor) {
        const hooks = Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {};
        hooks.afterUpdate = hooks.afterUpdate || [];
        hooks.afterUpdate.push(descriptor.value);
        Reflect.defineMetadata(METADATA_KEYS.HOOKS, hooks, target);
        const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        modelOptions.hooks = modelOptions.hooks || {};
        modelOptions.hooks.afterUpdate = descriptor.value;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
    };
}
function BeforeDestroy() {
    return function (target, propertyKey, descriptor) {
        const hooks = Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {};
        hooks.beforeDestroy = hooks.beforeDestroy || [];
        hooks.beforeDestroy.push(descriptor.value);
        Reflect.defineMetadata(METADATA_KEYS.HOOKS, hooks, target);
        const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        modelOptions.hooks = modelOptions.hooks || {};
        modelOptions.hooks.beforeDestroy = descriptor.value;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
    };
}
function AfterDestroy() {
    return function (target, propertyKey, descriptor) {
        const hooks = Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {};
        hooks.afterDestroy = hooks.afterDestroy || [];
        hooks.afterDestroy.push(descriptor.value);
        Reflect.defineMetadata(METADATA_KEYS.HOOKS, hooks, target);
        const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        modelOptions.hooks = modelOptions.hooks || {};
        modelOptions.hooks.afterDestroy = descriptor.value;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
    };
}
function DefaultScope(scope) {
    return function (target) {
        const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        modelOptions.defaultScope = scope;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
        return target;
    };
}
function Scope(name, scope) {
    return function (target) {
        const scopes = Reflect.getMetadata(METADATA_KEYS.SCOPES, target) || {};
        scopes[name] = scope;
        Reflect.defineMetadata(METADATA_KEYS.SCOPES, scopes, target);
        const modelOptions = Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {};
        modelOptions.scopes = modelOptions.scopes || {};
        modelOptions.scopes[name] = scope;
        Reflect.defineMetadata(METADATA_KEYS.MODEL_OPTIONS, modelOptions, target);
        return target;
    };
}
function getModelMetadata(target) {
    return {
        options: Reflect.getMetadata(METADATA_KEYS.MODEL_OPTIONS, target) || {},
        attributes: Reflect.getMetadata(METADATA_KEYS.ATTRIBUTES, target.prototype) || {},
        indexes: Reflect.getMetadata(METADATA_KEYS.INDEXES, target) || [],
        hooks: Reflect.getMetadata(METADATA_KEYS.HOOKS, target) || {},
        scopes: Reflect.getMetadata(METADATA_KEYS.SCOPES, target) || {},
        computed: Reflect.getMetadata(METADATA_KEYS.COMPUTED, target.prototype) || {},
        encrypted: Reflect.getMetadata(METADATA_KEYS.ENCRYPTED, target.prototype) || {},
        foreignKeys: Reflect.getMetadata(METADATA_KEYS.FOREIGN_KEYS, target.prototype) || {},
    };
}
function initializeModel(ModelClass, sequelize) {
    const metadata = getModelMetadata(ModelClass);
    ModelClass.init(metadata.attributes, {
        ...metadata.options,
        sequelize,
    });
    return ModelClass;
}
//# sourceMappingURL=model-decorators.service.js.map