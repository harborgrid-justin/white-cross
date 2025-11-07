import { Command, CommandRunner } from 'nest-commander';
import { InjectModel } from '@nestjs/sequelize';
import { HealthRecord } from '../database/models/health-record.model';
import { Student } from '../database/models/student.model';
import { v4 as uuidv4 } from 'uuid';

@Command({
  name: 'seed:health-records',
  description: 'Seed 100 health records into the database',
})
export class SeedHealthRecordsCommand extends CommandRunner {
  constructor(
    @InjectModel(HealthRecord)
    private healthRecordModel: typeof HealthRecord,
    @InjectModel(Student)
    private studentModel: typeof Student,
  ) {
    super();
  }

  async run(): Promise<void> {
    console.log('🚀 Health Records Seed Script\n');

    try {
      // Get all active students
      const students = await this.studentModel.findAll({
        where: { isActive: true },
        attributes: ['id'],
        limit: 50,
      });

      if (students.length === 0) {
        console.error(
          '❌ No students found in database. Please seed students first.',
        );
        return;
      }

      console.log(`✓ Found ${students.length} students\n`);
      console.log('🌱 Starting health records seeding...');

      const healthRecords = this.generateHealthRecords(students);

      // Bulk insert all records
      await this.healthRecordModel.bulkCreate(healthRecords, {
        validate: true,
        individualHooks: false,
      });

      console.log(
        `✅ Successfully seeded ${healthRecords.length} health records`,
      );

      // Summary statistics
      this.printStatistics(healthRecords);
    } catch (error) {
      console.error('❌ Error seeding health records:', error);
      throw error;
    }
  }

