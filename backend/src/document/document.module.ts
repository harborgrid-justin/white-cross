import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document, DocumentAuditTrail, DocumentSignature } from '@/document/entities';

/**
 * Document Module
 * Provides comprehensive document management with HIPAA compliance
 *
 * Features:
 * - Document CRUD operations with validation
 * - File upload and storage integration
 * - Digital signature workflows
 * - Version control
 * - Access tracking and audit trails
 * - Template management
 * - Search and filtering
 * - Analytics and statistics
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      Document,
      DocumentSignature,
      DocumentAuditTrail,
    ]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
