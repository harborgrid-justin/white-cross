const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get all existing students
    const students = await queryInterface.sequelize.query(
      'SELECT id, "firstName", "lastName", grade, "dateOfBirth" FROM students ORDER BY "createdAt"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (students.length === 0) {
      console.log('No students found. Skipping health records seeding.');
      return;
    }

    console.log(`Creating health records for ${students.length} students...`);

    // Helper function to calculate age
    const calculateAge = (dateOfBirth) => {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    // Helper to get random date within range
    const randomDate = (start, end) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    // Common allergens by type
    const allergens = {
      FOOD: ['Peanuts', 'Tree nuts (almonds, walnuts)', 'Milk', 'Eggs', 'Shellfish', 'Fish', 'Soy', 'Wheat'],
      MEDICATION: ['Penicillin', 'Aspirin', 'Ibuprofen', 'Codeine', 'Latex'],
      ENVIRONMENTAL: ['Pollen', 'Dust mites', 'Pet dander', 'Mold', 'Grass'],
      INSECT: ['Bee stings', 'Wasp stings', 'Fire ants'],
      OTHER: ['Latex', 'Fragrances', 'Nickel']
    };

    // Common medications by age group
    const commonMedications = {
      elementary: ['Albuterol inhaler', 'Children\'s Tylenol', 'Amoxicillin', 'Benadryl'],
      middle: ['Albuterol inhaler', 'Ibuprofen', 'Claritin', 'EpiPen', 'Adderall'],
      high: ['Albuterol inhaler', 'Birth control', 'Acne medications', 'Antidepressants', 'ADHD medications']
    };

    // Medical conditions by prevalence
    const conditions = [
      { name: 'Asthma', prevalence: 0.15, severity: 'MILD' },
      { name: 'ADHD', prevalence: 0.08, severity: 'MODERATE' },
      { name: 'Diabetes Type 1', prevalence: 0.02, severity: 'SEVERE' },
      { name: 'Food allergies', prevalence: 0.12, severity: 'MODERATE' },
      { name: 'Eczema', prevalence: 0.10, severity: 'MILD' },
      { name: 'Anxiety disorder', prevalence: 0.06, severity: 'MODERATE' },
      { name: 'Seasonal allergies', prevalence: 0.20, severity: 'MILD' }
    ];

    const healthRecordsData = [];
    const allergiesData = [];
    const medicationsData = [];
    const studentMedicationsData = [];

    // Process each student
    for (const student of students) {
      const age = calculateAge(student.dateOfBirth);
      const studentId = student.id;
      const now = new Date();
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);

      console.log(`Processing ${student.firstName} ${student.lastName} (Age: ${age}, Grade: ${student.grade})`);

      // Determine age group for medication selection
      let ageGroup = 'elementary';
      if (student.grade >= 6 && student.grade <= 8) ageGroup = 'middle';
      if (student.grade >= 9) ageGroup = 'high';

      // Randomly assign conditions based on prevalence
      const studentConditions = [];
      conditions.forEach(condition => {
        if (Math.random() < condition.prevalence) {
          studentConditions.push(condition);
        }
      });

      // Generate allergies (30% chance of having allergies)
      if (Math.random() < 0.30) {
        const allergyTypes = Object.keys(allergens);
        const randomType = allergyTypes[Math.floor(Math.random() * allergyTypes.length)];
        const allergenList = allergens[randomType];
        const allergen = allergenList[Math.floor(Math.random() * allergenList.length)];
        
        const severities = ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        const epiPenRequired = severity === 'SEVERE' || severity === 'LIFE_THREATENING';

        const allergyId = uuidv4();
        allergiesData.push({
          id: allergyId,
          studentId,
          allergen,
          allergyType: randomType,
          severity,
          symptoms: getSymptomsForSeverity(severity),
          treatment: getTreatmentForSeverity(severity),
          emergencyProtocol: epiPenRequired ? 'Administer EpiPen immediately and call 911' : 'Administer antihistamine and monitor',
          diagnosedDate: randomDate(twoYearsAgo, oneYearAgo),
          diagnosedBy: 'Dr. ' + ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'][Math.floor(Math.random() * 5)],
          verified: true,
          verifiedBy: uuidv4(), // Would be actual user ID
          verificationDate: randomDate(twoYearsAgo, now),
          active: true,
          epiPenRequired,
          epiPenLocation: epiPenRequired ? 'Main office, School nurse office' : null,
          epiPenExpiration: epiPenRequired ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) : null,
          createdBy: uuidv4(),
          createdAt: randomDate(twoYearsAgo, oneYearAgo),
          updatedAt: randomDate(oneYearAgo, now)
        });

        // Create corresponding health record for allergy documentation
        healthRecordsData.push({
          id: uuidv4(),
          studentId,
          recordType: 'ALLERGY_DOCUMENTATION',
          title: `${allergen} Allergy Documentation`,
          description: `Student has documented ${severity.toLowerCase()} allergy to ${allergen}. ${epiPenRequired ? 'EpiPen required for emergencies.' : 'Treated with antihistamines.'}`,
          recordDate: randomDate(twoYearsAgo, oneYearAgo),
          provider: 'Dr. ' + ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'][Math.floor(Math.random() * 5)],
          facility: 'Pediatric Allergy Clinic',
          diagnosis: `Allergy to ${allergen}`,
          treatment: getTreatmentForSeverity(severity),
          followUpRequired: severity === 'SEVERE' || severity === 'LIFE_THREATENING',
          followUpDate: (severity === 'SEVERE' || severity === 'LIFE_THREATENING') ? new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000) : null,
          followUpCompleted: false,
          attachments: '[]',
          isConfidential: false,
          notes: `Emergency action plan ${epiPenRequired ? 'includes EpiPen administration' : 'involves antihistamine treatment'}.`,
          createdBy: uuidv4(),
          createdAt: randomDate(twoYearsAgo, oneYearAgo),
          updatedAt: randomDate(oneYearAgo, now)
        });
      }

      // Generate medications based on conditions and age
      studentConditions.forEach(condition => {
        if (condition.name === 'Asthma') {
          // Create albuterol inhaler medication
          const medicationId = uuidv4();
          const medication = {
            id: medicationId,
            name: 'Albuterol Sulfate',
            genericName: 'Albuterol',
            dosageForm: 'Metered Dose Inhaler',
            strength: '90 mcg/actuation',
            manufacturer: 'ProAir',
            isControlled: false,
            requiresWitness: false,
            isActive: true,
            createdAt: twoYearsAgo,
            updatedAt: now
          };
          
          // Check if this medication already exists
          const existingMed = medicationsData.find(m => m.name === medication.name && m.strength === medication.strength);
          if (!existingMed) {
            medicationsData.push(medication);
          }

          studentMedicationsData.push({
            id: uuidv4(),
            studentId,
            medicationId: existingMed ? existingMed.id : medicationId,
            dosage: '2 puffs',
            frequency: 'As needed for asthma symptoms',
            route: 'Inhalation',
            instructions: 'Use when experiencing shortness of breath, wheezing, or chest tightness. Prime inhaler before first use.',
            startDate: randomDate(oneYearAgo, now),
            isActive: true,
            prescribedBy: 'Dr. ' + ['Roberts', 'Martinez', 'Anderson', 'Taylor'][Math.floor(Math.random() * 4)],
            prescriptionNumber: 'RX' + Math.floor(Math.random() * 1000000),
            refillsRemaining: Math.floor(Math.random() * 5) + 1,
            createdBy: uuidv4(),
            createdAt: randomDate(oneYearAgo, now),
            updatedAt: randomDate(oneYearAgo, now)
          });

          // Create health record for asthma management
          healthRecordsData.push({
            id: uuidv4(),
            studentId,
            recordType: 'CHRONIC_CONDITION_REVIEW',
            title: 'Asthma Management Plan',
            description: 'Regular review and management of student asthma condition. Inhaler prescribed for symptom control.',
            recordDate: randomDate(oneYearAgo, now),
            provider: 'Dr. ' + ['Roberts', 'Martinez', 'Anderson', 'Taylor'][Math.floor(Math.random() * 4)],
            facility: 'Pediatric Pulmonology',
            diagnosis: 'Asthma',
            diagnosisCode: 'J45.9',
            treatment: 'Albuterol inhaler as needed, avoid triggers',
            followUpRequired: true,
            followUpDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
            followUpCompleted: false,
            attachments: '[]',
            isConfidential: false,
            notes: 'Student doing well with current treatment. Continue current medication regimen.',
            createdBy: uuidv4(),
            createdAt: randomDate(oneYearAgo, now),
            updatedAt: randomDate(oneYearAgo, now)
          });
        }

        if (condition.name === 'ADHD' && ageGroup !== 'elementary') {
          // Create ADHD medication for older students
          const medicationId = uuidv4();
          const adhdMeds = ['Adderall XR', 'Ritalin', 'Concerta', 'Vyvanse'];
          const medName = adhdMeds[Math.floor(Math.random() * adhdMeds.length)];
          
          const medication = {
            id: medicationId,
            name: medName,
            genericName: medName === 'Adderall XR' ? 'Amphetamine Salts' : 'Methylphenidate',
            dosageForm: 'Extended Release Capsule',
            strength: ['10mg', '15mg', '20mg', '25mg'][Math.floor(Math.random() * 4)],
            manufacturer: 'Shire Pharmaceuticals',
            isControlled: true,
            deaSchedule: 'II',
            requiresWitness: true,
            isActive: true,
            createdAt: twoYearsAgo,
            updatedAt: now
          };

          const existingMed = medicationsData.find(m => m.name === medication.name && m.strength === medication.strength);
          if (!existingMed) {
            medicationsData.push(medication);
          }

          studentMedicationsData.push({
            id: uuidv4(),
            studentId,
            medicationId: existingMed ? existingMed.id : medicationId,
            dosage: medication.strength,
            frequency: 'Once daily in morning',
            route: 'Oral',
            instructions: 'Take with breakfast. Do not crush or chew. Store securely.',
            startDate: randomDate(oneYearAgo, now),
            isActive: true,
            prescribedBy: 'Dr. ' + ['Peterson', 'Thompson', 'Garcia', 'Miller'][Math.floor(Math.random() * 4)],
            prescriptionNumber: 'RX' + Math.floor(Math.random() * 1000000),
            refillsRemaining: Math.floor(Math.random() * 3) + 1,
            createdBy: uuidv4(),
            createdAt: randomDate(oneYearAgo, now),
            updatedAt: randomDate(oneYearAgo, now)
          });
        }

        // Create health record for the condition
        healthRecordsData.push({
          id: uuidv4(),
          studentId,
          recordType: 'CHRONIC_CONDITION_REVIEW',
          title: `${condition.name} Management`,
          description: `Ongoing management and monitoring of ${condition.name} condition.`,
          recordDate: randomDate(oneYearAgo, now),
          provider: 'Dr. ' + ['Wilson', 'Moore', 'Taylor', 'Anderson'][Math.floor(Math.random() * 4)],
          facility: 'Pediatric Specialty Clinic',
          diagnosis: condition.name,
          treatment: getConditionTreatment(condition.name),
          followUpRequired: condition.severity !== 'MILD',
          followUpDate: condition.severity !== 'MILD' ? new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) : null,
          followUpCompleted: false,
          attachments: '[]',
          isConfidential: condition.name.includes('Anxiety') || condition.name.includes('Depression'),
          notes: `Patient managing ${condition.name} well with current treatment plan.`,
          createdBy: uuidv4(),
          createdAt: randomDate(oneYearAgo, now),
          updatedAt: randomDate(oneYearAgo, now)
        });
      });

      // Generate routine health records (physical exams, screenings)
      // Annual physical exam
      if (Math.random() < 0.8) { // 80% have recent physical
        healthRecordsData.push({
          id: uuidv4(),
          studentId,
          recordType: 'PHYSICAL_EXAM',
          title: 'Annual Physical Examination',
          description: 'Comprehensive annual physical examination including growth assessment, vital signs, and general health evaluation.',
          recordDate: randomDate(oneYearAgo, now),
          provider: 'Dr. ' + ['Johnson', 'Smith', 'Williams', 'Davis'][Math.floor(Math.random() * 4)],
          facility: 'Pediatric Primary Care',
          diagnosis: 'Healthy child',
          treatment: 'Continue routine care',
          followUpRequired: false,
          attachments: '[]',
          isConfidential: false,
          notes: 'Normal growth and development. All systems within normal limits.',
          createdBy: uuidv4(),
          createdAt: randomDate(oneYearAgo, now),
          updatedAt: randomDate(oneYearAgo, now)
        });
      }

      // Vision screening for older students
      if (student.grade >= 3 && Math.random() < 0.6) {
        healthRecordsData.push({
          id: uuidv4(),
          studentId,
          recordType: 'VISION',
          title: 'Vision Screening',
          description: 'Annual vision screening examination to assess visual acuity and eye health.',
          recordDate: randomDate(oneYearAgo, now),
          provider: 'School Nurse',
          facility: student.grade >= 9 ? 'High School Health Office' : 'Elementary Health Office',
          diagnosis: Math.random() < 0.15 ? 'Refractive error' : 'Normal vision',
          treatment: Math.random() < 0.15 ? 'Referral to optometrist' : 'No treatment needed',
          followUpRequired: Math.random() < 0.15,
          followUpDate: Math.random() < 0.15 ? new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000) : null,
          followUpCompleted: false,
          attachments: '[]',
          isConfidential: false,
          notes: Math.random() < 0.15 ? 'Student may need corrective lenses' : 'Vision screening within normal limits',
          createdBy: uuidv4(),
          createdAt: randomDate(oneYearAgo, now),
          updatedAt: randomDate(oneYearAgo, now)
        });
      }
    }

    // Insert data in correct order (medications first, then student medications, then allergies, then health records)
    console.log(`Inserting ${medicationsData.length} medications...`);
    if (medicationsData.length > 0) {
      await queryInterface.bulkInsert('medications', medicationsData);
    }

    console.log(`Inserting ${studentMedicationsData.length} student medications...`);
    if (studentMedicationsData.length > 0) {
      await queryInterface.bulkInsert('student_medications', studentMedicationsData);
    }

    console.log(`Inserting ${allergiesData.length} allergies...`);
    if (allergiesData.length > 0) {
      await queryInterface.bulkInsert('allergies', allergiesData);
    }

    console.log(`Inserting ${healthRecordsData.length} health records...`);
    if (healthRecordsData.length > 0) {
      await queryInterface.bulkInsert('health_records', healthRecordsData);
    }

    console.log(`Health records seeding completed!`);
    console.log(`Total created:`);
    console.log(`- Health Records: ${healthRecordsData.length}`);
    console.log(`- Allergies: ${allergiesData.length}`);
    console.log(`- Medications: ${medicationsData.length}`);
    console.log(`- Student Medications: ${studentMedicationsData.length}`);
  },

  down: async (queryInterface, Sequelize) => {
    console.log('Removing health records seed data...');
    await queryInterface.bulkDelete('health_records', null, {});
    await queryInterface.bulkDelete('allergies', null, {});
    await queryInterface.bulkDelete('student_medications', null, {});
    await queryInterface.bulkDelete('medications', null, {});
    console.log('Health records seed data removed.');
  }
};

