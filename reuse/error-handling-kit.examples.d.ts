/**
 * Usage examples for error-handling-kit.prod.ts
 *
 * This file demonstrates common usage patterns for the error handling utilities.
 * These examples are for reference only and should not be executed directly.
 */
/**
 * Example: Using custom domain exceptions
 */
declare function example1_CustomExceptions(): Promise<void>;
/**
 * Example: Using exception filters in NestJS controllers
 */
export declare class PatientController {
    findOne(id: string): Promise<any>;
    create(dto: CreatePatientDto): Promise<any>;
}
declare function example3_ZodValidation(data: unknown): Promise<any>;
/**
 * Example: Retry external API calls with backoff
 */
declare function example4_RetryLogic(): Promise<any>;
/**
 * Example: Using circuit breaker for external services
 */
declare class InsuranceService {
    private circuitBreaker;
    constructor();
    verifyEligibility(patientId: string): Promise<any>;
    private getFallbackEligibility;
}
/**
 * Example: Initialize Sentry and capture errors
 */
declare function example6_SentryIntegration(): void;
/**
 * Example: Execute operation with automatic recovery
 */
declare function example7_ErrorRecovery(): Promise<any>;
/**
 * Example: Graceful degradation with fallback
 */
declare function example7_GracefulDegradation(): Promise<any>;
/**
 * Example: Using error interceptors in NestJS
 */
export declare class AppointmentController {
    findOne(id: string): Promise<any>;
}
/**
 * Example: Sanitize errors to remove sensitive patient information
 */
declare function example10_ErrorSanitization(): void;
/**
 * Example: Using dead letter queue for failed operations
 */
declare function example11_DeadLetterQueue(): Promise<void>;
declare function bootstrap(): Promise<void>;
export { example1_CustomExceptions, example3_ZodValidation, example4_RetryLogic, example6_SentryIntegration, example7_ErrorRecovery, example7_GracefulDegradation, example10_ErrorSanitization, example11_DeadLetterQueue, InsuranceService, PatientController, AppointmentController, bootstrap, };
//# sourceMappingURL=error-handling-kit.examples.d.ts.map