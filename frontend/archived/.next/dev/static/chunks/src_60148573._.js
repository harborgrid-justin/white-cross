(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/validations/student.schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Student Validation Schemas
 * Zod schemas for type-safe validation of student data
 *
 * @module lib/validations/student.schema
 */ __turbopack_context__.s([
    "BulkUpdateStudentsSchema",
    ()=>BulkUpdateStudentsSchema,
    "CreateStudentSchema",
    ()=>CreateStudentSchema,
    "DeactivateStudentSchema",
    ()=>DeactivateStudentSchema,
    "StudentFiltersSchema",
    ()=>StudentFiltersSchema,
    "StudentFormSchema",
    ()=>StudentFormSchema,
    "TransferStudentSchema",
    ()=>TransferStudentSchema,
    "UpdateStudentSchema",
    ()=>UpdateStudentSchema,
    "validateCreateStudent",
    ()=>validateCreateStudent,
    "validateStudentFilters",
    ()=>validateStudentFilters,
    "validateUpdateStudent",
    ()=>validateUpdateStudent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
;
/**
 * Gender enum schema
 */ const GenderSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    'MALE',
    'FEMALE',
    'OTHER',
    'PREFER_NOT_TO_SAY'
]);
/**
 * Student number validation
 * Format: alphanumeric with hyphens, 3-50 characters
 */ const studentNumberSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(3, 'Student number must be at least 3 characters').max(50, 'Student number must not exceed 50 characters').regex(/^[A-Z0-9-]+$/i, 'Student number can only contain letters, numbers, and hyphens');
/**
 * Name validation
 * Letters, spaces, hyphens, apostrophes only
 */ const nameSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters').regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");
/**
 * Grade validation
 * Supports: K, 1-12
 */ const gradeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^(K|[1-9]|1[0-2])$/, 'Grade must be K or 1-12');
/**
 * Date of birth validation
 * Must be a past date
 */ const dateOfBirthSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date()).refine((val)=>{
    const date = typeof val === 'string' ? new Date(val) : val;
    return date < new Date();
}, 'Date of birth must be in the past').refine((val)=>{
    const date = typeof val === 'string' ? new Date(val) : val;
    const year = date.getFullYear();
    return year > 1900 && year <= new Date().getFullYear();
}, 'Date of birth must be between 1900 and current year');
/**
 * Medical record number validation
 * Optional, alphanumeric with hyphens
 */ const medicalRecordNumberSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^[A-Z0-9-]+$/i, 'Medical record number can only contain letters, numbers, and hyphens').min(3, 'Medical record number must be at least 3 characters').max(50, 'Medical record number must not exceed 50 characters').optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(''));
/**
 * UUID validation
 */ const uuidSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid('Invalid UUID format');
/**
 * Photo URL validation
 */ const photoUrlSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url('Invalid photo URL').optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(''));
const CreateStudentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    studentNumber: studentNumberSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    dateOfBirth: dateOfBirthSchema,
    grade: gradeSchema,
    gender: GenderSchema,
    photo: photoUrlSchema,
    medicalRecordNum: medicalRecordNumberSchema,
    nurseId: uuidSchema.optional(),
    enrollmentDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date()).optional(),
    createdBy: uuidSchema.optional()
});
const UpdateStudentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    studentNumber: studentNumberSchema.optional(),
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    dateOfBirth: dateOfBirthSchema.optional(),
    grade: gradeSchema.optional(),
    gender: GenderSchema.optional(),
    photo: photoUrlSchema,
    medicalRecordNum: medicalRecordNumberSchema,
    nurseId: uuidSchema.optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].null()),
    isActive: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    enrollmentDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date()).optional(),
    updatedBy: uuidSchema.optional()
}).refine(_c = (data)=>Object.keys(data).length > 0, 'At least one field must be provided for update');
_c1 = UpdateStudentSchema;
const StudentFiltersSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    search: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    grade: gradeSchema.optional(),
    isActive: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    includeInactive: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    nurseId: uuidSchema.optional(),
    hasAllergies: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    hasMedications: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    gender: GenderSchema.optional(),
    page: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().optional().default(1),
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().max(100).optional().default(20)
});
const TransferStudentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    nurseId: uuidSchema
});
const DeactivateStudentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    reason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(5, 'Deactivation reason must be at least 5 characters').max(500, 'Deactivation reason must not exceed 500 characters')
});
const StudentFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    studentNumber: studentNumberSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    dateOfBirth: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().refine((val)=>{
        const date = new Date(val);
        return !isNaN(date.getTime()) && date < new Date();
    }, 'Please enter a valid past date'),
    grade: gradeSchema,
    gender: GenderSchema,
    photo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('')),
    medicalRecordNum: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('')),
    nurseId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('')),
    enrollmentDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const BulkUpdateStudentsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    studentIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(uuidSchema).min(1, 'At least one student ID is required'),
    updateData: UpdateStudentSchema.omit({
        updatedBy: true
    })
});
function validateCreateStudent(data) {
    return CreateStudentSchema.safeParse(data);
}
function validateUpdateStudent(data) {
    return UpdateStudentSchema.safeParse(data);
}
function validateStudentFilters(data) {
    return StudentFiltersSchema.safeParse(data);
}
var _c, _c1;
__turbopack_context__.k.register(_c, "UpdateStudentSchema$z.object({\r\n  studentNumber: studentNumberSchema.optional(),\r\n  firstName: nameSchema.optional(),\r\n  lastName: nameSchema.optional(),\r\n  dateOfBirth: dateOfBirthSchema.optional(),\r\n  grade: gradeSchema.optional(),\r\n  gender: GenderSchema.optional(),\r\n  photo: photoUrlSchema,\r\n  medicalRecordNum: medicalRecordNumberSchema,\r\n  nurseId: uuidSchema.optional().or(z.null()),\r\n  isActive: z.boolean().optional(),\r\n  enrollmentDate: z.string().or(z.date()).optional(),\r\n  updatedBy: uuidSchema.optional()\r\n}).refine");
__turbopack_context__.k.register(_c1, "UpdateStudentSchema");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/actions/students.actions.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Student Management Server Actions - Next.js v14+ Compatible
 * @module app/students/actions
 *
 * HIPAA-compliant server actions for student data management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive in submodules
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all PHI operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 *
 * This module serves as the main entry point and re-exports all student-related
 * operations from specialized submodules for better code organization.
 *
 * Note: This file does NOT have 'use server' directive to allow re-exports.
 * Each submodule has its own 'use server' directive.
 */ // ==========================================
