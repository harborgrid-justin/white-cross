/**
 * Data Generation Utilities for Database Seeding
 * Provides realistic, HIPAA-compliant fake data for the White Cross platform
 */

export const firstNames = {
  male: [
    'Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander',
    'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Levi', 'Sebastian', 'Mateo',
    'Jack', 'Owen', 'Theodore', 'Aiden', 'Samuel', 'Joseph', 'John', 'David', 'Wyatt', 'Matthew',
    'Luke', 'Asher', 'Carter', 'Julian', 'Grayson', 'Leo', 'Jayden', 'Gabriel', 'Isaac', 'Lincoln',
  ],
  female: [
    'Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Evelyn', 'Harper',
    'Luna', 'Camila', 'Gianna', 'Elizabeth', 'Eleanor', 'Ella', 'Abigail', 'Sofia', 'Avery', 'Scarlett',
    'Emily', 'Aria', 'Penelope', 'Chloe', 'Layla', 'Mila', 'Nora', 'Hazel', 'Madison', 'Ellie',
    'Lily', 'Nova', 'Isla', 'Grace', 'Violet', 'Aurora', 'Riley', 'Zoey', 'Willow', 'Emilia',
  ],
};

export const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
];

export const streetNames = [
  'Main Street', 'Oak Avenue', 'Maple Drive', 'Pine Street', 'Elm Avenue', 'Cedar Lane',
  'Washington Street', 'Park Avenue', 'Lincoln Drive', 'Jefferson Street', 'Roosevelt Avenue',
  'Madison Lane', 'Highland Drive', 'Sunset Boulevard', 'River Road', 'Lake Street',
];

export const cities = [
  { name: 'Demo City', state: 'CA', zipRange: [90001, 90099] },
  { name: 'Riverside', state: 'CA', zipRange: [92501, 92599] },
  { name: 'San Valley', state: 'CA', zipRange: [93001, 93099] },
];

export const grades = [
  'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
  '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade',
];

export const genders = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];

// Medical reference data
export const allergyData = {
  FOOD: [
    { allergen: 'Peanuts', severity: ['SEVERE', 'LIFE_THREATENING'] },
    { allergen: 'Tree nuts', severity: ['SEVERE', 'LIFE_THREATENING'] },
    { allergen: 'Milk', severity: ['MILD', 'MODERATE'] },
    { allergen: 'Eggs', severity: ['MILD', 'MODERATE'] },
    { allergen: 'Wheat', severity: ['MILD', 'MODERATE'] },
    { allergen: 'Soy', severity: ['MILD', 'MODERATE'] },
    { allergen: 'Fish', severity: ['MODERATE', 'SEVERE'] },
    { allergen: 'Shellfish', severity: ['SEVERE', 'LIFE_THREATENING'] },
  ],
  MEDICATION: [
    { allergen: 'Penicillin', severity: ['MODERATE', 'SEVERE'] },
    { allergen: 'Sulfa drugs', severity: ['MODERATE', 'SEVERE'] },
    { allergen: 'Aspirin', severity: ['MILD', 'MODERATE'] },
  ],
  ENVIRONMENTAL: [
    { allergen: 'Pollen', severity: ['MILD', 'MODERATE'] },
    { allergen: 'Dust mites', severity: ['MILD', 'MODERATE'] },
    { allergen: 'Pet dander', severity: ['MILD', 'MODERATE'] },
  ],
  INSECT: [
    { allergen: 'Bee stings', severity: ['SEVERE', 'LIFE_THREATENING'] },
    { allergen: 'Wasp stings', severity: ['SEVERE', 'LIFE_THREATENING'] },
  ],
};

