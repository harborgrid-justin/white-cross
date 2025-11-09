/**
 * LOC: EDUCATION_FACULTY_MANAGEMENT_001
 * File: /reuse/education/faculty-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *
 * DOWNSTREAM (imported by):
 *   - Faculty services
 *   - Course assignment services
 *   - Academic administration controllers
 *   - HR integration services
 *   - Faculty portal services
 */
import { Model } from 'sequelize-typescript';
import { z } from 'zod';
/**
 * Faculty employment status enum
 */
export declare enum FacultyStatus {
    ACTIVE = "active",
    ON_LEAVE = "on_leave",
    SABBATICAL = "sabbatical",
    RETIRED = "retired",
    TERMINATED = "terminated",
    EMERITUS = "emeritus"
}
/**
 * Faculty rank/position enum
 */
export declare enum FacultyRank {
    PROFESSOR = "professor",
    ASSOCIATE_PROFESSOR = "associate_professor",
    ASSISTANT_PROFESSOR = "assistant_professor",
    LECTURER = "lecturer",
    SENIOR_LECTURER = "senior_lecturer",
    INSTRUCTOR = "instructor",
    ADJUNCT = "adjunct",
    VISITING = "visiting",
    RESEARCH_FACULTY = "research_faculty"
}
/**
 * Employment type enum
 */
export declare enum EmploymentType {
    FULL_TIME = "full_time",
    PART_TIME = "part_time",
    ADJUNCT = "adjunct",
    VISITING = "visiting",
    CONTRACT = "contract"
}
/**
 * Contract type enum
 */
export declare enum ContractType {
    TENURE_TRACK = "tenure_track",
    TENURED = "tenured",
    FIXED_TERM = "fixed_term",
    ANNUAL = "annual",
    SEMESTER = "semester"
}
/**
 * Evaluation type enum
 */
export declare enum EvaluationType {
    ANNUAL_REVIEW = "annual_review",
    TENURE_REVIEW = "tenure_review",
    PROMOTION_REVIEW = "promotion_review",
    PEER_REVIEW = "peer_review",
    STUDENT_EVALUATION = "student_evaluation",
    TEACHING_OBSERVATION = "teaching_observation"
}
/**
 * Qualification type enum
 */
export declare enum QualificationType {
    DEGREE = "degree",
    CERTIFICATION = "certification",
    LICENSE = "license",
    ACCREDITATION = "accreditation",
    TRAINING = "training"
}
/**
 * Day of week enum
 */
export declare enum DayOfWeek {
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATURDAY = "saturday",
    SUNDAY = "sunday"
}
/**
 * Faculty model - Core faculty information
 */
export declare class Faculty extends Model {
    id: string;
    employee_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: FacultyStatus;
    rank: FacultyRank;
    employment_type: EmploymentType;
    department_id: string;
    hire_date: Date;
    termination_date: Date;
    is_tenured: boolean;
    tenure_date: Date;
    profile: FacultyProfile;
    teaching_loads: FacultyLoad[];
    qualifications: FacultyQualifications[];
}
/**
 * Faculty Profile model - Extended faculty information
 */
export declare class FacultyProfile extends Model {
    id: string;
    faculty_id: string;
    faculty: Faculty;
    photo_url: string;
    biography: string;
    research_interests: string[];
    specializations: string[];
    publications: Array<{
        title: string;
        authors: string[];
        journal: string;
        year: number;
        doi?: string;
        url?: string;
    }>;
    office_location: string;
    office_hours: Array<{
        day: DayOfWeek;
        start_time: string;
        end_time: string;
        location?: string;
        type?: 'in_person' | 'virtual' | 'hybrid';
    }>;
    preferred_contact: string;
    website_url: string;
    linkedin_url: string;
    orcid_id: string;
}
/**
 * Faculty Load model - Teaching load and course assignments
 */
export declare class FacultyLoad extends Model {
    id: string;
    faculty_id: string;
    faculty: Faculty;
    course_id: string;
    academic_year: string;
    semester: string;
    credit_hours: number;
    enrollment_count: number;
    role: string;
    is_primary: boolean;
    load_percentage: number;
    notes: string;
}
/**
 * Faculty Qualifications model - Degrees, certifications, licenses
 */
