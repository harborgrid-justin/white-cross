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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheSerializationService = void 0;
const common_1 = require("@nestjs/common");
const zlib = __importStar(require("zlib"));
const util_1 = require("util");
const cache_config_1 = require("./cache.config");
const base_1 = require("../../common/base");
const gzip = (0, util_1.promisify)(zlib.gzip);
const gunzip = (0, util_1.promisify)(zlib.gunzip);
let CacheSerializationService = class CacheSerializationService extends base_1.BaseService {
    cacheConfig;
    constructor(cacheConfig) {
        super("CacheSerializationService");
        this.cacheConfig = cacheConfig;
    }
    async serialize(value, options) {
        try {
            const json = JSON.stringify(value);
            const shouldCompress = (options.compress || this.cacheConfig.isCompressionEnabled()) &&
                json.length > this.cacheConfig.getConfig().compressionThreshold;
            if (shouldCompress) {
                const compressed = await gzip(Buffer.from(json));
                return `compressed:${compressed.toString('base64')}`;
            }
            return json;
        }
        catch (error) {
            this.logError('Serialization error:', error);
            throw new Error(`Failed to serialize value: ${error.message}`);
        }
    }
    async deserialize(value) {
        try {
            if (value.startsWith('compressed:')) {
                const compressed = Buffer.from(value.slice(11), 'base64');
                const decompressed = await gunzip(compressed);
                return JSON.parse(decompressed.toString());
            }
            return JSON.parse(value);
        }
        catch (error) {
            this.logError('Deserialization error:', error);
            throw new Error(`Failed to deserialize value: ${error.message}`);
        }
    }
    estimateSize(value) {
        try {
            const json = JSON.stringify(value);
            return json.length * 2;
        }
        catch (error) {
            this.logWarning('Size estimation error, returning default:', error);
            return 1024;
        }
    }
    shouldCompress(value, options) {
        if (!options.compress && !this.cacheConfig.isCompressionEnabled()) {
            return false;
        }
        const size = this.estimateSize(value);
        return size > this.cacheConfig.getConfig().compressionThreshold;
    }
};
exports.CacheSerializationService = CacheSerializationService;
exports.CacheSerializationService = CacheSerializationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_config_1.CacheConfigService])
], CacheSerializationService);
//# sourceMappingURL=cache-serialization.service.js.map