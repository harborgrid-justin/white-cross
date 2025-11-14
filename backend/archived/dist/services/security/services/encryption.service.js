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
exports.EnhancedEncryptionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const base_1 = require("../../../common/base");
let EnhancedEncryptionService = class EnhancedEncryptionService extends base_1.BaseService {
    configService;
    defaultAlgorithm = 'aes-256-gcm';
    keyCache = new Map();
    constructor(configService) {
        super('EnhancedEncryptionService');
        this.configService = configService;
    }
    async encrypt(data, key, options = {}) {
        try {
            const algorithm = options.algorithm || this.defaultAlgorithm;
            const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
            const iv = crypto.randomBytes(16);
            let derivedKey;
            let salt;
            if (Buffer.isBuffer(key)) {
                derivedKey = key;
            }
            else {
                salt = crypto.randomBytes(32);
                derivedKey = await this.deriveKey(key, salt, options);
            }
            const cipher = crypto.createCipheriv(algorithm, derivedKey, iv);
            cipher.setAAD(iv);
            const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
            const tag = cipher.getAuthTag();
            return {
                encrypted,
                iv,
                tag,
                salt,
            };
        }
        catch (error) {
            this.logError('Encryption failed:', error);
            throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async decrypt(encryptedData, key, options = {}) {
        try {
            const algorithm = options.algorithm || this.defaultAlgorithm;
            let derivedKey;
            if (Buffer.isBuffer(key)) {
                derivedKey = key;
            }
            else {
                if (!encryptedData.salt) {
                    throw new Error('Salt is required for key derivation');
                }
                derivedKey = await this.deriveKey(key, encryptedData.salt, options);
            }
            const decipher = crypto.createDecipheriv(algorithm, derivedKey, encryptedData.iv);
            decipher.setAAD(encryptedData.iv);
            decipher.setAuthTag(encryptedData.tag);
            const decrypted = Buffer.concat([
                decipher.update(encryptedData.encrypted),
                decipher.final(),
            ]);
            return decrypted;
        }
        catch (error) {
            this.logError('Decryption failed:', error);
            throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    generateKey(length = 32) {
        return crypto.randomBytes(length);
    }
    async deriveKey(password, salt, options = {}) {
        const cacheKey = `${password}:${salt.toString('hex')}`;
        if (this.keyCache.has(cacheKey)) {
            return this.keyCache.get(cacheKey);
        }
        const iterations = options.iterations || 100000;
        const keyLength = 32;
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, iterations, keyLength, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject(err);
                }
                else {
                    this.keyCache.set(cacheKey, derivedKey);
                    resolve(derivedKey);
                }
            });
        });
    }
    hash(data, algorithm = 'sha256') {
        const hash = crypto.createHash(algorithm);
        hash.update(data);
        return hash.digest('hex');
    }
    verifyHash(data, hash, algorithm = 'sha256') {
        const computedHash = this.hash(data, algorithm);
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash));
    }
};
exports.EnhancedEncryptionService = EnhancedEncryptionService;
exports.EnhancedEncryptionService = EnhancedEncryptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EnhancedEncryptionService);
//# sourceMappingURL=encryption.service.js.map