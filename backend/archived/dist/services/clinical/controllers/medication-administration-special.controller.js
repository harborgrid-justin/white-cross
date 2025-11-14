"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationAdministrationSpecialController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const record_refusal_dto_1 = require("../dto/administration/record-refusal.dto");
const witness_signature_dto_1 = require("../dto/administration/witness-signature.dto");
const base_1 = require("../../../common/base");
let MedicationAdministrationSpecialController = class MedicationAdministrationSpecialController extends base_1.BaseController {
    constructor() {
        super();
    }
    async recordRefusal(dto) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async recordMissedDose(dto) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async recordHeldMedication(dto) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async requestWitnessSignature(id, dto) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async submitWitnessSignature(id, dto) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
};
exports.MedicationAdministrationSpecialController = MedicationAdministrationSpecialController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Record medication refusal", summary: 'Record medication refusal',
        description: 'Records when a student refuses to take prescribed medication.' }),
    (0, common_1.Post)('refusal'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Refusal recorded successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_refusal_dto_1.RecordRefusalDto]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSpecialController.prototype, "recordRefusal", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Record missed dose", summary: 'Record missed medication dose',
        description: 'Records when a scheduled dose was not administered.' }),
    (0, common_1.Post)('missed'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Missed dose recorded successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_refusal_dto_1.RecordMissedDoseDto]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSpecialController.prototype, "recordMissedDose", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Record held medication", summary: 'Record held medication',
        description: 'Records when medication is held due to clinical decision.' }),
    (0, common_1.Post)('held'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Held medication recorded successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_refusal_dto_1.RecordHeldMedicationDto]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSpecialController.prototype, "recordHeldMedication", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Request witness signature", summary: 'Request witness signature for controlled substance',
        description: 'Initiates witness signature request for controlled substance administration.' }),
    (0, common_1.Post)(':id/witness'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Administration log ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Witness signature requested successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, witness_signature_dto_1.RequestWitnessSignatureDto]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSpecialController.prototype, "requestWitnessSignature", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Submit witness signature", summary: 'Submit witness signature',
        description: 'Submits digital signature from witness for controlled substance administration.' }),
    (0, common_1.Post)(':id/witness/sign'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Administration log ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Witness signature submitted successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, witness_signature_dto_1.SubmitWitnessSignatureDto]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSpecialController.prototype, "submitWitnessSignature", null);
exports.MedicationAdministrationSpecialController = MedicationAdministrationSpecialController = __decorate([
    (0, swagger_1.ApiTags)('Medication Administration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('medications/administrations'),
    __metadata("design:paramtypes", [])
], MedicationAdministrationSpecialController);
//# sourceMappingURL=medication-administration-special.controller.js.map