"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyStatus = exports.KeyFormat = exports.KeyType = void 0;
var KeyType;
(function (KeyType) {
    KeyType["PUBLIC"] = "public";
    KeyType["PRIVATE"] = "private";
    KeyType["SESSION"] = "session";
})(KeyType || (exports.KeyType = KeyType = {}));
var KeyFormat;
(function (KeyFormat) {
    KeyFormat["PEM"] = "pem";
    KeyFormat["DER"] = "der";
    KeyFormat["JWK"] = "jwk";
})(KeyFormat || (exports.KeyFormat = KeyFormat = {}));
var KeyStatus;
(function (KeyStatus) {
    KeyStatus["ACTIVE"] = "active";
    KeyStatus["EXPIRED"] = "expired";
    KeyStatus["ROTATED"] = "rotated";
    KeyStatus["REVOKED"] = "revoked";
})(KeyStatus || (exports.KeyStatus = KeyStatus = {}));
//# sourceMappingURL=key-management.interfaces.js.map