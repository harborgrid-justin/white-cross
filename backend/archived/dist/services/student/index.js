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
exports.StudentWaitlistController = exports.StudentBarcodeController = exports.StudentGradeController = exports.StudentAcademicController = exports.StudentPhotoController = exports.StudentHealthController = exports.StudentAnalyticsController = exports.StudentQueryController = exports.StudentManagementController = exports.StudentCrudController = exports.StudentService = exports.StudentModule = void 0;
var student_module_1 = require("./student.module");
Object.defineProperty(exports, "StudentModule", { enumerable: true, get: function () { return student_module_1.StudentModule; } });
var student_service_1 = require("./student.service");
Object.defineProperty(exports, "StudentService", { enumerable: true, get: function () { return student_service_1.StudentService; } });
var student_crud_controller_1 = require("./controllers/student-crud.controller");
Object.defineProperty(exports, "StudentCrudController", { enumerable: true, get: function () { return student_crud_controller_1.StudentCrudController; } });
var student_management_controller_1 = require("./controllers/student-management.controller");
Object.defineProperty(exports, "StudentManagementController", { enumerable: true, get: function () { return student_management_controller_1.StudentManagementController; } });
var student_query_controller_1 = require("./controllers/student-query.controller");
Object.defineProperty(exports, "StudentQueryController", { enumerable: true, get: function () { return student_query_controller_1.StudentQueryController; } });
var student_analytics_controller_1 = require("./controllers/student-analytics.controller");
Object.defineProperty(exports, "StudentAnalyticsController", { enumerable: true, get: function () { return student_analytics_controller_1.StudentAnalyticsController; } });
var student_health_controller_1 = require("./controllers/student-health.controller");
Object.defineProperty(exports, "StudentHealthController", { enumerable: true, get: function () { return student_health_controller_1.StudentHealthController; } });
var student_photo_controller_1 = require("./controllers/student-photo.controller");
Object.defineProperty(exports, "StudentPhotoController", { enumerable: true, get: function () { return student_photo_controller_1.StudentPhotoController; } });
var student_academic_controller_1 = require("./controllers/student-academic.controller");
Object.defineProperty(exports, "StudentAcademicController", { enumerable: true, get: function () { return student_academic_controller_1.StudentAcademicController; } });
var student_grade_controller_1 = require("./controllers/student-grade.controller");
Object.defineProperty(exports, "StudentGradeController", { enumerable: true, get: function () { return student_grade_controller_1.StudentGradeController; } });
var student_barcode_controller_1 = require("./controllers/student-barcode.controller");
Object.defineProperty(exports, "StudentBarcodeController", { enumerable: true, get: function () { return student_barcode_controller_1.StudentBarcodeController; } });
var student_waitlist_controller_1 = require("./controllers/student-waitlist.controller");
Object.defineProperty(exports, "StudentWaitlistController", { enumerable: true, get: function () { return student_waitlist_controller_1.StudentWaitlistController; } });
__exportStar(require("./dto"), exports);
//# sourceMappingURL=index.js.map