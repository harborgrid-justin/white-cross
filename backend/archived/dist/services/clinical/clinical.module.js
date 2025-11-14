"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const axios_1 = require("@nestjs/axios");
const database_1 = require("../../database");
const allergy_management_service_1 = require("./services/allergy-management.service");
const clinical_note_service_1 = require("./services/clinical-note.service");
const clinical_protocol_service_1 = require("./services/clinical-protocol.service");
const clinic_visit_basic_service_1 = require("./services/clinic-visit-basic.service");
const clinic_visit_analytics_service_1 = require("./services/clinic-visit-analytics.service");
const drug_catalog_service_1 = require("./services/drug-catalog.service");
const drug_interaction_service_1 = require("./services/drug-interaction.service");
const follow_up_service_1 = require("./services/follow-up.service");
const interaction_checker_service_1 = require("./services/interaction-checker.service");
const prescription_service_1 = require("./services/prescription.service");
const treatment_plan_service_1 = require("./services/treatment-plan.service");
const vital_signs_service_1 = require("./services/vital-signs.service");
const clinical_note_controller_1 = require("./controllers/clinical-note.controller");
const clinical_protocol_management_controller_1 = require("./controllers/clinical-protocol-management.controller");
const clinical_protocol_query_controller_1 = require("./controllers/clinical-protocol-query.controller");
const clinic_visit_controller_1 = require("./controllers/clinic-visit.controller");
const drug_catalog_controller_1 = require("./controllers/drug-catalog.controller");
const drug_interaction_management_controller_1 = require("./controllers/drug-interaction-management.controller");
const drug_allergy_controller_1 = require("./controllers/drug-allergy.controller");
const drug_safety_controller_1 = require("./controllers/drug-safety.controller");
const follow_up_controller_1 = require("./controllers/follow-up.controller");
const medication_administration_core_controller_1 = require("./controllers/medication-administration-core.controller");
const medication_administration_scheduling_controller_1 = require("./controllers/medication-administration-scheduling.controller");
const medication_administration_safety_controller_1 = require("./controllers/medication-administration-safety.controller");
const medication_administration_reporting_controller_1 = require("./controllers/medication-administration-reporting.controller");
const medication_administration_special_controller_1 = require("./controllers/medication-administration-special.controller");
const prescription_alias_controller_1 = require("./controllers/prescription-alias.controller");
const prescription_controller_1 = require("./controllers/prescription.controller");
const treatment_plan_controller_1 = require("./controllers/treatment-plan.controller");
const vital_signs_controller_1 = require("./controllers/vital-signs.controller");
let ClinicalModule = class ClinicalModule {
};
exports.ClinicalModule = ClinicalModule;
exports.ClinicalModule = ClinicalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                database_1.DrugCatalog,
                database_1.DrugInteraction,
                database_1.StudentDrugAllergy,
                database_1.TreatmentPlan,
                database_1.VitalSigns,
                database_1.ClinicVisit,
                database_1.Prescription,
                database_1.ClinicalProtocol,
                database_1.ClinicalNote,
                database_1.FollowUpAppointment,
            ]),
            axios_1.HttpModule,
        ],
        controllers: [
            drug_catalog_controller_1.DrugCatalogController,
            drug_interaction_management_controller_1.DrugInteractionManagementController,
            drug_allergy_controller_1.DrugAllergyController,
            drug_safety_controller_1.DrugSafetyController,
            clinic_visit_controller_1.ClinicVisitController,
            treatment_plan_controller_1.TreatmentPlanController,
            prescription_controller_1.PrescriptionController,
            clinical_protocol_management_controller_1.ClinicalProtocolManagementController,
            clinical_protocol_query_controller_1.ClinicalProtocolQueryController,
            clinical_note_controller_1.ClinicalNoteController,
            vital_signs_controller_1.VitalSignsController,
            follow_up_controller_1.FollowUpController,
            medication_administration_core_controller_1.MedicationAdministrationCoreController,
            medication_administration_scheduling_controller_1.MedicationAdministrationSchedulingController,
            medication_administration_safety_controller_1.MedicationAdministrationSafetyController,
            medication_administration_reporting_controller_1.MedicationAdministrationReportingController,
            medication_administration_special_controller_1.MedicationAdministrationSpecialController,
            prescription_alias_controller_1.PrescriptionAliasController,
        ],
        providers: [
            drug_interaction_service_1.DrugInteractionService,
            clinic_visit_basic_service_1.ClinicVisitBasicService,
            clinic_visit_analytics_service_1.ClinicVisitAnalyticsService,
            allergy_management_service_1.AllergyManagementService,
            clinical_note_service_1.ClinicalNoteService,
            clinical_protocol_service_1.ClinicalProtocolService,
            drug_catalog_service_1.DrugCatalogService,
            follow_up_service_1.FollowUpService,
            interaction_checker_service_1.InteractionCheckerService,
            prescription_service_1.PrescriptionService,
            treatment_plan_service_1.TreatmentPlanService,
            vital_signs_service_1.VitalSignsService,
        ],
        exports: [
            allergy_management_service_1.AllergyManagementService,
            clinical_note_service_1.ClinicalNoteService,
            clinical_protocol_service_1.ClinicalProtocolService,
            clinic_visit_basic_service_1.ClinicVisitBasicService,
            clinic_visit_analytics_service_1.ClinicVisitAnalyticsService,
            drug_catalog_service_1.DrugCatalogService,
            drug_interaction_service_1.DrugInteractionService,
            follow_up_service_1.FollowUpService,
            interaction_checker_service_1.InteractionCheckerService,
            prescription_service_1.PrescriptionService,
            treatment_plan_service_1.TreatmentPlanService,
            vital_signs_service_1.VitalSignsService,
        ],
    })
], ClinicalModule);
//# sourceMappingURL=clinical.module.js.map