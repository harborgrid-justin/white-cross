/**
 * Usage examples for error-handling-kit.prod.ts
 *
 * This file demonstrates common usage patterns for the error handling utilities.
 * These examples are for reference only and should not be executed directly.
 */

import {
  // Exception classes
  DomainException,
  ValidationException,
  BusinessRuleException,
  ExternalServiceException,
  DatabaseException,
  ResourceNotFoundException,
  ResourceConflictException,
  RateLimitException,
  CircuitBreakerOpenException,

  // Error handling
  serializeError,
  formatZodErrors,
  formatSequelizeErrors,
  sanitizeStackTrace,
  sanitizeErrorMessage,

  // Exception filters
  GlobalExceptionFilter,
  ValidationExceptionFilter,
  DatabaseExceptionFilter,

  // Interceptors
  ErrorLoggingInterceptor,
  ErrorTransformationInterceptor,
  TimeoutInterceptor,

  // Retry logic
  retryWithBackoff,
  retryWithBackoffOperator,
  calculateBackoffDelay,

  // Circuit breaker
  CircuitBreaker,

  // Sentry
  initializeSentry,
  captureErrorToSentry,

  // Recovery
  executeWithRecovery,
  gracefulDegradation,

  // Swagger decorators
  ApiValidationErrorResponse,
  ApiNotFoundErrorResponse,
  ApiAllErrorResponses,

  // Types
  ErrorCode,
  ErrorCategory,
  ErrorSeverity,
  RetryConfig,
  CircuitBreakerConfig,
} from './error-handling-kit.prod';

import { Controller, Get, Post, Body, Param, UseFilters, UseInterceptors } from '@nestjs/common';
import { z } from 'zod';

// ============================================================================
// EXAMPLE 1: CUSTOM EXCEPTIONS
// ============================================================================

/**
 * Example: Using custom domain exceptions
 */
async function example1_CustomExceptions() {
  // Throw a validation exception with details
  throw new ValidationException(
    'User input validation failed',
    [
      { field: 'email', message: 'Invalid email format', constraint: 'email' },
      { field: 'age', message: 'Must be at least 18', constraint: 'min' },
    ],
    { source: 'user-registration' }
  );

  // Throw a resource not found exception
  throw new ResourceNotFoundException('Patient', '123', { requestedBy: 'doctor-456' });

  // Throw a business rule exception
  throw new BusinessRuleException(
    'Cannot cancel appointment less than 24 hours before scheduled time',
    'appointment-cancellation-24h',
    { appointmentId: '789', scheduledTime: '2025-11-09T10:00:00Z' }
  );

  // Throw an external service exception
  throw new ExternalServiceException(
    'Failed to verify insurance eligibility',
    'insurance-verification-api',
    new Error('Connection timeout'),
    { patientId: '123', insuranceProvider: 'BlueCross' }
  );
}

// ============================================================================
// EXAMPLE 2: NESTJS EXCEPTION FILTERS
// ============================================================================

/**
 * Example: Using exception filters in NestJS controllers
 */
@Controller('patients')
@UseFilters(GlobalExceptionFilter, ValidationExceptionFilter)
export class PatientController {
  @Get(':id')
  @ApiNotFoundErrorResponse('Patient')
  async findOne(@Param('id') id: string) {
    const patient = await this.patientService.findOne(id);

    if (!patient) {
      throw new ResourceNotFoundException('Patient', id);
    }

    return patient;
  }

  @Post()
  @ApiValidationErrorResponse()
  @ApiAllErrorResponses()
  async create(@Body() dto: CreatePatientDto) {
    // Validation happens automatically via ValidationPipe
    // If validation fails, ValidationExceptionFilter catches it

    try {
      return await this.patientService.create(dto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ResourceConflictException(
          'Patient with this email already exists',
          'duplicate_email',
          { email: dto.email }
        );
      }
      throw error;
    }
  }
}

// ============================================================================
// EXAMPLE 3: ZOD VALIDATION WITH ERROR HANDLING
// ============================================================================

/**
 * Example: Using Zod validation with error formatting
 */
const CreatePatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  dateOfBirth: z.string().datetime('Invalid date format'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
});

async function example3_ZodValidation(data: unknown) {
  try {
    const validated = CreatePatientSchema.parse(data);
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = formatZodErrors(error);
      throw new ValidationException('Patient data validation failed', details);
    }
    throw error;
  }
}

// ============================================================================
// EXAMPLE 4: RETRY LOGIC WITH EXPONENTIAL BACKOFF
// ============================================================================

