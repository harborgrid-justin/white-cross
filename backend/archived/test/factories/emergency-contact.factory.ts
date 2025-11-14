/**
 * Emergency Contact Factory
 *
 * Factory for creating test emergency contact data with realistic contact scenarios.
 * Supports priority levels, verification status, and multi-channel notifications.
 */

export enum ContactPriority {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  TERTIARY = 'TERTIARY',
  EMERGENCY_ONLY = 'EMERGENCY_ONLY',
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
}

export enum PreferredContactMethod {
  ANY = 'ANY',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export enum NotificationChannel {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  VOICE = 'VOICE',
}

export interface CreateEmergencyContactOptions {
  id?: string;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  relationship?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  priority?: ContactPriority;
  isActive?: boolean;
  preferredContactMethod?: PreferredContactMethod;
  verificationStatus?: VerificationStatus;
  lastVerifiedAt?: Date;
  notificationChannels?: string;
  canPickupStudent?: boolean;
  notes?: string;
}

export class EmergencyContactFactory {
  private static idCounter = 1;

  /**
   * Create a single test emergency contact with optional overrides
   */
  static create(overrides: CreateEmergencyContactOptions = {}): any {
    const id = overrides.id || `emergency-contact-${this.idCounter++}-${Date.now()}`;

    return {
      id,
      studentId: overrides.studentId || 'student-test-1',
      firstName: overrides.firstName || 'Jane',
      lastName: overrides.lastName || 'Doe',
      relationship: overrides.relationship || 'Mother',
      phoneNumber: overrides.phoneNumber || '+14155551234',
      email: overrides.email || `jane.doe${this.idCounter}@example.com`,
      address: overrides.address || '123 Main St, Anytown, ST 12345',
      priority: overrides.priority || ContactPriority.PRIMARY,
      isActive: overrides.isActive ?? true,
      preferredContactMethod: overrides.preferredContactMethod || PreferredContactMethod.ANY,
      verificationStatus: overrides.verificationStatus || VerificationStatus.VERIFIED,
      lastVerifiedAt: overrides.lastVerifiedAt || new Date(),
      notificationChannels:
        overrides.notificationChannels ||
        JSON.stringify([NotificationChannel.SMS, NotificationChannel.EMAIL]),
      canPickupStudent: overrides.canPickupStudent ?? true,
      notes: overrides.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),

      // Virtual getters
      get fullName() {
        return `${this.firstName} ${this.lastName}`;
      },
      get isPrimary() {
        return this.priority === ContactPriority.PRIMARY;
      },
      get isVerified() {
        return this.verificationStatus === VerificationStatus.VERIFIED;
      },
      get parsedNotificationChannels() {
        if (!this.notificationChannels) return [];
        try {
          return JSON.parse(this.notificationChannels);
        } catch {
          return [];
        }
      },

      // Mock methods
      save: jest.fn().mockResolvedValue(true),
      destroy: jest.fn().mockResolvedValue(true),
      toJSON: jest.fn().mockReturnThis(),
    };
  }

