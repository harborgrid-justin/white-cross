/**
 * Student Management Validators
 * Joi validation schemas for student photo management, academic transcripts, grade transitions, and operational features
 */

import Joi from 'joi';

/**
 * COMMON PARAMETER SCHEMAS
 */

export const studentIdParamSchema = Joi.object({
  studentId: Joi.string().uuid().required()
});

/**
 * STUDENT PHOTO MANAGEMENT SCHEMAS
 */

export const studentPhotoUploadSchema = Joi.object({
  imageData: Joi.string().base64().required()
    .description('Base64 encoded image data'),
  imageFormat: Joi.string().valid('jpeg', 'jpg', 'png', 'gif').default('jpeg'),
  metadata: Joi.object({
    capturedDate: Joi.date().default(() => new Date(), 'current date'),
    capturedBy: Joi.string().uuid().optional(),
    deviceInfo: Joi.string().max(200).optional(),
    location: Joi.string().max(100).optional(),
    tags: Joi.array().items(Joi.string().max(50)).max(10).optional()
  }).optional(),
  replaceExisting: Joi.boolean().default(false)
    .description('Whether to replace existing photo or create new version'),
  permissions: Joi.object({
    viewableByParents: Joi.boolean().default(true),
    viewableByStaff: Joi.boolean().default(true),
    useForIdentification: Joi.boolean().default(true)
  }).optional()
});

export const studentPhotoSearchSchema = Joi.object({
  imageData: Joi.string().base64().required()
    .description('Base64 encoded image data to search for'),
  threshold: Joi.number().min(0.1).max(1.0).default(0.85)
    .description('Confidence threshold for facial recognition matches'),
  maxResults: Joi.number().min(1).max(20).default(10),
  includeInactive: Joi.boolean().default(false)
    .description('Whether to include inactive students in search'),
  searchScope: Joi.string().valid('current-school', 'district', 'all').default('current-school')
});

/**
 * ACADEMIC TRANSCRIPT SCHEMAS
 */

