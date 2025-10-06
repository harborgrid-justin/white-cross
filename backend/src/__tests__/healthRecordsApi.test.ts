import request from 'supertest';
import { app } from '../../index';
import { HealthRecordService } from '../../services/healthRecordService';
import jwt from 'jsonwebtoken';

// Mock the HealthRecordService
jest.mock('../../services/healthRecordService');
const mockHealthRecordService = HealthRecordService as jest.Mocked<typeof HealthRecordService>;

// Mock JWT for authentication
const mockToken = jwt.sign({ userId: 'user-1', role: 'NURSE' }, process.env.JWT_SECRET || 'test-secret');

// Mock data
const mockHealthRecord = {
  id: '1',
  studentId: 'student-1',
  type: 'PHYSICAL_EXAM',
  date: new Date('2024-10-01'),
  description: 'Annual physical examination',
  provider: 'Dr. Smith',
  notes: 'Patient in good health',
  vital: {
    height: 150,
    weight: 45,
    temperature: 36.5,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    heartRate: 72,
    bmi: 20.0
  },
  student: {
    id: 'student-1',
    firstName: 'John',
    lastName: 'Doe',
    studentNumber: 'STU001'
  }
};

const mockAllergy = {
  id: '1',
  studentId: 'student-1',
  allergen: 'Peanuts',
  severity: 'LIFE_THREATENING',
  reaction: 'Anaphylaxis',
  treatment: 'EpiPen',
  verified: true,
  verifiedBy: 'Dr. Smith',
  verifiedAt: new Date('2024-10-01'),
  student: {
    id: 'student-1',
    firstName: 'John',
    lastName: 'Doe',
    studentNumber: 'STU001'
  }
};

const mockChronicCondition = {
  id: '1',
  studentId: 'student-1',
  condition: 'Asthma',
  diagnosedDate: new Date('2020-01-15'),
  status: 'ACTIVE',
  severity: 'MODERATE',
  notes: 'Exercise-induced asthma',
  carePlan: 'Inhaler as needed',
  medications: 'Albuterol',
  dietaryRestrictions: 'None',
  activityRestrictions: 'No strenuous exercise',
  triggers: 'Dust, pollen',
  diagnosedBy: 'Dr. Johnson',
  lastReviewDate: new Date('2024-01-15'),
  nextReviewDate: new Date('2025-01-15'),
  student: {
    id: 'student-1',
    firstName: 'John',
    lastName: 'Doe',
    studentNumber: 'STU001'
  }
};

