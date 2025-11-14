/**
 * Database Seed Helper
 *
 * Utilities for seeding test databases with realistic healthcare data.
 * Provides methods for creating complete healthcare scenarios with students,
 * health records, medications, appointments, and emergency contacts.
 */

import { Sequelize } from 'sequelize-typescript';
import { UserFactory } from '../factories/user.factory';
import { StudentFactory } from '../factories/student.factory';
import { HealthRecordFactory } from '../factories/health-record.factory';
import { MedicationFactory } from '../factories/medication.factory';
import { AppointmentFactory } from '../factories/appointment.factory';
import { EmergencyContactFactory } from '../factories/emergency-contact.factory';

export interface HealthcareScenarioOptions {
  studentCount?: number;
  includeHealthRecords?: boolean;
  includeMedications?: boolean;
  includeAppointments?: boolean;
  includeEmergencyContacts?: boolean;
  includeUsers?: boolean;
}

export interface MultiTenantDataOptions {
  districtCount?: number;
  schoolsPerDistrict?: number;
  studentsPerSchool?: number;
}

export class DatabaseSeedHelper {
  /**
   * Seed a complete healthcare scenario with students and related data
   *
   * @param sequelize - Sequelize instance
   * @param options - Scenario configuration options
   * @returns Created entities
   */
  static async seedHealthcareScenario(
    sequelize: Sequelize,
    options: HealthcareScenarioOptions = {},
  ): Promise<any> {
    const {
      studentCount = 5,
      includeHealthRecords = true,
      includeMedications = true,
      includeAppointments = true,
      includeEmergencyContacts = true,
      includeUsers = true,
    } = options;

    const seededData: any = {
      users: [],
      students: [],
      healthRecords: [],
      medications: [],
      appointments: [],
      emergencyContacts: [],
    };

    // Create users (nurses, admins, counselors)
    if (includeUsers) {
      const adminUser = UserFactory.createAdmin();
      const nurseUser = UserFactory.createNurse();
      const counselorUser = UserFactory.createCounselor();

      seededData.users = [adminUser, nurseUser, counselorUser];

      // If using actual database, save users
      if (sequelize.models.User) {
        for (const user of seededData.users) {
          await sequelize.models.User.create(user);
        }
      }
    }

    // Create students
    for (let i = 0; i < studentCount; i++) {
      const student = StudentFactory.create({
        firstName: `Student${i + 1}`,
        lastName: `Test${i + 1}`,
        grade: String(Math.floor(Math.random() * 12) + 1),
      });

      seededData.students.push(student);

      // If using actual database, save student
      if (sequelize.models.Student) {
        await sequelize.models.Student.create(student);
      }

      // Create emergency contacts for student
      if (includeEmergencyContacts) {
        const contacts = EmergencyContactFactory.createCompleteSet(student.id);
        seededData.emergencyContacts.push(...contacts);

        if (sequelize.models.EmergencyContact) {
          for (const contact of contacts) {
            await sequelize.models.EmergencyContact.create(contact);
          }
        }
      }

      // Create health records for student
      if (includeHealthRecords) {
        const healthRecords = [
          HealthRecordFactory.createCheckup({ studentId: student.id }),
          HealthRecordFactory.createVaccination({ studentId: student.id }),
          HealthRecordFactory.createScreening({ studentId: student.id }),
        ];

        seededData.healthRecords.push(...healthRecords);

        if (sequelize.models.HealthRecord) {
          for (const record of healthRecords) {
            await sequelize.models.HealthRecord.create(record);
          }
        }
      }

      // Create appointments for student
      if (includeAppointments) {
        const appointments = [
          AppointmentFactory.createUpcoming({ studentId: student.id }),
          AppointmentFactory.createToday({ studentId: student.id }),
        ];

        seededData.appointments.push(...appointments);

        if (sequelize.models.Appointment) {
          for (const appointment of appointments) {
            await sequelize.models.Appointment.create(appointment);
          }
        }
      }
    }

    // Create common medications
    if (includeMedications) {
      const medications = [
        MedicationFactory.createAlbuterol(),
        MedicationFactory.createEpiPen(),
        MedicationFactory.createOTC({ name: 'Acetaminophen' }),
        MedicationFactory.createOTC({ name: 'Ibuprofen' }),
        MedicationFactory.createInsulin(),
      ];

      seededData.medications = medications;

      if (sequelize.models.Medication) {
        for (const medication of medications) {
          await sequelize.models.Medication.create(medication);
        }
      }
    }

    return seededData;
  }

