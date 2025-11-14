"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicTranscriptModule = void 0;
const common_1 = require("@nestjs/common");
const academic_transcript_service_1 = require("./academic-transcript.service");
const academic_transcript_controller_1 = require("./academic-transcript.controller");
const database_module_1 = require("../../database/database.module");
let AcademicTranscriptModule = class AcademicTranscriptModule {
};
exports.AcademicTranscriptModule = AcademicTranscriptModule;
exports.AcademicTranscriptModule = AcademicTranscriptModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [academic_transcript_controller_1.AcademicTranscriptController],
        providers: [academic_transcript_service_1.AcademicTranscriptService],
        exports: [academic_transcript_service_1.AcademicTranscriptService],
    })
], AcademicTranscriptModule);
//# sourceMappingURL=academic-transcript.module.js.map