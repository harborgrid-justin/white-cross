/**
 * Student Seed Data Generator
 * Generates realistic student data for seeding
 */

import { Gender } from '../models/student.model';

export interface StudentSeedData {
  id?: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: Gender;
  photo?: string;
  medicalRecordNum?: string;
  isActive: boolean;
  enrollmentDate: Date;
  nurseId?: string;
  schoolId?: string;
  districtId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const FIRST_NAMES_MALE = [
  'James',
  'John',
  'Robert',
  'Michael',
  'William',
  'David',
  'Richard',
  'Joseph',
  'Thomas',
  'Christopher',
  'Daniel',
  'Matthew',
  'Anthony',
  'Mark',
  'Donald',
  'Steven',
  'Andrew',
  'Paul',
  'Joshua',
  'Kenneth',
];

const FIRST_NAMES_FEMALE = [
  'Mary',
  'Patricia',
  'Jennifer',
  'Linda',
  'Elizabeth',
  'Barbara',
  'Susan',
  'Jessica',
  'Sarah',
  'Karen',
  'Lisa',
  'Nancy',
  'Betty',
  'Margaret',
  'Sandra',
  'Ashley',
  'Kimberly',
  'Emily',
  'Donna',
  'Michelle',
];

const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
  'Harris',
  'Sanchez',
  'Clark',
  'Ramirez',
  'Lewis',
  'Robinson',
];

const GRADES = [
  'K',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];

/**
 * Generate a random date of birth based on grade
 */
function generateDateOfBirth(grade: string): Date {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Calculate approximate age based on grade
  let ageBase: number;
  if (grade === 'K') ageBase = 5;
  else if (grade === '12') ageBase = 18;
  else ageBase = 5 + parseInt(grade);

  // Add some variation (-6 to +6 months)
  const monthVariation = Math.floor(Math.random() * 13) - 6;

  const birthYear = currentYear - ageBase;
  let birthMonth = currentMonth + monthVariation;
  let adjustedYear = birthYear;

  if (birthMonth < 0) {
    birthMonth += 12;
    adjustedYear -= 1;
  } else if (birthMonth > 11) {
    birthMonth -= 12;
    adjustedYear += 1;
  }

  const birthDay = Math.floor(Math.random() * 28) + 1;

  return new Date(adjustedYear, birthMonth, birthDay);
}

/**
 * Generate realistic student data for given schools
 */
export function generateStudents(
  schoolIds: string[],
  districtIds: string[],
  studentsPerSchool: number,
): StudentSeedData[] {
  const students: StudentSeedData[] = [];
  let studentCounter = 0;

  for (let schoolIndex = 0; schoolIndex < schoolIds.length; schoolIndex++) {
    const schoolId = schoolIds[schoolIndex];
    const districtId = districtIds[schoolIndex % districtIds.length];

    for (let i = 0; i < studentsPerSchool; i++) {
      studentCounter++;

      // Randomly select gender
      const genderValue = Math.random();
      let gender: Gender;
      let firstName: string;

      if (genderValue < 0.48) {
        gender = Gender.MALE;
        firstName = FIRST_NAMES_MALE[studentCounter % FIRST_NAMES_MALE.length];
      } else if (genderValue < 0.96) {
        gender = Gender.FEMALE;
        firstName =
          FIRST_NAMES_FEMALE[studentCounter % FIRST_NAMES_FEMALE.length];
      } else if (genderValue < 0.98) {
        gender = Gender.OTHER;
        firstName =
          Math.random() < 0.5
            ? FIRST_NAMES_MALE[studentCounter % FIRST_NAMES_MALE.length]
            : FIRST_NAMES_FEMALE[studentCounter % FIRST_NAMES_FEMALE.length];
      } else {
        gender = Gender.PREFER_NOT_TO_SAY;
        firstName =
          Math.random() < 0.5
            ? FIRST_NAMES_MALE[studentCounter % FIRST_NAMES_MALE.length]
            : FIRST_NAMES_FEMALE[studentCounter % FIRST_NAMES_FEMALE.length];
      }

      const lastName = LAST_NAMES[studentCounter % LAST_NAMES.length];
      const grade = GRADES[(studentCounter + i) % GRADES.length];
      const dateOfBirth = generateDateOfBirth(grade);

      // Generate enrollment date (typically at start of school year)
      const currentYear = new Date().getFullYear();
      const yearsEnrolled = Math.floor(Math.random() * 3); // 0-2 years ago
      const enrollmentDate = new Date(currentYear - yearsEnrolled, 8, 1); // September 1st

      students.push({
        // id is optional, let DB assign if not provided
        studentNumber: `STU-${studentCounter.toString().padStart(6, '0')}`,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        grade: grade,
        gender: gender,
        photo: undefined,
        medicalRecordNum: `MRN-${studentCounter.toString().padStart(8, '0')}`,
        isActive: true,
        enrollmentDate: enrollmentDate,
        nurseId: undefined,
        schoolId: schoolId,
        districtId: districtId,
        createdBy: undefined,
        updatedBy: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  return students;
}
