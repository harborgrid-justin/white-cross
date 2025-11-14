"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const student_service_1 = require("./student.service");
const student_core_controller_1 = require("./controllers/student-core.controller");
const student_status_controller_1 = require("./controllers/student-status.controller");
const student_crud_controller_1 = require("./controllers/student-crud.controller");
const student_management_controller_1 = require("./controllers/student-management.controller");
const student_query_controller_1 = require("./controllers/student-query.controller");
const student_analytics_controller_1 = require("./controllers/student-analytics.controller");
const student_health_controller_1 = require("./controllers/student-health.controller");
const student_photo_controller_1 = require("./controllers/student-photo.controller");
const student_academic_controller_1 = require("./controllers/student-academic.controller");
const student_grade_controller_1 = require("./controllers/student-grade.controller");
const student_barcode_controller_1 = require("./controllers/student-barcode.controller");
const student_waitlist_controller_1 = require("./controllers/student-waitlist.controller");
const services_1 = require("./services");
const database_1 = require("../../database");
const academic_transcript_1 = require("../academic-transcript");
const audit_1 = require("../audit");
let StudentModule = class StudentModule {
};
exports.StudentModule = StudentModule;
exports.StudentModule = StudentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([database_1.Student, database_1.User, database_1.HealthRecord, database_1.MentalHealthRecord]),
            academic_transcript_1.AcademicTranscriptModule,
            audit_1.AuditModule,
        ],
        controllers: [
            student_core_controller_1.StudentCoreController,
            student_status_controller_1.StudentStatusController,
            student_crud_controller_1.StudentCrudController,
            student_management_controller_1.StudentManagementController,
            student_query_controller_1.StudentQueryController,
            student_analytics_controller_1.StudentAnalyticsController,
            student_health_controller_1.StudentHealthController,
            student_photo_controller_1.StudentPhotoController,
            student_academic_controller_1.StudentAcademicController,
            student_grade_controller_1.StudentGradeController,
            student_barcode_controller_1.StudentBarcodeController,
            student_waitlist_controller_1.StudentWaitlistController,
        ],
        providers: [
            student_service_1.StudentService,
            services_1.StudentCrudService,
            services_1.StudentQueryService,
            services_1.StudentHealthRecordsService,
            services_1.StudentAcademicService,
            services_1.StudentPhotoService,
            services_1.StudentBarcodeService,
            services_1.StudentWaitlistService,
            services_1.StudentValidationService,
            services_1.StudentStatusService,
        ],
        exports: [
            student_service_1.StudentService,
            services_1.StudentCrudService,
            services_1.StudentQueryService,
            services_1.StudentHealthRecordsService,
            services_1.StudentAcademicService,
            services_1.StudentPhotoService,
            services_1.StudentBarcodeService,
            services_1.StudentWaitlistService,
            services_1.StudentValidationService,
            services_1.StudentStatusService,
        ],
    })
], StudentModule);
//# sourceMappingURL=student.module.js.map