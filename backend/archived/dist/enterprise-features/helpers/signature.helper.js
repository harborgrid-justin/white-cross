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
exports.SignatureHelper = void 0;
const crypto = __importStar(require("crypto"));
class SignatureHelper {
    static createSignatureHash(signature) {
        return crypto.createHash('sha256').update(signature).digest('hex');
    }
    static createSignatureData(formId, signedBy, signature, ipAddress, userAgent) {
        const signatureHash = SignatureHelper.createSignatureHash(signature);
        return {
            formId,
            signedBy,
            signatureHash,
            signedAt: new Date(),
            ipAddress,
            userAgent,
            verified: true,
        };
    }
    static verifySignatureHash(signature, storedHash) {
        if (!storedHash) {
            return false;
        }
        const computedHash = SignatureHelper.createSignatureHash(signature);
        return computedHash === storedHash;
    }
    static generateFormId() {
        return `CF-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    }
}
exports.SignatureHelper = SignatureHelper;
//# sourceMappingURL=signature.helper.js.map