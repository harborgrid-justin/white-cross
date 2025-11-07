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
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactService } from '@/contact/services';
import { EmergencyContactService } from '@/contact/services';
import { ContactController } from './contact.controller';
import { Contact } from '@/database';
import { EmergencyContact } from '@/database';

@Module({
  imports: [SequelizeModule.forFeature([Contact, EmergencyContact])],
  providers: [ContactService, EmergencyContactService],
  controllers: [ContactController],
  exports: [ContactService, EmergencyContactService],
})
export class ContactModule {}
