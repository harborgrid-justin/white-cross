/**
 * Student Seed Data (Placeholder)
 * Students seeding not yet implemented in new system
 */

import { Gender } from '../models/student.model';

export interface StudentSeedData {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  grade: string;
  schoolId?: string;
  districtId?: string;
  emergencyContacts?: any[];
  healthRecords?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const generateStudents = async (): Promise<StudentSeedData[]> => {
  console.log('generateStudents: Placeholder - not implemented');
  return [];
};

export const seedStudents = async (): Promise<void> => {
  console.log('seedStudents: Placeholder - not implemented');
};