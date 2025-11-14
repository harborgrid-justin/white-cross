"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionStatus = exports.EncryptionAlgorithm = void 0;
var EncryptionAlgorithm;
(function (EncryptionAlgorithm) {
    EncryptionAlgorithm["AES_256_GCM"] = "aes-256-gcm";
    EncryptionAlgorithm["RSA_OAEP"] = "rsa-oaep";
})(EncryptionAlgorithm || (exports.EncryptionAlgorithm = EncryptionAlgorithm = {}));
var EncryptionStatus;
(function (EncryptionStatus) {
    EncryptionStatus["SUCCESS"] = "success";
    EncryptionStatus["FAILED"] = "failed";
    EncryptionStatus["KEY_NOT_FOUND"] = "key_not_found";
    EncryptionStatus["INVALID_DATA"] = "invalid_data";
    EncryptionStatus["DECRYPTION_ERROR"] = "decryption_error";
})(EncryptionStatus || (exports.EncryptionStatus = EncryptionStatus = {}));
//# sourceMappingURL=encryption.interfaces.js.map