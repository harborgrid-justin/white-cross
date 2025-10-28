/**
 * @fileoverview Health Record Allergy Service
 * @module health-record/allergy
 * @description Allergy management within health records context
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class AllergyService {
  private readonly logger = new Logger(AllergyService.name);

  // Mock data store - in real implementation this would use a repository
  private allergies: any[] = [];

  async findOne(id: string, user: any): Promise<any> {
    this.logger.log(`Finding allergy ${id} for user ${user?.id}`);
    const allergy = this.allergies.find(a => a.id === id);
    if (!allergy) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }
    return allergy;
  }

  async findByStudent(studentId: string, user: any): Promise<any[]> {
    this.logger.log(`Finding allergies for student ${studentId} for user ${user?.id}`);
    return this.allergies.filter(a => a.studentId === studentId);
  }

  async create(createAllergyDto: any, user: any): Promise<any> {
    this.logger.log(`Creating allergy for user ${user?.id}`);
    const allergy = {
      id: `allergy-${Date.now()}`,
      ...createAllergyDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.allergies.push(allergy);
    return allergy;
  }

  async update(id: string, updateAllergyDto: any, user: any): Promise<any> {
    this.logger.log(`Updating allergy ${id} for user ${user?.id}`);
    const index = this.allergies.findIndex(a => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }
    this.allergies[index] = {
      ...this.allergies[index],
      ...updateAllergyDto,
      updatedAt: new Date(),
    };
    return this.allergies[index];
  }

  async remove(id: string, user: any): Promise<void> {
    this.logger.log(`Removing allergy ${id} for user ${user?.id}`);
    const index = this.allergies.findIndex(a => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }
    this.allergies.splice(index, 1);
  }

  async addAllergy(data: any): Promise<any> {
    this.logger.log(`Adding allergy for student ${data.studentId}`);
    return { id: 'temp-id', ...data, createdAt: new Date() };
  }

  async getAllergies(studentId: string): Promise<any[]> {
    this.logger.log(`Getting allergies for student ${studentId}`);
    return [];
  }

  async checkMedicationInteractions(studentId: string, medicationId: string): Promise<any> {
    this.logger.log(`Checking medication interactions for student ${studentId}`);
    return { hasInteractions: false, warnings: [] };
  }
}
