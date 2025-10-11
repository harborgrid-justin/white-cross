import { QueryInterface } from 'sequelize';

/**
 * Seeder: Appointments and Incident Reports
 *
 * Creates operational data:
 * - ~75 appointments (15% of students)
 * - ~25 incident reports (5% of students)
 *
 * HIPAA Compliance: All data is de-identified synthetic data.
 * Includes past and future appointments with realistic statuses.
 *
 * Performance: Single batch processing for smaller datasets.
 */

// Helper data
const appointmentTypes = [
  'ROUTINE_CHECKUP',
  'MEDICATION_ADMINISTRATION',
  'INJURY_ASSESSMENT',
  'ILLNESS_EVALUATION',
  'FOLLOW_UP',
];

const appointmentStatuses = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

const incidentTypes = ['INJURY', 'ILLNESS', 'BEHAVIORAL', 'ALLERGIC_REACTION', 'EMERGENCY'];

const incidentSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const incidentLocations = [
  'Classroom',
  'Gymnasium',
  'Cafeteria',
  'Playground',
  'Hallway',
  'Nurse Office',
  'Library',
  'Sports Field',
];

const maleFirstNames = [
  'James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph',
];

const femaleFirstNames = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
];

// Helper functions
const random = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date): Date =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const now = new Date();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    // Get students
    const students = await queryInterface.sequelize.query(
      `SELECT id, "enrollmentDate" FROM "Students" ORDER BY id`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    ) as Array<{ id: number; enrollmentDate: Date }>;

    // Get nurses
    const nurses = await queryInterface.sequelize.query(
      `SELECT id, "firstName" FROM "Users" WHERE role = 'NURSE'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    ) as Array<{ id: number; firstName: string }>;

    if (nurses.length === 0) {
      throw new Error('No nurses found. Please run user seeder first.');
    }

    // ========== APPOINTMENTS (15% of students) ==========
    console.log('Creating appointments...');

    const studentsForAppointments = students.filter(() => Math.random() < 0.15);
    const appointments = [];

    for (const student of studentsForAppointments) {
      const scheduledAt = randomDate(thirtyDaysAgo, sixtyDaysFromNow);
      const isPast = scheduledAt < now;

      let status: string;
      if (isPast) {
        status = Math.random() < 0.9 ? 'COMPLETED' : 'NO_SHOW';
      } else {
        status = 'SCHEDULED';
      }

      const appointmentType = random(appointmentTypes);

      appointments.push({
        studentId: student.id,
        nurseId: random(nurses).id,
        type: appointmentType,
        scheduledAt,
        duration: 30,
        status,
        reason: `${appointmentType.replace(/_/g, ' ').toLowerCase()} appointment`,
        notes: isPast ? 'Appointment completed successfully' : null,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (appointments.length > 0) {
      await queryInterface.bulkInsert('Appointments', appointments, {});
    }

    console.log(`✓ Created ${appointments.length} appointments`);

    // ========== INCIDENT REPORTS (5% of students) ==========
    console.log('Creating incident reports...');

    const studentsWithIncidents = students.filter(() => Math.random() < 0.05);
    const incidents = [];

    for (const student of studentsWithIncidents) {
      const occurredAt = randomDate(
        new Date(student.enrollmentDate),
        now
      );

      const parentNotificationDelay = 60 * 60 * 1000; // 1 hour
      const parentNotifiedAt = new Date(occurredAt.getTime() + parentNotificationDelay);

      // Generate witness names
      const witness1 = `${random([...maleFirstNames, ...femaleFirstNames])} ${random(lastNames)}`;
      const witness2 = `${random([...maleFirstNames, ...femaleFirstNames])} ${random(lastNames)}`;

      const reportingNurse = random(nurses);

      incidents.push({
        studentId: student.id,
        reportedById: reportingNurse.id,
        type: random(incidentTypes),
        severity: random(incidentSeverities),
        description: `Incident occurred at school requiring nurse intervention`,
        location: random(incidentLocations),
        witnesses: JSON.stringify([witness1, witness2]),
        actionsTaken: 'First aid administered, parents notified',
        parentNotified: true,
        parentNotificationMethod: random(['Phone', 'Email', 'In Person']),
        parentNotifiedAt,
        parentNotifiedBy: reportingNurse.firstName,
        followUpRequired: Math.random() < 0.3,
        occurredAt,
        attachments: JSON.stringify([]),
        evidencePhotos: JSON.stringify([]),
        evidenceVideos: JSON.stringify([]),
        createdAt: now,
        updatedAt: now,
      });
    }

    if (incidents.length > 0) {
      await queryInterface.bulkInsert('IncidentReports', incidents, {});
    }

    console.log(`✓ Created ${incidents.length} incident reports`);
    console.log(
      `✓ Total operational data: ${appointments.length} appointments, ${incidents.length} incidents`
    );
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('IncidentReports', {}, {});
    await queryInterface.bulkDelete('Appointments', {}, {});
    console.log('✓ Removed all incident reports and appointments');
  },
};
