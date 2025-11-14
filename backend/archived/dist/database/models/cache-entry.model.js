"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheEntry = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let CacheEntry = class CacheEntry extends sequelize_typescript_1.Model {
    cacheKey;
    data;
    complianceLevel;
    tags;
    expiresAt;
    accessCount;
    lastAccessed;
    dataSize;
    queryHash;
    isExpired() {
        return new Date() > this.expiresAt;
    }
    getParsedTags() {
        try {
            return JSON.parse(this.tags);
        }
        catch {
            return [];
        }
    }
    getParsedData() {
        try {
            return JSON.parse(this.data);
        }
        catch {
            return null;
        }
    }
    async recordAccess() {
        this.accessCount += 1;
        this.lastAccessed = new Date();
        await this.save({ fields: ['accessCount', 'lastAccessed'] });
    }
    matchesTags(targetTags) {
        const entryTags = this.getParsedTags();
        return targetTags.some((tag) => entryTags.includes(tag));
    }
    isPHI() {
        return (this.complianceLevel === 'PHI' || this.complianceLevel === 'SENSITIVE_PHI');
    }
    static async auditPHIAccess(instance) {
        await createModelAuditHook('CacheEntry', instance);
    }
};
exports.CacheEntry = CacheEntry;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], CacheEntry.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: false,
        unique: true,
        comment: 'Unique cache key identifier',
    }),
    __metadata("design:type", String)
], CacheEntry.prototype, "cacheKey", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
        comment: 'JSON serialized cached data - encrypted at rest for PHI',
    }),
    __metadata("design:type", String)
], CacheEntry.prototype, "data", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PHI', 'SENSITIVE_PHI'),
        allowNull: false,
        defaultValue: 'INTERNAL',
        comment: 'HIPAA compliance level for audit and security',
    }),
    __metadata("design:type", String)
], CacheEntry.prototype, "complianceLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        defaultValue: '[]',
        comment: 'Cache invalidation tags for bulk operations',
    }),
    __metadata("design:type", String)
], CacheEntry.prototype, "tags", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        comment: 'Cache entry expiration timestamp for TTL enforcement',
    }),
    __metadata("design:type", Date)
], CacheEntry.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of times this cache entry has been accessed',
    }),
    __metadata("design:type", Number)
], CacheEntry.prototype, "accessCount", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Last access timestamp for LRU eviction',
    }),
    __metadata("design:type", Date)
], CacheEntry.prototype, "lastAccessed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Size of cached data in bytes for memory management',
    }),
    __metadata("design:type", Number)
], CacheEntry.prototype, "dataSize", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(64),
        allowNull: true,
        comment: 'Hash of original query for deduplication and optimization',
    }),
    __metadata("design:type", String)
], CacheEntry.prototype, "queryHash", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        comment: 'Cache entry creation timestamp',
    }),
    __metadata("design:type", Date)
], CacheEntry.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        comment: 'Cache entry last update timestamp',
    }),
    __metadata("design:type", Date)
], CacheEntry.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CacheEntry]),
    __metadata("design:returntype", Promise)
], CacheEntry, "auditPHIAccess", null);
exports.CacheEntry = CacheEntry = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'cache_entries',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                name: 'idx_cache_key',
                fields: ['cacheKey'],
                unique: true,
            },
            {
                name: 'idx_expires_at',
                fields: ['expiresAt'],
            },
            {
                name: 'idx_compliance_level',
                fields: ['complianceLevel'],
            },
            {
                name: 'idx_query_hash',
                fields: ['queryHash'],
            },
            {
                name: 'idx_last_accessed',
                fields: ['lastAccessed'],
            },
            {
                name: 'idx_tags',
                fields: ['tags'],
                using: 'gin',
            },
            {
                fields: ['createdAt'],
                name: 'idx_cache_entry_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_cache_entry_updated_at',
            },
        ],
    })
], CacheEntry);
//# sourceMappingURL=cache-entry.model.js.map