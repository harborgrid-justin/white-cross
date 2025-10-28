/**
 * NestJS Application Entry Point
 * White Cross School Health Platform
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('White Cross School Health API')
    .setDescription(
      'Comprehensive HIPAA-compliant API for school health management systems. ' +
      'Provides complete student health record management, medication tracking, ' +
      'vaccination monitoring, allergy management, chronic condition tracking, ' +
      'appointment scheduling, incident reporting, analytics, and administrative functions.',
    )
    .setVersion('2.0')
    .setContact(
      'White Cross Support',
      'https://whitecross.health',
      'support@whitecross.health',
    )
    .setLicense('Proprietary', 'https://whitecross.health/license')

    // Core Modules
    .addTag('Authentication', 'User authentication, registration, login, and token management')
    .addTag('students', 'Student profile management, enrollment, and demographics')
    .addTag('Users', 'User account management and profile administration')

    // Health Management
    .addTag('Health Records', 'Comprehensive student health record management')
    .addTag('Allergies', 'Allergy tracking, safety checks, and critical allergy alerts')
    .addTag('Chronic Conditions', 'Chronic condition management and treatment plans')
    .addTag('Vaccinations', 'Immunization tracking and CDC-compliant vaccination schedules')
    .addTag('Vital Signs', 'Vital signs monitoring, trends, and health assessments')

    // Clinical Services
    .addTag('Clinical', 'Clinical services including drug interactions and clinic visits')
    .addTag('Appointments', 'Appointment scheduling and calendar management')
    .addTag('Incident Reports', 'Health incident documentation and reporting')

    // Medication Management
    .addTag('medications', 'Medication formulary management')
    .addTag('administration', 'Medication administration records (MAR)')
    .addTag('inventory', 'Medication inventory and stock management')
    .addTag('adverse-reactions', 'Adverse drug reaction reporting')
    .addTag('controlled-substances', 'DEA-compliant controlled substance logging')

    // Administrative Functions
    .addTag('Administration', 'System administration, configuration, and school management')
    .addTag('Access Control', 'Role-based access control and permissions')
    .addTag('Audit', 'Audit logging and compliance tracking')
    .addTag('Compliance', 'Regulatory compliance and HIPAA controls')
    .addTag('Security', 'Security events, incidents, and IP restrictions')

    // Operational Modules
    .addTag('Analytics', 'Analytics, reporting, and data insights')
    .addTag('Reports', 'Report generation and scheduled reporting')
    .addTag('Budget', 'Budget management and financial tracking')
    .addTag('Contacts', 'Emergency contacts and parent/guardian management')
    .addTag('Documents', 'Document management and file storage')

    // Integration & Communication
    .addTag('Integration', 'Third-party integrations and SIS connectors')
    .addTag('Communication', 'Multi-channel communication and notifications')
    .addTag('Mobile', 'Mobile device management, sync, and push notifications')

    // Utilities
    .addTag('PDF Generation', 'PDF document generation and printing')

    // Advanced Features (to be implemented)
    .addTag('Academic Transcript', 'Academic records and transcript management')
    .addTag('AI Search', 'Intelligent search with vector embeddings')
    .addTag('Alerts', 'Real-time alert system and notification management')
    .addTag('Features', 'Enterprise feature flags and advanced capabilities')
    .addTag('Health Domain', 'Health domain business logic and workflows')

    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT token obtained from /auth/login or /auth/register',
      name: 'Authorization',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Also expose the JSON spec at /api/docs-json for automated tools
  app.getHttpAdapter().get('/api/docs-json', (req, res) => {
    res.json(document);
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`\n🚀 White Cross NestJS Backend running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