describe('Health Records API - GET /api/health-records/student/:studentId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests 101-110: Get Student Health Records
  test('101. should get student health records successfully', async () => {
    mockHealthRecordService.getStudentHealthRecords.mockResolvedValue({
      records: [mockHealthRecord],
      pagination: { page: 1, limit: 20, total: 1, pages: 1 }
    });

    const response = await request(app)
      .get('/api/health-records/student/student-1')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.records).toHaveLength(1);
    expect(response.body.data.records[0].id).toBe('1');
  });

  test('102. should require authentication for health records', async () => {
    await request(app)
      .get('/api/health-records/student/student-1')
      .expect(401);
  });

  test('103. should handle pagination parameters', async () => {
    mockHealthRecordService.getStudentHealthRecords.mockResolvedValue({
      records: [mockHealthRecord],
      pagination: { page: 2, limit: 10, total: 15, pages: 2 }
    });

    await request(app)
      .get('/api/health-records/student/student-1?page=2&limit=10')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    expect(mockHealthRecordService.getStudentHealthRecords).toHaveBeenCalledWith(
      'student-1', 2, 10, {}
    );
  });

  test('104. should handle filter parameters', async () => {
    mockHealthRecordService.getStudentHealthRecords.mockResolvedValue({
      records: [mockHealthRecord],
      pagination: { page: 1, limit: 20, total: 1, pages: 1 }
    });

    await request(app)
      .get('/api/health-records/student/student-1?type=PHYSICAL_EXAM&provider=Dr.%20Smith')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    expect(mockHealthRecordService.getStudentHealthRecords).toHaveBeenCalledWith(
      'student-1', 1, 20, { type: 'PHYSICAL_EXAM', provider: 'Dr. Smith' }
    );
  });

  test('105. should handle date range filters', async () => {
    mockHealthRecordService.getStudentHealthRecords.mockResolvedValue({
      records: [mockHealthRecord],
      pagination: { page: 1, limit: 20, total: 1, pages: 1 }
    });

    await request(app)
      .get('/api/health-records/student/student-1?dateFrom=2024-01-01&dateTo=2024-12-31')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    expect(mockHealthRecordService.getStudentHealthRecords).toHaveBeenCalledWith(
      'student-1', 1, 20, { 
        dateFrom: new Date('2024-01-01'), 
        dateTo: new Date('2024-12-31') 
      }
    );
  });

  test('106. should handle service errors gracefully', async () => {
    mockHealthRecordService.getStudentHealthRecords.mockRejectedValue(
      new Error('Database connection failed')
    );

    const response = await request(app)
      .get('/api/health-records/student/student-1')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe('Database connection failed');
  });

  test('107. should return empty array for student with no records', async () => {
    mockHealthRecordService.getStudentHealthRecords.mockResolvedValue({
      records: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 }
    });

    const response = await request(app)
      .get('/api/health-records/student/student-2')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    expect(response.body.data.records).toHaveLength(0);
    expect(response.body.data.pagination.total).toBe(0);
  });

  test('108. should validate student ID parameter', async () => {
    await request(app)
      .get('/api/health-records/student/')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(404);
  });

  test('109. should handle malformed pagination parameters', async () => {
    mockHealthRecordService.getStudentHealthRecords.mockResolvedValue({
      records: [mockHealthRecord],
      pagination: { page: 1, limit: 20, total: 1, pages: 1 }
    });

    await request(app)
      .get('/api/health-records/student/student-1?page=invalid&limit=invalid')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    // Should default to page 1, limit 20
    expect(mockHealthRecordService.getStudentHealthRecords).toHaveBeenCalledWith(
      'student-1', 1, 20, {}
    );
  });

  test('110. should include student information in response', async () => {
    mockHealthRecordService.getStudentHealthRecords.mockResolvedValue({
      records: [mockHealthRecord],
      pagination: { page: 1, limit: 20, total: 1, pages: 1 }
    });

    const response = await request(app)
      .get('/api/health-records/student/student-1')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    expect(response.body.data.records[0].student).toEqual({
      id: 'student-1',
      firstName: 'John',
      lastName: 'Doe',
      studentNumber: 'STU001'
    });
  });
});