  /**
   * Seed multi-tenant data (districts, schools, students)
   *
   * @param sequelize - Sequelize instance
   * @param options - Multi-tenant data options
   * @returns Created entities
   */
  static async seedMultiTenantData(
    sequelize: Sequelize,
    options: MultiTenantDataOptions = {},
  ): Promise<any> {
    const {
      districtCount = 2,
      schoolsPerDistrict = 3,
      studentsPerSchool = 10,
    } = options;

    const seededData: any = {
      districts: [],
      schools: [],
      students: [],
      users: [],
    };

    for (let d = 0; d < districtCount; d++) {
      const district = {
        id: `district-test-${d + 1}`,
        name: `Test District ${d + 1}`,
        code: `TD${String(d + 1).padStart(3, '0')}`,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      seededData.districts.push(district);

      if (sequelize.models.District) {
        await sequelize.models.District.create(district);
      }

      // Create district admin
      const districtAdmin = UserFactory.create({
        role: 'DISTRICT_ADMIN' as any,
        districtId: district.id,
        email: `admin.district${d + 1}@whitecross.edu`,
      });

      seededData.users.push(districtAdmin);

      if (sequelize.models.User) {
        await sequelize.models.User.create(districtAdmin);
      }

      // Create schools for district
      for (let s = 0; s < schoolsPerDistrict; s++) {
        const school = {
          id: `school-test-${d + 1}-${s + 1}`,
          name: `Test School ${d + 1}-${s + 1}`,
          code: `TS${String(d + 1).padStart(2, '0')}${String(s + 1).padStart(2, '0')}`,
          districtId: district.id,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        seededData.schools.push(school);

        if (sequelize.models.School) {
          await sequelize.models.School.create(school);
        }

        // Create school admin and nurse
        const schoolAdmin = UserFactory.createSchoolAdmin({
          schoolId: school.id,
          districtId: district.id,
          email: `admin.school${d + 1}-${s + 1}@whitecross.edu`,
        });

        const nurse = UserFactory.createNurse({
          schoolId: school.id,
          districtId: district.id,
          email: `nurse.school${d + 1}-${s + 1}@whitecross.edu`,
        });

        seededData.users.push(schoolAdmin, nurse);

        if (sequelize.models.User) {
          await sequelize.models.User.create(schoolAdmin);
          await sequelize.models.User.create(nurse);
        }

        // Create students for school
        for (let st = 0; st < studentsPerSchool; st++) {
          const student = StudentFactory.create({
            schoolId: school.id,
            districtId: district.id,
            studentId: `S${String(d + 1).padStart(2, '0')}${String(s + 1).padStart(2, '0')}${String(st + 1).padStart(4, '0')}`,
          });

          seededData.students.push(student);

          if (sequelize.models.Student) {
            await sequelize.models.Student.create(student);
          }
        }
      }
    }

    return seededData;
  }

  /**
   * Seed a student with complete health profile
   *
   * @param sequelize - Sequelize instance
   * @param studentId - Student ID
   * @returns Created health data
   */
  static async seedStudentHealthProfile(sequelize: Sequelize, studentId: string): Promise<any> {
    const healthData: any = {
      healthRecords: [],
      appointments: [],
      emergencyContacts: [],
    };

    // Create diverse health records
    const healthRecords = [
      HealthRecordFactory.createCheckup({ studentId }),
      HealthRecordFactory.createVaccination({ studentId }),
      HealthRecordFactory.createIllness({ studentId }),
      HealthRecordFactory.createInjury({ studentId }),
      HealthRecordFactory.createScreening({ studentId }),
      HealthRecordFactory.createLabResult({ studentId }),
    ];

    healthData.healthRecords = healthRecords;

    if (sequelize.models.HealthRecord) {
      for (const record of healthRecords) {
        await sequelize.models.HealthRecord.create(record);
      }
    }

    // Create appointments
    const appointments = [
      AppointmentFactory.createUpcoming({ studentId }),
      AppointmentFactory.createToday({ studentId }),
      AppointmentFactory.createCompleted({ studentId }),
      AppointmentFactory.createRecurring({ studentId }),
    ];

    healthData.appointments = appointments;

    if (sequelize.models.Appointment) {
      for (const appointment of appointments) {
        await sequelize.models.Appointment.create(appointment);
      }
    }

    // Create emergency contacts
    const emergencyContacts = EmergencyContactFactory.createCompleteSet(studentId);

    healthData.emergencyContacts = emergencyContacts;

    if (sequelize.models.EmergencyContact) {
      for (const contact of emergencyContacts) {
        await sequelize.models.EmergencyContact.create(contact);
      }
    }

    return healthData;
  }

  /**
   * Seed medication inventory
   *
   * @param sequelize - Sequelize instance
   * @returns Created medications
   */
  static async seedMedicationInventory(sequelize: Sequelize): Promise<any[]> {
    const medications = [
      // OTC medications
      MedicationFactory.createOTC({ name: 'Acetaminophen', strength: '500 mg' }),
      MedicationFactory.createOTC({ name: 'Ibuprofen', strength: '200 mg' }),

      // Emergency medications
      MedicationFactory.createAlbuterol(),
      MedicationFactory.createEpiPen(),

      // Chronic condition medications
      MedicationFactory.createInsulin(),
      MedicationFactory.createADHDMedication(),
      MedicationFactory.createSeizureMedication(),

      // Allergy medications
      MedicationFactory.createAllergyMedication(),

      // Controlled substances (various schedules)
      MedicationFactory.createScheduleII(),
      MedicationFactory.createScheduleIII(),
      MedicationFactory.createScheduleIV(),
    ];

    if (sequelize.models.Medication) {
      for (const medication of medications) {
        await sequelize.models.Medication.create(medication);
      }
    }

    return medications;
  }

  /**
   * Seed emergency scenario data
   *
   * @param sequelize - Sequelize instance
   * @returns Created emergency data
   */
  static async seedEmergencyScenario(sequelize: Sequelize): Promise<any> {
    const student = StudentFactory.create();

    if (sequelize.models.Student) {
      await sequelize.models.Student.create(student);
    }

    const emergencyData: any = {
      student,
      healthRecords: [],
      appointments: [],
      emergencyContacts: [],
    };

    // Emergency health record
    const emergencyRecord = HealthRecordFactory.createEmergency({ studentId: student.id });
    emergencyData.healthRecords.push(emergencyRecord);

    if (sequelize.models.HealthRecord) {
      await sequelize.models.HealthRecord.create(emergencyRecord);
    }

    // Emergency appointment
    const emergencyAppointment = AppointmentFactory.createEmergency({ studentId: student.id });
    emergencyData.appointments.push(emergencyAppointment);

    if (sequelize.models.Appointment) {
      await sequelize.models.Appointment.create(emergencyAppointment);
    }

    // Emergency contacts
    const emergencyContacts = [
      EmergencyContactFactory.createPrimaryMother({ studentId: student.id }),
      EmergencyContactFactory.createEmergencyOnly({ studentId: student.id }),
    ];

    emergencyData.emergencyContacts = emergencyContacts;

    if (sequelize.models.EmergencyContact) {
      for (const contact of emergencyContacts) {
        await sequelize.models.EmergencyContact.create(contact);
      }
    }

    return emergencyData;
  }

  /**
   * Clear all test data from database
   *
   * @param sequelize - Sequelize instance
   */
  static async clearAllData(sequelize: Sequelize): Promise<void> {
    const models = Object.values(sequelize.models);

    // Reverse order to handle foreign key constraints
    for (const model of models.reverse()) {
      try {
        await model.destroy({ where: {}, force: true, truncate: true });
      } catch (error) {
        // Ignore errors for models that don't exist or have constraints
        console.warn(`Could not clear ${model.name}:`, error.message);
      }
    }
  }

  /**
   * Reset all factory counters
   */
  static resetFactories(): void {
    UserFactory.reset();
    StudentFactory.reset();
    HealthRecordFactory.reset();
    MedicationFactory.reset();
    AppointmentFactory.reset();
    EmergencyContactFactory.reset();
  }

  /**
   * Seed data and return cleanup function
   *
   * @param sequelize - Sequelize instance
   * @param seedFunction - Function to seed data
   * @returns Cleanup function
   */
  static async withSeededData(
    sequelize: Sequelize,
    seedFunction: (seq: Sequelize) => Promise<any>,
  ): Promise<() => Promise<void>> {
    await seedFunction(sequelize);

    return async () => {
      await this.clearAllData(sequelize);
      this.resetFactories();
    };
  }
}
