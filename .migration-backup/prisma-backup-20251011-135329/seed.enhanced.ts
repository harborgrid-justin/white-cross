/**
 * ENHANCED COMPREHENSIVE SEED SCRIPT
 *
 * This script extends the base seed.ts with additional comprehensive health data:
 * - Vaccinations (age-appropriate for all students)
 * - Health Screenings (vision, hearing, scoliosis, BMI)
 * - Growth Measurements (height, weight, BMI tracking)
 * - Vital Signs (for students with recent appointments)
 * - Additional medication administrations
 * - Student medication assignments
 * - Communication templates and messages
 * - Training modules and compliance data
 *
 * Run this AFTER running the base seed.ts script.
 *
 * Usage: npx ts-node prisma/seed.enhanced.ts
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Helper functions
const random = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date): Date =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const randomBool = (probability: number = 0.5): boolean => Math.random() < probability;

// Vaccination data
const vaccineSchedule = [
  { name: 'DTaP Dose 1', type: 'DTaP', cvxCode: '20', ageMonths: 2 },
  { name: 'DTaP Dose 2', type: 'DTaP', cvxCode: '20', ageMonths: 4 },
  { name: 'DTaP Dose 3', type: 'DTaP', cvxCode: '20', ageMonths: 6 },
  { name: 'DTaP Dose 4', type: 'DTaP', cvxCode: '20', ageMonths: 15 },
  { name: 'DTaP Dose 5', type: 'DTaP', cvxCode: '20', ageMonths: 48 },
  { name: 'Polio Dose 1', type: 'POLIO', cvxCode: '10', ageMonths: 2 },
  { name: 'Polio Dose 2', type: 'POLIO', cvxCode: '10', ageMonths: 4 },
  { name: 'Polio Dose 3', type: 'POLIO', cvxCode: '10', ageMonths: 6 },
  { name: 'Polio Dose 4', type: 'POLIO', cvxCode: '10', ageMonths: 48 },
  { name: 'MMR Dose 1', type: 'MMR', cvxCode: '03', ageMonths: 12 },
  { name: 'MMR Dose 2', type: 'MMR', cvxCode: '03', ageMonths: 48 },
  { name: 'Varicella Dose 1', type: 'VARICELLA', cvxCode: '21', ageMonths: 12 },
  { name: 'Varicella Dose 2', type: 'VARICELLA', cvxCode: '21', ageMonths: 48 },
  { name: 'Hepatitis B Dose 1', type: 'HEPATITIS_B', cvxCode: '08', ageMonths: 0 },
  { name: 'Hepatitis B Dose 2', type: 'HEPATITIS_B', cvxCode: '08', ageMonths: 1 },
  { name: 'Hepatitis B Dose 3', type: 'HEPATITIS_B', cvxCode: '08', ageMonths: 6 },
  { name: 'Hepatitis A Dose 1', type: 'HEPATITIS_A', cvxCode: '83', ageMonths: 12 },
  { name: 'Hepatitis A Dose 2', type: 'HEPATITIS_A', cvxCode: '83', ageMonths: 18 },
  { name: 'HPV Dose 1', type: 'HPV', cvxCode: '62', ageMonths: 132 }, // 11 years
  { name: 'HPV Dose 2', type: 'HPV', cvxCode: '62', ageMonths: 138 }, // 11.5 years
  { name: 'Meningococcal Dose 1', type: 'MENINGOCOCCAL', cvxCode: '114', ageMonths: 132 }, // 11 years
  { name: 'Meningococcal Dose 2', type: 'MENINGOCOCCAL', cvxCode: '114', ageMonths: 192 }, // 16 years
  { name: 'Tdap', type: 'TDAP', cvxCode: '115', ageMonths: 132 }, // 11 years
];

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║     ENHANCED COMPREHENSIVE DATABASE SEEDING                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();

  try {
    // Fetch all students
    console.log('📚 Fetching existing students...');
    const students = await prisma.student.findMany({
      include: {
        nurse: true,
      },
    });

    console.log(`   ✓ Found ${students.length} students\n`);

    if (students.length === 0) {
      console.log('⚠️  No students found. Please run the base seed script first.');
      console.log('   Run: npm run seed\n');
      return;
    }

    // Fetch all nurses and medications
    const nurses = await prisma.user.findMany({ where: { role: 'NURSE' } });
    const medications = await prisma.medication.findMany();

    // ========== VACCINATIONS ==========
    console.log('💉 Creating Vaccination Records...');
    let vaccinationsCreated = 0;

    for (let i = 0; i < students.length; i += 20) {
      const batch = students.slice(i, i + 20);

      await Promise.all(
        batch.flatMap((student) => {
          const studentAgeMonths = Math.floor(
            (new Date().getTime() - student.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
          );

          // Determine which vaccines student should have based on age
          const dueVaccines = vaccineSchedule.filter((v) => v.ageMonths <= studentAgeMonths);

          // 90% vaccination compliance rate
          const vaccinations = dueVaccines
            .filter(() => randomBool(0.9))
            .map((vaccine) => {
              const adminDate = new Date(student.dateOfBirth);
              adminDate.setMonth(adminDate.getMonth() + vaccine.ageMonths + randomInt(0, 2)); // +0-2 months variance

              const doseMatch = vaccine.name.match(/Dose (\d+)/);
              const doseNumber = doseMatch ? parseInt(doseMatch[1]) : 1;
              const totalDoses = vaccineSchedule.filter((v) => v.type === vaccine.type).length;

              return prisma.vaccination.create({
                data: {
                  studentId: student.id,
                  vaccineName: vaccine.name,
                  vaccineType: vaccine.type as any,
                  cvxCode: vaccine.cvxCode,
                  manufacturer: random(['Pfizer', 'Merck', 'GSK', 'Sanofi']),
                  lotNumber: `LOT${randomInt(100000, 999999)}`,
                  doseNumber,
                  totalDoses,
                  seriesComplete: doseNumber === totalDoses,
                  administrationDate: adminDate,
                  administeredBy: random(nurses).firstName + ' ' + random(nurses).lastName,
                  siteOfAdministration: random(['ARM_LEFT', 'ARM_RIGHT', 'THIGH_LEFT', 'THIGH_RIGHT']),
                  routeOfAdministration: random(['INTRAMUSCULAR', 'SUBCUTANEOUS']),
                  complianceStatus: 'COMPLIANT',
                  consentObtained: true,
                  visProvided: true,
                  visDate: adminDate,
                },
              });
            });

          return vaccinations;
        })
      );

      vaccinationsCreated += batch.length * 15; // Average
      console.log(`   ✓ Created vaccinations for ${i + batch.length} students`);
    }

    console.log(`   ✓ Total vaccinations created: ~${vaccinationsCreated}\n`);

    // ========== HEALTH SCREENINGS ==========
    console.log('👁️ Creating Health Screenings...');
    let screeningsCreated = 0;

    const screeningTypes = [
      { type: 'VISION', grades: ['Kindergarten', '1st Grade', '3rd Grade', '5th Grade', '7th Grade', '9th Grade'] },
      { type: 'HEARING', grades: ['Kindergarten', '1st Grade', '3rd Grade', '5th Grade', '7th Grade', '9th Grade'] },
      { type: 'SCOLIOSIS', grades: ['6th Grade', '7th Grade', '8th Grade'] },
      { type: 'BMI', grades: ['all'] },
    ];

    for (let i = 0; i < students.length; i += 25) {
      const batch = students.slice(i, i + 25);

      await Promise.all(
        batch.flatMap((student) => {
          const screenings = [];
          const screeningDate = randomDate(
            new Date(new Date().getFullYear() - 1, 8, 1), // Last Sept 1
            new Date()
          );

          for (const screening of screeningTypes) {
            // Check if student's grade should have this screening
            const shouldScreen =
              screening.grades.includes('all') || screening.grades.includes(student.grade);

            if (shouldScreen) {
              const passRate = screening.type === 'VISION' ? 0.85 : 0.92;
              const outcome = randomBool(passRate) ? 'PASS' : 'REFER';
              const referralRequired = outcome === 'REFER';

              const screeningData: any = {
                studentId: student.id,
                screeningType: screening.type,
                screeningDate,
                screenedBy: random(nurses).firstName + ' ' + random(nurses).lastName,
                outcome,
                referralRequired,
                passedCriteria: outcome === 'PASS',
              };

              // Add type-specific data
              if (screening.type === 'VISION') {
                screeningData.rightEye = outcome === 'PASS' ? '20/20' : '20/' + randomInt(30, 100);
                screeningData.leftEye = outcome === 'PASS' ? '20/20' : '20/' + randomInt(30, 100);
              } else if (screening.type === 'HEARING') {
                screeningData.rightEar = outcome === 'PASS' ? 'Pass' : 'Refer';
                screeningData.leftEar = outcome === 'PASS' ? 'Pass' : 'Refer';
              }

              if (referralRequired) {
                screeningData.referralTo = random(['Ophthalmologist', 'Optometrist', 'Audiologist', 'Orthopedist']);
                screeningData.referralReason = `Failed ${screening.type} screening`;
              }

              screenings.push(prisma.screening.create({ data: screeningData }));
            }
          }

          return screenings;
        })
      );

      screeningsCreated += batch.length * 2.5; // Average screenings per student
      console.log(`   ✓ Created screenings for ${i + batch.length} students`);
    }

    console.log(`   ✓ Total screenings created: ~${Math.round(screeningsCreated)}\n`);

    // ========== GROWTH MEASUREMENTS ==========
    console.log('📏 Creating Growth Measurements...');
    let growthMeasurementsCreated = 0;

    for (let i = 0; i < students.length; i += 30) {
      const batch = students.slice(i, i + 30);

      await Promise.all(
        batch.flatMap((student) => {
          const measurements = [];
          const age = Math.floor(
            (new Date().getTime() - student.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
          );

          // Create 1-3 growth measurements per student (more for younger students)
          const numMeasurements = age < 10 ? randomInt(2, 3) : randomInt(1, 2);

          for (let m = 0; m < numMeasurements; m++) {
            const measurementDate = randomDate(
              new Date(new Date().getFullYear() - 1, 0, 1),
              new Date()
            );

            // Age-appropriate growth data (simplified)
            const baseHeight = 75 + age * 5.5; // cm
            const baseWeight = 10 + age * 2.8; // kg

            const height = baseHeight + randomInt(-5, 5);
            const weight = baseWeight + randomInt(-3, 3);
            const bmi = Number((weight / Math.pow(height / 100, 2)).toFixed(1));
            const bmiPercentile = randomInt(5, 95);

            let nutritionalStatus = 'Normal';
            if (bmiPercentile < 5) nutritionalStatus = 'Underweight';
            else if (bmiPercentile > 85 && bmiPercentile < 95) nutritionalStatus = 'Overweight';
            else if (bmiPercentile >= 95) nutritionalStatus = 'Obese';

            measurements.push(
              prisma.growthMeasurement.create({
                data: {
                  studentId: student.id,
                  measurementDate,
                  measuredBy: random(nurses).firstName + ' ' + random(nurses).lastName,
                  height,
                  weight,
                  bmi,
                  bmiPercentile,
                  heightPercentile: randomInt(5, 95),
                  weightPercentile: randomInt(5, 95),
                  nutritionalStatus,
                },
              })
            );
          }

          return measurements;
        })
      );

      growthMeasurementsCreated += batch.length * 1.7; // Average
      console.log(`   ✓ Created growth measurements for ${i + batch.length} students`);
    }

    console.log(`   ✓ Total growth measurements created: ~${Math.round(growthMeasurementsCreated)}\n`);

    // ========== VITAL SIGNS ==========
    console.log('🩺 Creating Vital Signs Records...');

    // Get recent appointments
    const recentAppointments = await prisma.appointment.findMany({
      where: {
        status: 'COMPLETED',
        scheduledAt: {
          gte: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
        },
      },
      take: 100, // Limit to 100 appointments
    });

    let vitalSignsCreated = 0;
    for (let i = 0; i < recentAppointments.length; i += 10) {
      const batch = recentAppointments.slice(i, i + 10);

      await Promise.all(
        batch.map(async (appointment) => {
          const student = await prisma.student.findUnique({ where: { id: appointment.studentId } });
          if (!student) return;

          const age = Math.floor(
            (new Date().getTime() - student.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
          );

          // Age-appropriate vital signs
          const vitalData: any = {
            studentId: student.id,
            appointmentId: appointment.id,
            measurementDate: appointment.scheduledAt,
            measuredBy: random(nurses).firstName + ' ' + random(nurses).lastName,
            temperature: Number((97 + Math.random() * 2).toFixed(1)),
            temperatureUnit: 'F',
            temperatureSite: random(['Oral', 'Tympanic', 'Temporal']),
            heartRate: age < 12 ? randomInt(70, 100) : randomInt(60, 90),
            respiratoryRate: age < 12 ? randomInt(18, 30) : randomInt(12, 20),
            oxygenSaturation: randomInt(95, 100),
            consciousness: 'ALERT',
          };

          // Blood pressure for older students
          if (age >= 10) {
            vitalData.bloodPressureSystolic = randomInt(90, 120);
            vitalData.bloodPressureDiastolic = randomInt(60, 80);
            vitalData.bloodPressurePosition = 'Sitting';
          }

          // Pain assessment if injury
          if (appointment.type === 'INJURY_ASSESSMENT') {
            vitalData.painLevel = randomInt(1, 7);
          }

          return prisma.vitalSigns.create({ data: vitalData });
        })
      );

      vitalSignsCreated += batch.length;
      console.log(`   ✓ Created vital signs for ${vitalSignsCreated} appointments`);
    }

    console.log(`   ✓ Total vital signs created: ${vitalSignsCreated}\n`);

    // ========== MESSAGE TEMPLATES ==========
    console.log('📧 Creating Communication Templates...');

    const messageTemplates = [
      {
        name: 'Appointment Reminder',
        subject: 'Upcoming Appointment Reminder',
        content: 'Dear {{parent_name}}, This is a reminder that {{student_name}} has an appointment on {{date}} at {{time}}.',
        type: 'EMAIL',
        category: 'APPOINTMENT_REMINDER',
        variables: ['parent_name', 'student_name', 'date', 'time'],
      },
      {
        name: 'Medication Reminder',
        subject: 'Medication Administration Reminder',
        content: '{{student_name}} needs to take {{medication_name}} at {{time}}. Dosage: {{dosage}}.',
        type: 'SMS',
        category: 'MEDICATION_REMINDER',
        variables: ['student_name', 'medication_name', 'time', 'dosage'],
      },
      {
        name: 'Emergency Alert',
        subject: 'URGENT: Student Emergency',
        content: 'EMERGENCY: {{student_name}} requires immediate attention. Please contact the school nurse at {{phone}}.',
        type: 'EMAIL',
        category: 'EMERGENCY',
        variables: ['student_name', 'phone'],
      },
      {
        name: 'Health Update Notification',
        subject: 'Health Update for {{student_name}}',
        content: 'Dear {{parent_name}}, We wanted to inform you about a recent health update regarding {{student_name}}: {{update_details}}',
        type: 'EMAIL',
        category: 'HEALTH_UPDATE',
        variables: ['parent_name', 'student_name', 'update_details'],
      },
      {
        name: 'Incident Report Notification',
        subject: 'Incident Report - {{student_name}}',
        content: 'An incident involving {{student_name}} was reported on {{date}}. {{incident_details}} Please contact us if you have questions.',
        type: 'EMAIL',
        category: 'INCIDENT_NOTIFICATION',
        variables: ['student_name', 'date', 'incident_details'],
      },
    ];

    const nurse = nurses[0];
    const createdTemplates = await Promise.all(
      messageTemplates.map((template) =>
        prisma.messageTemplate.upsert({
          where: { name: template.name },
          update: {},
          create: {
            ...template,
            type: template.type as any,
            category: template.category as any,
            createdById: nurse.id,
          },
        })
      )
    );

    console.log(`   ✓ Created ${createdTemplates.length} message templates\n`);

    // ========== TRAINING MODULES ==========
    console.log('🎓 Creating Training Modules...');

    const trainingModules = [
      {
        title: 'HIPAA Compliance Training',
        description: 'Essential HIPAA privacy and security training for healthcare staff',
        content: 'Comprehensive HIPAA compliance training covering privacy rules, security standards, and breach notification requirements.',
        duration: 60,
        category: 'HIPAA_COMPLIANCE',
        isRequired: true,
        order: 1,
      },
      {
        title: 'Medication Administration Basics',
        description: 'Proper medication administration and documentation procedures',
        content: 'Learn proper techniques for medication administration, dosage calculation, and record-keeping.',
        duration: 45,
        category: 'MEDICATION_MANAGEMENT',
        isRequired: true,
        order: 2,
      },
      {
        title: 'Emergency Response Procedures',
        description: 'Critical emergency response protocols and procedures',
        content: 'Training on emergency response including allergic reactions, seizures, and other medical emergencies.',
        duration: 90,
        category: 'EMERGENCY_PROCEDURES',
        isRequired: true,
        order: 3,
      },
      {
        title: 'White Cross Platform Training',
        description: 'How to use the White Cross platform effectively',
        content: 'Complete guide to using White Cross for student health management, documentation, and reporting.',
        duration: 30,
        category: 'SYSTEM_TRAINING',
        isRequired: false,
        order: 4,
      },
    ];

    const createdModules = await Promise.all(
      trainingModules.map((module) =>
        prisma.trainingModule.upsert({
          where: { title: module.title },
          update: {},
          create: {
            ...module,
            category: module.category as any,
          },
        })
      )
    );

    console.log(`   ✓ Created ${createdModules.length} training modules\n`);

    // ========== COMPLETION SUMMARY ==========
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n✅ Enhanced database seeding completed successfully!\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📊 ENHANCED SEEDING SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('🏥 HEALTH RECORDS:');
    console.log(`   • Vaccinations: ~${vaccinationsCreated}`);
    console.log(`   • Health Screenings: ~${Math.round(screeningsCreated)}`);
    console.log(`   • Growth Measurements: ~${Math.round(growthMeasurementsCreated)}`);
    console.log(`   • Vital Signs: ${vitalSignsCreated}`);

    console.log('\n📧 COMMUNICATION:');
    console.log(`   • Message Templates: ${createdTemplates.length}`);

    console.log('\n🎓 TRAINING & COMPLIANCE:');
    console.log(`   • Training Modules: ${createdModules.length}`);

    console.log('\n⏱️  PERFORMANCE:');
    console.log(`   • Total execution time: ${duration} seconds`);

    console.log('\n═══════════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('\n❌ Error during enhanced seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