  private generateHealthRecords(students: Student[]): any[] {
    const recordTypes = [
      'CHECKUP',
      'VACCINATION',
      'ILLNESS',
      'INJURY',
      'SCREENING',
      'PHYSICAL_EXAM',
      'MENTAL_HEALTH',
      'DENTAL',
      'VISION',
      'HEARING',
      'EXAMINATION',
      'ALLERGY_DOCUMENTATION',
      'CHRONIC_CONDITION_REVIEW',
      'GROWTH_ASSESSMENT',
      'VITAL_SIGNS_CHECK',
      'EMERGENCY_VISIT',
      'FOLLOW_UP',
      'CONSULTATION',
      'DIAGNOSTIC_TEST',
      'PROCEDURE',
    ];

    const titles = {
      CHECKUP: [
        'Annual Health Checkup',
        'Routine Health Assessment',
        'Wellness Visit',
        'Health Screening',
      ],
      VACCINATION: [
        'Flu Vaccination',
        'COVID-19 Booster',
        'Tetanus Shot',
        'HPV Vaccine',
      ],
      ILLNESS: [
        'Common Cold Treatment',
        'Flu Diagnosis',
        'Strep Throat',
        'Stomach Bug',
      ],
      INJURY: [
        'Sports Injury Assessment',
        'Playground Fall',
        'Sprained Ankle',
        'Minor Cut Treatment',
      ],
      SCREENING: [
        'Vision Screening',
        'Hearing Test',
        'Scoliosis Screening',
        'BMI Assessment',
      ],
      PHYSICAL_EXAM: [
        'Annual Physical Examination',
        'Sports Physical',
        'School Entry Physical',
        'Pre-participation Exam',
      ],
      MENTAL_HEALTH: [
        'Anxiety Assessment',
        'Depression Screening',
        'Stress Management Counseling',
        'Behavioral Evaluation',
      ],
      DENTAL: [
        'Dental Checkup',
        'Cavity Treatment',
        'Teeth Cleaning',
        'Orthodontic Consultation',
      ],
      VISION: [
        'Eye Exam',
        'Vision Correction',
        'Glasses Prescription',
        'Contact Lens Fitting',
      ],
      HEARING: [
        'Hearing Test',
        'Audiometry Screening',
        'Ear Infection Check',
        'Hearing Aid Assessment',
      ],
    };

    const providers = [
      'Dr. Sarah Johnson',
      'Dr. Michael Chen',
      'Dr. Emily Rodriguez',
      'Dr. James Williams',
      'Dr. Lisa Anderson',
      'Dr. David Martinez',
      'Dr. Jennifer Taylor',
      'Dr. Robert Thompson',
      'Nurse Practitioner Amanda Brown',
      'Physician Assistant Chris Davis',
    ];

    const facilities = [
      'School Health Center',
      'Community Health Clinic',
      "Children's Medical Center",
      'District Health Office',
      'Urgent Care Center',
      'Family Practice Associates',
      'Pediatric Care Clinic',
      'Student Wellness Center',
    ];

    const diagnoses = [
      'Healthy - No concerns',
      'Seasonal Allergies',
      'Minor Upper Respiratory Infection',
      'Mild Asthma',
      'Well-developed for age',
      'Vision Correction Needed',
      'Hearing within normal limits',
      'Immunizations up to date',
      'Growing appropriately',
      'No acute concerns',
    ];

    const icdCodes = [
      'Z00.00',
      'Z23',
      'J06.9',
      'J45.20',
      'H52.0',
      'Z01.0',
      'J30.1',
      'S93.40XA',
      'K52.9',
      'R51.9',
    ];

    const treatments = [
      'Continue regular diet and exercise. Follow up in one year.',
      'Prescribed medication as needed. Monitor symptoms.',
      'Rest and fluids recommended. Return if symptoms worsen.',
      'Physical therapy exercises provided. Follow up in 2 weeks.',
      'Dietary recommendations discussed. Schedule follow-up.',
      'No treatment required. Maintain current health practices.',
      'Referred to specialist for further evaluation.',
      'Over-the-counter medication recommended as needed.',
      'Observation and monitoring. Report any changes.',
      'Health education provided. Continue preventive care.',
    ];

    const healthRecords: any[] = [];

    for (let i = 0; i < 100; i++) {
      const student = this.randomItem(students);
      const recordType = this.randomItem(recordTypes);
      const recordDate = this.randomDate(730, 30);

      const titleOptions = (titles as Record<string, string[]>)[recordType] || ['Health Record'];
      const title = this.randomItem(titleOptions);

      const provider = this.randomItem(providers);
      const facility = this.randomItem(facilities);
      const diagnosis = this.randomItem(diagnoses);
      const icdCode = this.randomItem(icdCodes);
      const treatment = this.randomItem(treatments);

      const followUpRequired = Math.random() > 0.7;
      const followUpDate = followUpRequired ? this.randomDate(-30, -90) : null;
      const followUpCompleted = followUpRequired ? Math.random() > 0.6 : false;
      const isConfidential = Math.random() > 0.9;

      const record = {
        id: uuidv4(),
        studentId: student.id,
        recordType,
        title,
        description: `${title} conducted on ${recordDate.toLocaleDateString()}. Patient was evaluated and ${diagnosis.toLowerCase()} was noted.`,
        recordDate,
        provider,
        providerNpi: this.randomNPI(),
        facility,
        facilityNpi: this.randomNPI(),
        diagnosis,
        diagnosisCode: icdCode,
        treatment,
        followUpRequired,
        followUpDate,
        followUpCompleted,
        attachments: [],
        metadata: {
          source: 'seed_script',
          generatedAt: new Date().toISOString(),
        },
        isConfidential,
        notes:
          Math.random() > 0.5
            ? `Additional observations: Patient is ${Math.random() > 0.5 ? 'cooperative' : 'responsive'} during examination. ${Math.random() > 0.5 ? 'Guardian present and informed.' : 'Follow standard protocols.'}`
            : null,
        createdAt: recordDate,
        updatedAt: recordDate,
      };

      healthRecords.push(record);
    }

    return healthRecords;
  }

  private randomDate(startDaysAgo: number, endDaysAgo: number = 0): Date {
    const start = new Date();
    start.setDate(start.getDate() - startDaysAgo);
    const end = new Date();
    end.setDate(end.getDate() - endDaysAgo);
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }

  private randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private randomNPI(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  private printStatistics(healthRecords: any[]): void {
    const recordTypeCount: Record<string, number> = {};
    healthRecords.forEach((record: any) => {
      recordTypeCount[record.recordType] =
        (recordTypeCount[record.recordType] || 0) + 1;
    });

    console.log('\n📊 Record Type Distribution:');
    Object.entries(recordTypeCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });

    const followUpsRequired = healthRecords.filter(
      (r) => r.followUpRequired,
    ).length;
    const confidential = healthRecords.filter((r) => r.isConfidential).length;
    console.log(`\n📋 Follow-ups Required: ${followUpsRequired}`);
    console.log(`🔒 Confidential Records: ${confidential}`);
  }
}
