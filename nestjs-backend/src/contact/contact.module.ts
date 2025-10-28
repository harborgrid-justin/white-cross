/**
 * Contact Module
 * @description Module for contact management functionality
 *
 * Features:
 * - General contact management (guardians, staff, vendors, providers)
 * - Emergency contact management for students
 * - Contact verification workflow
 * - Notification routing by priority
 * - Student pickup authorization tracking
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './services/contact.service';
import { EmergencyContactService } from './services/emergency-contact.service';
import { ContactController } from './contact.controller';
import { Contact, EmergencyContact } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact, EmergencyContact])
  ],
  providers: [ContactService, EmergencyContactService],
  controllers: [ContactController],
  exports: [ContactService, EmergencyContactService]
})
export class ContactModule {}
