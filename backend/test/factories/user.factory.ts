/**
 * User Factory
 *
 * Factory for creating test user data with realistic values.
 * Supports customization and bulk creation.
 */

import { UserRole } from '../../src/database/models/user.model';

export interface CreateUserOptions {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
  schoolId?: string;
  districtId?: string;
}

export class UserFactory {
  private static idCounter = 1;

  /**
   * Create a single test user with optional overrides
   */
  static create(overrides: CreateUserOptions = {}): any {
    const id = `user-${this.idCounter++}-${Date.now()}`;

    return {
      id,
      email: overrides.email || `test.user${this.idCounter}@whitecross.edu`,
      password: overrides.password || '$2b$10$hashedTestPassword123',
      firstName: overrides.firstName || 'Test',
      lastName: overrides.lastName || `User${this.idCounter}`,
      role: overrides.role || UserRole.NURSE,
      isActive: overrides.isActive ?? true,
      schoolId: overrides.schoolId || 'school-test-1',
      districtId: overrides.districtId || 'district-test-1',
      failedLoginAttempts: 0,
      lockoutUntil: null,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),

      // Mock methods
      comparePassword: jest.fn().mockResolvedValue(true),
      isAccountLocked: jest.fn().mockReturnValue(false),
      incrementFailedLoginAttempts: jest.fn(),
      resetFailedLoginAttempts: jest.fn(),
      toSafeObject: jest.fn().mockReturnValue({
        id,
        email: overrides.email || `test.user${this.idCounter}@whitecross.edu`,
        firstName: overrides.firstName || 'Test',
        lastName: overrides.lastName || `User${this.idCounter}`,
        role: overrides.role || UserRole.NURSE,
        isActive: overrides.isActive ?? true,
      }),
      save: jest.fn().mockResolvedValue(true),
      destroy: jest.fn().mockResolvedValue(true),
    };
  }

  /**
   * Create multiple test users
   */
  static createMany(count: number, overrides: CreateUserOptions = {}): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create a nurse user
   */
  static createNurse(overrides: CreateUserOptions = {}): any {
    return this.create({ ...overrides, role: UserRole.NURSE });
  }

  /**
   * Create an admin user
   */
  static createAdmin(overrides: CreateUserOptions = {}): any {
    return this.create({ ...overrides, role: UserRole.ADMIN });
  }

  /**
   * Create a doctor user
   */
  static createDoctor(overrides: CreateUserOptions = {}): any {
    return this.create({ ...overrides, role: UserRole.DOCTOR });
  }

  /**
   * Create a parent user
   */
  static createParent(overrides: CreateUserOptions = {}): any {
    return this.create({ ...overrides, role: UserRole.PARENT });
  }

  /**
   * Create an inactive user
   */
  static createInactive(overrides: CreateUserOptions = {}): any {
    return this.create({ ...overrides, isActive: false });
  }

  /**
   * Create a locked user
   */
  static createLocked(overrides: CreateUserOptions = {}): any {
    const user = this.create(overrides);
    user.failedLoginAttempts = 5;
    user.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000);
    user.isAccountLocked = jest.fn().mockReturnValue(true);
    return user;
  }

  /**
   * Reset the ID counter (useful between test suites)
   */
  static reset(): void {
    this.idCounter = 1;
  }
}