export declare class FacultyQualifications extends Model {
    id: string;
    faculty_id: string;
    faculty: Faculty;
    qualification_type: QualificationType;
    name: string;
    institution: string;
    field: string;
    earned_date: Date;
    expiration_date: Date;
    credential_number: string;
    verification_url: string;
    is_verified: boolean;
    document_url: string;
}
/**
 * Faculty creation schema
 */
export declare const CreateFacultySchema: any;
/**
 * Faculty update schema
 */
export declare const UpdateFacultySchema: any;
/**
 * Faculty profile schema
 */
export declare const FacultyProfileSchema: any;
/**
 * Course assignment schema
 */
export declare const CourseAssignmentSchema: any;
/**
 * Qualification schema
 */
export declare const QualificationSchema: any;
/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
        has_next: boolean;
        has_prev: boolean;
    };
}
/**
 * API error response
 */
export interface ApiErrorResponse {
    statusCode: number;
    message: string;
    error: string;
    timestamp: string;
    path: string;
    details?: Record<string, any>;
}
/**
 * Success response wrapper
 */
export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
    meta?: Record<string, any>;
}
export declare class FacultyManagementService {
    private readonly logger;
    /**
     * Function 1: Create faculty record
     * POST /api/v1/faculty
     * Status: 201 Created, 400 Bad Request, 409 Conflict
     */
    createFaculty(data: z.infer<typeof CreateFacultySchema>): Promise<Faculty>;
    /**
     * Function 2: Get faculty by ID
     * GET /api/v1/faculty/:id
     * Status: 200 OK, 404 Not Found
     */
    getFacultyById(id: string, options?: {
        includeProfile?: boolean;
        includeLoads?: boolean;
        includeQualifications?: boolean;
    }): Promise<Faculty>;
    /**
     * Function 3: List faculty with pagination
     * GET /api/v1/faculty?page=1&limit=20&sort=last_name&order=asc
     * Status: 200 OK
     */
    listFaculty(params: {
        page?: number;
        limit?: number;
        sort?: string;
        order?: 'asc' | 'desc';
        status?: FacultyStatus;
        rank?: FacultyRank;
        department_id?: string;
        search?: string;
    }): Promise<PaginatedResponse<Faculty>>;
    /**
     * Function 4: Update faculty information
     * PUT /api/v1/faculty/:id or PATCH /api/v1/faculty/:id
     * Status: 200 OK, 404 Not Found, 400 Bad Request
     */
    updateFaculty(id: string, data: z.infer<typeof UpdateFacultySchema>): Promise<Faculty>;
    /**
     * Function 5: Delete/deactivate faculty
     * DELETE /api/v1/faculty/:id
     * Status: 204 No Content, 404 Not Found
     */
    deleteFaculty(id: string, softDelete?: boolean): Promise<void>;
    /**
     * Function 6: Bulk create faculty
     * POST /api/v1/faculty/bulk
     * Status: 201 Created, 400 Bad Request
     */
    bulkCreateFaculty(facultyList: z.infer<typeof CreateFacultySchema>[]): Promise<{
        created: Faculty[];
        errors: Array<{
            index: number;
            error: string;
        }>;
    }>;
    /**
     * Function 7: Search faculty
     * GET /api/v1/faculty/search?q=searchterm
     * Status: 200 OK
     */
    searchFaculty(query: string, limit?: number): Promise<Faculty[]>;
    /**
     * Function 8: Filter faculty by criteria
     * GET /api/v1/faculty/filter
     * Status: 200 OK
     */
    filterFaculty(criteria: {
        status?: FacultyStatus[];
        rank?: FacultyRank[];
        employment_type?: EmploymentType[];
        department_ids?: string[];
        is_tenured?: boolean;
        hired_after?: Date;
        hired_before?: Date;
    }): Promise<Faculty[]>;
    /**
     * Function 9: Sort faculty results
     * GET /api/v1/faculty?sort=field&order=asc|desc
     * Status: 200 OK
     */
    sortFaculty(sortField?: string, sortOrder?: 'asc' | 'desc', filters?: any): Promise<Faculty[]>;
    /**
     * Function 10: Export faculty data
     * GET /api/v1/faculty/export?format=json|csv
     * Status: 200 OK
     */
    exportFacultyData(format?: 'json' | 'csv'): Promise<any>;
    /**
     * Function 11: Create faculty profile
     * POST /api/v1/faculty/:facultyId/profile
     * Status: 201 Created, 400 Bad Request, 409 Conflict
     */
    createFacultyProfile(data: z.infer<typeof FacultyProfileSchema>): Promise<FacultyProfile>;
    /**
     * Function 12: Update profile information
     * PATCH /api/v1/faculty/:facultyId/profile
     * Status: 200 OK, 404 Not Found
     */
    updateFacultyProfile(facultyId: string, data: Partial<z.infer<typeof FacultyProfileSchema>>): Promise<FacultyProfile>;
    /**
     * Function 13: Get profile details
     * GET /api/v1/faculty/:facultyId/profile
     * Status: 200 OK, 404 Not Found
     */
    getFacultyProfile(facultyId: string): Promise<FacultyProfile>;
    /**
     * Function 14: Upload profile photo
     * POST /api/v1/faculty/:facultyId/profile/photo
     * Status: 200 OK, 404 Not Found
     */
    uploadProfilePhoto(facultyId: string, photoUrl: string): Promise<FacultyProfile>;
    /**
     * Function 15: Manage contact information
     * PATCH /api/v1/faculty/:id/contact
     * Status: 200 OK, 404 Not Found
     */
    updateContactInformation(facultyId: string, contact: {
        email?: string;
        phone?: string;
        office_location?: string;
        preferred_contact?: string;
    }): Promise<Faculty>;
    /**
     * Function 16: Update biography
     * PATCH /api/v1/faculty/:facultyId/profile/biography
     * Status: 200 OK, 404 Not Found
     */
    updateBiography(facultyId: string, biography: string): Promise<FacultyProfile>;
    /**
     * Function 17: Set specializations
     * PUT /api/v1/faculty/:facultyId/profile/specializations
     * Status: 200 OK, 404 Not Found
     */
    setSpecializations(facultyId: string, specializations: string[]): Promise<FacultyProfile>;
    /**
     * Function 18: Manage publications
     * POST /api/v1/faculty/:facultyId/profile/publications
     * Status: 201 Created, 404 Not Found
     */
    addPublication(facultyId: string, publication: {
        title: string;
        authors: string[];
        journal: string;
        year: number;
        doi?: string;
        url?: string;
    }): Promise<FacultyProfile>;
    /**
     * Function 19: Assign course to faculty
     * POST /api/v1/faculty/:facultyId/courses
     * Status: 201 Created, 400 Bad Request, 409 Conflict
     */
    assignCourse(data: z.infer<typeof CourseAssignmentSchema>): Promise<FacultyLoad>;
    /**
     * Function 20: Remove course assignment
     * DELETE /api/v1/faculty/:facultyId/courses/:assignmentId
     * Status: 204 No Content, 404 Not Found
     */
    removeCourseAssignment(assignmentId: string): Promise<void>;
    /**
     * Function 21: List faculty courses
     * GET /api/v1/faculty/:facultyId/courses
     * Status: 200 OK
     */
    listFacultyCourses(facultyId: string, filters?: {
        academic_year?: string;
        semester?: string;
    }): Promise<FacultyLoad[]>;
    /**
     * Function 22: Get course assignment details
     * GET /api/v1/faculty/courses/:assignmentId
     * Status: 200 OK, 404 Not Found
     */
    getCourseAssignmentDetails(assignmentId: string): Promise<FacultyLoad>;
    /**
     * Function 23: Update course assignment
     * PATCH /api/v1/faculty/courses/:assignmentId
     * Status: 200 OK, 404 Not Found
     */
    updateCourseAssignment(assignmentId: string, data: Partial<z.infer<typeof CourseAssignmentSchema>>): Promise<FacultyLoad>;
    /**
     * Function 24: Assign multiple courses
     * POST /api/v1/faculty/:facultyId/courses/bulk
     * Status: 201 Created
     */
    assignMultipleCourses(facultyId: string, courses: Array<Omit<z.infer<typeof CourseAssignmentSchema>, 'faculty_id'>>): Promise<{
        created: FacultyLoad[];
        errors: Array<{
            index: number;
            error: string;
        }>;
    }>;
    /**
     * Function 25: Check assignment conflicts
     * GET /api/v1/faculty/:facultyId/courses/conflicts
     * Status: 200 OK
     */
    checkAssignmentConflicts(facultyId: string, academicYear: string, semester: string): Promise<{
        conflicts: any[];
        hasConflicts: boolean;
    }>;
    /**
     * Function 26: Course assignment history
     * GET /api/v1/faculty/:facultyId/courses/history
     * Status: 200 OK
     */
    getCourseAssignmentHistory(facultyId: string): Promise<FacultyLoad[]>;
    /**
     * Function 27: Calculate teaching load
     * GET /api/v1/faculty/:facultyId/load/calculate
     * Status: 200 OK
     */
    calculateTeachingLoad(facultyId: string, academicYear: string, semester: string): Promise<{
        faculty_id: string;
        academic_year: string;
        semester: string;
        total_credit_hours: number;
        total_courses: number;
        total_students: number;
        load_percentage: number;
        status: 'underload' | 'normal' | 'overload';
    }>;
    /**
     * Function 28: Get current load
     * GET /api/v1/faculty/:facultyId/load/current
     * Status: 200 OK
     */
    getCurrentLoad(facultyId: string): Promise<any>;
    /**
     * Function 29: Load balancing algorithm
     * POST /api/v1/faculty/load/balance
     * Status: 200 OK
     */
    balanceTeachingLoads(departmentId: string, academicYear: string, semester: string): Promise<{
        recommendations: Array<{
            faculty_id: string;
            current_load: number;
            recommended_adjustments: string[];
        }>;
    }>;
    /**
     * Function 30: Overload detection
     * GET /api/v1/faculty/load/overloads
     * Status: 200 OK
     */
    detectOverloads(departmentId: string, academicYear: string, semester: string): Promise<{
        overloaded_faculty: Array<{
            faculty: Faculty;
            load: any;
        }>;
    }>;
    /**
     * Function 31: Load comparison
     * GET /api/v1/faculty/load/compare
     * Status: 200 OK
     */
    compareTeachingLoads(facultyIds: string[], academicYear: string, semester: string): Promise<{
        comparisons: Array<{
            faculty_id: string;
            name: string;
            load: any;
        }>;
        average_load: number;
    }>;
    /**
     * Function 32: Load forecasting
     * GET /api/v1/faculty/:facultyId/load/forecast
     * Status: 200 OK
     */
    forecastTeachingLoad(facultyId: string, futureSemesters?: number): Promise<{
        forecasts: Array<{
            academic_year: string;
            semester: string;
            projected_load: number;
        }>;
    }>;
    /**
     * Function 33: Add qualification
     * POST /api/v1/faculty/:facultyId/qualifications
     * Status: 201 Created, 400 Bad Request
     */
    addQualification(data: z.infer<typeof QualificationSchema>): Promise<FacultyQualifications>;
    /**
     * Function 34: Update credentials
     * PATCH /api/v1/faculty/qualifications/:qualificationId
     * Status: 200 OK, 404 Not Found
     */
    updateQualification(qualificationId: string, data: Partial<z.infer<typeof QualificationSchema>>): Promise<FacultyQualifications>;
    /**
     * Function 35: Verify qualifications
     * POST /api/v1/faculty/qualifications/:qualificationId/verify
     * Status: 200 OK, 404 Not Found
     */
    verifyQualification(qualificationId: string): Promise<FacultyQualifications>;
    /**
     * Function 36: List credentials
     * GET /api/v1/faculty/:facultyId/qualifications
     * Status: 200 OK
     */
    listQualifications(facultyId: string, filters?: {
        qualification_type?: QualificationType;
        is_verified?: boolean;
    }): Promise<FacultyQualifications[]>;
    /**
     * Function 37: Credential expiration tracking
     * GET /api/v1/faculty/qualifications/expiring
     * Status: 200 OK
     */
    getExpiringCredentials(daysAhead?: number): Promise<{
        expiring: Array<{
            qualification: FacultyQualifications;
            faculty: Faculty;
            days_until_expiration: number;
        }>;
    }>;
    /**
     * Function 38: Set office hours
     * PUT /api/v1/faculty/:facultyId/office-hours
     * Status: 200 OK, 404 Not Found
     */
    setOfficeHours(facultyId: string, officeHours: Array<{
        day: DayOfWeek;
        start_time: string;
        end_time: string;
        location?: string;
        type?: 'in_person' | 'virtual' | 'hybrid';
    }>): Promise<FacultyProfile>;
    /**
     * Function 39: Get availability
     * GET /api/v1/faculty/:facultyId/availability
     * Status: 200 OK
     */
    getFacultyAvailability(facultyId: string, date?: Date): Promise<{
        faculty_id: string;
        office_hours: any[];
        teaching_schedule: any[];
        available_slots: any[];
    }>;
    /**
     * Function 40: Update schedule
     * PATCH /api/v1/faculty/:facultyId/schedule
     * Status: 200 OK
     */
    updateFacultySchedule(facultyId: string, schedule: any): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Function 41: Book appointment
     * POST /api/v1/faculty/:facultyId/appointments
     * Status: 201 Created
     */
    bookAppointment(facultyId: string, appointment: {
        student_id: string;
        date: Date;
        start_time: string;
        end_time: string;
        purpose: string;
        type: 'in_person' | 'virtual';
    }): Promise<{
        appointment_id: string;
        confirmation: string;
    }>;
    /**
     * Function 42: Availability conflicts
     * GET /api/v1/faculty/:facultyId/availability/conflicts
     * Status: 200 OK
     */
    checkAvailabilityConflicts(facultyId: string, startDate: Date, endDate: Date): Promise<{
        conflicts: Array<{
            date: Date;
            type: string;
            description: string;
        }>;
    }>;
    /**
     * Function 43: Create evaluation
     * POST /api/v1/faculty/:facultyId/evaluations
     * Status: 201 Created
     */
    createEvaluation(evaluation: {
        faculty_id: string;
        evaluation_type: EvaluationType;
        academic_year: string;
        semester: string;
        evaluator_id: string;
        rating: number;
        comments: string;
        strengths: string[];
        areas_for_improvement: string[];
        recommendations: string[];
    }): Promise<{
        evaluation_id: string;
        status: string;
    }>;
    /**
     * Function 44: Manage contracts
     * POST /api/v1/faculty/:facultyId/contracts
     * Status: 201 Created
     */
    createContract(contract: {
        faculty_id: string;
        contract_type: ContractType;
        start_date: Date;
        end_date: Date;
        salary: number;
        benefits: any;
        terms: string;
        signed_date?: Date;
    }): Promise<{
        contract_id: string;
        status: string;
    }>;
    /**
     * Function 45: Contract renewal
     * POST /api/v1/faculty/contracts/:contractId/renew
     * Status: 201 Created, 404 Not Found
     */
    renewContract(contractId: string, renewal: {
        new_end_date: Date;
        salary_adjustment?: number;
        updated_terms?: string;
    }): Promise<{
        new_contract_id: string;
        status: string;
    }>;
}
/**
 * API version constant
 */