/**
 * Example: Retry external API calls with backoff
 */
async function example4_RetryLogic() {
  const config: RetryConfig = {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
    shouldRetry: (error, attempt) => {
      // Only retry on timeout or 5xx errors
      if (error instanceof ExternalServiceException) {
        return true;
      }
      return false;
    },
  };

  const result = await retryWithBackoff(
    async () => {
      // Call external insurance verification API
      return await insuranceAPI.verify({ patientId: '123' });
    },
    config
  );

  return result;
}

// ============================================================================
// EXAMPLE 5: CIRCUIT BREAKER PATTERN
// ============================================================================

/**
 * Example: Using circuit breaker for external services
 */
class InsuranceService {
  private circuitBreaker: CircuitBreaker;

  constructor() {
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,        // Open after 5 failures
      successThreshold: 2,         // Close after 2 successes in half-open
      timeout: 10000,              // 10 second timeout
      resetTimeoutMs: 60000,       // Try again after 1 minute
      halfOpenMaxAttempts: 3,      // Max attempts in half-open state
      name: 'insurance-verification-api',
    });
  }

  async verifyEligibility(patientId: string) {
    try {
      return await this.circuitBreaker.execute(async () => {
        // Call external API
        const response = await fetch(`https://api.insurance.com/verify/${patientId}`);

        if (!response.ok) {
          throw new ExternalServiceException(
            'Insurance verification failed',
            'insurance-api',
            new Error(`HTTP ${response.status}`)
          );
        }

        return await response.json();
      });
    } catch (error) {
      if (error instanceof CircuitBreakerOpenException) {
        // Circuit is open, use fallback or return cached data
        return this.getFallbackEligibility(patientId);
      }
      throw error;
    }
  }

  private async getFallbackEligibility(patientId: string) {
    // Return cached data or default response
    return { eligible: null, cached: true };
  }
}

// ============================================================================
// EXAMPLE 6: SENTRY INTEGRATION
// ============================================================================

/**
 * Example: Initialize Sentry and capture errors
 */
function example6_SentryIntegration() {
  // Initialize in main.ts or app module
  initializeSentry(process.env.SENTRY_DSN!, {
    environment: process.env.NODE_ENV,
    release: process.env.APP_VERSION,
    tracesSampleRate: 0.1,
  });

  // Capture error with context
  try {
    // Some operation that might fail
    throw new Error('Database connection lost');
  } catch (error) {
    captureErrorToSentry(error as Error, {
      level: 'error',
      tags: {
        errorCode: ErrorCode.DATABASE_CONNECTION_FAILED,
        category: ErrorCategory.DATABASE,
      },
      extra: {
        database: 'patients-db',
        operation: 'findOne',
      },
      user: {
        id: '123',
        email: 'doctor@hospital.com',
      },
    });
  }
}

// ============================================================================
// EXAMPLE 7: ERROR RECOVERY STRATEGIES
// ============================================================================

/**
 * Example: Execute operation with automatic recovery
 */
async function example7_ErrorRecovery() {
  const result = await executeWithRecovery(
    // Primary operation
    async () => {
      return await primaryDatabase.query('SELECT * FROM patients WHERE id = ?', ['123']);
    },
    // Recovery strategy
    {
      maxAttempts: 3,
      backoffMs: [1000, 2000, 4000],
      fallbackValue: null, // Return null if all attempts fail
      shouldRecover: (error, attempt) => {
        // Only recover from connection errors
        return error instanceof DatabaseException;
      },
      onRecovery: (error, result) => {
        console.log('Recovered from error:', error.message);
      },
      onFailure: (error) => {
        console.error('Recovery failed:', error);
      },
    }
  );

  return result;
}

/**
 * Example: Graceful degradation with fallback
 */
async function example7_GracefulDegradation() {
  const patientData = await gracefulDegradation(
    // Primary: Fetch from database
    async () => {
      return await database.findPatient('123');
    },
    // Fallback: Fetch from cache
    async () => {
      return await cache.get('patient:123');
    },
    // Condition: Use fallback on database errors
    (error) => error instanceof DatabaseException
  );

  return patientData;
}

// ============================================================================
// EXAMPLE 8: INTERCEPTORS
// ============================================================================

/**
 * Example: Using error interceptors in NestJS
 */
@Controller('appointments')
@UseInterceptors(
  ErrorLoggingInterceptor,
  ErrorTransformationInterceptor,
  new TimeoutInterceptor(5000) // 5 second timeout
)
export class AppointmentController {
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Any errors will be logged by ErrorLoggingInterceptor
    // ZodErrors will be transformed to ValidationException
    // Requests taking > 5s will timeout