describe('Health Records API - POST /api/health-records', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests 111-120: Create Health Record
  test('111. should create health record successfully', async () => {
    mockHealthRecordService.createHealthRecord.mockResolvedValue(mockHealthRecord);

    const newRecord = {
      studentId: 'student-1',
      type: 'PHYSICAL_EXAM',
      date: '2024-10-01T10:00:00Z',
      description: 'Annual physical examination',
      provider: 'Dr. Smith',
      notes: 'Patient in good health'
    };

    const response = await request(app)
      .post('/api/health-records')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(newRecord)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.healthRecord.id).toBe('1');
  });

  test('112. should require authentication for creating records', async () => {
    const newRecord = {
      studentId: 'student-1',
      type: 'PHYSICAL_EXAM',
      date: '2024-10-01T10:00:00Z',
      description: 'Annual physical examination'
    };

    await request(app)
      .post('/api/health-records')
      .send(newRecord)
      .expect(401);
  });

  test('113. should validate required fields', async () => {
    const response = await request(app)
      .post('/api/health-records')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
  });

  test('114. should validate student ID field', async () => {
    const response = await request(app)
      .post('/api/health-records')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        type: 'PHYSICAL_EXAM',
        date: '2024-10-01T10:00:00Z',
        description: 'Annual physical examination'
      })
      .expect(400);

    expect(response.body.errors.some((error: any) => 
      error.param === 'studentId'
    )).toBe(true);
  });

  test('115. should validate record type', async () => {
    const response = await request(app)
      .post('/api/health-records')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        studentId: 'student-1',
        type: 'INVALID_TYPE',
        date: '2024-10-01T10:00:00Z',
        description: 'Test record'
      })
      .expect(400);

    expect(response.body.errors.some((error: any) => 
      error.param === 'type'
    )).toBe(true);
  });

  test('116. should validate date format', async () => {
    const response = await request(app)
      .post('/api/health-records')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        studentId: 'student-1',
        type: 'PHYSICAL_EXAM',
        date: 'invalid-date',
        description: 'Test record'
      })
      .expect(400);

    expect(response.body.errors.some((error: any) => 
      error.param === 'date'
    )).toBe(true);
  });

  test('117. should validate description field', async () => {
    const response = await request(app)
      .post('/api/health-records')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        studentId: 'student-1',
        type: 'PHYSICAL_EXAM',
        date: '2024-10-01T10:00:00Z'
      })
      .expect(400);

    expect(response.body.errors.some((error: any) => 
      error.param === 'description'
    )).toBe(true);
  });

  test('118. should handle service errors during creation', async () => {
    mockHealthRecordService.createHealthRecord.mockRejectedValue(
      new Error('Student not found')
    );

    const newRecord = {
      studentId: 'invalid-student',
      type: 'PHYSICAL_EXAM',
      date: '2024-10-01T10:00:00Z',
      description: 'Annual physical examination'
    };

    const response = await request(app)
      .post('/api/health-records')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(newRecord)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe('Student not found');
  });

  test('119. should accept optional vital signs data', async () => {
    mockHealthRecordService.createHealthRecord.mockResolvedValue({
      ...mockHealthRecord,
      vital: {
        height: 150,
        weight: 45,
        temperature: 36.5,
        bmi: 20.0
      }
    });

    const newRecord = {
      studentId: 'student-1',
      type: 'PHYSICAL_EXAM',
      date: '2024-10-01T10:00:00Z',
      description: 'Annual physical examination',
      vital: {
        height: 150,
        weight: 45,
        temperature: 36.5
      }
    };

    const response = await request(app)
      .post('/api/health-records')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(newRecord)
      .expect(201);

    expect(response.body.data.healthRecord.vital).toBeDefined();
    expect(response.body.data.healthRecord.vital.bmi).toBe(20.0);
  });

  test('120. should accept optional provider and notes', async () => {
    mockHealthRecordService.createHealthRecord.mockResolvedValue({
      ...mockHealthRecord,
      provider: 'Dr. Johnson',
      notes: 'Follow-up needed'
    });

    const newRecord = {
      studentId: 'student-1',
      type: 'PHYSICAL_EXAM',
      date: '2024-10-01T10:00:00Z',
      description: 'Annual physical examination',
      provider: 'Dr. Johnson',
      notes: 'Follow-up needed'
    };

    const response = await request(app)
      .post('/api/health-records')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(newRecord)
      .expect(201);

    expect(response.body.data.healthRecord.provider).toBe('Dr. Johnson');
    expect(response.body.data.healthRecord.notes).toBe('Follow-up needed');
  });
});