export declare const API_VERSION = "v1";
/**
 * API base path
 */
export declare const API_BASE_PATH = "/api/v1";
/**
 * Export all models for external use
 */
export declare const FacultyModels: {
    Faculty: typeof Faculty;
    FacultyProfile: typeof FacultyProfile;
    FacultyLoad: typeof FacultyLoad;
    FacultyQualifications: typeof FacultyQualifications;
};
/**
 * Export all schemas for validation
 */
export declare const FacultySchemas: {
    CreateFacultySchema: any;
    UpdateFacultySchema: any;
    FacultyProfileSchema: any;
    CourseAssignmentSchema: any;
    QualificationSchema: any;
};
/**
 * Export all enums
 */
export declare const FacultyEnums: {
    FacultyStatus: typeof FacultyStatus;
    FacultyRank: typeof FacultyRank;
    EmploymentType: typeof EmploymentType;
    ContractType: typeof ContractType;
    EvaluationType: typeof EvaluationType;
    QualificationType: typeof QualificationType;
    DayOfWeek: typeof DayOfWeek;
};
/**
 * Type exports for TypeScript consumers
 */
export type CreateFacultyDto = z.infer<typeof CreateFacultySchema>;
export type UpdateFacultyDto = z.infer<typeof UpdateFacultySchema>;
export type FacultyProfileDto = z.infer<typeof FacultyProfileSchema>;
export type CourseAssignmentDto = z.infer<typeof CourseAssignmentSchema>;
export type QualificationDto = z.infer<typeof QualificationSchema>;
//# sourceMappingURL=faculty-management-kit.d.ts.map