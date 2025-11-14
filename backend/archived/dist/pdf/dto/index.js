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
__exportStar(require("./generate-custom-report.dto"), exports);
__exportStar(require("./generate-immunization-report.dto"), exports);
__exportStar(require("./generate-incident-report.dto"), exports);
__exportStar(require("./generate-medication-log.dto"), exports);
__exportStar(require("./generate-student-health-summary.dto"), exports);
__exportStar(require("./merge-pdfs.dto"), exports);
__exportStar(require("./sign-pdf.dto"), exports);
__exportStar(require("./watermark-pdf.dto"), exports);
//# sourceMappingURL=index.js.map