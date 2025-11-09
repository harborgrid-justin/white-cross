/**
 * LOC: EDU-COMP-CURRICULUM-001
 * File: /reuse/education/composites/academic-curriculum-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../curriculum-management-kit
 *   - ../course-catalog-kit
 *   - ../academic-planning-kit
 *   - ../degree-audit-kit
 *   - ../compliance-reporting-kit
 *
 * DOWNSTREAM (imported by):
 *   - Academic curriculum controllers
 *   - Program management services
 *   - Curriculum review modules
 *   - Accreditation reporting services
 *   - Degree planning systems
 */
import { Sequelize } from 'sequelize';
/**
 * Program status types
 */
export type ProgramStatus = 'active' | 'inactive' | 'discontinued' | 'under_review' | 'pending_approval';
/**
 * Degree level types
 */
export type DegreeLevel = 'certificate' | 'associate' | 'bachelor' | 'master' | 'doctoral' | 'professional';
/**
 * Curriculum approval status
 */
export type ApprovalStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'revision_requested';
/**
 * Requirement category types
 */
export type RequirementCategory = 'core' | 'major' | 'elective' | 'general_education' | 'capstone' | 'internship';
/**
 * Program data interface
 */
export interface ProgramData {
    programCode: string;
    programName: string;
    degreeLevel: DegreeLevel;
    departmentId: string;
    schoolId: string;
    cipCode: string;
    totalCredits: number;
    status: ProgramStatus;
    catalogYear: string;
    effectiveDate: Date;
    expirationDate?: Date;
    admissionRequirements?: any;
    learningOutcomes?: string[];
    accreditationBody?: string;
}
/**
 * Curriculum revision data
 */
export interface CurriculumRevisionData {
    curriculumId: string;
    versionNumber: string;
    revisionReason: string;
    changes: string[];
    revisedBy: string;
    effectiveDate: Date;
    approvalStatus: ApprovalStatus;
    reviewers?: string[];
    approvedBy?: string;
    approvedAt?: Date;
}
/**
 * Course requirement data
 */
export interface CourseRequirementData {
    curriculumId: string;
    courseId: string;
    requirementCategory: RequirementCategory;
    credits: number;
    isRequired: boolean;
    prerequisites?: string[];
    corequisites?: string[];
    substitutions?: string[];
    minGrade?: string;
}
/**
 * Articulation agreement data
 */
export interface ArticulationAgreementData {
    institutionId: string;
    programId: string;
    agreementType: 'transfer' | '2plus2' | 'dual_enrollment' | 'concurrent';
    effectiveDate: Date;
    expirationDate?: Date;
    courseMapping: Array<{
        sourceInstitution: string;
        sourceCourse: string;
        targetCourse: string;
        credits: number;
    }>;
    conditions?: string[];
    approvedBy: string;
}
/**
 * Program analytics data
 */
export interface ProgramAnalytics {
    programId: string;
    enrollmentCount: number;
    graduationRate: number;
    averageTimeToCompletion: number;
    retentionRate: number;
    employmentRate?: number;
    studentSatisfaction?: number;
}
/**
 * Sequelize model for Academic Programs with full metadata.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     AcademicProgram:
 *       type: object
 *       required:
 *         - programCode
 *         - programName
 *         - degreeLevel
 *         - cipCode
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         programCode:
 *           type: string
 *           example: "CS-BS"
 *         programName:
 *           type: string
 *           example: "Bachelor of Science in Computer Science"
 *         degreeLevel:
 *           type: string
 *           enum: [certificate, associate, bachelor, master, doctoral, professional]
 *         cipCode:
 *           type: string
 *           example: "11.0701"
 *         totalCredits:
 *           type: number
 *           example: 120
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AcademicProgram model
 *
 * @example
 * ```typescript
 * const AcademicProgram = createAcademicProgramModel(sequelize);
 * const program = await AcademicProgram.create({
 *   programCode: 'CS-BS',
 *   programName: 'Bachelor of Science in Computer Science',
 *   degreeLevel: 'bachelor',
 *   departmentId: 'dept-cs',
 *   schoolId: 'school-engineering',
 *   cipCode: '11.0701',
 *   totalCredits: 120,
 *   status: 'active',
 *   catalogYear: '2025-2026',
 *   effectiveDate: new Date('2025-09-01')
 * });
 * ```
 */