export const chronicConditionsData = [
  { name: 'Asthma', icdCode: 'J45.909', severities: ['MILD', 'MODERATE', 'SEVERE'], prevalence: 0.08 },
  { name: 'Type 1 Diabetes', icdCode: 'E10.9', severities: ['MODERATE', 'SEVERE'], prevalence: 0.02 },
  { name: 'ADHD', icdCode: 'F90.9', severities: ['MILD', 'MODERATE'], prevalence: 0.09 },
  { name: 'Epilepsy', icdCode: 'G40.909', severities: ['MODERATE', 'SEVERE'], prevalence: 0.01 },
  { name: 'Anxiety Disorder', icdCode: 'F41.9', severities: ['MILD', 'MODERATE', 'SEVERE'], prevalence: 0.04 },
  { name: 'Celiac Disease', icdCode: 'K90.0', severities: ['MILD', 'MODERATE'], prevalence: 0.01 },
];

export const vaccineSchedule = [
  { name: 'DTaP', type: 'DTaP', doses: 5, cvxCode: '20' },
  { name: 'Polio', type: 'POLIO', doses: 4, cvxCode: '10' },
  { name: 'MMR', type: 'MMR', doses: 2, cvxCode: '03' },
  { name: 'Varicella', type: 'VARICELLA', doses: 2, cvxCode: '21' },
  { name: 'Hepatitis B', type: 'HEPATITIS_B', doses: 3, cvxCode: '08' },
  { name: 'Hepatitis A', type: 'HEPATITIS_A', doses: 2, cvxCode: '83' },
];

// Utility functions
export const random = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const randomDate = (start: Date, end: Date): Date =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const randomBool = (probability: number = 0.5): boolean => Math.random() < probability;

export const generatePhoneNumber = (): string => {
  const area = randomInt(200, 999);
  const exchange = randomInt(200, 999);
  const number = randomInt(1000, 9999);
  return `(${area}) ${exchange}-${number}`;
};

export const generateEmail = (firstName: string, lastName: string, domain?: string): string => {
  const domains = domain ? [domain] : ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
  return `${cleanFirst}.${cleanLast}${randomInt(1, 99)}@${random(domains)}`;
};

export const generateAddress = (): { address: string; city: string; state: string; zipCode: string } => {
  const number = randomInt(100, 9999);
  const location = random(cities);
  const zipCode = randomInt(location.zipRange[0], location.zipRange[1]).toString();

  return {
    address: `${number} ${random(streetNames)}`,
    city: location.name,
    state: location.state,
    zipCode,
  };
};

export const getGradeForAge = (age: number): string => {
  if (age <= 5) return grades[0];
  if (age >= 18) return grades[12];
  return grades[Math.min(age - 5, 12)];
};

export const generateBMI = (age: number, heightCm: number, weightKg: number): number => {
  return Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1));
};

export const generateRealisticVitals = (age: number) => {
  // Age-appropriate vital signs
  const vitals: any = {
    temperature: Number((97 + Math.random() * 2).toFixed(1)), // 97.0-99.0°F
    heartRate: age < 12 ? randomInt(70, 100) : randomInt(60, 90),
    respiratoryRate: age < 12 ? randomInt(18, 30) : randomInt(12, 20),
    oxygenSaturation: randomInt(95, 100),
  };

  // Blood pressure for older children
  if (age >= 10) {
    vitals.bloodPressureSystolic = randomInt(90, 120);
    vitals.bloodPressureDiastolic = randomInt(60, 80);
  }

  return vitals;
};

export const generateGrowthMeasurement = (age: number, gender: string) => {
  // Simplified growth percentile calculations
  const isMale = gender === 'MALE';

  // Height in cm (age-based)
  const baseHeight = 75 + (age * 5); // Simplified
  const height = baseHeight + randomInt(-10, 10);

  // Weight in kg (age-based)
  const baseWeight = 10 + (age * 2.5); // Simplified
  const weight = baseWeight + randomInt(-5, 5);

  const bmi = generateBMI(age, height, weight);
  const bmiPercentile = randomInt(5, 95);

  return {
    height: Number(height.toFixed(1)),
    weight: Number(weight.toFixed(1)),
    bmi: Number(bmi.toFixed(1)),
    bmiPercentile: Number(bmiPercentile.toFixed(1)),
    heightPercentile: Number(randomInt(5, 95).toFixed(1)),
    weightPercentile: Number(randomInt(5, 95).toFixed(1)),
  };
};
