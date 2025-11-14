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
__exportStar(require("./student-crud.service"), exports);
__exportStar(require("./student-query.service"), exports);
__exportStar(require("./student-health-records.service"), exports);
__exportStar(require("./student-academic.service"), exports);
__exportStar(require("./student-photo.service"), exports);
__exportStar(require("./student-barcode.service"), exports);
__exportStar(require("./student-waitlist.service"), exports);
__exportStar(require("./student-validation.service"), exports);
__exportStar(require("./student-status.service"), exports);
//# sourceMappingURL=index.js.map