export declare const createAcademicProgramModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        programCode: string;
        programName: string;
        degreeLevel: DegreeLevel;
        departmentId: string;
        schoolId: string;
        cipCode: string;
        totalCredits: number;
        status: ProgramStatus;
        catalogYear: string;
        effectiveDate: Date;
        expirationDate: Date | null;
        admissionRequirements: any;
        learningOutcomes: string[];
        accreditationBody: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Curriculum Versions with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CurriculumVersion model
 */
export declare const createCurriculumVersionModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        programId: string;
        versionNumber: string;
        revisionReason: string;
        changes: string[];
        revisedBy: string;
        effectiveDate: Date;
        approvalStatus: ApprovalStatus;
        reviewers: string[];
        approvedBy: string | null;
        approvedAt: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Academic Curriculum Management Composite Service
 *
 * Provides comprehensive curriculum design, program lifecycle management, course catalog
 * operations, and accreditation support for higher education institutions.
 */
export declare class AcademicCurriculumManagementService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates a new academic program with full metadata.
     *
     * @param {ProgramData} programData - Program data
     * @returns {Promise<any>} Created program
     *
     * @example
     * ```typescript
     * const program = await service.createAcademicProgram({
     *   programCode: 'CS-BS',
     *   programName: 'Bachelor of Science in Computer Science',
     *   degreeLevel: 'bachelor',
     *   departmentId: 'dept-cs',
     *   schoolId: 'school-eng',
     *   cipCode: '11.0701',
     *   totalCredits: 120,
     *   status: 'pending_approval',
     *   catalogYear: '2025-2026',
     *   effectiveDate: new Date('2025-09-01'),
     *   learningOutcomes: ['Design software systems', 'Apply algorithms'],
     *   accreditationBody: 'ABET'
     * });
     * ```
     */
    createAcademicProgram(programData: ProgramData): Promise<any>;
    /**
     * 2. Updates an existing academic program.
     *
     * @param {string} programId - Program ID
     * @param {Partial<ProgramData>} updates - Update data
     * @returns {Promise<any>} Updated program
     *
     * @example
     * ```typescript
     * const updated = await service.updateAcademicProgram('prog-123', {
     *   totalCredits: 125,
     *   learningOutcomes: ['Updated outcome 1', 'Updated outcome 2']
     * });
     * ```
     */
    updateAcademicProgram(programId: string, updates: Partial<ProgramData>): Promise<any>;
    /**
     * 3. Retrieves program by code.
     *
     * @param {string} programCode - Program code
     * @returns {Promise<any>} Program details
     *
     * @example
     * ```typescript
     * const program = await service.getProgramByCode('CS-BS');
     * ```
     */
    getProgramByCode(programCode: string): Promise<any>;
    /**
     * 4. Lists all programs by degree level.
     *
     * @param {DegreeLevel} degreeLevel - Degree level
     * @returns {Promise<any[]>} Programs
     *
     * @example
     * ```typescript
     * const bachelors = await service.getProgramsByDegreeLevel('bachelor');
     * ```
     */
    getProgramsByDegreeLevel(degreeLevel: DegreeLevel): Promise<any[]>;
    /**
     * 5. Activates a program for enrollment.
     *
     * @param {string} programId - Program ID
     * @param {string} activatedBy - User ID
     * @returns {Promise<any>} Activated program
     *
     * @example
     * ```typescript
     * await service.activateProgram('prog-123', 'admin-456');
     * ```
     */
    activateProgram(programId: string, activatedBy: string): Promise<any>;
    /**
     * 6. Discontinues a program.
     *
     * @param {string} programId - Program ID
     * @param {Date} expirationDate - Expiration date
     * @param {string} reason - Discontinuation reason
     * @returns {Promise<any>} Discontinued program
     *
     * @example
     * ```typescript
     * await service.discontinueProgram('prog-123', new Date('2027-05-31'), 'Low enrollment');
     * ```
     */
    discontinueProgram(programId: string, expirationDate: Date, reason: string): Promise<any>;
    /**
     * 7. Searches programs by criteria.
     *
     * @param {any} searchCriteria - Search criteria
     * @returns {Promise<any[]>} Matching programs
     *
     * @example
     * ```typescript
     * const programs = await service.searchPrograms({
     *   departmentId: 'dept-cs',
     *   status: 'active',
     *   catalogYear: '2025-2026'
     * });
     * ```
     */
    searchPrograms(searchCriteria: any): Promise<any[]>;
    /**
     * 8. Validates program requirements completeness.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<{complete: boolean; missing: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateProgramRequirements('prog-123');
     * if (!validation.complete) {
     *   console.log('Missing:', validation.missing);
     * }
     * ```
     */
    validateProgramRequirements(programId: string): Promise<{
        complete: boolean;
        missing: string[];
    }>;
    /**
     * 9. Creates a new curriculum revision.
     *
     * @param {CurriculumRevisionData} revisionData - Revision data
     * @returns {Promise<any>} Created revision
     *
     * @example
     * ```typescript
     * const revision = await service.createCurriculumRevision({
     *   curriculumId: 'curr-123',
     *   versionNumber: '2.0',
     *   revisionReason: 'Industry alignment',
     *   changes: ['Added AI courses', 'Updated core requirements'],
     *   revisedBy: 'faculty-789',
     *   effectiveDate: new Date('2026-09-01'),
     *   approvalStatus: 'draft'
     * });
     * ```
     */
    createCurriculumRevision(revisionData: CurriculumRevisionData): Promise<any>;
    /**
     * 10. Submits curriculum revision for approval.
     *
     * @param {string} revisionId - Revision ID
     * @param {string} submittedBy - User ID
     * @returns {Promise<any>} Updated revision
     *
     * @example
     * ```typescript
     * await service.submitCurriculumRevisionForApproval('rev-123', 'faculty-789');
     * ```
     */
    submitCurriculumRevisionForApproval(revisionId: string, submittedBy: string): Promise<any>;
    /**
     * 11. Approves a curriculum revision.
     *
     * @param {string} revisionId - Revision ID
     * @param {string} approvedBy - Approver user ID
     * @returns {Promise<any>} Approved revision
     *
     * @example
     * ```typescript
     * await service.approveCurriculumRevision('rev-123', 'dean-456');
     * ```
     */
    approveCurriculumRevision(revisionId: string, approvedBy: string): Promise<any>;
    /**
     * 12. Requests revisions to curriculum.
     *
     * @param {string} revisionId - Revision ID
     * @param {string} reviewerId - Reviewer user ID
     * @param {string} comments - Review comments
     * @returns {Promise<any>} Updated revision
     *
     * @example
     * ```typescript
     * await service.requestCurriculumRevisions('rev-123', 'reviewer-999', 'Please add more electives');
     * ```
     */
    requestCurriculumRevisions(revisionId: string, reviewerId: string, comments: string): Promise<any>;
    /**
     * 13. Retrieves curriculum revision history.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any[]>} Revision history
     *
     * @example
     * ```typescript
     * const history = await service.getCurriculumRevisionHistory('prog-123');
     * ```
     */
    getCurriculumRevisionHistory(programId: string): Promise<any[]>;
    /**
     * 14. Compares two curriculum versions.
     *
     * @param {string} version1Id - First version ID
     * @param {string} version2Id - Second version ID
     * @returns {Promise<any>} Comparison report
     *
     * @example
     * ```typescript
     * const comparison = await service.compareCurriculumVersions('rev-1', 'rev-2');
     * ```
     */
    compareCurriculumVersions(version1Id: string, version2Id: string): Promise<any>;
    /**
     * 15. Generates curriculum change log.
     *
     * @param {string} programId - Program ID
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<any>} Change log
     *
     * @example
     * ```typescript
     * const log = await service.generateCurriculumChangeLog(
     *   'prog-123',
     *   new Date('2024-01-01'),
     *   new Date('2025-01-01')
     * );
     * ```
     */
    generateCurriculumChangeLog(programId: string, startDate: Date, endDate: Date): Promise<any>;
    /**
     * 16. Adds course requirement to curriculum.
     *
     * @param {CourseRequirementData} requirementData - Requirement data
     * @returns {Promise<any>} Created requirement
     *
     * @example
     * ```typescript
     * const req = await service.addCourseRequirement({
     *   curriculumId: 'curr-123',
     *   courseId: 'cs-101',
     *   requirementCategory: 'core',
     *   credits: 3,
     *   isRequired: true,
     *   prerequisites: ['math-101'],
     *   minGrade: 'C'
     * });
     * ```
     */
    addCourseRequirement(requirementData: CourseRequirementData): Promise<any>;
    /**
     * 17. Updates course requirement.
     *
     * @param {string} requirementId - Requirement ID
     * @param {Partial<CourseRequirementData>} updates - Updates
     * @returns {Promise<any>} Updated requirement
     *
     * @example
     * ```typescript
     * await service.updateCourseRequirement('req-123', { minGrade: 'B' });
     * ```
     */
    updateCourseRequirement(requirementId: string, updates: Partial<CourseRequirementData>): Promise<any>;
    /**
     * 18. Removes course requirement from curriculum.
     *
     * @param {string} requirementId - Requirement ID
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.removeCourseRequirement('req-123');
     * ```
     */
    removeCourseRequirement(requirementId: string): Promise<void>;
    /**
     * 19. Validates prerequisite chain for course.
     *
     * @param {string} courseId - Course ID
     * @param {string[]} prerequisites - Prerequisites
     * @returns {Promise<{valid: boolean; errors: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const result = await service.validatePrerequisiteChain('cs-301', ['cs-201', 'cs-202']);
     * ```
     */
    validatePrerequisiteChain(courseId: string, prerequisites: string[]): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * 20. Lists all requirements for curriculum.
     *
     * @param {string} curriculumId - Curriculum ID
     * @returns {Promise<any[]>} Requirements
     *
     * @example
     * ```typescript
     * const requirements = await service.getCurriculumRequirements('curr-123');
     * ```
     */
    getCurriculumRequirements(curriculumId: string): Promise<any[]>;
    /**
     * 21. Calculates total credits for curriculum.
     *
     * @param {string} curriculumId - Curriculum ID
     * @returns {Promise<number>} Total credits
     *
     * @example
     * ```typescript
     * const totalCredits = await service.calculateCurriculumCredits('curr-123');
     * console.log(`Total: ${totalCredits} credits`);
     * ```
     */
    calculateCurriculumCredits(curriculumId: string): Promise<number>;
    /**
     * 22. Generates requirement validation report.
     *
     * @param {string} curriculumId - Curriculum ID
     * @returns {Promise<any>} Validation report
     *
     * @example
     * ```typescript
     * const report = await service.generateRequirementValidationReport('curr-123');
     * ```
     */
    generateRequirementValidationReport(curriculumId: string): Promise<any>;
    /**
     * 23. Creates articulation agreement with partner institution.
     *
     * @param {ArticulationAgreementData} agreementData - Agreement data
     * @returns {Promise<any>} Created agreement
     *
     * @example
     * ```typescript
     * const agreement = await service.createArticulationAgreement({
     *   institutionId: 'inst-partner',
     *   programId: 'prog-123',
     *   agreementType: '2plus2',
     *   effectiveDate: new Date('2025-09-01'),
     *   courseMapping: [
     *     { sourceInstitution: 'partner', sourceCourse: 'ENG-101', targetCourse: 'ENGL-101', credits: 3 }
     *   ],
     *   approvedBy: 'registrar-456'
     * });
     * ```
     */
    createArticulationAgreement(agreementData: ArticulationAgreementData): Promise<any>;
    /**
     * 24. Updates articulation agreement.
     *
     * @param {string} agreementId - Agreement ID
     * @param {Partial<ArticulationAgreementData>} updates - Updates
     * @returns {Promise<any>} Updated agreement
     *
     * @example
     * ```typescript
     * await service.updateArticulationAgreement('agr-123', {
     *   expirationDate: new Date('2030-08-31')
     * });
     * ```
     */
    updateArticulationAgreement(agreementId: string, updates: Partial<ArticulationAgreementData>): Promise<any>;
    /**
     * 25. Maps transfer credits from partner institution.
     *
     * @param {string} agreementId - Agreement ID
     * @param {string[]} completedCourses - Completed courses
     * @returns {Promise<any[]>} Transfer credit mapping
     *
     * @example
     * ```typescript
     * const credits = await service.mapTransferCredits('agr-123', ['ENG-101', 'MATH-101']);
     * ```
     */
    mapTransferCredits(agreementId: string, completedCourses: string[]): Promise<any[]>;
    /**
     * 26. Validates articulation agreement compliance.
     *
     * @param {string} agreementId - Agreement ID
     * @returns {Promise<{compliant: boolean; issues: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateArticulationAgreement('agr-123');
     * ```
     */
    validateArticulationAgreement(agreementId: string): Promise<{
        compliant: boolean;
        issues: string[];
    }>;
    /**
     * 27. Lists all articulation agreements for program.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any[]>} Agreements
     *
     * @example
     * ```typescript
     * const agreements = await service.getArticulationAgreementsByProgram('prog-123');
     * ```
     */
    getArticulationAgreementsByProgram(programId: string): Promise<any[]>;
    /**
     * 28. Generates articulation agreement report.
     *
     * @param {string} agreementId - Agreement ID
     * @returns {Promise<any>} Agreement report
     *
     * @example
     * ```typescript
     * const report = await service.generateArticulationReport('agr-123');
     * ```
     */
    generateArticulationReport(agreementId: string): Promise<any>;
    /**
     * 29. Publishes program to catalog.
     *
     * @param {string} programId - Program ID
     * @param {string} catalogYear - Catalog year
     * @returns {Promise<any>} Published catalog entry
     *
     * @example
     * ```typescript
     * await service.publishProgramToCatalog('prog-123', '2025-2026');
     * ```
     */
    publishProgramToCatalog(programId: string, catalogYear: string): Promise<any>;
    /**
     * 30. Searches program catalog.
     *
     * @param {any} searchParams - Search parameters
     * @returns {Promise<any[]>} Matching programs
     *
     * @example
     * ```typescript
     * const results = await service.searchProgramCatalog({
     *   keyword: 'computer',
     *   degreeLevel: 'bachelor',
     *   departmentId: 'dept-cs'
     * });
     * ```
     */
    searchProgramCatalog(searchParams: any): Promise<any[]>;
    /**
     * 31. Generates program catalog entry.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any>} Catalog entry
     *
     * @example
     * ```typescript
     * const entry = await service.generateProgramCatalogEntry('prog-123');
     * ```
     */
    generateProgramCatalogEntry(programId: string): Promise<any>;
    /**
     * 32. Filters programs by accreditation.
     *
     * @param {string} accreditationBody - Accreditation organization
     * @returns {Promise<any[]>} Accredited programs
     *
     * @example
     * ```typescript
     * const abetPrograms = await service.filterProgramsByAccreditation('ABET');
     * ```
     */
    filterProgramsByAccreditation(accreditationBody: string): Promise<any[]>;
    /**
     * 33. Generates program comparison report.
     *
     * @param {string[]} programIds - Program IDs to compare
     * @returns {Promise<any>} Comparison report
     *
     * @example
     * ```typescript
     * const comparison = await service.compareProgramDetails(['prog-1', 'prog-2']);
     * ```
     */
    compareProgramDetails(programIds: string[]): Promise<any>;
    /**
     * 34. Exports program catalog to PDF.
     *
     * @param {string} catalogYear - Catalog year
     * @returns {Promise<Buffer>} PDF buffer
     *
     * @example
     * ```typescript
     * const pdfBuffer = await service.exportProgramCatalogPDF('2025-2026');
     * ```
     */
    exportProgramCatalogPDF(catalogYear: string): Promise<Buffer>;
    /**
     * 35. Generates program enrollment statistics.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any>} Enrollment statistics
     *
     * @example
     * ```typescript
     * const stats = await service.getProgramEnrollmentStatistics('prog-123');
     * ```
     */
    getProgramEnrollmentStatistics(programId: string): Promise<any>;
    /**
     * 36. Generates accreditation compliance report.
     *
     * @param {string} programId - Program ID
     * @param {string} accreditationBody - Accreditation organization
     * @returns {Promise<any>} Compliance report
     *
     * @example
     * ```typescript
     * const report = await service.generateAccreditationReport('prog-123', 'ABET');
     * ```
     */
    generateAccreditationReport(programId: string, accreditationBody: string): Promise<any>;
    /**
     * 37. Validates learning outcomes alignment.
     *
     * @param {string} programId - Program ID
     * @param {string[]} requiredOutcomes - Required outcomes
     * @returns {Promise<{aligned: boolean; missing: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateLearningOutcomesAlignment('prog-123', [
     *   'Critical thinking', 'Problem solving', 'Communication'
     * ]);
     * ```
     */
    validateLearningOutcomesAlignment(programId: string, requiredOutcomes: string[]): Promise<{
        aligned: boolean;
        missing: string[];
    }>;
    /**
     * 38. Tracks accreditation milestones.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any[]>} Accreditation milestones
     *
     * @example
     * ```typescript
     * const milestones = await service.trackAccreditationMilestones('prog-123');
     * ```
     */
    trackAccreditationMilestones(programId: string): Promise<any[]>;
    /**
     * 39. Generates curriculum assessment report.
     *
     * @param {string} programId - Program ID
     * @param {string} academicYear - Academic year
     * @returns {Promise<any>} Assessment report
     *
     * @example
     * ```typescript
     * const report = await service.generateCurriculumAssessmentReport('prog-123', '2024-2025');
     * ```
     */
    generateCurriculumAssessmentReport(programId: string, academicYear: string): Promise<any>;
    /**
     * 40. Validates CIP code classification.
     *
     * @param {string} cipCode - CIP code
     * @returns {Promise<{valid: boolean; title?: string}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateCIPCodeClassification('11.0701');
     * console.log(validation.title); // "Computer Science"
     * ```
     */
    validateCIPCodeClassification(cipCode: string): Promise<{
        valid: boolean;
        title?: string;
    }>;
    /**
     * 41. Generates program review self-study.
     *
     * @param {string} programId - Program ID
     * @returns {Promise<any>} Self-study document
     *
     * @example
     * ```typescript
     * const selfStudy = await service.generateProgramReviewSelfStudy('prog-123');
     * ```
     */
    generateProgramReviewSelfStudy(programId: string): Promise<any>;
    /**
     * 42. Exports accreditation data package.
     *
     * @param {string} programId - Program ID
     * @param {string} format - Export format
     * @returns {Promise<any>} Data package
     *
     * @example
     * ```typescript
     * const dataPackage = await service.exportAccreditationDataPackage('prog-123', 'json');
     * ```
     */
    exportAccreditationDataPackage(programId: string, format: 'json' | 'xml' | 'pdf'): Promise<any>;
    /**
     * Retrieves program by ID.
     *
     * @private
     */
    private getProgramById;
}
export default AcademicCurriculumManagementService;
//# sourceMappingURL=academic-curriculum-management-composite.d.ts.map