describe('Health Records API - PUT /api/health-records/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests 121-130: Update Health Record
  test('121. should update health record successfully', async () => {
    mockHealthRecordService.updateHealthRecord.mockResolvedValue({
      ...mockHealthRecord,
      description: 'Updated description'
    });

    const updateData = {
      description: 'Updated description',
      notes: 'Updated notes'
    };

    const response = await request(app)
      .put('/api/health-records/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.healthRecord.description).toBe('Updated description');
  });

  test('122. should require authentication for updates', async () => {
    await request(app)
      .put('/api/health-records/1')
      .send({ description: 'Updated' })
      .expect(401);
  });

  test('123. should validate record type on update', async () => {
    const response = await request(app)
      .put('/api/health-records/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ type: 'INVALID_TYPE' })
      .expect(400);

    expect(response.body.errors.some((error: any) => 
      error.param === 'type'
    )).toBe(true);
  });

  test('124. should validate date format on update', async () => {
    const response = await request(app)
      .put('/api/health-records/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ date: 'invalid-date' })
      .expect(400);

    expect(response.body.errors.some((error: any) => 
      error.param === 'date'
    )).toBe(true);
  });

  test('125. should handle record not found', async () => {
    mockHealthRecordService.updateHealthRecord.mockRejectedValue(
      new Error('Health record not found')
    );

    const response = await request(app)
      .put('/api/health-records/999')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ description: 'Updated' })
      .expect(400);

    expect(response.body.error.message).toBe('Health record not found');
  });

  test('126. should accept partial updates', async () => {
    mockHealthRecordService.updateHealthRecord.mockResolvedValue({
      ...mockHealthRecord,
      notes: 'Only notes updated'
    });

    const response = await request(app)
      .put('/api/health-records/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ notes: 'Only notes updated' })
      .expect(200);

    expect(response.body.data.healthRecord.notes).toBe('Only notes updated');
  });

  test('127. should update vital signs data', async () => {
    mockHealthRecordService.updateHealthRecord.mockResolvedValue({
      ...mockHealthRecord,
      vital: { ...mockHealthRecord.vital, temperature: 37.0 }
    });

    const response = await request(app)
      .put('/api/health-records/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ 
        vital: { temperature: 37.0 }
      })
      .expect(200);

    expect(response.body.data.healthRecord.vital.temperature).toBe(37.0);
  });

  test('128. should trim whitespace from string fields', async () => {
    mockHealthRecordService.updateHealthRecord.mockResolvedValue({
      ...mockHealthRecord,
      description: 'Trimmed description'
    });

    await request(app)
      .put('/api/health-records/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ description: '  Trimmed description  ' })
      .expect(200);

    expect(mockHealthRecordService.updateHealthRecord).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        description: 'Trimmed description'
      })
    );
  });

  test('129. should handle date conversion on update', async () => {
    mockHealthRecordService.updateHealthRecord.mockResolvedValue(mockHealthRecord);

    await request(app)
      .put('/api/health-records/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ date: '2024-10-02T10:00:00Z' })
      .expect(200);

    expect(mockHealthRecordService.updateHealthRecord).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        date: new Date('2024-10-02T10:00:00Z')
      })
    );
  });

  test('130. should handle service errors during update', async () => {
    mockHealthRecordService.updateHealthRecord.mockRejectedValue(
      new Error('Validation failed')
    );

    const response = await request(app)
      .put('/api/health-records/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ description: 'Updated' })
      .expect(400);

    expect(response.body.error.message).toBe('Validation failed');
  });
});

