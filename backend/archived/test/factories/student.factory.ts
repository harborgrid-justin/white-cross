/**
 * Student Factory
 *
 * Factory for creating test student data.
 */

export interface CreateStudentOptions {
  id?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  grade?: string;
  studentId?: string;
  schoolId?: string;
  districtId?: string;
  isActive?: boolean;
  gender?: string;
}

export class StudentFactory {
  private static idCounter = 1;

  /**
   * Create a single test student
   */
  static create(overrides: CreateStudentOptions = {}): any {
    const id = overrides.id || `student-${this.idCounter++}-${Date.now()}`;

    return {
      id,
      firstName: overrides.firstName || 'John',
      lastName: overrides.lastName || `Doe${this.idCounter}`,
      dateOfBirth: overrides.dateOfBirth || new Date('2010-01-15'),
      grade: overrides.grade || '5',
      studentId: overrides.studentId || `STU${String(this.idCounter).padStart(6, '0')}`,
      schoolId: overrides.schoolId || 'school-test-1',
      districtId: overrides.districtId || 'district-test-1',
      isActive: overrides.isActive ?? true,
      gender: overrides.gender || 'M',
      createdAt: new Date(),
      updatedAt: new Date(),

      // Mock methods
      save: jest.fn().mockResolvedValue(true),
      destroy: jest.fn().mockResolvedValue(true),
      toJSON: jest.fn().mockReturnThis(),
    };
  }

  /**
   * Create multiple test students
   */
  static createMany(count: number, overrides: CreateStudentOptions = {}): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create a student with allergies
   */
  static createWithAllergies(overrides: CreateStudentOptions = {}): any {
    const student = this.create(overrides);
    student.allergies = [
      {
        id: 'allergy-1',
        allergen: 'Peanuts',
        severity: 'SEVERE',
        reaction: 'Anaphylaxis',
        active: true,
      },
    ];
    return student;
  }

  /**
   * Create a student with medications
   */
  static createWithMedications(overrides: CreateStudentOptions = {}): any {
    const student = this.create(overrides);
    student.medications = [
      {
        id: 'med-1',
        name: 'Albuterol',
        dosage: '2 puffs',
        frequency: 'As needed',
        isActive: true,
      },
    ];
    return student;
  }

  /**
   * Reset the ID counter
   */
  static reset(): void {
    this.idCounter = 1;
  }
}
