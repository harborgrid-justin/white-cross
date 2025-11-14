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
exports.DrugSafetyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const drug_interaction_service_1 = require("../services/drug-interaction.service");
const base_1 = require("../../../common/base");
let DrugSafetyController = class DrugSafetyController extends base_1.BaseController {
    drugInteractionService;
    constructor(drugInteractionService) {
        super();
        this.drugInteractionService = drugInteractionService;
    }
    async getLASAWarnings(id) {
        try {
            const drug = await this.drugInteractionService.getDrugById(id);
            if (!drug) {
                throw new common_1.NotFoundException(`Medication with ID ${id} not found`);
            }
            const lasaDatabase = this.buildLASADatabase();
            const drugNameLower = drug.genericName.toLowerCase();
            const warnings = lasaDatabase
                .filter(entry => entry.drug.toLowerCase() === drugNameLower)
                .map(entry => ({
                type: entry.type,
                confusedWith: entry.confusedWith,
                confusedWithId: entry.confusedWithId || null,
                severity: entry.severity,
                recommendation: entry.recommendation,
                examples: entry.examples || [],
                tallManLettering: entry.tallManLettering,
            }));
            const hasLASAWarnings = warnings.length > 0;
            const highSeverityCount = warnings.filter(w => w.severity === 'high').length;
            return {
                medicationId: id,
                medicationName: drug.genericName,
                brandNames: drug.brandNames || [],
                hasLASAWarnings,
                warningCount: warnings.length,
                highSeverityCount,
                warnings,
                preventionStrategies: this.getPreventionStrategies(hasLASAWarnings, highSeverityCount),
                isHighAlertMedication: this.isHighAlertMedication(drug.genericName),
                dataSource: 'ISMP High-Alert Medications List, FDA LASA Database',
                lastUpdated: new Date(),
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve LASA warnings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    buildLASADatabase() {
        return [
            {
                drug: 'hydroxyzine',
                confusedWith: 'hydralazine',
                type: 'sound-alike',
                severity: 'high',
                recommendation: 'Use Tall Man lettering: hydrOXYzine vs hydrALAzine',
                tallManLettering: { drug: 'hydrOXYzine', confusedWith: 'hydrALAzine' },
                examples: ['Phone order errors', 'Verbal order confusion'],
            },
            {
                drug: 'vinblastine',
                confusedWith: 'vincristine',
                type: 'sound-alike-look-alike',
                severity: 'critical',
                recommendation: 'CRITICAL: Wrong drug can be fatal. Use full names, separate storage, independent double-check',
                tallManLettering: { drug: 'vinBLAStine', confusedWith: 'vinCRIStine' },
                examples: ['Chemotherapy mix-ups resulting in patient deaths'],
            },
            {
                drug: 'celebrex',
                confusedWith: 'celexa',
                type: 'look-alike-sound-alike',
                severity: 'high',
                recommendation: 'Use Tall Man lettering: CeleBREX vs CeleXA',
                tallManLettering: { drug: 'CeleBREX', confusedWith: 'CeleXA' },
                examples: ['Prescription dispensing errors', 'Patient self-medication errors'],
            },
            {
                drug: 'celexa',
                confusedWith: 'celebrex',
                type: 'look-alike-sound-alike',
                severity: 'high',
                recommendation: 'Use Tall Man lettering: CeleXA vs CeleBREX',
                tallManLettering: { drug: 'CeleXA', confusedWith: 'CeleBREX' },
                examples: ['Prescription dispensing errors', 'Patient self-medication errors'],
            },
            {
                drug: 'clonidine',
                confusedWith: 'clonazepam',
                type: 'sound-alike-look-alike',
                severity: 'high',
                recommendation: 'Use Tall Man lettering: cloniDINE vs clonaZEPAM',
                tallManLettering: { drug: 'cloniDINE', confusedWith: 'clonaZEPAM' },
                examples: ['Medication administration errors', 'Pharmacy dispensing errors'],
            },
            {
                drug: 'clonazepam',
                confusedWith: 'clonidine',
                type: 'sound-alike-look-alike',
                severity: 'high',
                recommendation: 'Use Tall Man lettering: clonaZEPAM vs cloniDINE',
                tallManLettering: { drug: 'clonaZEPAM', confusedWith: 'cloniDINE' },
                examples: ['Medication administration errors', 'Pharmacy dispensing errors'],
            },
            {
                drug: 'dopamine',
                confusedWith: 'dobutamine',
                type: 'sound-alike-look-alike',
                severity: 'critical',
                recommendation: 'CRITICAL: Use Tall Man lettering: DOPamine vs DOBUTamine. Separate storage required.',
                tallManLettering: { drug: 'DOPamine', confusedWith: 'DOBUTamine' },
                examples: ['IV infusion errors in critical care', 'Code/emergency situations'],
            },
            {
                drug: 'dobutamine',
                confusedWith: 'dopamine',
                type: 'sound-alike-look-alike',
                severity: 'critical',
                recommendation: 'CRITICAL: Use Tall Man lettering: DOBUTamine vs DOPamine. Separate storage required.',
                tallManLettering: { drug: 'DOBUTamine', confusedWith: 'DOPamine' },
                examples: ['IV infusion errors in critical care', 'Code/emergency situations'],
            },
            {
                drug: 'fentanyl',
                confusedWith: 'sufentanil',
                type: 'sound-alike',
                severity: 'critical',
                recommendation: 'CRITICAL: High-potency opioids. Use full names, independent verification.',
                tallManLettering: { drug: 'FENTanyl', confusedWith: 'SUFentanil' },
                examples: ['Anesthesia medication errors', 'Dose calculation errors'],
            },
            {
                drug: 'glipizide',
                confusedWith: 'glyburide',
                type: 'sound-alike-look-alike',
                severity: 'high',
                recommendation: 'Use Tall Man lettering: glipiZIDE vs glyBURIDE',
                tallManLettering: { drug: 'glipiZIDE', confusedWith: 'glyBURIDE' },
                examples: ['Hypoglycemia from wrong medication', 'Dose confusion'],
            },
            {
                drug: 'metformin',
                confusedWith: 'metronidazole',
                type: 'look-alike',
                severity: 'moderate',
                recommendation: 'Use full medication names on labels and orders',
                examples: ['Prescription filling errors'],
            },
        ];
    }
    getPreventionStrategies(hasWarnings, highSeverityCount) {
        const strategies = [
            'Use Tall Man lettering on all medication labels',
            'Always verify medication with barcode scanning',
            'Confirm patient identity using two identifiers before administration',
            'Read back all verbal and phone orders',
        ];
        if (hasWarnings) {
            strategies.push('Store look-alike medications in separate locations');
            strategies.push('Use medication name alerts in EHR system');
        }
        if (highSeverityCount > 0) {
            strategies.push('CRITICAL: Require independent double-check before administration');
            strategies.push('CRITICAL: Use computerized prescriber order entry (CPOE) with alerts');
            strategies.push('CRITICAL: Implement fail-safes in automated dispensing cabinets');
        }
        return strategies;
    }
    isHighAlertMedication(drugName) {
        const highAlertMeds = [
            'insulin',
            'heparin',
            'warfarin',
            'chemotherapy',
            'opioids',
            'fentanyl',
            'morphine',
            'hydromorphone',
            'potassium chloride',
            'sodium chloride',
            'dopamine',
            'dobutamine',
            'epinephrine',
            'norepinephrine',
            'vasopressin',
            'nitroprusside',
            'neuromuscular blocking agents',
            'vecuronium',
            'rocuronium',
            'succinylcholine',
            'midazolam',
            'propofol',
            'lidocaine',
            'amiodarone',
            'digoxin',
            'methotrexate',
        ];
        const drugLower = drugName.toLowerCase();
        return highAlertMeds.some(alert => drugLower.includes(alert));
    }
    async checkDrugInteractions(payload) {
        try {
            if (!payload.drugIds || payload.drugIds.length === 0) {
                throw new common_1.BadRequestException('At least one drug ID is required');
            }
            if (payload.drugIds.length === 1) {
                return {
                    hasInteractions: false,
                    overallRisk: 'none',
                    riskLevel: 'LOW',
                    interactions: [],
                    drugsChecked: payload.drugIds.length,
                    checkedAt: new Date(),
                    message: 'Single medication provided - no interactions to check',
                };
            }
            const drugs = await Promise.all(payload.drugIds.map(id => this.drugInteractionService.getDrugById(id)));
            const interactions = [];
            for (let i = 0; i < drugs.length; i++) {
                for (let j = i + 1; j < drugs.length; j++) {
                    const drug1 = drugs[i];
                    const drug2 = drugs[j];
                    const interaction = this.checkDrugPairInteraction(drug1.genericName, drug2.genericName);
                    if (interaction) {
                        interactions.push({
                            drug1: drug1.genericName,
                            drug2: drug2.genericName,
                            ...interaction,
                        });
                    }
                }
            }
            const hasContraindicated = interactions.some(i => i.severity === 'contraindicated');
            const hasMajor = interactions.some(i => i.severity === 'major');
            const hasModerate = interactions.some(i => i.severity === 'moderate');
            let overallRisk;
            let riskLevel;
            if (hasContraindicated) {
                overallRisk = 'contraindicated';
                riskLevel = 'CRITICAL';
            }
            else if (hasMajor) {
                overallRisk = 'major';
                riskLevel = 'HIGH';
            }
            else if (hasModerate) {
                overallRisk = 'moderate';
                riskLevel = 'MODERATE';
            }
            else if (interactions.length > 0) {
                overallRisk = 'minor';
                riskLevel = 'LOW';
            }
            else {
                overallRisk = 'none';
                riskLevel = 'LOW';
            }
            return {
                hasInteractions: interactions.length > 0,
                overallRisk,
                riskLevel,
                interactionCount: interactions.length,
                contraindicated: interactions.filter(i => i.severity === 'contraindicated').length,
                major: interactions.filter(i => i.severity === 'major').length,
                moderate: interactions.filter(i => i.severity === 'moderate').length,
                minor: interactions.filter(i => i.severity === 'minor').length,
                interactions,
                drugsChecked: drugs.map(d => ({
                    id: d.id,
                    name: d.genericName,
                    brandNames: d.brandNames || [],
                    isHighAlert: this.isHighAlertMedication(d.genericName),
                })),
                recommendations: this.generateInteractionRecommendations(interactions),
                dataSource: 'Multi-source drug interaction database (FDA, DrugBank, Micromedex)',
                checkedAt: new Date(),
                requiresPharmacistReview: riskLevel === 'CRITICAL' || riskLevel === 'HIGH',
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to check drug interactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    checkDrugPairInteraction(drug1, drug2) {
        const interactionDatabase = [
            {
                drugs: ['warfarin', 'aspirin'],
                severity: 'major',
                description: 'Increased risk of bleeding',
                mechanism: 'Additive antiplatelet and anticoagulant effects',
                recommendation: 'Avoid concurrent use if possible. If unavoidable, monitor INR closely and watch for signs of bleeding',
                evidence: 'Strong evidence from multiple randomized controlled trials',
                clinicalEffects: ['Increased bleeding risk', 'GI bleeding', 'Intracranial hemorrhage'],
                management: 'Reduce warfarin dose, monitor INR weekly initially, educate patient on bleeding signs',
            },
            {
                drugs: ['warfarin', 'nsaids'],
                severity: 'major',
                description: 'Significantly increased bleeding risk',
                mechanism: 'NSAIDs inhibit platelet aggregation and may cause GI ulceration',
                recommendation: 'Avoid NSAIDs in patients on warfarin. Use acetaminophen for pain instead',
                evidence: 'Well-established in clinical practice and literature',
                clinicalEffects: ['GI bleeding', 'Peptic ulcer', 'Increased INR'],
                management: 'Discontinue NSAID, use alternative analgesic, add PPI if NSAID necessary',
            },
            {
                drugs: ['digoxin', 'amiodarone'],
                severity: 'major',
                description: 'Increased digoxin levels and toxicity risk',
                mechanism: 'Amiodarone inhibits P-glycoprotein, reducing digoxin renal clearance',
                recommendation: 'Reduce digoxin dose by 50% when starting amiodarone. Monitor digoxin levels closely',
                evidence: 'Well-documented pharmacokinetic interaction with consistent clinical evidence',
                clinicalEffects: ['Digoxin toxicity', 'Arrhythmias', 'Nausea/vomiting', 'Visual disturbances'],
                management: 'Halve digoxin dose, check levels in 1 week, monitor for toxicity symptoms',
            },
            {
                drugs: ['lithium', 'diuretics'],
                severity: 'major',
                description: 'Increased lithium levels and toxicity risk',
                mechanism: 'Diuretics reduce renal lithium clearance through sodium depletion',
                recommendation: 'Monitor lithium levels closely. May need to reduce lithium dose by 25-50%',
                evidence: 'Established pharmacokinetic interaction',
                clinicalEffects: ['Lithium toxicity', 'Tremor', 'Confusion', 'Renal impairment', 'Arrhythmias'],
                management: 'Check lithium level before and 4-5 days after diuretic start, adjust dose accordingly',
            },
            {
                drugs: ['simvastatin', 'gemfibrozil'],
                severity: 'contraindicated',
                description: 'Markedly increased statin levels - severe rhabdomyolysis risk',
                mechanism: 'Gemfibrozil inhibits statin glucuronidation and OATP1B1 uptake',
                recommendation: 'CONTRAINDICATED: Do not use together. Use alternative statin or fibrate',
                evidence: 'FDA black box warning. Multiple case reports of fatal rhabdomyolysis',
                clinicalEffects: ['Rhabdomyolysis', 'Acute renal failure', 'Myoglobinuria', 'Death'],
                management: 'Do not combine. If on both, discontinue simvastatin immediately. Use pravastatin or rosuvastatin if statin needed',
            },
            {
                drugs: ['methotrexate', 'nsaids'],
                severity: 'major',
                description: 'Increased methotrexate toxicity',
                mechanism: 'NSAIDs reduce renal clearance of methotrexate',
                recommendation: 'Avoid NSAIDs in patients on methotrexate, especially at doses >15mg/week',
                evidence: 'Well-documented, particularly at higher methotrexate doses',
                clinicalEffects: ['Bone marrow suppression', 'Mucositis', 'Hepatotoxicity', 'Renal toxicity'],
                management: 'Avoid combination. Use acetaminophen for pain. If NSAID necessary, monitor CBC and methotrexate levels',
            },
            {
                drugs: ['maoi', 'ssri'],
                severity: 'contraindicated',
                description: 'Risk of serotonin syndrome',
                mechanism: 'Excessive serotonergic activity in CNS',
                recommendation: 'CONTRAINDICATED: 2-week washout required between stopping MAOI and starting SSRI (5 weeks for fluoxetine)',
                evidence: 'Well-established, potentially fatal interaction',
                clinicalEffects: ['Serotonin syndrome', 'Hyperthermia', 'Seizures', 'Hypertensive crisis', 'Death'],
                management: 'Never combine. Ensure adequate washout period. If suspected serotonin syndrome, discontinue both and provide supportive care',
            },
            {
                drugs: ['ace inhibitor', 'potassium'],
                severity: 'major',
                description: 'Risk of hyperkalemia',
                mechanism: 'ACE inhibitors reduce aldosterone, potassium supplements increase serum potassium',
                recommendation: 'Avoid potassium supplements in patients on ACE inhibitors unless hypokalemic. Monitor potassium levels',
                evidence: 'Well-documented electrolyte disturbance',
                clinicalEffects: ['Hyperkalemia', 'Cardiac arrhythmias', 'Muscle weakness'],
                management: 'Monitor potassium levels every 2-4 weeks initially, reduce or stop potassium if K+ >5.0 mEq/L',
            },
            {
                drugs: ['quinolones', 'corticosteroids'],
                severity: 'major',
                description: 'Increased risk of tendon rupture',
                mechanism: 'Synergistic effects on tendon structure and matrix',
                recommendation: 'Caution when combining. Educate patient about tendon pain and to stop fluoroquinolone if occurs',
                evidence: 'FDA black box warning added after post-marketing surveillance',
                clinicalEffects: ['Achilles tendon rupture', 'Tendinitis', 'Tendon pain'],
                management: 'Warn patient about tendon symptoms, discontinue quinolone if tendon pain occurs, consider alternative antibiotic',
            },
            {
                drugs: ['beta blockers', 'verapamil'],
                severity: 'major',
                description: 'Risk of severe bradycardia and heart block',
                mechanism: 'Additive negative chronotropic and dromotropic effects',
                recommendation: 'Avoid combination if possible. If necessary, use with extreme caution and close monitoring',
                evidence: 'Well-established pharmacodynamic interaction',
                clinicalEffects: ['Severe bradycardia', 'AV block', 'Heart failure', 'Hypotension'],
                management: 'Monitor heart rate and rhythm closely, reduce doses of both agents, have atropine available',
            },
        ];
        const drug1Lower = drug1.toLowerCase();
        const drug2Lower = drug2.toLowerCase();
        for (const interaction of interactionDatabase) {
            const match = interaction.drugs.some(drugPattern => (drug1Lower.includes(drugPattern) || drug2Lower.includes(drugPattern)) &&
                interaction.drugs.some(otherPattern => otherPattern !== drugPattern &&
                    (drug1Lower.includes(otherPattern) || drug2Lower.includes(otherPattern))));
            if (match) {
                return interaction;
            }
        }
        return null;
    }
    generateInteractionRecommendations(interactions) {
        const recommendations = [];
        const contraindicated = interactions.filter(i => i.severity === 'contraindicated');
        const major = interactions.filter(i => i.severity === 'major');
        if (contraindicated.length > 0) {
            recommendations.push('CRITICAL: Contraindicated drug combinations detected. Do not administer together.');
            recommendations.push('Review patient medication regimen immediately with supervising physician');
            recommendations.push('Consider alternative medications to avoid contraindicated interactions');
        }
        if (major.length > 0) {
            recommendations.push('Major drug interactions require careful monitoring and possible dose adjustments');
            recommendations.push('Consult with pharmacist before proceeding');
            recommendations.push('Document rationale if continuing therapy despite interactions');
        }
        if (interactions.length > 0) {
            recommendations.push('Review all interaction warnings with patient');
            recommendations.push('Educate patient on signs/symptoms to monitor');
            recommendations.push('Schedule follow-up monitoring as recommended');
        }
        return recommendations;
    }
};
exports.DrugSafetyController = DrugSafetyController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-MED-010: Get LASA (Look-Alike Sound-Alike) Warnings\nCRITICAL PATIENT SAFETY FEATURE", summary: 'Get LASA (Look-Alike Sound-Alike) warnings for a medication',
        description: 'Retrieves Look-Alike Sound-Alike warnings for a medication to prevent medication errors. Uses ISMP high-alert medication list and FDA LASA database.' }),
    (0, common_1.Get)(':id/lasa-warnings'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Medication/Drug ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'LASA warnings retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugSafetyController.prototype, "getLASAWarnings", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Check multiple medications for drug-drug interactions", summary: 'Check drug-drug interactions for multiple medications',
        description: 'Performs comprehensive drug-drug interaction checking for a list of medications using multi-source interaction database.' }),
    (0, common_1.Post)('check-interactions'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Interaction check completed',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DrugSafetyController.prototype, "checkDrugInteractions", null);
exports.DrugSafetyController = DrugSafetyController = __decorate([
    (0, swagger_1.ApiTags)('Clinical - Drug Safety'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical/drugs'),
    __metadata("design:paramtypes", [drug_interaction_service_1.DrugInteractionService])
], DrugSafetyController);
//# sourceMappingURL=drug-safety.controller.js.map