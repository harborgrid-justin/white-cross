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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthcareCacheUtils = exports.HealthcareCacheFactory = exports.HealthcareCacheService = exports.HealthcareInvalidationStrategy = exports.HealthcareCacheStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const events_1 = require("events");
const crypto = __importStar(require("crypto"));
const zlib = __importStar(require("zlib"));
const logger_service_1 = require("../logging/logger.service");
const common_2 = require("@nestjs/common");
var HealthcareCacheStrategy;
(function (HealthcareCacheStrategy) {
    HealthcareCacheStrategy["PHI_WRITE_THROUGH"] = "phi_write_through";
    HealthcareCacheStrategy["PHI_WRITE_AROUND"] = "phi_write_around";
    HealthcareCacheStrategy["STANDARD_CACHE_ASIDE"] = "standard_cache_aside";
    HealthcareCacheStrategy["CLINICAL_READ_THROUGH"] = "clinical_read_through";
    HealthcareCacheStrategy["EMERGENCY_BYPASS"] = "emergency_bypass";
})(HealthcareCacheStrategy || (exports.HealthcareCacheStrategy = HealthcareCacheStrategy = {}));
var HealthcareInvalidationStrategy;
(function (HealthcareInvalidationStrategy) {
    HealthcareInvalidationStrategy["PHI_TTL"] = "phi_ttl";
    HealthcareInvalidationStrategy["PATIENT_BASED"] = "patient_based";
    HealthcareInvalidationStrategy["PROVIDER_BASED"] = "provider_based";
    HealthcareInvalidationStrategy["CLINICAL_WORKFLOW"] = "clinical_workflow";
    HealthcareInvalidationStrategy["COMPLIANCE_PURGE"] = "compliance_purge";
})(HealthcareInvalidationStrategy || (exports.HealthcareInvalidationStrategy = HealthcareInvalidationStrategy = {}));
let HealthcareMemoryCache = class HealthcareMemoryCache extends events_1.EventEmitter {
    config;
    cache = new Map();
    timers = new Map();
    stats;
    encryptionKey;
    constructor(logger, config) {
        super();
        this.config = config;
        this.stats = this.initializeStats();
        this.encryptionKey = crypto.randomBytes(32);
        this.startHealthcareCleanupProcess();
    }
    initializeStats() {
        return {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
            evictions: 0,
            memoryUsage: 0,
            hitRatio: 0,
            avgResponseTime: 0,
            phiOperations: 0,
            auditEvents: 0,
            encryptedEntries: 0,
        };
    }
    async get(key, auditContext) {
        const startTime = Date.now();
        try {
            const entry = this.cache.get(key);
            if (!entry) {
                this.stats.misses++;
                return null;
            }
            if (this.isExpired(entry)) {
                await this.delete(key);
                this.stats.misses++;
                return null;
            }
            entry.lastAccessed = new Date();
            entry.hitCount++;
            this.stats.hits++;
            if (this.isPHIData(entry.dataLevel)) {
                this.stats.phiOperations++;
            }
            if (entry.hipaaAuditRequired && this.config.auditCacheAccess) {
                this.logHealthcareAudit('CACHE_GET', key, entry.dataLevel, auditContext);
                this.stats.auditEvents++;
            }
            let value = entry.value;
            if (entry.encrypted && this.config.enableEncryption) {
                value = this.decryptValue(value);
            }
            if (entry.compressed && typeof value === 'string') {
                value = this.decompress(value);
            }
            return value;
        }
        finally {
            this.updateResponseTime(Date.now() - startTime);
        }
    }
    async set(key, value, options = {}) {
        try {
            const dataLevel = options.dataLevel || 'INTERNAL';
            const ttl = this.getTTLForDataLevel(options.ttl, dataLevel);
            if (this.shouldEvictForDataLevel(dataLevel)) {
                await this.evictItems();
            }
            let processedValue = value;
            let compressed = false;
            let encrypted = false;
            if (this.config.enableCompression && this.shouldCompress(value)) {
                processedValue = this.compress(value);
                compressed = true;
            }
            if (this.config.enableEncryption && this.isPHIData(dataLevel)) {
                processedValue = this.encryptValue(processedValue);
                encrypted = true;
                this.stats.encryptedEntries++;
            }
            const entry = {
                key,
                value: processedValue,
                ttl,
                createdAt: new Date(),
                lastAccessed: new Date(),
                hitCount: 0,
                compressed,
                encrypted,
                tags: options.tags || [],
                dataLevel,
                patientId: options.patientId,
                providerId: options.providerId,
                clinicalContext: options.clinicalContext,
                hipaaAuditRequired: this.isPHIData(dataLevel),
            };
            this.cache.set(key, entry);
            this.stats.sets++;
            if (this.isPHIData(dataLevel)) {
                this.stats.phiOperations++;
            }
            if (entry.ttl > 0) {
                this.setExpirationTimer(key, entry.ttl);
            }
            if (entry.hipaaAuditRequired && this.config.auditCacheAccess) {
                this.logHealthcareAudit('CACHE_SET', key, dataLevel, {
                    patientId: options.patientId,
                    providerId: options.providerId,
                });
                this.stats.auditEvents++;
            }
            this.emit('healthcareSet', { key, dataLevel, encrypted, ttl });
        }
        catch (error) {
            this.logError(`Failed to set healthcare cache entry for key ${key}:`, error);
            throw error;
        }
    }
    async delete(key, auditContext) {
        try {
            const entry = this.cache.get(key);
            const existed = this.cache.has(key);
            if (existed) {
                this.cache.delete(key);
                this.clearExpirationTimer(key);
                this.stats.deletes++;
                if (entry && entry.hipaaAuditRequired && this.config.auditCacheAccess) {
                    this.logHealthcareAudit('CACHE_DELETE', key, entry.dataLevel, {
                        reason: auditContext?.reason || 'manual',
                        providerId: auditContext?.providerId,
                    });
                    this.stats.auditEvents++;
                }
                this.emit('healthcareDelete', { key, dataLevel: entry?.dataLevel });
            }
            return existed;
        }
        catch (error) {
            this.logError(`Failed to delete healthcare cache entry for key ${key}:`, error);
            throw error;
        }
    }
    async invalidateByPatient(patientId, reason = 'patient_update') {
        let invalidatedCount = 0;
        try {
            for (const [key, entry] of this.cache.entries()) {
                if (entry.patientId === patientId) {
                    await this.delete(key, { reason, providerId: 'system' });
                    invalidatedCount++;
                }
            }
            this.emit('patientDataInvalidated', { patientId, count: invalidatedCount, reason });
            return invalidatedCount;
        }
        catch (error) {
            this.logError(`Failed to invalidate patient data for ${patientId}:`, error);
            throw error;
        }
    }
    async invalidateByProvider(providerId, reason = 'provider_update') {
        let invalidatedCount = 0;
        try {
            for (const [key, entry] of this.cache.entries()) {
                if (entry.providerId === providerId) {
                    await this.delete(key, { reason, providerId });
                    invalidatedCount++;
                }
            }
            this.emit('providerDataInvalidated', { providerId, count: invalidatedCount, reason });
            return invalidatedCount;
        }
        catch (error) {
            this.logError(`Failed to invalidate provider data for ${providerId}:`, error);
            throw error;
        }
    }
    async invalidateByTags(tags, reason = 'tag_invalidation') {
        let invalidatedCount = 0;
        try {
            for (const [key, entry] of this.cache.entries()) {
                if (entry.tags.some((tag) => tags.includes(tag))) {
                    await this.delete(key, { reason });
                    invalidatedCount++;
                }
            }
            this.emit('tagsInvalidated', { tags, count: invalidatedCount, reason });
            return invalidatedCount;
        }
        catch (error) {
            this.logError('Failed to invalidate by tags:', error);
            throw error;
        }
    }
    async clear(reason = 'manual_clear') {
        try {
            const keys = Array.from(this.cache.keys());
            const phiKeys = keys.filter((key) => {
                const entry = this.cache.get(key);
                return entry && this.isPHIData(entry.dataLevel);
            });
            if (phiKeys.length > 0 && this.config.auditCacheAccess) {
                this.logHealthcareAudit('CACHE_CLEAR_PHI', 'multiple', 'PHI', {
                    reason,
                    phiKeysCount: phiKeys.length,
                });
                this.stats.auditEvents++;
            }
            for (const key of keys) {
                this.clearExpirationTimer(key);
            }
            this.cache.clear();
            this.stats = this.initializeStats();
            this.emit('healthcareClear', { reason, phiKeysCleared: phiKeys.length });
        }
        catch (error) {
            this.logError('Failed to clear healthcare cache:', error);
            throw error;
        }
    }
    getHealthcareStats() {
        this.updateStats();
        return { ...this.stats };
    }
    isPHIData(dataLevel) {
        return ['PHI', 'SENSITIVE_PHI', 'RESTRICTED'].includes(dataLevel);
    }
    getTTLForDataLevel(requestedTTL, dataLevel) {
        if (requestedTTL !== undefined)
            return requestedTTL;
        if (this.isPHIData(dataLevel)) {
            return this.config.phiTTL || 1800;
        }
        return this.config.defaultTTL;
    }
    shouldEvictForDataLevel(dataLevel) {
        if (this.isPHIData(dataLevel)) {
            const phiItems = Array.from(this.cache.values()).filter((entry) => this.isPHIData(entry.dataLevel)).length;
            return phiItems >= (this.config.memoryConfig?.phiMaxItems || 500);
        }
        return this.cache.size >= this.config.maxSize;
    }
    encryptValue(value) {
        const serialized = JSON.stringify(value);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
        let encrypted = cipher.update(serialized, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    }
    decryptValue(encryptedValue) {
        const [ivHex, authTagHex, encrypted] = encryptedValue.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }
    compress(value) {
        const serialized = JSON.stringify(value);
        return zlib.deflateSync(serialized).toString('base64');
    }
    decompress(compressed) {
        const buffer = Buffer.from(compressed, 'base64');
        const decompressed = zlib.inflateSync(buffer).toString();
        return JSON.parse(decompressed);
    }
    shouldCompress(value) {
        const serialized = JSON.stringify(value);
        return serialized.length > 1024;
    }
    logHealthcareAudit(operation, key, dataLevel, context) {
        this.logInfo(`Healthcare Cache Audit: ${operation} | Key: ${key} | DataLevel: ${dataLevel} | Context: ${JSON.stringify(context)} | Time: ${new Date().toISOString()}`);
    }
    isExpired(entry) {
        if (entry.ttl <= 0)
            return false;
        const now = Date.now();
        const createdAt = entry.createdAt.getTime();
        return now - createdAt > entry.ttl * 1000;
    }
    setExpirationTimer(key, ttl) {
        this.clearExpirationTimer(key);
        const timer = setTimeout(async () => {
            await this.delete(key, { reason: 'ttl_expiration' });
        }, ttl * 1000);
        this.timers.set(key, timer);
    }
    clearExpirationTimer(key) {
        const timer = this.timers.get(key);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(key);
        }
    }
    async evictItems() {
        const entries = Array.from(this.cache.entries());
        entries.sort((a, b) => {
            const aPHI = this.isPHIData(a[1].dataLevel);
            const bPHI = this.isPHIData(b[1].dataLevel);
            if (aPHI !== bPHI) {
                return aPHI ? 1 : -1;
            }
            return a[1].lastAccessed.getTime() - b[1].lastAccessed.getTime();
        });
        const evictCount = Math.ceil(entries.length * 0.25);
        for (let i = 0; i < evictCount; i++) {
            await this.delete(entries[i][0], { reason: 'cache_eviction' });
            this.stats.evictions++;
        }
    }
    updateStats() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRatio = total > 0 ? this.stats.hits / total : 0;
        this.stats.memoryUsage = this.cache.size;
    }
    updateResponseTime(responseTime) {
        const total = this.stats.hits + this.stats.misses;
        this.stats.avgResponseTime = total > 0 ? (this.stats.avgResponseTime * (total - 1) + responseTime) / total : responseTime;
    }
    startHealthcareCleanupProcess() {
        const checkPeriod = this.config.memoryConfig?.checkPeriod || 60000;
        setInterval(() => {
            this.cleanupExpiredEntries();
            this.performHealthcareCompliance();
        }, checkPeriod);
    }
    cleanupExpiredEntries() {
        const expiredKeys = [];
        for (const [key, entry] of this.cache.entries()) {
            if (this.isExpired(entry)) {
                expiredKeys.push(key);
            }
        }
        expiredKeys.forEach((key) => this.delete(key, { reason: 'expiration_cleanup' }));
    }
    performHealthcareCompliance() {
        const phiEntries = Array.from(this.cache.entries()).filter(([, entry]) => this.isPHIData(entry.dataLevel));
        if (phiEntries.length > 0) {
            this.logInfo(`Healthcare Compliance Check: ${phiEntries.length} PHI entries in cache, ${this.stats.encryptedEntries} encrypted entries`);
        }
    }
};
HealthcareMemoryCache = __decorate([
    __param(0, (0, common_2.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, Object])
], HealthcareMemoryCache);
let HealthcareCacheService = class HealthcareCacheService extends events_1.EventEmitter {
    configService;
    config;
    memoryCache;
    constructor(configService, config) {
        super();
        this.configService = configService;
        this.config = config;
        this.memoryCache = new HealthcareMemoryCache(config);
        this.setupHealthcareEventHandlers();
    }
    async get(key, auditContext) {
        try {
            const value = await this.memoryCache.get(key, auditContext);
            if (value !== null) {
                this.emit('healthcareHit', { key, auditContext });
            }
            else {
                this.emit('healthcareMiss', { key });
            }
            return value;
        }
        catch (error) {
            this.logError(`Healthcare cache get failed for key ${key}:`, error);
            throw error;
        }
    }
    async set(key, value, options = {}) {
        try {
            await this.memoryCache.set(key, value, options);
            this.emit('healthcareSet', { key, dataLevel: options.dataLevel, ...options });
        }
        catch (error) {
            this.logError(`Healthcare cache set failed for key ${key}:`, error);
            throw error;
        }
    }
    async cacheHealthcareQuery(query, params, executor, options = {}) {
        const key = this.generateHealthcareQueryKey(query, params, options.patientId);
        try {
            let result = await this.get(key, {
                patientId: options.patientId,
                providerId: options.providerId,
            });
            if (result === null) {
                result = await executor();
                await this.set(key, result, {
                    ...options,
                    tags: ['healthcare_query', ...(options.tags || [])],
                });
                this.emit('healthcareQueryExecuted', { key, query, clinicalContext: options.clinicalContext });
            }
            else {
                this.emit('healthcareQueryCacheHit', { key, query });
            }
            return result;
        }
        catch (error) {
            this.logError(`Healthcare query caching failed for key ${key}:`, error);
            throw error;
        }
    }
    async cachePatientData(patientId, dataType, data, options = {}) {
        const key = `patient:${patientId}:${dataType}`;
        await this.set(key, data, {
            ttl: options.ttl,
            dataLevel: options.dataLevel || 'PHI',
            patientId,
            providerId: options.providerId,
            clinicalContext: options.clinicalContext,
            tags: ['patient_data', dataType],
        });
    }
    async getPatientData(patientId, dataType, providerId) {
        const key = `patient:${patientId}:${dataType}`;
        return this.get(key, { patientId, providerId });
    }
    async invalidatePatientData(patientId, reason = 'patient_update') {
        return this.memoryCache.invalidateByPatient(patientId, reason);
    }
    async invalidateProviderData(providerId, reason = 'provider_update') {
        return this.memoryCache.invalidateByProvider(providerId, reason);
    }
    async warmHealthcareCache(warmingData) {
        try {
            const promises = warmingData.map(({ key, value, ttl, dataLevel, tags, patientId, providerId }) => this.set(key, value, { ttl, dataLevel, tags, patientId, providerId }));
            await Promise.all(promises);
            this.emit('healthcareCacheWarmed', { count: warmingData.length });
        }
        catch (error) {
            this.logError('Healthcare cache warming failed:', error);
            throw error;
        }
    }
    async delete(key, auditContext) {
        return this.memoryCache.delete(key, auditContext);
    }
    async invalidateByTags(tags, reason = 'tag_invalidation') {
        return this.memoryCache.invalidateByTags(tags, reason);
    }
    async clear(reason = 'manual_clear') {
        return this.memoryCache.clear(reason);
    }
    getHealthcareStats() {
        return this.memoryCache.getHealthcareStats();
    }
    async healthCheck() {
        try {
            const testKey = `health_check_${Date.now()}`;
            const testValue = { test: 'health_check_value', timestamp: new Date() };
            await this.set(testKey, testValue, { ttl: 10, dataLevel: 'INTERNAL' });
            const retrievedValue = await this.get(testKey);
            const basicCaching = JSON.stringify(retrievedValue) === JSON.stringify(testValue);
            const phiTestKey = `phi_health_check_${Date.now()}`;
            const phiTestValue = { patientData: 'sensitive', ssn: '123-45-6789' };
            await this.set(phiTestKey, phiTestValue, { ttl: 10, dataLevel: 'PHI', patientId: 'test-patient' });
            const phiRetrievedValue = await this.get(phiTestKey, { patientId: 'test-patient' });
            const phiCaching = JSON.stringify(phiRetrievedValue) === JSON.stringify(phiTestValue);
            await this.delete(testKey);
            await this.delete(phiTestKey);
            return {
                memory: basicCaching,
                encryption: this.config.enableEncryption,
                compliance: this.config.auditCacheAccess,
                phiProtection: phiCaching,
            };
        }
        catch (error) {
            this.logError('Healthcare cache health check failed:', error);
            return {
                memory: false,
                encryption: false,
                compliance: false,
                phiProtection: false,
            };
        }
    }
    generateHealthcareQueryKey(query, params, patientId) {
        const hash = crypto.createHash('sha256');
        hash.update(query);
        hash.update(JSON.stringify(params));
        if (patientId) {
            hash.update(patientId);
        }
        return `healthcare_query:${hash.digest('hex')}`;
    }
    setupHealthcareEventHandlers() {
        this.memoryCache.on('healthcareSet', (data) => this.emit('memorySet', data));
        this.memoryCache.on('healthcareDelete', (data) => this.emit('memoryDelete', data));
        this.memoryCache.on('healthcareClear', (data) => this.emit('memoryClear', data));
        this.memoryCache.on('patientDataInvalidated', (data) => this.emit('patientDataInvalidated', data));
        this.memoryCache.on('providerDataInvalidated', (data) => this.emit('providerDataInvalidated', data));
    }
};
exports.HealthcareCacheService = HealthcareCacheService;
exports.HealthcareCacheService = HealthcareCacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], HealthcareCacheService);
class HealthcareCacheFactory {
    static createHealthcareCache(configService, config = {}) {
        const defaultConfig = {
            defaultTTL: 3600,
            phiTTL: 1800,
            maxSize: 10000,
            enableCompression: true,
            enableMetrics: true,
            enableEncryption: true,
            auditCacheAccess: true,
            redisConfig: {
                host: configService.get('REDIS_HOST', 'localhost'),
                port: configService.get('REDIS_PORT', 6379),
                password: configService.get('REDIS_PASSWORD'),
                db: configService.get('REDIS_DB', 0),
                enableSSL: configService.get('REDIS_SSL', true),
            },
            memoryConfig: {
                maxItems: 1000,
                checkPeriod: 60000,
                phiMaxItems: 500,
            },
        };
        const finalConfig = { ...defaultConfig, ...config };
        return new HealthcareCacheService(configService, finalConfig);
    }
}
exports.HealthcareCacheFactory = HealthcareCacheFactory;
exports.HealthcareCacheUtils = {
    generatePatientKey: (patientId, dataType) => {
        return `patient:${patientId}:${dataType}`;
    },
    generateProviderKey: (providerId, dataType) => {
        return `provider:${providerId}:${dataType}`;
    },
    generateClinicalKey: (workflowType, contextId) => {
        return `clinical:${workflowType}:${contextId}`;
    },
    parseHealthcareKey: (key) => {
        const parts = key.split(':');
        return {
            type: parts[0] || '',
            id: parts[1] || '',
            dataType: parts[2] || '',
        };
    },
    isPatientKey: (key) => {
        return key.startsWith('patient:');
    },
    isProviderKey: (key) => {
        return key.startsWith('provider:');
    },
    isClinicalKey: (key) => {
        return key.startsWith('clinical:');
    },
};
//# sourceMappingURL=healthcare-cache.service.js.map