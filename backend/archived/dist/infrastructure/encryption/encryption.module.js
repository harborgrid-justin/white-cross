"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_module_1 = require("../cache/cache.module");
const encryption_service_1 = require("./encryption.service");
const key_management_service_1 = require("./key-management.service");
const crypto_service_1 = require("./services/crypto.service");
const session_key_manager_service_1 = require("./services/session-key-manager.service");
const message_encryption_service_1 = require("./services/message-encryption.service");
let EncryptionModule = class EncryptionModule {
};
exports.EncryptionModule = EncryptionModule;
exports.EncryptionModule = EncryptionModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            cache_module_1.CacheModule,
        ],
        providers: [
            encryption_service_1.EncryptionService,
            key_management_service_1.KeyManagementService,
            crypto_service_1.CryptoService,
            session_key_manager_service_1.SessionKeyManagerService,
            message_encryption_service_1.MessageEncryptionService,
        ],
        exports: [encryption_service_1.EncryptionService, key_management_service_1.KeyManagementService],
    })
], EncryptionModule);
//# sourceMappingURL=encryption.module.js.map