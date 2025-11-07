import { Command, CommandRunner } from 'nest-commander';
import { InjectModel } from '@nestjs/sequelize';
import { IncidentReport } from '../database/models/incident-report.model';
import { Student } from '../database/models/student.model';
import { User } from '../database/models/user.model';
import { generateIncidents } from '../database/seeds/incidents.seed';

@Command({
  name: 'seed:incidents',
  description: 'Seed incident reports into the database',
})
export class SeedIncidentsCommand extends CommandRunner {
  constructor(
    @InjectModel(IncidentReport)
    private incidentModel: typeof IncidentReport,
    @InjectModel(Student)
    private studentModel: typeof Student,
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super();
  }

  async run(): Promise<void> {
    console.log('🚀 Incident Reports Seed Script\n');

    try {
      // Check if incidents already exist
      const existingCount = await this.incidentModel.count();

      if (existingCount > 0) {
        console.log(
          `⚠️  Found ${existingCount} existing incident reports in database`,
        );
        console.log(
          '❌ Skipping seed to avoid duplicates. Clear incident_reports table first if needed.\n',
        );
        return;
      }

      // Get all students
      const students = await this.studentModel.findAll({
        attributes: ['id'],
        where: { isActive: true },
      });

      if (students.length === 0) {
        console.log(
          '❌ No students found in database. Please seed students first.',
        );
        console.log('   Run: npm run seed:students\n');
        return;
      }

      const studentIds = students.map((s) => s.id);
      console.log(`✅ Found ${studentIds.length} students`);

      // Get all nurses and admins who can report incidents
      const nurses = await this.userModel.findAll({
        attributes: ['id'],
        where: {
          role: ['NURSE', 'SCHOOL_ADMIN', 'ADMIN'],
          isActive: true,
        },
      });

      if (nurses.length === 0) {
        console.log(
          '❌ No nurses or admins found in database to report incidents.',
        );
        console.log(
          '   At least one user with role NURSE, SCHOOL_ADMIN, or ADMIN is required.\n',
        );
        return;
      }

      const nurseIds = nurses.map((n) => n.id);
      console.log(`✅ Found ${nurseIds.length} nurses/admins`);

      // Generate incident data
      const maxIncidentsPerStudent = 3;
      console.log(
        `📝 Generating incident reports (up to ${maxIncidentsPerStudent} per student)...`,
      );
      const incidents = generateIncidents(
        studentIds,
        nurseIds,
        maxIncidentsPerStudent,
      );

      if (incidents.length === 0) {
        console.log(
          '⚠️  No incidents were generated. This is normal - not all students have incidents.',
        );
        return;
      }

      console.log(`   Generated ${incidents.length} incident reports`);

      // Bulk insert incidents in batches to avoid memory issues
      const batchSize = 50;
      let totalCreated = 0;

      console.log('💾 Inserting incident reports into database...');

      // Debug: Check first incident structure
      if (incidents.length > 0) {
        console.log('   Sample incident keys:', Object.keys(incidents[0]));
      }

      for (let i = 0; i < incidents.length; i += batchSize) {
        const batch = incidents.slice(i, i + batchSize);

        // Clean each incident to remove any extra fields
        const cleanedBatch = batch.map((incident) => ({
          studentId: incident.studentId,
          reportedById: incident.reportedById,
          type: incident.type,
          severity: incident.severity,
          status: incident.status,
          description: incident.description,
          location: incident.location,
          witnesses: incident.witnesses,
          actionsTaken: incident.actionsTaken,
          parentNotified: incident.parentNotified,
          parentNotificationMethod: incident.parentNotificationMethod,
          parentNotifiedAt: incident.parentNotifiedAt,
          parentNotifiedBy: incident.parentNotifiedBy,
          followUpRequired: incident.followUpRequired,
          followUpNotes: incident.followUpNotes,
          attachments: incident.attachments,
          evidencePhotos: incident.evidencePhotos,
          evidenceVideos: incident.evidenceVideos,
          insuranceClaimNumber: incident.insuranceClaimNumber,
          insuranceClaimStatus: incident.insuranceClaimStatus,
          legalComplianceStatus: incident.legalComplianceStatus,
          occurredAt: incident.occurredAt,
          createdBy: incident.createdBy,
          updatedBy: incident.updatedBy,
        }));

        const created = await this.incidentModel.bulkCreate(
          cleanedBatch as any[],
          {
            validate: true,
            returning: true,
          },
        );
        totalCreated += created.length;
        console.log(
          `   Inserted batch ${Math.floor(i / batchSize) + 1}: ${created.length} incidents (Total: ${totalCreated})`,
        );
      }

      console.log(`✅ Successfully seeded ${totalCreated} incident reports`);

      // Show statistics
      const stats = await this.incidentModel.findAll({
        attributes: [
          'type',
          [
            this.incidentModel.sequelize!.fn(
              'COUNT',
              this.incidentModel.sequelize!.col('id'),
            ),
            'count',
          ],
        ],
        group: ['type'],
        raw: true,
      });

      console.log('\nIncident reports by type:');
      stats.forEach((stat: any) => {
        console.log(`  - ${stat.type}: ${stat.count}`);
      });

      // Show sample incidents
      const sampleIncidents = await this.incidentModel.findAll({
        limit: 3,
        attributes: [
          'type',
          'severity',
          'description',
          'location',
          'occurredAt',
        ],
        order: [['occurredAt', 'DESC']],
      });

      console.log('\nRecent sample incidents:');
      sampleIncidents.forEach((incident) => {
        console.log(
          `  - [${incident.severity}] ${incident.type} at ${incident.location}`,
        );
        console.log(`    "${incident.description.substring(0, 60)}..."`);
        console.log(`    Occurred: ${incident.occurredAt.toLocaleString()}`);
      });
      console.log('');
    } catch (error) {
      console.error('❌ Error seeding incident reports:', error.message);
      if (error.errors) {
        error.errors.forEach((e: any) => {
          console.error(`   - ${e.message}`);
        });
      }
      throw error;
    }
  }
}
