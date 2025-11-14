"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStudents = generateStudents;
const student_model_1 = require("../models/student.model");
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
function generateDateOfBirth(grade) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    let ageBase;
    if (grade === 'K')
        ageBase = 5;
    else if (grade === '12')
        ageBase = 18;
    else
        ageBase = 5 + parseInt(grade);
    const monthVariation = Math.floor(Math.random() * 13) - 6;
    const birthYear = currentYear - ageBase;
    let birthMonth = currentMonth + monthVariation;
    let adjustedYear = birthYear;
    if (birthMonth < 0) {
        birthMonth += 12;
        adjustedYear -= 1;
    }
    else if (birthMonth > 11) {
        birthMonth -= 12;
        adjustedYear += 1;
    }
    const birthDay = Math.floor(Math.random() * 28) + 1;
    return new Date(adjustedYear, birthMonth, birthDay);
}
function generateStudents(schoolIds, districtIds, studentsPerSchool) {
    const students = [];
    let studentCounter = 0;
    for (let schoolIndex = 0; schoolIndex < schoolIds.length; schoolIndex++) {
        const schoolId = schoolIds[schoolIndex];
        const districtId = districtIds[schoolIndex % districtIds.length];
        for (let i = 0; i < studentsPerSchool; i++) {
            studentCounter++;
            const genderValue = Math.random();
            let gender;
            let firstName;
            if (genderValue < 0.48) {
                gender = student_model_1.Gender.MALE;
                firstName = FIRST_NAMES_MALE[studentCounter % FIRST_NAMES_MALE.length];
            }
            else if (genderValue < 0.96) {
                gender = student_model_1.Gender.FEMALE;
                firstName =
                    FIRST_NAMES_FEMALE[studentCounter % FIRST_NAMES_FEMALE.length];
            }
            else if (genderValue < 0.98) {
                gender = student_model_1.Gender.OTHER;
                firstName =
                    Math.random() < 0.5
                        ? FIRST_NAMES_MALE[studentCounter % FIRST_NAMES_MALE.length]
                        : FIRST_NAMES_FEMALE[studentCounter % FIRST_NAMES_FEMALE.length];
            }
            else {
                gender = student_model_1.Gender.PREFER_NOT_TO_SAY;
                firstName =
                    Math.random() < 0.5
                        ? FIRST_NAMES_MALE[studentCounter % FIRST_NAMES_MALE.length]
                        : FIRST_NAMES_FEMALE[studentCounter % FIRST_NAMES_FEMALE.length];
            }
            const lastName = LAST_NAMES[studentCounter % LAST_NAMES.length];
            const grade = GRADES[(studentCounter + i) % GRADES.length];
            const dateOfBirth = generateDateOfBirth(grade);
            const currentYear = new Date().getFullYear();
            const yearsEnrolled = Math.floor(Math.random() * 3);
            const enrollmentDate = new Date(currentYear - yearsEnrolled, 8, 1);
            students.push({
                studentNumber: `STU-${studentCounter.toString().padStart(6, '0')}`,
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth,
                grade: grade,
                gender: gender,
                medicalRecordNum: `MRN-${studentCounter.toString().padStart(8, '0')}`,
                isActive: true,
                enrollmentDate: enrollmentDate,
                schoolId: schoolId,
                districtId: districtId,
            });
        }
    }
    return students;
}
//# sourceMappingURL=students.seed.js.map