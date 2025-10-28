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
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { EmergencyContact } from '../contact/entities/emergency-contact.entity';
import { Student } from '../student/entities/student.entity';

// Services
import { EmergencyContactService } from './emergency-contact.service';

// Controllers
import { EmergencyContactController } from './emergency-contact.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmergencyContact,
      Student, // Required for student validation
    ]),
  ],
  controllers: [EmergencyContactController],
  providers: [EmergencyContactService],
  exports: [EmergencyContactService], // Export for use in other modules
})
export class EmergencyContactModule {}
