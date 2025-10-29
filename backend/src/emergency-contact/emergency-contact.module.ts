/**
 * Emergency Contact Module
 *
 * Comprehensive emergency contact management with:
 * - CRUD operations with validation
 * - Primary contact enforcement (max 2 primary contacts)
 * - Multi-channel notification support (SMS, email, voice)
 * - Contact verification workflows
 * - Statistics and reporting
 *
 * @module EmergencyContactModule
 */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Models
import { EmergencyContact } from '../database/models/emergency-contact.model';
import { Student } from '../database/models/student.model';

// Services
import { EmergencyContactService } from './emergency-contact.service';

// Controllers
import { EmergencyContactController } from './emergency-contact.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      EmergencyContact,
      Student, // Required for student validation
    ]),
  ],
  controllers: [EmergencyContactController],
  providers: [EmergencyContactService],
  exports: [EmergencyContactService], // Export for use in other modules
})
export class EmergencyContactModule {}