describe('Health Records API - Allergies Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests 131-140: Allergy Management
  test('131. should get student allergies successfully', async () => {
    mockHealthRecordService.getStudentAllergies.mockResolvedValue([mockAllergy]);

    const response = await request(app)
      .get('/api/health-records/allergies/student-1')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.allergies).toHaveLength(1);
    expect(response.body.data.allergies[0].allergen).toBe('Peanuts');
  });

  test('132. should create allergy successfully', async () => {
    mockHealthRecordService.addAllergy.mockResolvedValue(mockAllergy);

    const newAllergy = {
      studentId: 'student-1',
      allergen: 'Shellfish',
      severity: 'SEVERE',
      reaction: 'Hives',
      verified: false
    };

    const response = await request(app)
      .post('/api/health-records/allergies')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(newAllergy)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.allergy).toBeDefined();
  });

  test('133. should validate allergy required fields', async () => {
    const response = await request(app)
      .post('/api/health-records/allergies')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({})
      .expect(400);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.some((error: any) => error.param === 'studentId')).toBe(true);
    expect(response.body.errors.some((error: any) => error.param === 'allergen')).toBe(true);
    expect(response.body.errors.some((error: any) => error.param === 'severity')).toBe(true);
  });

  test('134. should validate allergy severity levels', async () => {
    const response = await request(app)
      .post('/api/health-records/allergies')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        studentId: 'student-1',
        allergen: 'Test allergen',
        severity: 'INVALID_SEVERITY'
      })
      .expect(400);

    expect(response.body.errors.some((error: any) => 
      error.param === 'severity'
    )).toBe(true);
  });

  test('135. should update allergy successfully', async () => {
    mockHealthRecordService.updateAllergy.mockResolvedValue({
      ...mockAllergy,
      verified: true,
      verifiedBy: 'Dr. Johnson'
    });

    const response = await request(app)
      .put('/api/health-records/allergies/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ verified: true, verifiedBy: 'Dr. Johnson' })
      .expect(200);

    expect(response.body.data.allergy.verified).toBe(true);
  });

  test('136. should delete allergy successfully', async () => {
    mockHealthRecordService.deleteAllergy.mockResolvedValue(undefined);

    const response = await request(app)
      .delete('/api/health-records/allergies/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Allergy deleted successfully');
  });

  test('137. should handle duplicate allergy creation', async () => {
    mockHealthRecordService.addAllergy.mockRejectedValue(
      new Error('Allergy already exists for this student')
    );

    const response = await request(app)
      .post('/api/health-records/allergies')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        studentId: 'student-1',
        allergen: 'Peanuts',
        severity: 'LIFE_THREATENING'
      })
      .expect(400);

    expect(response.body.error.message).toBe('Allergy already exists for this student');
  });

  test('138. should trim allergen name', async () => {
    mockHealthRecordService.addAllergy.mockResolvedValue(mockAllergy);

    await request(app)
      .post('/api/health-records/allergies')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        studentId: 'student-1',
        allergen: '  Peanuts  ',
        severity: 'LIFE_THREATENING'
      })
      .expect(201);

    expect(mockHealthRecordService.addAllergy).toHaveBeenCalledWith(
      expect.objectContaining({
        allergen: 'Peanuts'
      })
    );
  });

  test('139. should handle allergy not found on update', async () => {
    mockHealthRecordService.updateAllergy.mockRejectedValue(
      new Error('Allergy not found')
    );

    const response = await request(app)
      .put('/api/health-records/allergies/999')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ severity: 'MILD' })
      .expect(400);

    expect(response.body.error.message).toBe('Allergy not found');
  });

  test('140. should require authentication for allergy operations', async () => {
    await request(app)
      .get('/api/health-records/allergies/student-1')
      .expect(401);

    await request(app)
      .post('/api/health-records/allergies')
      .send({ studentId: 'student-1', allergen: 'Test', severity: 'MILD' })
      .expect(401);

    await request(app)
      .put('/api/health-records/allergies/1')
      .send({ severity: 'MODERATE' })
      .expect(401);

    await request(app)
      .delete('/api/health-records/allergies/1')
      .expect(401);
  });
});