// TYPE EXPORTS
// ==========================================
__turbopack_context__.s([]);
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/actions/data:96eb7c [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4046c4eae0498c9eb595c7b1b074d6c86b665f309a":"createStudent"},"src/lib/actions/students.crud.ts",""] */ __turbopack_context__.s([
    "createStudent",
    ()=>createStudent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var createStudent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4046c4eae0498c9eb595c7b1b074d6c86b665f309a", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createStudent"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vc3R1ZGVudHMuY3J1ZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGZpbGVvdmVydmlldyBTdHVkZW50IENSVUQgT3BlcmF0aW9ucyAtIENyZWF0ZSwgUmVhZCwgVXBkYXRlLCBEZWxldGVcclxuICogQG1vZHVsZSBsaWIvYWN0aW9ucy9zdHVkZW50cy5jcnVkXHJcbiAqXHJcbiAqIEhJUEFBLWNvbXBsaWFudCBDUlVEIG9wZXJhdGlvbnMgZm9yIHN0dWRlbnQgZGF0YSBtYW5hZ2VtZW50LlxyXG4gKlxyXG4gKiBGZWF0dXJlczpcclxuICogLSBDcmVhdGUsIHVwZGF0ZSwgZGVsZXRlIG9wZXJhdGlvbnNcclxuICogLSBISVBBQSBhdWRpdCBsb2dnaW5nIGZvciBhbGwgUEhJIG9wZXJhdGlvbnNcclxuICogLSBDYWNoZSBpbnZhbGlkYXRpb24gd2l0aCByZXZhbGlkYXRlVGFnL3JldmFsaWRhdGVQYXRoXHJcbiAqIC0gQ29tcHJlaGVuc2l2ZSBlcnJvciBoYW5kbGluZyBhbmQgdmFsaWRhdGlvblxyXG4gKi9cclxuXHJcbid1c2Ugc2VydmVyJztcclxuXHJcbmltcG9ydCB7IHJldmFsaWRhdGVUYWcsIHJldmFsaWRhdGVQYXRoIH0gZnJvbSAnbmV4dC9jYWNoZSc7XHJcbmltcG9ydCB7IHNlcnZlclBvc3QsIHNlcnZlclB1dCwgc2VydmVyRGVsZXRlLCBOZXh0QXBpQ2xpZW50RXJyb3IgfSBmcm9tICdAL2xpYi9hcGkvbmV4dGpzLWNsaWVudCc7XHJcbmltcG9ydCB7IEFQSV9FTkRQT0lOVFMgfSBmcm9tICdAL2NvbnN0YW50cy9hcGknO1xyXG5pbXBvcnQgeyBhdWRpdExvZywgQVVESVRfQUNUSU9OUyB9IGZyb20gJ0AvbGliL2F1ZGl0JztcclxuaW1wb3J0IHsgQ0FDSEVfVEFHUyB9IGZyb20gJ0AvbGliL2NhY2hlL2NvbnN0YW50cyc7XHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgdHlwZSB7XHJcbiAgU3R1ZGVudCxcclxuICBDcmVhdGVTdHVkZW50RGF0YSxcclxuICBVcGRhdGVTdHVkZW50RGF0YSxcclxufSBmcm9tICdAL3R5cGVzL2RvbWFpbi9zdHVkZW50LnR5cGVzJztcclxuaW1wb3J0IHR5cGUgeyBBcGlSZXNwb25zZSB9IGZyb20gJ0AvdHlwZXMnO1xyXG5pbXBvcnQgdHlwZSB7IEFjdGlvblJlc3VsdCB9IGZyb20gJy4vc3R1ZGVudHMudHlwZXMnO1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IHsgZm9ybWF0TmFtZSB9IGZyb20gJ0AvdXRpbHMvZm9ybWF0dGVycyc7XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gQ1JFQVRFIE9QRVJBVElPTlNcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbmV3IHN0dWRlbnRcclxuICogSW5jbHVkZXMgSElQQUEgYXVkaXQgbG9nZ2luZyBhbmQgY2FjaGUgaW52YWxpZGF0aW9uXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU3R1ZGVudChkYXRhOiBDcmVhdGVTdHVkZW50RGF0YSk6IFByb21pc2U8QWN0aW9uUmVzdWx0PFN0dWRlbnQ+PiB7XHJcbiAgdHJ5IHtcclxuICAgIC8vIFZhbGlkYXRlIHJlcXVpcmVkIGZpZWxkc1xyXG4gICAgaWYgKCFkYXRhLmZpcnN0TmFtZSB8fCAhZGF0YS5sYXN0TmFtZSB8fCAhZGF0YS5kYXRlT2ZCaXJ0aCB8fCAhZGF0YS5ncmFkZSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgIGVycm9yOiAnTWlzc2luZyByZXF1aXJlZCBmaWVsZHM6IGZpcnN0TmFtZSwgbGFzdE5hbWUsIGRhdGVPZkJpcnRoLCBncmFkZSdcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZlclBvc3Q8QXBpUmVzcG9uc2U8U3R1ZGVudD4+KFxyXG4gICAgICBBUElfRU5EUE9JTlRTLlNUVURFTlRTLkJBU0UsXHJcbiAgICAgIGRhdGEsXHJcbiAgICAgIHtcclxuICAgICAgICBjYWNoZTogJ25vLXN0b3JlJyxcclxuICAgICAgICBuZXh0OiB7IHRhZ3M6IFtDQUNIRV9UQUdTLlNUVURFTlRTLCBDQUNIRV9UQUdTLlBISV0gfVxyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIGlmICghcmVzcG9uc2Uuc3VjY2VzcyB8fCAhcmVzcG9uc2UuZGF0YSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2UubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGNyZWF0ZSBzdHVkZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSElQQUEgQVVESVQgTE9HIC0gTWFuZGF0b3J5IGZvciBQSEkgY3JlYXRpb25cclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLkNSRUFURV9TVFVERU5ULFxyXG4gICAgICByZXNvdXJjZTogJ1N0dWRlbnQnLFxyXG4gICAgICByZXNvdXJjZUlkOiByZXNwb25zZS5kYXRhLmlkLFxyXG4gICAgICBkZXRhaWxzOiBgQ3JlYXRlZCBzdHVkZW50IHJlY29yZCBmb3IgJHtmb3JtYXROYW1lKGRhdGEuZmlyc3ROYW1lLCBkYXRhLmxhc3ROYW1lKX1gLFxyXG4gICAgICBzdWNjZXNzOiB0cnVlXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDYWNoZSBpbnZhbGlkYXRpb25cclxuICAgIHJldmFsaWRhdGVUYWcoQ0FDSEVfVEFHUy5TVFVERU5UUywgJ2RlZmF1bHQnKTtcclxuICAgIHJldmFsaWRhdGVUYWcoJ3N0dWRlbnQtbGlzdCcsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlUGF0aCgnL2Rhc2hib2FyZC9zdHVkZW50cycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIGRhdGE6IHJlc3BvbnNlLmRhdGEsXHJcbiAgICAgIG1lc3NhZ2U6ICdTdHVkZW50IGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5J1xyXG4gICAgfTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBOZXh0QXBpQ2xpZW50RXJyb3JcclxuICAgICAgPyBlcnJvci5tZXNzYWdlXHJcbiAgICAgIDogZXJyb3IgaW5zdGFuY2VvZiBFcnJvclxyXG4gICAgICA/IGVycm9yLm1lc3NhZ2VcclxuICAgICAgOiAnRmFpbGVkIHRvIGNyZWF0ZSBzdHVkZW50JztcclxuXHJcbiAgICAvLyBISVBBQSBBVURJVCBMT0cgLSBMb2cgZmFpbGVkIGF0dGVtcHRcclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLkNSRUFURV9TVFVERU5ULFxyXG4gICAgICByZXNvdXJjZTogJ1N0dWRlbnQnLFxyXG4gICAgICBkZXRhaWxzOiBgRmFpbGVkIHRvIGNyZWF0ZSBzdHVkZW50IHJlY29yZDogJHtlcnJvck1lc3NhZ2V9YCxcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yTWVzc2FnZVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yOiBlcnJvck1lc3NhZ2VcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gVVBEQVRFIE9QRVJBVElPTlNcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogVXBkYXRlIHN0dWRlbnQgaW5mb3JtYXRpb25cclxuICogSW5jbHVkZXMgSElQQUEgYXVkaXQgbG9nZ2luZyBhbmQgY2FjaGUgaW52YWxpZGF0aW9uXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3R1ZGVudChcclxuICBzdHVkZW50SWQ6IHN0cmluZyxcclxuICBkYXRhOiBVcGRhdGVTdHVkZW50RGF0YVxyXG4pOiBQcm9taXNlPEFjdGlvblJlc3VsdDxTdHVkZW50Pj4ge1xyXG4gIHRyeSB7XHJcbiAgICBpZiAoIXN0dWRlbnRJZCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgIGVycm9yOiAnU3R1ZGVudCBJRCBpcyByZXF1aXJlZCdcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZlclB1dDxBcGlSZXNwb25zZTxTdHVkZW50Pj4oXHJcbiAgICAgIEFQSV9FTkRQT0lOVFMuU1RVREVOVFMuQllfSUQoc3R1ZGVudElkKSxcclxuICAgICAgZGF0YSxcclxuICAgICAge1xyXG4gICAgICAgIGNhY2hlOiAnbm8tc3RvcmUnLFxyXG4gICAgICAgIG5leHQ6IHsgdGFnczogW0NBQ0hFX1RBR1MuU1RVREVOVFMsIGBzdHVkZW50LSR7c3R1ZGVudElkfWAsIENBQ0hFX1RBR1MuUEhJXSB9XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzIHx8ICFyZXNwb25zZS5kYXRhKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5tZXNzYWdlIHx8ICdGYWlsZWQgdG8gdXBkYXRlIHN0dWRlbnQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBISVBBQSBBVURJVCBMT0cgLSBNYW5kYXRvcnkgZm9yIFBISSBtb2RpZmljYXRpb25cclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLlVQREFURV9TVFVERU5ULFxyXG4gICAgICByZXNvdXJjZTogJ1N0dWRlbnQnLFxyXG4gICAgICByZXNvdXJjZUlkOiBzdHVkZW50SWQsXHJcbiAgICAgIGRldGFpbHM6IGBVcGRhdGVkIHN0dWRlbnQgcmVjb3JkYCxcclxuICAgICAgY2hhbmdlczogZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcclxuICAgICAgc3VjY2VzczogdHJ1ZVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQ2FjaGUgaW52YWxpZGF0aW9uXHJcbiAgICByZXZhbGlkYXRlVGFnKENBQ0hFX1RBR1MuU1RVREVOVFMsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlVGFnKGBzdHVkZW50LSR7c3R1ZGVudElkfWAsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlVGFnKCdzdHVkZW50LWxpc3QnLCAnZGVmYXVsdCcpO1xyXG4gICAgcmV2YWxpZGF0ZVBhdGgoJy9kYXNoYm9hcmQvc3R1ZGVudHMnKTtcclxuICAgIHJldmFsaWRhdGVQYXRoKGAvZGFzaGJvYXJkL3N0dWRlbnRzLyR7c3R1ZGVudElkfWAgYXMgYW55KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICBkYXRhOiByZXNwb25zZS5kYXRhLFxyXG4gICAgICBtZXNzYWdlOiAnU3R1ZGVudCB1cGRhdGVkIHN1Y2Nlc3NmdWxseSdcclxuICAgIH07XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGVycm9yIGluc3RhbmNlb2YgTmV4dEFwaUNsaWVudEVycm9yXHJcbiAgICAgID8gZXJyb3IubWVzc2FnZVxyXG4gICAgICA6IGVycm9yIGluc3RhbmNlb2YgRXJyb3JcclxuICAgICAgPyBlcnJvci5tZXNzYWdlXHJcbiAgICAgIDogJ0ZhaWxlZCB0byB1cGRhdGUgc3R1ZGVudCc7XHJcblxyXG4gICAgLy8gSElQQUEgQVVESVQgTE9HIC0gTG9nIGZhaWxlZCBhdHRlbXB0XHJcbiAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5VUERBVEVfU1RVREVOVCxcclxuICAgICAgcmVzb3VyY2U6ICdTdHVkZW50JyxcclxuICAgICAgcmVzb3VyY2VJZDogc3R1ZGVudElkLFxyXG4gICAgICBkZXRhaWxzOiBgRmFpbGVkIHRvIHVwZGF0ZSBzdHVkZW50IHJlY29yZDogJHtlcnJvck1lc3NhZ2V9YCxcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yTWVzc2FnZVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yOiBlcnJvck1lc3NhZ2VcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gREVMRVRFIE9QRVJBVElPTlNcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogRGVsZXRlIHN0dWRlbnQgKHNvZnQgZGVsZXRlKVxyXG4gKiBJbmNsdWRlcyBISVBBQSBhdWRpdCBsb2dnaW5nIGFuZCBjYWNoZSBpbnZhbGlkYXRpb25cclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVTdHVkZW50KHN0dWRlbnRJZDogc3RyaW5nKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ8dm9pZD4+IHtcclxuICB0cnkge1xyXG4gICAgaWYgKCFzdHVkZW50SWQpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICBlcnJvcjogJ1N0dWRlbnQgSUQgaXMgcmVxdWlyZWQnXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgc2VydmVyRGVsZXRlPEFwaVJlc3BvbnNlPHZvaWQ+PihcclxuICAgICAgQVBJX0VORFBPSU5UUy5TVFVERU5UUy5CWV9JRChzdHVkZW50SWQpLFxyXG4gICAgICB7XHJcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXHJcbiAgICAgICAgbmV4dDogeyB0YWdzOiBbQ0FDSEVfVEFHUy5TVFVERU5UUywgYHN0dWRlbnQtJHtzdHVkZW50SWR9YCwgQ0FDSEVfVEFHUy5QSEldIH1cclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBISVBBQSBBVURJVCBMT0cgLSBNYW5kYXRvcnkgZm9yIFBISSBkZWxldGlvblxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuREVMRVRFX1NUVURFTlQsXHJcbiAgICAgIHJlc291cmNlOiAnU3R1ZGVudCcsXHJcbiAgICAgIHJlc291cmNlSWQ6IHN0dWRlbnRJZCxcclxuICAgICAgZGV0YWlsczogYERlbGV0ZWQgc3R1ZGVudCByZWNvcmQgKHNvZnQgZGVsZXRlKWAsXHJcbiAgICAgIHN1Y2Nlc3M6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENhY2hlIGludmFsaWRhdGlvblxyXG4gICAgcmV2YWxpZGF0ZVRhZyhDQUNIRV9UQUdTLlNUVURFTlRTLCAnZGVmYXVsdCcpO1xyXG4gICAgcmV2YWxpZGF0ZVRhZyhgc3R1ZGVudC0ke3N0dWRlbnRJZH1gLCAnZGVmYXVsdCcpO1xyXG4gICAgcmV2YWxpZGF0ZVRhZygnc3R1ZGVudC1saXN0JywgJ2RlZmF1bHQnKTtcclxuICAgIHJldmFsaWRhdGVQYXRoKCcvZGFzaGJvYXJkL3N0dWRlbnRzJyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgbWVzc2FnZTogJ1N0dWRlbnQgZGVsZXRlZCBzdWNjZXNzZnVsbHknXHJcbiAgICB9O1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIE5leHRBcGlDbGllbnRFcnJvclxyXG4gICAgICA/IGVycm9yLm1lc3NhZ2VcclxuICAgICAgOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yXHJcbiAgICAgID8gZXJyb3IubWVzc2FnZVxyXG4gICAgICA6ICdGYWlsZWQgdG8gZGVsZXRlIHN0dWRlbnQnO1xyXG5cclxuICAgIC8vIEhJUEFBIEFVRElUIExPRyAtIExvZyBmYWlsZWQgYXR0ZW1wdFxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuREVMRVRFX1NUVURFTlQsXHJcbiAgICAgIHJlc291cmNlOiAnU3R1ZGVudCcsXHJcbiAgICAgIHJlc291cmNlSWQ6IHN0dWRlbnRJZCxcclxuICAgICAgZGV0YWlsczogYEZhaWxlZCB0byBkZWxldGUgc3R1ZGVudCByZWNvcmQ6ICR7ZXJyb3JNZXNzYWdlfWAsXHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvck1lc3NhZ2VcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvcjogZXJyb3JNZXNzYWdlXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InVTQXlDc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/actions/data:a5ed0d [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60bc6a098439532302e1e557eb696b9ff56552956a":"updateStudent"},"src/lib/actions/students.crud.ts",""] */ __turbopack_context__.s([
    "updateStudent",
    ()=>updateStudent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var updateStudent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60bc6a098439532302e1e557eb696b9ff56552956a", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "updateStudent"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vc3R1ZGVudHMuY3J1ZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGZpbGVvdmVydmlldyBTdHVkZW50IENSVUQgT3BlcmF0aW9ucyAtIENyZWF0ZSwgUmVhZCwgVXBkYXRlLCBEZWxldGVcclxuICogQG1vZHVsZSBsaWIvYWN0aW9ucy9zdHVkZW50cy5jcnVkXHJcbiAqXHJcbiAqIEhJUEFBLWNvbXBsaWFudCBDUlVEIG9wZXJhdGlvbnMgZm9yIHN0dWRlbnQgZGF0YSBtYW5hZ2VtZW50LlxyXG4gKlxyXG4gKiBGZWF0dXJlczpcclxuICogLSBDcmVhdGUsIHVwZGF0ZSwgZGVsZXRlIG9wZXJhdGlvbnNcclxuICogLSBISVBBQSBhdWRpdCBsb2dnaW5nIGZvciBhbGwgUEhJIG9wZXJhdGlvbnNcclxuICogLSBDYWNoZSBpbnZhbGlkYXRpb24gd2l0aCByZXZhbGlkYXRlVGFnL3JldmFsaWRhdGVQYXRoXHJcbiAqIC0gQ29tcHJlaGVuc2l2ZSBlcnJvciBoYW5kbGluZyBhbmQgdmFsaWRhdGlvblxyXG4gKi9cclxuXHJcbid1c2Ugc2VydmVyJztcclxuXHJcbmltcG9ydCB7IHJldmFsaWRhdGVUYWcsIHJldmFsaWRhdGVQYXRoIH0gZnJvbSAnbmV4dC9jYWNoZSc7XHJcbmltcG9ydCB7IHNlcnZlclBvc3QsIHNlcnZlclB1dCwgc2VydmVyRGVsZXRlLCBOZXh0QXBpQ2xpZW50RXJyb3IgfSBmcm9tICdAL2xpYi9hcGkvbmV4dGpzLWNsaWVudCc7XHJcbmltcG9ydCB7IEFQSV9FTkRQT0lOVFMgfSBmcm9tICdAL2NvbnN0YW50cy9hcGknO1xyXG5pbXBvcnQgeyBhdWRpdExvZywgQVVESVRfQUNUSU9OUyB9IGZyb20gJ0AvbGliL2F1ZGl0JztcclxuaW1wb3J0IHsgQ0FDSEVfVEFHUyB9IGZyb20gJ0AvbGliL2NhY2hlL2NvbnN0YW50cyc7XHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgdHlwZSB7XHJcbiAgU3R1ZGVudCxcclxuICBDcmVhdGVTdHVkZW50RGF0YSxcclxuICBVcGRhdGVTdHVkZW50RGF0YSxcclxufSBmcm9tICdAL3R5cGVzL2RvbWFpbi9zdHVkZW50LnR5cGVzJztcclxuaW1wb3J0IHR5cGUgeyBBcGlSZXNwb25zZSB9IGZyb20gJ0AvdHlwZXMnO1xyXG5pbXBvcnQgdHlwZSB7IEFjdGlvblJlc3VsdCB9IGZyb20gJy4vc3R1ZGVudHMudHlwZXMnO1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IHsgZm9ybWF0TmFtZSB9IGZyb20gJ0AvdXRpbHMvZm9ybWF0dGVycyc7XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gQ1JFQVRFIE9QRVJBVElPTlNcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbmV3IHN0dWRlbnRcclxuICogSW5jbHVkZXMgSElQQUEgYXVkaXQgbG9nZ2luZyBhbmQgY2FjaGUgaW52YWxpZGF0aW9uXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU3R1ZGVudChkYXRhOiBDcmVhdGVTdHVkZW50RGF0YSk6IFByb21pc2U8QWN0aW9uUmVzdWx0PFN0dWRlbnQ+PiB7XHJcbiAgdHJ5IHtcclxuICAgIC8vIFZhbGlkYXRlIHJlcXVpcmVkIGZpZWxkc1xyXG4gICAgaWYgKCFkYXRhLmZpcnN0TmFtZSB8fCAhZGF0YS5sYXN0TmFtZSB8fCAhZGF0YS5kYXRlT2ZCaXJ0aCB8fCAhZGF0YS5ncmFkZSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgIGVycm9yOiAnTWlzc2luZyByZXF1aXJlZCBmaWVsZHM6IGZpcnN0TmFtZSwgbGFzdE5hbWUsIGRhdGVPZkJpcnRoLCBncmFkZSdcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZlclBvc3Q8QXBpUmVzcG9uc2U8U3R1ZGVudD4+KFxyXG4gICAgICBBUElfRU5EUE9JTlRTLlNUVURFTlRTLkJBU0UsXHJcbiAgICAgIGRhdGEsXHJcbiAgICAgIHtcclxuICAgICAgICBjYWNoZTogJ25vLXN0b3JlJyxcclxuICAgICAgICBuZXh0OiB7IHRhZ3M6IFtDQUNIRV9UQUdTLlNUVURFTlRTLCBDQUNIRV9UQUdTLlBISV0gfVxyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIGlmICghcmVzcG9uc2Uuc3VjY2VzcyB8fCAhcmVzcG9uc2UuZGF0YSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2UubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGNyZWF0ZSBzdHVkZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSElQQUEgQVVESVQgTE9HIC0gTWFuZGF0b3J5IGZvciBQSEkgY3JlYXRpb25cclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLkNSRUFURV9TVFVERU5ULFxyXG4gICAgICByZXNvdXJjZTogJ1N0dWRlbnQnLFxyXG4gICAgICByZXNvdXJjZUlkOiByZXNwb25zZS5kYXRhLmlkLFxyXG4gICAgICBkZXRhaWxzOiBgQ3JlYXRlZCBzdHVkZW50IHJlY29yZCBmb3IgJHtmb3JtYXROYW1lKGRhdGEuZmlyc3ROYW1lLCBkYXRhLmxhc3ROYW1lKX1gLFxyXG4gICAgICBzdWNjZXNzOiB0cnVlXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDYWNoZSBpbnZhbGlkYXRpb25cclxuICAgIHJldmFsaWRhdGVUYWcoQ0FDSEVfVEFHUy5TVFVERU5UUywgJ2RlZmF1bHQnKTtcclxuICAgIHJldmFsaWRhdGVUYWcoJ3N0dWRlbnQtbGlzdCcsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlUGF0aCgnL2Rhc2hib2FyZC9zdHVkZW50cycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIGRhdGE6IHJlc3BvbnNlLmRhdGEsXHJcbiAgICAgIG1lc3NhZ2U6ICdTdHVkZW50IGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5J1xyXG4gICAgfTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBOZXh0QXBpQ2xpZW50RXJyb3JcclxuICAgICAgPyBlcnJvci5tZXNzYWdlXHJcbiAgICAgIDogZXJyb3IgaW5zdGFuY2VvZiBFcnJvclxyXG4gICAgICA/IGVycm9yLm1lc3NhZ2VcclxuICAgICAgOiAnRmFpbGVkIHRvIGNyZWF0ZSBzdHVkZW50JztcclxuXHJcbiAgICAvLyBISVBBQSBBVURJVCBMT0cgLSBMb2cgZmFpbGVkIGF0dGVtcHRcclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLkNSRUFURV9TVFVERU5ULFxyXG4gICAgICByZXNvdXJjZTogJ1N0dWRlbnQnLFxyXG4gICAgICBkZXRhaWxzOiBgRmFpbGVkIHRvIGNyZWF0ZSBzdHVkZW50IHJlY29yZDogJHtlcnJvck1lc3NhZ2V9YCxcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yTWVzc2FnZVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yOiBlcnJvck1lc3NhZ2VcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gVVBEQVRFIE9QRVJBVElPTlNcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogVXBkYXRlIHN0dWRlbnQgaW5mb3JtYXRpb25cclxuICogSW5jbHVkZXMgSElQQUEgYXVkaXQgbG9nZ2luZyBhbmQgY2FjaGUgaW52YWxpZGF0aW9uXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3R1ZGVudChcclxuICBzdHVkZW50SWQ6IHN0cmluZyxcclxuICBkYXRhOiBVcGRhdGVTdHVkZW50RGF0YVxyXG4pOiBQcm9taXNlPEFjdGlvblJlc3VsdDxTdHVkZW50Pj4ge1xyXG4gIHRyeSB7XHJcbiAgICBpZiAoIXN0dWRlbnRJZCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgIGVycm9yOiAnU3R1ZGVudCBJRCBpcyByZXF1aXJlZCdcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZlclB1dDxBcGlSZXNwb25zZTxTdHVkZW50Pj4oXHJcbiAgICAgIEFQSV9FTkRQT0lOVFMuU1RVREVOVFMuQllfSUQoc3R1ZGVudElkKSxcclxuICAgICAgZGF0YSxcclxuICAgICAge1xyXG4gICAgICAgIGNhY2hlOiAnbm8tc3RvcmUnLFxyXG4gICAgICAgIG5leHQ6IHsgdGFnczogW0NBQ0hFX1RBR1MuU1RVREVOVFMsIGBzdHVkZW50LSR7c3R1ZGVudElkfWAsIENBQ0hFX1RBR1MuUEhJXSB9XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzIHx8ICFyZXNwb25zZS5kYXRhKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5tZXNzYWdlIHx8ICdGYWlsZWQgdG8gdXBkYXRlIHN0dWRlbnQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBISVBBQSBBVURJVCBMT0cgLSBNYW5kYXRvcnkgZm9yIFBISSBtb2RpZmljYXRpb25cclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLlVQREFURV9TVFVERU5ULFxyXG4gICAgICByZXNvdXJjZTogJ1N0dWRlbnQnLFxyXG4gICAgICByZXNvdXJjZUlkOiBzdHVkZW50SWQsXHJcbiAgICAgIGRldGFpbHM6IGBVcGRhdGVkIHN0dWRlbnQgcmVjb3JkYCxcclxuICAgICAgY2hhbmdlczogZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcclxuICAgICAgc3VjY2VzczogdHJ1ZVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQ2FjaGUgaW52YWxpZGF0aW9uXHJcbiAgICByZXZhbGlkYXRlVGFnKENBQ0hFX1RBR1MuU1RVREVOVFMsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlVGFnKGBzdHVkZW50LSR7c3R1ZGVudElkfWAsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlVGFnKCdzdHVkZW50LWxpc3QnLCAnZGVmYXVsdCcpO1xyXG4gICAgcmV2YWxpZGF0ZVBhdGgoJy9kYXNoYm9hcmQvc3R1ZGVudHMnKTtcclxuICAgIHJldmFsaWRhdGVQYXRoKGAvZGFzaGJvYXJkL3N0dWRlbnRzLyR7c3R1ZGVudElkfWAgYXMgYW55KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICBkYXRhOiByZXNwb25zZS5kYXRhLFxyXG4gICAgICBtZXNzYWdlOiAnU3R1ZGVudCB1cGRhdGVkIHN1Y2Nlc3NmdWxseSdcclxuICAgIH07XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGVycm9yIGluc3RhbmNlb2YgTmV4dEFwaUNsaWVudEVycm9yXHJcbiAgICAgID8gZXJyb3IubWVzc2FnZVxyXG4gICAgICA6IGVycm9yIGluc3RhbmNlb2YgRXJyb3JcclxuICAgICAgPyBlcnJvci5tZXNzYWdlXHJcbiAgICAgIDogJ0ZhaWxlZCB0byB1cGRhdGUgc3R1ZGVudCc7XHJcblxyXG4gICAgLy8gSElQQUEgQVVESVQgTE9HIC0gTG9nIGZhaWxlZCBhdHRlbXB0XHJcbiAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5VUERBVEVfU1RVREVOVCxcclxuICAgICAgcmVzb3VyY2U6ICdTdHVkZW50JyxcclxuICAgICAgcmVzb3VyY2VJZDogc3R1ZGVudElkLFxyXG4gICAgICBkZXRhaWxzOiBgRmFpbGVkIHRvIHVwZGF0ZSBzdHVkZW50IHJlY29yZDogJHtlcnJvck1lc3NhZ2V9YCxcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yTWVzc2FnZVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yOiBlcnJvck1lc3NhZ2VcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gREVMRVRFIE9QRVJBVElPTlNcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogRGVsZXRlIHN0dWRlbnQgKHNvZnQgZGVsZXRlKVxyXG4gKiBJbmNsdWRlcyBISVBBQSBhdWRpdCBsb2dnaW5nIGFuZCBjYWNoZSBpbnZhbGlkYXRpb25cclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVTdHVkZW50KHN0dWRlbnRJZDogc3RyaW5nKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ8dm9pZD4+IHtcclxuICB0cnkge1xyXG4gICAgaWYgKCFzdHVkZW50SWQpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICBlcnJvcjogJ1N0dWRlbnQgSUQgaXMgcmVxdWlyZWQnXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgc2VydmVyRGVsZXRlPEFwaVJlc3BvbnNlPHZvaWQ+PihcclxuICAgICAgQVBJX0VORFBPSU5UUy5TVFVERU5UUy5CWV9JRChzdHVkZW50SWQpLFxyXG4gICAgICB7XHJcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXHJcbiAgICAgICAgbmV4dDogeyB0YWdzOiBbQ0FDSEVfVEFHUy5TVFVERU5UUywgYHN0dWRlbnQtJHtzdHVkZW50SWR9YCwgQ0FDSEVfVEFHUy5QSEldIH1cclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBISVBBQSBBVURJVCBMT0cgLSBNYW5kYXRvcnkgZm9yIFBISSBkZWxldGlvblxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuREVMRVRFX1NUVURFTlQsXHJcbiAgICAgIHJlc291cmNlOiAnU3R1ZGVudCcsXHJcbiAgICAgIHJlc291cmNlSWQ6IHN0dWRlbnRJZCxcclxuICAgICAgZGV0YWlsczogYERlbGV0ZWQgc3R1ZGVudCByZWNvcmQgKHNvZnQgZGVsZXRlKWAsXHJcbiAgICAgIHN1Y2Nlc3M6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENhY2hlIGludmFsaWRhdGlvblxyXG4gICAgcmV2YWxpZGF0ZVRhZyhDQUNIRV9UQUdTLlNUVURFTlRTLCAnZGVmYXVsdCcpO1xyXG4gICAgcmV2YWxpZGF0ZVRhZyhgc3R1ZGVudC0ke3N0dWRlbnRJZH1gLCAnZGVmYXVsdCcpO1xyXG4gICAgcmV2YWxpZGF0ZVRhZygnc3R1ZGVudC1saXN0JywgJ2RlZmF1bHQnKTtcclxuICAgIHJldmFsaWRhdGVQYXRoKCcvZGFzaGJvYXJkL3N0dWRlbnRzJyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgbWVzc2FnZTogJ1N0dWRlbnQgZGVsZXRlZCBzdWNjZXNzZnVsbHknXHJcbiAgICB9O1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIE5leHRBcGlDbGllbnRFcnJvclxyXG4gICAgICA/IGVycm9yLm1lc3NhZ2VcclxuICAgICAgOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yXHJcbiAgICAgID8gZXJyb3IubWVzc2FnZVxyXG4gICAgICA6ICdGYWlsZWQgdG8gZGVsZXRlIHN0dWRlbnQnO1xyXG5cclxuICAgIC8vIEhJUEFBIEFVRElUIExPRyAtIExvZyBmYWlsZWQgYXR0ZW1wdFxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuREVMRVRFX1NUVURFTlQsXHJcbiAgICAgIHJlc291cmNlOiAnU3R1ZGVudCcsXHJcbiAgICAgIHJlc291cmNlSWQ6IHN0dWRlbnRJZCxcclxuICAgICAgZGV0YWlsczogYEZhaWxlZCB0byBkZWxldGUgc3R1ZGVudCByZWNvcmQ6ICR7ZXJyb3JNZXNzYWdlfWAsXHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvck1lc3NhZ2VcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvcjogZXJyb3JNZXNzYWdlXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InVTQWtIc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
            outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, loading = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        disabled: loading || props.disabled,
        ...props,
        children: loading ? "Loading..." : props.children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border bg-card text-card-foreground shadow", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 11,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 26,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 38,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 50,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 70,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/alert.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Alert",
    ()=>Alert,
    "AlertDescription",
    ()=>AlertDescription,
    "AlertTitle",
    ()=>AlertTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const alertVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7", {
    variants: {
        variant: {
            default: "bg-background text-foreground",
            destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Alert = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        role: "alert",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(alertVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert.tsx",
        lineNumber: 28,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Alert;
Alert.displayName = "Alert";
const AlertTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mb-1 font-medium leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert.tsx",
        lineNumber: 41,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = AlertTitle;
AlertTitle.displayName = "AlertTitle";
const AlertDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm [&_p]:leading-relaxed", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert.tsx",
        lineNumber: 53,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = AlertDescription;
AlertDescription.displayName = "AlertDescription";
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Alert$React.forwardRef");
__turbopack_context__.k.register(_c1, "Alert");
__turbopack_context__.k.register(_c2, "AlertTitle$React.forwardRef");
__turbopack_context__.k.register(_c3, "AlertTitle");
__turbopack_context__.k.register(_c4, "AlertDescription$React.forwardRef");
__turbopack_context__.k.register(_c5, "AlertDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/features/students/StudentForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * StudentForm Component
 * Comprehensive form for creating and editing students
 *
 * @module components/features/students/StudentForm
 */ __turbopack_context__.s([
    "StudentForm",
    ()=>StudentForm,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@hookform/resolvers/zod/dist/zod.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validations$2f$student$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/validations/student.schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$students$2e$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/students.actions.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$96eb7c__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/data:96eb7c [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$a5ed0d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/data:a5ed0d [app-client] (ecmascript) <text/javascript>");
// UI Components
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
const StudentForm = ({ student, mode = 'create', onCancel, onSuccess, className })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isPending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isEditMode = mode === 'edit' && student !== undefined;
    // Form state with react-hook-form + Zod validation
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validations$2f$student$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StudentFormSchema"]),
        defaultValues: isEditMode ? {
            studentNumber: student.studentNumber,
            firstName: student.firstName,
            lastName: student.lastName,
            dateOfBirth: student.dateOfBirth.split('T')[0],
            // Format for input[type="date"]
            grade: student.grade,
            gender: student.gender,
            photo: student.photo || '',
            medicalRecordNum: student.medicalRecordNum || '',
            nurseId: student.nurseId || '',
            enrollmentDate: student.enrollmentDate?.split('T')[0] || ''
        } : {
            studentNumber: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            grade: '',
            gender: 'PREFER_NOT_TO_SAY',
            photo: '',
            medicalRecordNum: '',
            nurseId: '',
            enrollmentDate: new Date().toISOString().split('T')[0]
        }
    });
    /**
   * Form submission handler
   */ const onSubmit = async (data)=>{
        setError(null);
        setSuccess(false);
        startTransition(async ()=>{
            try {
                let result;
                if (isEditMode) {
                    // Update existing student
                    result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$a5ed0d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["updateStudent"])(student.id, data);
                } else {
                    // Create new student
                    result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$96eb7c__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createStudent"])(data);
                }
                if (result.success && result.data) {
                    setSuccess(true);
                    if (onSuccess) {
                        onSuccess(result.data);
                    } else {
                        // Default: redirect to student details
                        router.push(`/students/${result.data.id}`);
                    }
                } else {
                    setError(result.error || 'An error occurred');
                }
            } catch (err) {
                console.error('Form submission error:', err);
                setError(err instanceof Error ? err.message : 'Failed to save student');
            }
        });
    };
    /**
   * Cancel handler
   */ const handleCancel = ()=>{
        if (onCancel) {
            onCancel();
        } else {
            router.back();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: className,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-gray-900 dark:text-gray-100",
                            children: isEditMode ? 'Edit Student' : 'New Student'
                        }, void 0, false, {
                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-sm text-gray-600 dark:text-gray-400",
                            children: isEditMode ? 'Update student demographic and enrollment information' : 'Enter student demographic and enrollment information'
                        }, void 0, false, {
                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                    variant: "success",
                    className: "mb-6",
                    children: [
                        "Student ",
                        isEditMode ? 'updated' : 'created',
                        " successfully!"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                    lineNumber: 159,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                    variant: "error",
                    className: "mb-6",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                    lineNumber: 164,
                    columnNumber: 19
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit(onSubmit),
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4",
                                    children: "Basic Information"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "studentNumber",
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                    children: [
                                                        "Student Number ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-red-600",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                            lineNumber: 178,
                                                            columnNumber: 34
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    ...register('studentNumber'),
                                                    type: "text",
                                                    id: "studentNumber",
                                                    placeholder: "STU-2024-001",
                                                    disabled: isEditMode,
                                                    className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.studentNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-red-600",
                                                    children: errors.studentNumber.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 42
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                            lineNumber: 176,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "firstName",
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                    children: [
                                                        "First Name ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-red-600",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                            lineNumber: 188,
                                                            columnNumber: 30
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    ...register('firstName'),
                                                    type: "text",
                                                    id: "firstName",
                                                    placeholder: "John",
                                                    className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 190,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.firstName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-red-600",
                                                    children: errors.firstName.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 38
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                            lineNumber: 186,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "lastName",
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                    children: [
                                                        "Last Name ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-red-600",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                            lineNumber: 197,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    ...register('lastName'),
                                                    type: "text",
                                                    id: "lastName",
                                                    placeholder: "Doe",
                                                    className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.lastName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-red-600",
                                                    children: errors.lastName.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                            lineNumber: 195,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "dateOfBirth",
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                    children: [
                                                        "Date of Birth ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-red-600",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                            lineNumber: 206,
                                                            columnNumber: 33
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 205,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    ...register('dateOfBirth'),
                                                    type: "date",
                                                    id: "dateOfBirth",
                                                    max: new Date().toISOString().split('T')[0],
                                                    className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.dateOfBirth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-red-600",
                                                    children: errors.dateOfBirth.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 209,
                                                    columnNumber: 40
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                            lineNumber: 204,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "grade",
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                    children: [
                                                        "Grade ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-red-600",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                            lineNumber: 215,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    ...register('grade'),
                                                    id: "grade",
                                                    className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Select grade"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                            lineNumber: 218,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "K",
                                                            children: "Kindergarten"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                            lineNumber: 219,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        Array.from({
                                                            length: 12
                                                        }, (_, i)=>i + 1).map((grade)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: String(grade),
                                                                children: [
                                                                    "Grade ",
                                                                    grade
                                                                ]
                                                            }, grade, true, {
                                                                fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                                lineNumber: 222,
                                                                columnNumber: 50
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.grade && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-red-600",
                                                    children: errors.grade.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 226,
                                                    columnNumber: 34
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                            lineNumber: 213,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "gender",
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                    children: [
                                                        "Gender ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-red-600",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                            lineNumber: 232,
                                                            columnNumber: 26
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    ...register('gender'),
                                                    id: "gender",
                                                    className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "MALE",
                                                            children: "Male"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                            lineNumber: 235,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "FEMALE",
                                                            children: "Female"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                            lineNumber: 236,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "OTHER",
                                                            children: "Other"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                            lineNumber: 237,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "PREFER_NOT_TO_SAY",
                                                            children: "Prefer not to say"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                            lineNumber: 238,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.gender && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-red-600",
                                                    children: errors.gender.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 240,
                                                    columnNumber: 35
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                            lineNumber: 230,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4",
                                    children: "Additional Information"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                    lineNumber: 247,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "enrollmentDate",
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                    children: "Enrollment Date"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    ...register('enrollmentDate'),
                                                    type: "date",
                                                    id: "enrollmentDate",
                                                    className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.enrollmentDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-red-600",
                                                    children: errors.enrollmentDate.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 43
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                            lineNumber: 252,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "medicalRecordNum",
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                    children: "Medical Record Number"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    ...register('medicalRecordNum'),
                                                    type: "text",
                                                    id: "medicalRecordNum",
                                                    placeholder: "MRN-12345",
                                                    className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.medicalRecordNum && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-red-600",
                                                    children: errors.medicalRecordNum.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 266,
                                                    columnNumber: 45
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                            lineNumber: 261,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "photo",
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                    children: "Photo URL"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    ...register('photo'),
                                                    type: "url",
                                                    id: "photo",
                                                    placeholder: "https://example.com/photo.jpg",
                                                    className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-red-600",
                                                    children: errors.photo.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 275,
                                                    columnNumber: 34
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-xs text-gray-500",
                                                    children: "Enter a valid URL to a student photo"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                            lineNumber: 270,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "nurseId",
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                    children: "Assigned Nurse ID"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    ...register('nurseId'),
                                                    type: "text",
                                                    id: "nurseId",
                                                    placeholder: "Nurse UUID (optional)",
                                                    className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 286,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.nurseId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-red-600",
                                                    children: errors.nurseId.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 287,
                                                    columnNumber: 36
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-xs text-gray-500",
                                                    children: "Leave blank to assign later"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                    lineNumber: 288,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                            lineNumber: 282,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                    lineNumber: 250,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                            lineNumber: 246,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "secondary",
                                    onClick: handleCancel,
                                    disabled: isPending || isSubmitting,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-4 w-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                            lineNumber: 298,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "Cancel"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                    lineNumber: 297,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "submit",
                                    disabled: isPending || isSubmitting,
                                    children: isPending || isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "h-4 w-4 mr-2 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                lineNumber: 303,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            isEditMode ? 'Updating...' : 'Creating...'
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                                lineNumber: 306,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            isEditMode ? 'Update Student' : 'Create Student'
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                                    lineNumber: 301,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/features/students/StudentForm.tsx",
                            lineNumber: 296,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/features/students/StudentForm.tsx",
                    lineNumber: 168,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/features/students/StudentForm.tsx",
            lineNumber: 147,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/features/students/StudentForm.tsx",
        lineNumber: 146,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(StudentForm, "iFbFFRfniMnQJazNg5z7Gqtb//U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c = StudentForm;
StudentForm.displayName = 'StudentForm';
const __TURBOPACK__default__export__ = StudentForm;
var _c;
__turbopack_context__.k.register(_c, "StudentForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_60148573._.js.map