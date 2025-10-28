/**
 * V1 Routes Module
 *
 * Central module for all v1 API routes. Provides backward compatibility
 * with the legacy Hapi.js backend while using NestJS patterns.
 *
 * Route structure:
 * - /api/v1/auth/* - Authentication routes
 * - /api/v1/users/* - User management routes
 * - /api/v1/students/* - Student operations routes
 * - /api/v1/medications/* - Medication management routes
 * - /api/v1/health-records/* - Health records routes
 * - /api/v1/appointments/* - Appointment scheduling routes
 * - /api/v1/documents/* - Document management routes
 * - /api/v1/compliance/* - Compliance and audit routes
 * - /api/v1/communications/* - Messaging and broadcasts routes
 * - /api/v1/incidents/* - Incident reporting routes
 * - /api/v1/analytics/* - Analytics and reporting routes
 * - /api/v1/system/* - System administration routes
 * - /api/v1/alerts/* - Real-time alerting routes
 * - /api/v1/clinical/* - Clinical operations routes
 */

import { Module } from '@nestjs/common';
import { CoreV1Module } from './core/core.module';

@Module({
  imports: [
    CoreV1Module,
    // Add other v1 route modules here as they are migrated
    // HealthcareV1Module,
    // OperationsV1Module,
    // DocumentsV1Module,
    // ComplianceV1Module,
    // CommunicationsV1Module,
    // IncidentsV1Module,
    // AnalyticsV1Module,
    // SystemV1Module,
    // AlertsV1Module,
    // ClinicalV1Module,
  ],
})
export class V1RoutesModule {}