describe('Health Records API - Chronic Conditions Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests 141-150: Chronic Conditions Management
  test('141. should get student chronic conditions successfully', async () => {
    mockHealthRecordService.getStudentChronicConditions.mockResolvedValue([mockChronicCondition]);

    const response = await request(app)
      .get('/api/health-records/chronic-conditions/student-1')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.conditions).toHaveLength(1);
    expect(response.body.data.conditions[0].condition).toBe('Asthma');
  });

  test('142. should create chronic condition successfully', async () => {
    mockHealthRecordService.addChronicCondition.mockResolvedValue(mockChronicCondition);

    const newCondition = {
      studentId: 'student-1',
      condition: 'Diabetes Type 1',
      diagnosedDate: '2024-01-01T00:00:00Z',
      status: 'ACTIVE',
      severity: 'SEVERE'
    };

    const response = await request(app)
      .post('/api/health-records/chronic-conditions')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(newCondition)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.condition).toBeDefined();
  });

  test('143. should validate chronic condition required fields', async () => {
    const response = await request(app)
      .post('/api/health-records/chronic-conditions')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({})
      .expect(400);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.some((error: any) => error.param === 'studentId')).toBe(true);
    expect(response.body.errors.some((error: any) => error.param === 'condition')).toBe(true);
    expect(response.body.errors.some((error: any) => error.param === 'diagnosedDate')).toBe(true);
  });

  test('144. should validate diagnosed date format', async () => {
    const response = await request(app)
      .post('/api/health-records/chronic-conditions')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        studentId: 'student-1',
        condition: 'Test condition',
        diagnosedDate: 'invalid-date'
      })
      .expect(400);

    expect(response.body.errors.some((error: any) => 
      error.param === 'diagnosedDate'
    )).toBe(true);
  });

  test('145. should update chronic condition successfully', async () => {
    mockHealthRecordService.updateChronicCondition.mockResolvedValue({
      ...mockChronicCondition,
      status: 'MANAGED',
      nextReviewDate: new Date('2025-06-01')
    });

    const response = await request(app)
      .put('/api/health-records/chronic-conditions/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ 
        status: 'MANAGED',
        nextReviewDate: '2025-06-01T00:00:00Z'
      })
      .expect(200);

    expect(response.body.data.condition.status).toBe('MANAGED');
  });

  test('146. should delete chronic condition successfully', async () => {
    mockHealthRecordService.deleteChronicCondition.mockResolvedValue(undefined);

    const response = await request(app)
      .delete('/api/health-records/chronic-conditions/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Chronic condition deleted successfully');
  });

  test('147. should handle date conversions on create', async () => {
    mockHealthRecordService.addChronicCondition.mockResolvedValue(mockChronicCondition);

    await request(app)
      .post('/api/health-records/chronic-conditions')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        studentId: 'student-1',
        condition: 'Test condition',
        diagnosedDate: '2024-01-01T00:00:00Z',
        lastReviewDate: '2024-06-01T00:00:00Z',
        nextReviewDate: '2024-12-01T00:00:00Z'
      })
      .expect(201);

    expect(mockHealthRecordService.addChronicCondition).toHaveBeenCalledWith(
      expect.objectContaining({
        diagnosedDate: new Date('2024-01-01T00:00:00Z'),
        lastReviewDate: new Date('2024-06-01T00:00:00Z'),
        nextReviewDate: new Date('2024-12-01T00:00:00Z')
      })
    );
  });

  test('148. should handle date conversions on update', async () => {
    mockHealthRecordService.updateChronicCondition.mockResolvedValue(mockChronicCondition);

    await request(app)
      .put('/api/health-records/chronic-conditions/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        diagnosedDate: '2024-02-01T00:00:00Z',
        lastReviewDate: '2024-07-01T00:00:00Z'
      })
      .expect(200);

    expect(mockHealthRecordService.updateChronicCondition).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        diagnosedDate: new Date('2024-02-01T00:00:00Z'),
        lastReviewDate: new Date('2024-07-01T00:00:00Z')
      })
    );
  });

  test('149. should trim condition name', async () => {
    mockHealthRecordService.addChronicCondition.mockResolvedValue(mockChronicCondition);

    await request(app)
      .post('/api/health-records/chronic-conditions')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        studentId: 'student-1',
        condition: '  Asthma  ',
        diagnosedDate: '2024-01-01T00:00:00Z'
      })
      .expect(201);

    expect(mockHealthRecordService.addChronicCondition).toHaveBeenCalledWith(
      expect.objectContaining({
        condition: 'Asthma'
      })
    );
  });

  test('150. should require authentication for chronic condition operations', async () => {
    await request(app)
      .get('/api/health-records/chronic-conditions/student-1')
      .expect(401);

    await request(app)
      .post('/api/health-records/chronic-conditions')
      .send({ 
        studentId: 'student-1', 
        condition: 'Test', 
        diagnosedDate: '2024-01-01T00:00:00Z'
      })
      .expect(401);

    await request(app)
      .put('/api/health-records/chronic-conditions/1')
      .send({ status: 'MANAGED' })
      .expect(401);

    await request(app)
      .delete('/api/health-records/chronic-conditions/1')
      .expect(401);
  });
});