export const academicTranscriptSchema = Joi.object({
  schoolYear: Joi.string().pattern(/^\d{4}-\d{4}$/).required()
    .description('Academic year in format YYYY-YYYY (e.g., 2023-2024)'),
  semester: Joi.string().valid('fall', 'spring', 'summer', 'year').default('year'),
  transcriptSource: Joi.string().valid('previous-school', 'district-transfer', 'homeschool', 'international', 'manual-entry').required(),
  previousSchool: Joi.object({
    name: Joi.string().max(200).required(),
    address: Joi.string().max(500).optional(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    principalName: Joi.string().max(100).optional()
  }).when('transcriptSource', {
    is: Joi.valid('previous-school', 'district-transfer'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  grades: Joi.array().items(
    Joi.object({
      courseCode: Joi.string().max(20).required(),
      courseName: Joi.string().max(200).required(),
      creditHours: Joi.number().positive().precision(2).required(),
      grade: Joi.string().valid('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'P', 'NP', 'I', 'W').required(),
      gradePoints: Joi.number().min(0).max(4).precision(2).required(),
      semester: Joi.string().valid('fall', 'spring', 'summer').required(),
      teacherName: Joi.string().max(100).optional(),
      isHonors: Joi.boolean().default(false),
      isAP: Joi.boolean().default(false),
      isDualEnrollment: Joi.boolean().default(false)
    })
  ).min(1).required(),
  gpa: Joi.object({
    cumulative: Joi.number().min(0).max(4).precision(3).required(),
    weighted: Joi.number().min(0).max(5).precision(3).optional(),
    unweighted: Joi.number().min(0).max(4).precision(3).optional(),
    classRank: Joi.number().positive().optional(),
    classSize: Joi.number().positive().optional()
  }).required(),
  attendanceRecord: Joi.object({
    daysPresent: Joi.number().min(0).required(),
    daysAbsent: Joi.number().min(0).required(),
    daysExcused: Joi.number().min(0).optional(),
    tardies: Joi.number().min(0).optional()
  }).optional(),
  testScores: Joi.array().items(
    Joi.object({
      testName: Joi.string().valid('SAT', 'ACT', 'PSAT', 'AP', 'State-Test', 'Other').required(),
      subject: Joi.string().max(100).optional(),
      score: Joi.number().required(),
      maxScore: Joi.number().required(),
      percentile: Joi.number().min(1).max(100).optional(),
      testDate: Joi.date().required()
    })
  ).optional(),
  verificationDocuments: Joi.array().items(
    Joi.string().base64()
  ).max(5).optional()
    .description('Base64 encoded verification documents (transcripts, report cards)')
});

/**
 * GRADE TRANSITION SCHEMAS
 */

export const gradeTransitionSchema = Joi.object({
  effectiveDate: Joi.date().min('now').required()
    .description('Date when grade transitions take effect'),
  dryRun: Joi.boolean().default(true)
    .description('Whether to perform actual transitions or just simulation'),
  criteria: Joi.object({
    minimumAttendance: Joi.number().min(0).max(100).default(90)
      .description('Minimum attendance percentage required for promotion'),
    minimumGPA: Joi.number().min(0).max(4).default(2.0)
      .description('Minimum GPA required for promotion'),
    requiredCredits: Joi.object({
      english: Joi.number().min(0).default(4),
      math: Joi.number().min(0).default(4),
      science: Joi.number().min(0).default(3),
      socialStudies: Joi.number().min(0).default(3),
      total: Joi.number().min(0).default(22)
    }).optional(),
    specialConsiderations: Joi.array().items(
      Joi.string().valid('iep-accommodation', 'ell-support', 'medical-leave', 'family-circumstances')
    ).optional()
  }).optional(),
  notifications: Joi.object({
    notifyParents: Joi.boolean().default(true),
    notifyStudents: Joi.boolean().default(true),
    notifyTeachers: Joi.boolean().default(true),
    emailTemplate: Joi.string().valid('promotion', 'retention', 'graduation').optional()
  }).default({}),
  overrides: Joi.array().items(
    Joi.object({
      studentId: Joi.string().uuid().required(),
      decision: Joi.string().valid('promote', 'retain', 'graduate').required(),
      reason: Joi.string().min(10).max(500).required(),
      approvedBy: Joi.string().uuid().required()
    })
  ).optional()
    .description('Manual overrides for specific students')
});

/**
 * BARCODE SCANNING SCHEMAS
 */

export const barcodeVerificationSchema = Joi.object({
  studentBarcode: Joi.string().min(1).max(200).required()
    .description('Student identification barcode'),
  medicationBarcode: Joi.string().min(1).max(200).required()
    .description('Medication package barcode'),
  nurseBarcode: Joi.string().min(1).max(200).required()
    .description('Nurse identification barcode'),
  administrationTime: Joi.date().default(() => new Date(), 'current time'),
  verificationMode: Joi.string().valid('standard', 'emergency', 'override').default('standard'),
  witnessBarcode: Joi.string().min(1).max(200).optional()
    .description('Witness barcode for controlled substances'),
  notes: Joi.string().max(500).optional()
    .description('Additional verification notes')
});

/**
 * WAITLIST MANAGEMENT SCHEMAS
 */

export const waitlistSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  appointmentType: Joi.string().valid(
    'health-screening',
    'nurse-visit',
    'counselor-meeting',
    'principal-meeting',
    'parent-conference',
    'special-education',
    'speech-therapy',
    'occupational-therapy',
    'physical-therapy',
    'psychological-evaluation'
  ).required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  preferredTimeSlots: Joi.array().items(
    Joi.object({
      dayOfWeek: Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday').required(),
      startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    })
  ).max(10).optional(),
  requestedBy: Joi.string().uuid().optional()
    .description('ID of person making the waitlist request'),
  reason: Joi.string().max(500).optional()
    .description('Reason for appointment request'),
  urgencyNotes: Joi.string().max(200).when('priority', {
    is: 'urgent',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  parentNotificationPreference: Joi.string().valid('email', 'phone', 'text', 'app-notification').default('email'),
  estimatedDuration: Joi.number().min(15).max(180).default(30)
    .description('Estimated appointment duration in minutes'),
  specialAccommodations: Joi.array().items(
    Joi.string().valid('wheelchair-accessible', 'interpreter-needed', 'quiet-environment', 'extended-time', 'parent-present')
  ).optional()
});

/**
 * EXPORT VALIDATION FUNCTIONS
 */

export const validateStudentIdParam = (params: any) => {
  return studentIdParamSchema.validate(params);
};

export const validateStudentPhotoUpload = (payload: any) => {
  return studentPhotoUploadSchema.validate(payload);
};

export const validateStudentPhotoSearch = (payload: any) => {
  return studentPhotoSearchSchema.validate(payload);
};

export const validateAcademicTranscript = (payload: any) => {
  return academicTranscriptSchema.validate(payload);
};

export const validateGradeTransition = (payload: any) => {
  return gradeTransitionSchema.validate(payload);
};

export const validateBarcodeVerification = (payload: any) => {
  return barcodeVerificationSchema.validate(payload);
};

export const validateWaitlist = (payload: any) => {
  return waitlistSchema.validate(payload);
};
