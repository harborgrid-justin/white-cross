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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncQueueItem = exports.SyncConflict = exports.PushNotification = exports.DeviceToken = void 0;
__exportStar(require("./mobile.module"), exports);
__exportStar(require("./controllers"), exports);
__exportStar(require("./dto"), exports);
var models_1 = require("../../database/models");
Object.defineProperty(exports, "DeviceToken", { enumerable: true, get: function () { return models_1.DeviceToken; } });
Object.defineProperty(exports, "PushNotification", { enumerable: true, get: function () { return models_1.PushNotification; } });
Object.defineProperty(exports, "SyncConflict", { enumerable: true, get: function () { return models_1.SyncConflict; } });
Object.defineProperty(exports, "SyncQueueItem", { enumerable: true, get: function () { return models_1.SyncQueueItem; } });
__exportStar(require("./enums"), exports);
__exportStar(require("./services"), exports);
//# sourceMappingURL=index.js.map