  /**
   * Create multiple test emergency contacts
   */
  static createMany(count: number, overrides: CreateEmergencyContactOptions = {}): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create a primary emergency contact (mother)
   */
  static createPrimaryMother(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      firstName: 'Jane',
      lastName: 'Smith',
      relationship: 'Mother',
      phoneNumber: '+14155551001',
      email: 'jane.smith@example.com',
      priority: ContactPriority.PRIMARY,
      canPickupStudent: true,
      verificationStatus: VerificationStatus.VERIFIED,
    });
  }

  /**
   * Create a primary emergency contact (father)
   */
  static createPrimaryFather(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      firstName: 'John',
      lastName: 'Smith',
      relationship: 'Father',
      phoneNumber: '+14155551002',
      email: 'john.smith@example.com',
      priority: ContactPriority.PRIMARY,
      canPickupStudent: true,
      verificationStatus: VerificationStatus.VERIFIED,
    });
  }

  /**
   * Create a secondary emergency contact
   */
  static createSecondary(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      firstName: 'Margaret',
      lastName: 'Johnson',
      relationship: 'Grandmother',
      phoneNumber: '+14155552001',
      email: 'margaret.j@example.com',
      priority: ContactPriority.SECONDARY,
      canPickupStudent: true,
      verificationStatus: VerificationStatus.VERIFIED,
    });
  }

  /**
   * Create a tertiary emergency contact
   */
  static createTertiary(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      firstName: 'Robert',
      lastName: 'Wilson',
      relationship: 'Uncle',
      phoneNumber: '+14155553001',
      email: 'robert.w@example.com',
      priority: ContactPriority.TERTIARY,
      canPickupStudent: false,
      verificationStatus: VerificationStatus.VERIFIED,
    });
  }

  /**
   * Create an emergency-only contact
   */
  static createEmergencyOnly(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      firstName: 'Dr. Sarah',
      lastName: 'Anderson',
      relationship: 'Family Physician',
      phoneNumber: '+14155554001',
      email: 'dr.anderson@medical.com',
      priority: ContactPriority.EMERGENCY_ONLY,
      canPickupStudent: false,
      verificationStatus: VerificationStatus.VERIFIED,
      preferredContactMethod: PreferredContactMethod.PHONE,
    });
  }

  /**
   * Create an unverified contact
   */
  static createUnverified(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      verificationStatus: VerificationStatus.UNVERIFIED,
      lastVerifiedAt: null,
    });
  }

  /**
   * Create a pending verification contact
   */
  static createPendingVerification(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      verificationStatus: VerificationStatus.PENDING,
      lastVerifiedAt: null,
    });
  }

  /**
   * Create a failed verification contact
   */
  static createFailedVerification(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      verificationStatus: VerificationStatus.FAILED,
      lastVerifiedAt: null,
      notes: 'Phone number could not be verified',
    });
  }

  /**
   * Create an inactive contact
   */
  static createInactive(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      isActive: false,
      notes: 'Contact moved out of state',
    });
  }

  /**
   * Create a contact who can pick up student
   */
  static createWithPickupAuthorization(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      canPickupStudent: true,
      verificationStatus: VerificationStatus.VERIFIED,
      notes: 'Authorized to pick up student',
    });
  }

  /**
   * Create a contact who cannot pick up student
   */
  static createWithoutPickupAuthorization(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      canPickupStudent: false,
      notes: 'Emergency contact only - not authorized for pickup',
    });
  }

  /**
   * Create a contact with phone-only preference
   */
  static createPhoneOnly(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      preferredContactMethod: PreferredContactMethod.PHONE,
      notificationChannels: JSON.stringify([NotificationChannel.VOICE]),
      email: null,
    });
  }

  /**
   * Create a contact with email-only preference
   */
  static createEmailOnly(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      preferredContactMethod: PreferredContactMethod.EMAIL,
      notificationChannels: JSON.stringify([NotificationChannel.EMAIL]),
    });
  }

  /**
   * Create a contact with SMS preference
   */
  static createSMSOnly(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      preferredContactMethod: PreferredContactMethod.SMS,
      notificationChannels: JSON.stringify([NotificationChannel.SMS]),
    });
  }

  /**
   * Create a contact with all notification channels
   */
  static createWithAllChannels(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      preferredContactMethod: PreferredContactMethod.ANY,
      notificationChannels: JSON.stringify([
        NotificationChannel.SMS,
        NotificationChannel.EMAIL,
        NotificationChannel.VOICE,
      ]),
    });
  }

  /**
   * Create a guardian contact (parent or legal guardian)
   */
  static createGuardian(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      relationship: 'Legal Guardian',
      priority: ContactPriority.PRIMARY,
      canPickupStudent: true,
      verificationStatus: VerificationStatus.VERIFIED,
    });
  }

  /**
   * Create a grandparent contact
   */
  static createGrandparent(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      firstName: 'Mary',
      lastName: 'Williams',
      relationship: 'Grandmother',
      phoneNumber: '+14155555001',
      email: 'mary.w@example.com',
      priority: ContactPriority.SECONDARY,
      canPickupStudent: true,
    });
  }

  /**
   * Create a sibling contact (adult)
   */
  static createAdultSibling(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      firstName: 'Michael',
      lastName: 'Smith',
      relationship: 'Brother',
      phoneNumber: '+14155556001',
      email: 'michael.s@example.com',
      priority: ContactPriority.TERTIARY,
      canPickupStudent: false,
    });
  }

  /**
   * Create a neighbor contact
   */
  static createNeighbor(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      firstName: 'Susan',
      lastName: 'Davis',
      relationship: 'Neighbor',
      phoneNumber: '+14155557001',
      email: 'susan.d@example.com',
      priority: ContactPriority.TERTIARY,
      canPickupStudent: false,
    });
  }

  /**
   * Create a family friend contact
   */
  static createFamilyFriend(overrides: CreateEmergencyContactOptions = {}): any {
    return this.create({
      ...overrides,
      firstName: 'Lisa',
      lastName: 'Brown',
      relationship: 'Family Friend',
      phoneNumber: '+14155558001',
      email: 'lisa.b@example.com',
      priority: ContactPriority.TERTIARY,
      canPickupStudent: true,
      notes: 'Close family friend - can pick up in emergencies',
    });
  }

  /**
   * Create a complete set of emergency contacts for a student
   */
  static createCompleteSet(studentId: string): any[] {
    return [
      this.createPrimaryMother({ studentId }),
      this.createPrimaryFather({ studentId }),
      this.createSecondary({ studentId }),
      this.createEmergencyOnly({ studentId }),
    ];
  }

  /**
   * Reset the ID counter (useful between test suites)
   */
  static reset(): void {
    this.idCounter = 1;
  }
}
