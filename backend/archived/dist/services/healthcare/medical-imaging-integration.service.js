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
exports.MedicalImagingIntegrationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const base_1 = require("../../common/base");
let MedicalImagingIntegrationService = class MedicalImagingIntegrationService extends base_1.BaseService {
    studentModel;
    healthRecordModel;
    vitalSignsModel;
    sequelize;
    IMAGING_MODALITIES = {
        XRAY: {
            name: 'X-Ray',
            radiation: true,
            contrast: false,
            typicalDuration: 5,
            aiAnalysis: ['fracture_detection', 'pneumonia_detection', 'bone_age_estimation'],
        },
        MRI: {
            name: 'Magnetic Resonance Imaging',
            radiation: false,
            contrast: true,
            typicalDuration: 45,
            aiAnalysis: ['tumor_detection', 'stroke_analysis', 'ms_lesion_detection'],
        },
        CT: {
            name: 'Computed Tomography',
            radiation: true,
            contrast: true,
            typicalDuration: 15,
            aiAnalysis: ['pulmonary_embolism', 'aneurysm_detection', 'coronary_calcification'],
        },
        ULTRASOUND: {
            name: 'Ultrasound',
            radiation: false,
            contrast: false,
            typicalDuration: 20,
            aiAnalysis: ['fetal_development', 'cardiac_function', 'thyroid_nodules'],
        },
        MAMMOGRAPHY: {
            name: 'Mammography',
            radiation: true,
            contrast: false,
            typicalDuration: 10,
            aiAnalysis: ['breast_cancer_detection', 'calcification_analysis', 'density_assessment'],
        },
        PET: {
            name: 'Positron Emission Tomography',
            radiation: true,
            contrast: false,
            typicalDuration: 30,
            aiAnalysis: ['metabolic_activity', 'cancer_staging', 'treatment_response'],
        },
    };
    DICOM_CONFIG = {
        maxFileSize: 100 * 1024 * 1024,
        supportedTransferSyntaxes: [
            '1.2.840.10008.1.2',
            '1.2.840.10008.1.2.1',
            '1.2.840.10008.1.2.2',
        ],
        requiredTags: [
            '0008,0020',
            '0008,0030',
            '0008,0050',
            '0008,0060',
            '0010,0010',
            '0010,0020',
        ],
    };
    AI_MODELS = {
        FRACTURE_DETECTION: {
            modelId: 'fracture_v2',
            accuracy: 0.94,
            supportedModalities: ['XRAY'],
            processingTime: 30,
        },
        TUMOR_DETECTION: {
            modelId: 'tumor_detection_v3',
            accuracy: 0.91,
            supportedModalities: ['MRI', 'CT'],
            processingTime: 120,
        },
        PNEUMONIA_DETECTION: {
            modelId: 'chest_xray_pneumonia',
            accuracy: 0.96,
            supportedModalities: ['XRAY'],
            processingTime: 45,
        },
        STROKE_ANALYSIS: {
            modelId: 'stroke_mri_analysis',
            accuracy: 0.89,
            supportedModalities: ['MRI', 'CT'],
            processingTime: 90,
        },
    };
    constructor(studentModel, healthRecordModel, vitalSignsModel, sequelize) {
        super("MedicalImagingIntegrationService");
        this.studentModel = studentModel;
        this.healthRecordModel = healthRecordModel;
        this.vitalSignsModel = vitalSignsModel;
        this.sequelize = sequelize;
    }
    async uploadMedicalImages(patientId, imagingRequest) {
        const patient = await this.studentModel.findByPk(patientId);
        if (!patient) {
            return {
                success: false,
                error: 'Patient not found',
            };
        }
        const validation = await this.validateImagingRequest(imagingRequest);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error,
            };
        }
        const processedImages = [];
        for (const file of imagingRequest.files) {
            try {
                const processedImage = await this.processImageFile(file, patientId, imagingRequest);
                processedImages.push(processedImage);
                if (imagingRequest.enableAIAnalysis) {
                    await this.triggerAIAnalysis(processedImage.id, imagingRequest.modality);
                }
            }
            catch (error) {
                this.logError(`Failed to process image file: ${file.filename}`, error);
                return {
                    success: false,
                    error: `Failed to process image: ${file.filename}`,
                };
            }
        }
        const studyRecord = await this.createImagingStudyRecord(patientId, imagingRequest, processedImages);
        await this.scheduleQualityAssuranceReview(studyRecord.id);
        await this.logImagingActivity(studyRecord.id, 'UPLOAD', {
            patientId,
            modality: imagingRequest.modality,
            imageCount: processedImages.length,
        });
        return {
            success: true,
            studyId: studyRecord.id,
            processedImages,
            aiAnalysisTriggered: imagingRequest.enableAIAnalysis,
            qualityAssuranceScheduled: true,
            message: 'Medical images uploaded and processed successfully.',
        };
    }
    async retrieveMedicalImages(studyId, accessRequest) {
        const authorization = await this.verifyImageAccessAuthorization(studyId, accessRequest.userId, accessRequest.userRole);
        if (!authorization.authorized) {
            return {
                success: false,
                error: authorization.reason,
            };
        }
        const study = await this.getImagingStudy(studyId);
        if (!study) {
            return {
                success: false,
                error: 'Imaging study not found',
            };
        }
        const imageUrls = await this.generateSecureImageUrls(study.images, accessRequest);
        await this.logImagingActivity(studyId, 'ACCESS', {
            userId: accessRequest.userId,
            userRole: accessRequest.userRole,
            accessType: accessRequest.accessType,
            imageCount: imageUrls.length,
        });
        return {
            success: true,
            study: {
                id: study.id,
                patientId: study.patientId,
                modality: study.modality,
                studyDate: study.studyDate,
                description: study.description,
            },
            images: imageUrls,
            accessToken: authorization.accessToken,
            expiresAt: authorization.expiresAt,
        };
    }
    async performAIAnalysis(imageId, analysisRequest) {
        const image = await this.getImageMetadata(imageId);
        if (!image) {
            return {
                success: false,
                error: 'Image not found',
            };
        }
        const modelValidation = this.validateAIModelForModality(analysisRequest.modelId, image.modality);
        if (!modelValidation.valid) {
            return {
                success: false,
                error: modelValidation.error,
            };
        }
        const analysisJob = await this.submitAIAnalysisJob(imageId, analysisRequest);
        const progressMonitor = await this.monitorAIAnalysisProgress(analysisJob.id);
        return {
            success: true,
            analysisId: analysisJob.id,
            status: 'PROCESSING',
            estimatedCompletion: analysisJob.estimatedCompletion,
            modelUsed: analysisRequest.modelId,
            progressMonitor: progressMonitor,
        };
    }
    async getAIAnalysisResults(analysisId) {
        const analysisJob = await this.getAIAnalysisJob(analysisId);
        if (!analysisJob) {
            return {
                success: false,
                error: 'Analysis job not found',
            };
        }
        if (analysisJob.status === 'PROCESSING') {
            return {
                success: true,
                status: 'PROCESSING',
                progress: analysisJob.progress,
                estimatedTimeRemaining: analysisJob.estimatedTimeRemaining,
            };
        }
        if (analysisJob.status === 'FAILED') {
            return {
                success: false,
                error: analysisJob.errorMessage,
                status: 'FAILED',
            };
        }
        const results = await this.retrieveAIAnalysisResults(analysisId);
        const insights = await this.generateClinicalInsights(results, analysisJob);
        await this.logAIAnalysisCompletion(analysisId, results);
        return {
            success: true,
            status: 'COMPLETED',
            results,
            insights,
            confidence: results.confidence,
            recommendations: insights.recommendations,
            completedAt: analysisJob.completedAt,
        };
    }
    async shareMedicalImages(studyId, shareRequest) {
        const permissions = await this.verifySharingPermissions(studyId, shareRequest.requestedBy, shareRequest.recipients);
        if (!permissions.authorized) {
            return {
                success: false,
                error: permissions.reason,
            };
        }
        const sharingLinks = await this.createSecureSharingLinks(studyId, shareRequest.recipients, shareRequest.expirationHours);
        await this.notifyImageSharingRecipients(sharingLinks, shareRequest);
        await this.logImagingActivity(studyId, 'SHARE', {
            requestedBy: shareRequest.requestedBy,
            recipients: shareRequest.recipients,
            expirationHours: shareRequest.expirationHours,
            sharingLinks: sharingLinks.length,
        });
        return {
            success: true,
            sharingLinks,
            expirationDate: new Date(Date.now() + shareRequest.expirationHours * 60 * 60 * 1000),
            message: 'Medical images shared successfully with authorized recipients.',
        };
    }
    async performQualityAssurance(studyId, qaRequest) {
        const study = await this.getImagingStudy(studyId);
        if (!study) {
            return {
                success: false,
                error: 'Imaging study not found',
            };
        }
        const automatedChecks = await this.performAutomatedQualityChecks(study);
        let manualReview = null;
        if (qaRequest.includeManualReview) {
            manualReview = await this.performManualQualityReview(study, qaRequest.reviewerId);
        }
        const qaReport = await this.generateQualityAssuranceReport(study, automatedChecks, manualReview);
        await this.updateStudyQAStatus(studyId, qaReport.overallQuality);
        await this.logQualityAssuranceCompletion(studyId, qaReport);
        return {
            success: true,
            studyId,
            overallQuality: qaReport.overallQuality,
            automatedChecks,
            manualReview,
            report: qaReport,
            recommendations: qaReport.recommendations,
        };
    }
    async integrateWithPACS(pacsRequest) {
        const connection = await this.establishPACSConnection(pacsRequest);
        if (!connection.success) {
            return {
                success: false,
                error: connection.error,
            };
        }
        const studies = await this.queryPACSStudies(connection.session, pacsRequest.queryParameters);
        const processedStudies = await this.processPACSStudies(connection.session, studies, pacsRequest);
        await this.closePACSConnection(connection.session);
        await this.logPACSIntegration(pacsRequest, processedStudies);
        return {
            success: true,
            studiesRetrieved: processedStudies.length,
            studiesProcessed: processedStudies.filter(s => s.processed).length,
            connectionDuration: connection.duration,
            message: 'PACS integration completed successfully.',
        };
    }
    async generateImagingAnalytics(dateRange) {
        const imagingData = await this.getImagingDataForAnalytics(dateRange);
        const metrics = await this.calculateImagingMetrics(imagingData, dateRange);
        const trends = await this.analyzeImagingTrends(imagingData);
        const insights = await this.generateImagingInsights(metrics, trends);
        const predictions = await this.predictImagingNeeds(imagingData, dateRange);
        return {
            dateRange,
            metrics,
            trends,
            insights,
            predictions,
            generatedAt: new Date(),
        };
    }
    async archiveImagingStudies(archiveRequest) {
        const studiesToArchive = await this.identifyStudiesForArchiving(archiveRequest);
        const validation = await this.validateArchivingCriteria(studiesToArchive);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error,
            };
        }
        const archivePackages = await this.createArchivePackages(studiesToArchive);
        const transferResults = await this.transferToLongTermStorage(archivePackages);
        await this.updateArchivedStudyStatus(studiesToArchive);
        const manifest = await this.generateArchiveManifest(archivePackages, transferResults);
        await this.logArchivingActivity(archiveRequest, manifest);
        return {
            success: true,
            studiesArchived: studiesToArchive.length,
            archivePackages: archivePackages.length,
            totalSizeArchived: manifest.totalSize,
            manifest,
            message: 'Imaging studies archived successfully.',
        };
    }
    async validateImagingRequest(request) {
        for (const file of request.files) {
            if (file.size > this.DICOM_CONFIG.maxFileSize) {
                return {
                    valid: false,
                    error: `File ${file.filename} exceeds maximum size limit`,
                };
            }
            if (!this.isValidDICOMFile(file)) {
                return {
                    valid: false,
                    error: `File ${file.filename} is not a valid DICOM file`,
                };
            }
        }
        if (!this.IMAGING_MODALITIES[request.modality]) {
            return {
                valid: false,
                error: 'Unsupported imaging modality',
            };
        }
        return { valid: true };
    }
    async processImageFile(file, patientId, request) {
        const dicomMetadata = await this.extractDICOMMetadata(file);
        await this.validateDICOMTags(dicomMetadata);
        const storagePath = await this.generateSecureStoragePath(patientId, request.modality);
        const storedFile = await this.storeImageFile(file, storagePath);
        const imageRecord = await this.createImageRecord({
            patientId,
            studyId: null,
            filename: file.filename,
            storagePath: storedFile.path,
            metadata: dicomMetadata,
            modality: request.modality,
            fileSize: file.size,
        });
        return {
            id: imageRecord.id,
            filename: file.filename,
            modality: request.modality,
            processedAt: new Date(),
            metadata: dicomMetadata,
        };
    }
    async triggerAIAnalysis(imageId, modality) {
        const availableModels = this.getAvailableAIModelsForModality(modality);
        for (const modelId of availableModels) {
            await this.performAIAnalysis(imageId, {
                modelId,
                priority: 'NORMAL',
                clinicalContext: {},
            });
        }
    }
    async createImagingStudyRecord(patientId, request, images) {
        return {
            id: `study_${Date.now()}`,
            patientId,
            modality: request.modality,
            studyDate: new Date(),
            description: request.description,
            images: images.map(img => img.id),
        };
    }
    async scheduleQualityAssuranceReview(studyId) {
    }
    async logImagingActivity(studyId, activity, details) {
    }
    async verifyImageAccessAuthorization(studyId, userId, userRole) {
        return {
            authorized: true,
            accessToken: 'token_123',
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        };
    }
    async getImagingStudy(studyId) {
        return {
            id: studyId,
            patientId: 'patient_123',
            modality: 'XRAY',
            studyDate: new Date(),
            description: 'Chest X-ray',
            images: [],
        };
    }
    async generateSecureImageUrls(images, accessRequest) {
        return images.map(img => ({
            imageId: img.id,
            url: `https://secure-imaging.example.com/image/${img.id}?token=secure_token`,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        }));
    }
    async getImageMetadata(imageId) {
        return {
            id: imageId,
            modality: 'XRAY',
            patientId: 'patient_123',
        };
    }
    validateAIModelForModality(modelId, modality) {
        const model = this.AI_MODELS[modelId];
        if (!model) {
            return { valid: false, error: 'AI model not found' };
        }
        if (!model.supportedModalities.includes(modality)) {
            return { valid: false, error: 'AI model not compatible with imaging modality' };
        }
        return { valid: true };
    }
    async submitAIAnalysisJob(imageId, request) {
        return {
            id: `analysis_${Date.now()}`,
            estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000),
        };
    }
    async monitorAIAnalysisProgress(analysisId) {
        return { analysisId };
    }
    async getAIAnalysisJob(analysisId) {
        return {
            id: analysisId,
            status: 'COMPLETED',
            progress: 100,
            completedAt: new Date(),
        };
    }
    async retrieveAIAnalysisResults(analysisId) {
        return {
            findings: [],
            confidence: 0.95,
        };
    }
    async generateClinicalInsights(results, job) {
        return {
            recommendations: [],
        };
    }
    async logAIAnalysisCompletion(analysisId, results) {
    }
    async verifySharingPermissions(studyId, requestedBy, recipients) {
        return { authorized: true };
    }
    async createSecureSharingLinks(studyId, recipients, expirationHours) {
        return recipients.map(recipient => ({
            recipientId: recipient,
            sharingUrl: `https://secure-share.example.com/study/${studyId}?token=share_token`,
            expiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
        }));
    }
    async notifyImageSharingRecipients(links, request) {
    }
    async performAutomatedQualityChecks(study) {
        return {
            imageQuality: 'GOOD',
            artifacts: [],
            positioning: 'CORRECT',
        };
    }
    async performManualQualityReview(study, reviewerId) {
        return {
            reviewerId,
            reviewDate: new Date(),
            qualityScore: 9,
            comments: 'High quality images',
        };
    }
    async generateQualityAssuranceReport(study, automatedChecks, manualReview) {
        return {
            overallQuality: 'EXCELLENT',
            recommendations: [],
        };
    }
    async updateStudyQAStatus(studyId, quality) {
    }
    async logQualityAssuranceCompletion(studyId, report) {
    }
    async establishPACSConnection(request) {
        return {
            success: true,
            session: 'pacs_session_123',
            duration: 0,
        };
    }
    async queryPACSStudies(session, queryParams) {
        return [];
    }
    async processPACSStudies(session, studies, request) {
        return studies.map(study => ({ ...study, processed: true }));
    }
    async closePACSConnection(session) {
    }
    async logPACSIntegration(request, results) {
    }
    async getImagingDataForAnalytics(dateRange) {
        return [];
    }
    async calculateImagingMetrics(data, dateRange) {
        return {
            totalStudies: 0,
            studiesByModality: {},
            averageProcessingTime: 0,
        };
    }
    async analyzeImagingTrends(data) {
        return {
            modalityTrends: [],
            qualityTrends: [],
        };
    }
    async generateImagingInsights(metrics, trends) {
        return [];
    }
    async predictImagingNeeds(data, dateRange) {
        return {
            predictedStudies: 0,
            recommendedCapacity: {},
        };
    }
    async identifyStudiesForArchiving(request) {
        return [];
    }
    async validateArchivingCriteria(studies) {
        return { valid: true };
    }
    async createArchivePackages(studies) {
        return [];
    }
    async transferToLongTermStorage(packages) {
        return { success: true };
    }
    async updateArchivedStudyStatus(studies) {
    }
    async generateArchiveManifest(packages, results) {
        return {
            totalSize: 0,
            packages: [],
        };
    }
    async logArchivingActivity(request, manifest) {
    }
    isValidDICOMFile(file) {
        return true;
    }
    async extractDICOMMetadata(file) {
        return {
            studyDate: new Date(),
            modality: 'XRAY',
            patientId: 'patient_123',
        };
    }
    async validateDICOMTags(metadata) {
    }
    async generateSecureStoragePath(patientId, modality) {
        return `/secure/imaging/${patientId}/${modality}/${Date.now()}`;
    }
    async storeImageFile(file, storagePath) {
        return { path: storagePath };
    }
    async createImageRecord(imageData) {
        return {
            id: `image_${Date.now()}`,
            ...imageData,
        };
    }
    getAvailableAIModelsForModality(modality) {
        const modalityConfig = this.IMAGING_MODALITIES[modality];
        return modalityConfig?.aiAnalysis || [];
    }
};
exports.MedicalImagingIntegrationService = MedicalImagingIntegrationService;
exports.MedicalImagingIntegrationService = MedicalImagingIntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.HealthRecord)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.VitalSigns)),
    __metadata("design:paramtypes", [Object, Object, Object, sequelize_typescript_1.Sequelize])
], MedicalImagingIntegrationService);
//# sourceMappingURL=medical-imaging-integration.service.js.map