// Helper functions
function getSymptomsForSeverity(severity) {
  const symptoms = {
    'MILD': 'Mild skin irritation, slight itching',
    'MODERATE': 'Hives, swelling, itching, mild respiratory symptoms',
    'SEVERE': 'Significant swelling, difficulty breathing, severe hives',
    'LIFE_THREATENING': 'Anaphylaxis, severe breathing difficulty, loss of consciousness, severe swelling'
  };
  return symptoms[severity];
}

function getTreatmentForSeverity(severity) {
  const treatments = {
    'MILD': 'Avoid allergen, topical antihistamines as needed',
    'MODERATE': 'Avoid allergen, oral antihistamines (Benadryl, Claritin)',
    'SEVERE': 'Avoid allergen, antihistamines, possible corticosteroids, EpiPen available',
    'LIFE_THREATENING': 'Strict allergen avoidance, EpiPen required, emergency action plan in place'
  };
  return treatments[severity];
}

function getConditionTreatment(condition) {
  const treatments = {
    'Asthma': 'Bronchodilator inhaler as needed, avoid triggers, regular monitoring',
    'ADHD': 'Stimulant medication, behavioral interventions, regular monitoring',
    'Diabetes Type 1': 'Insulin therapy, blood glucose monitoring, dietary management',
    'Food allergies': 'Allergen avoidance, emergency action plan, antihistamines/EpiPen',
    'Eczema': 'Moisturizers, topical corticosteroids, avoid triggers',
    'Anxiety disorder': 'Counseling, coping strategies, possible medication',
    'Seasonal allergies': 'Antihistamines, nasal sprays, allergen avoidance'
  };
  return treatments[condition] || 'Ongoing management and monitoring';
}