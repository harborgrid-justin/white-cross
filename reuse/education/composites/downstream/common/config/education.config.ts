/**
 * Education System Configuration Schema
 *
 * Centralized configuration management for education composites.
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  logging: boolean;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

export interface EnrollmentConfig {
  batchSize: number;
  maxRetries: number;
  timeout: number;
  maxCoursesPerTerm: number;
  waitlistEnabled: boolean;
  waitlistCapacity: number;
  dropDeadlineWeeks: number;
}

export interface RegistrationConfig {
  earlyRegistrationEnabled: boolean;
  registrationPeriodDays: number;
  lateRegistrationFee: number;
  maxConcurrentSections: number;
  conflictCheckEnabled: boolean;
}

export interface GradingConfig {
  gradeScale: string[];
  passingGrade: string;
  gpaScale: number;
  gradingPeriodDays: number;
  gradeChangeDeadlineWeeks: number;
}

export interface FinancialConfig {
  tuitionDueDeadlineWeeks: number;
  paymentPlanEnabled: boolean;
  latePaymentFee: number;
  refundPolicy: {
    fullRefundWeeks: number;
    partialRefundWeeks: number;
    noRefundAfterWeeks: number;
  };
}

export interface NotificationConfig {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  batchSize: number;
  retryAttempts: number;
  retryDelayMs: number;
}

export interface AuditConfig {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  retentionDays: number;
  sensitiveFieldEncryption: boolean;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxItems: number;
  strategy: 'memory' | 'redis';
}

export interface EducationSystemConfig {
  database: DatabaseConfig;
  enrollment: EnrollmentConfig;
  registration: RegistrationConfig;
  grading: GradingConfig;
  financial: FinancialConfig;
  notification: NotificationConfig;
  audit: AuditConfig;
  cache: CacheConfig;
}

/**
 * Default configuration values
 */
export const defaultEducationConfig: EducationSystemConfig = {
  database: {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    name: 'education_db',
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  },
  enrollment: {
    batchSize: 100,
    maxRetries: 3,
    timeout: 30000,
    maxCoursesPerTerm: 6,
    waitlistEnabled: true,
    waitlistCapacity: 20,
    dropDeadlineWeeks: 2
  },
  registration: {
    earlyRegistrationEnabled: true,
    registrationPeriodDays: 14,
    lateRegistrationFee: 50,
    maxConcurrentSections: 7,
    conflictCheckEnabled: true
  },
  grading: {
    gradeScale: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'],
    passingGrade: 'D',
    gpaScale: 4.0,
    gradingPeriodDays: 7,
    gradeChangeDeadlineWeeks: 4
  },
  financial: {
    tuitionDueDeadlineWeeks: 2,
    paymentPlanEnabled: true,
    latePaymentFee: 100,
    refundPolicy: {
      fullRefundWeeks: 1,
      partialRefundWeeks: 4,
      noRefundAfterWeeks: 6
    }
  },
  notification: {
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    batchSize: 100,
    retryAttempts: 3,
    retryDelayMs: 5000
  },
  audit: {
    enabled: true,
    logLevel: 'info',
    retentionDays: 365,
    sensitiveFieldEncryption: true
  },
  cache: {
    enabled: true,
    ttl: 3600,
    maxItems: 1000,
    strategy: 'memory'
  }
};