    const appointment = await this.appointmentService.findOne(id);

    if (!appointment) {
      throw new ResourceNotFoundException('Appointment', id);
    }

    return appointment;
  }
}

// ============================================================================
// EXAMPLE 9: SEQUELIZE ERROR HANDLING
// ============================================================================

/**
 * Example: Handling Sequelize errors with DatabaseExceptionFilter
 */
@UseFilters(DatabaseExceptionFilter)
class PatientService {
  async createPatient(data: CreatePatientDto) {
    try {
      const patient = await Patient.create(data);
      return patient;
    } catch (error) {
      // DatabaseExceptionFilter will catch and format these errors:
      // - UniqueConstraintError -> ResourceConflictException
      // - ForeignKeyConstraintError -> DatabaseException
      // - ValidationError -> ValidationException
      // - ConnectionError -> DatabaseException
      // - TimeoutError -> DatabaseException
      throw error;
    }
  }
}

// ============================================================================
// EXAMPLE 10: ERROR SANITIZATION (HIPAA COMPLIANCE)
// ============================================================================

/**
 * Example: Sanitize errors to remove sensitive patient information
 */
function example10_ErrorSanitization() {
  try {
    // Operation that might expose sensitive data in error
    throw new Error('Patient SSN 123-45-6789 is invalid for user token abc123xyz');
  } catch (error) {
    const sanitizedMessage = sanitizeErrorMessage((error as Error).message);
    // Returns: 'Patient SSN [REDACTED] is invalid for user token [REDACTED]'

    const sanitizedStack = sanitizeStackTrace((error as Error).stack);
    // Stack trace with all sensitive patterns redacted

    console.log('Safe to log:', sanitizedMessage);
  }
}

// ============================================================================
// EXAMPLE 11: DEAD LETTER QUEUE
// ============================================================================

/**
 * Example: Using dead letter queue for failed operations
 */
async function example11_DeadLetterQueue() {
  try {
    await processAppointmentReminder({
      appointmentId: '123',
      patientEmail: 'patient@example.com',
      scheduledTime: '2025-11-09T10:00:00Z',
    });
  } catch (error) {
    // Add to DLQ for retry later
    await addToDeadLetterQueue(
      {
        appointmentId: '123',
        patientEmail: 'patient@example.com',
        scheduledTime: '2025-11-09T10:00:00Z',
      },
      error as Error,
      3, // Attempt number
      {
        queue: 'appointment-reminders',
        priority: 'high',
      }
    );
  }
}

// ============================================================================
// EXAMPLE 12: ERROR CONTEXT ENRICHMENT
// ============================================================================

/**
 * Example: Enriching errors with request context
 */
import { Request, Response, NextFunction } from 'express';
import { enrichErrorContext, extractErrorContextFromRequest } from './error-handling-kit.prod';

function errorEnrichmentMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Your application logic
    next();
  } catch (error) {
    // Extract context from request
    const context = extractErrorContextFromRequest(req);

    // Enrich error with context
    const enrichedError = enrichErrorContext(error as Error, context);

    // Error now has userId, sessionId, ipAddress, etc.
    throw enrichedError;
  }
}

// ============================================================================
// EXAMPLE 13: COMPLETE NESTJS APP SETUP
// ============================================================================

/**
 * Example: Complete error handling setup in NestJS application
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Initialize Sentry
  initializeSentry(process.env.SENTRY_DSN!, {
    environment: process.env.NODE_ENV,
    release: process.env.APP_VERSION,
  });

  // 2. Global validation pipe (works with ValidationExceptionFilter)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // 3. Global exception filters
  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new ValidationExceptionFilter(),
    new DatabaseExceptionFilter()
  );

  // 4. Global interceptors
  app.useGlobalInterceptors(
    new ErrorLoggingInterceptor(),
    new ErrorTransformationInterceptor(),
    new TimeoutInterceptor(30000) // 30 second default timeout
  );

  await app.listen(3000);
}

// Export examples for reference
export {
  example1_CustomExceptions,
  example3_ZodValidation,
  example4_RetryLogic,
  example6_SentryIntegration,
  example7_ErrorRecovery,
  example7_GracefulDegradation,
  example10_ErrorSanitization,
  example11_DeadLetterQueue,
  InsuranceService,
  PatientController,
  AppointmentController,
  bootstrap,
};
