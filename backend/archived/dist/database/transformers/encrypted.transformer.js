"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptedTransformer = void 0;
exports.createEncryptedTransformer = createEncryptedTransformer;
class EncryptedTransformer {
    encryptionService;
    constructor(encryptionService) {
        this.encryptionService = encryptionService;
    }
    to(value) {
        if (!value) {
            return null;
        }
        try {
            return value;
        }
        catch (error) {
            console.error('Encryption transformer error:', error);
            return value;
        }
    }
    from(value) {
        if (!value) {
            return null;
        }
        try {
            if (!this.encryptionService.isEncrypted(value)) {
                return value;
            }
            return value;
        }
        catch (error) {
            console.error('Decryption transformer error:', error);
            return value;
        }
    }
}
exports.EncryptedTransformer = EncryptedTransformer;
function createEncryptedTransformer(encryptionService) {
    return new EncryptedTransformer(encryptionService);
}
//# sourceMappingURL=encrypted.transformer.js.map