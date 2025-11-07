import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';
import { DocumentSignature } from './entities/document-signature.entity';
import { DocumentAuditTrail } from './entities/document-audit-trail.entity';

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
