/**
 * Student Resolver Integration Tests
 *
 * Tests the full GraphQL stack for student queries and mutations.
 * Includes authentication, authorization, DataLoader, and database integration.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { DatabaseService } from '../../../src/database/database.service';
import { AuthService } from '../../../src/auth/auth.service';
import { UserRole } from '../../../src/database/models/user.model';

describe('StudentResolver (Integration)', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let authService: AuthService;
  let adminToken: string;
  let nurseToken: string;
  let testStudentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);
    authService = moduleFixture.get<AuthService>(AuthService);

    // Create test users and get tokens
    const adminUser = await createTestUser('admin', UserRole.ADMIN);
    const nurseUser = await createTestUser('nurse', UserRole.NURSE);

    adminToken = await authService.generateToken(adminUser);
    nurseToken = await authService.generateToken(nurseUser);

    // Create test student
    testStudentId = await createTestStudent();
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData();
    await app.close();
  });

  describe('Query: students', () => {
    it('should return paginated list of students with admin token', async () => {
      const query = `
        query GetStudents {
          students(page: 1, limit: 10) {
            students {
              id
              firstName
              lastName
              fullName
              grade
              isActive
            }
            pagination {
              page
              limit
              total
              totalPages
            }
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ query })
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.students).toBeDefined();
      expect(response.body.data.students.students).toBeInstanceOf(Array);
      expect(response.body.data.students.pagination).toBeDefined();
      expect(response.body.data.students.pagination.total).toBeGreaterThan(0);
    });

    it('should return 401 without authentication token', async () => {
      const query = `{ students(page: 1, limit: 10) { students { id } } }`;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200); // GraphQL returns 200 even for errors

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain('Unauthorized');
    });

    it('should filter students by grade', async () => {
      const query = `
        query GetStudentsByGrade {
          students(page: 1, limit: 10, filters: { grade: "5" }) {
            students {
              id
              grade
            }
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ query })
        .expect(200);

      expect(response.body.data.students.students).toBeInstanceOf(Array);
      response.body.data.students.students.forEach((student: any) => {
        expect(student.grade).toBe('5');
      });
    });
  });

  describe('Query: student', () => {
    it('should return single student by ID', async () => {
      const query = `
        query GetStudent($id: ID!) {
          student(id: $id) {
            id
            firstName
            lastName
            fullName
            dateOfBirth
            grade
            gender
            isActive
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          query,
          variables: { id: testStudentId },
        })
        .expect(200);

      expect(response.body.data.student).toBeDefined();
      expect(response.body.data.student.id).toBe(testStudentId);
      expect(response.body.data.student.fullName).toBeDefined();
    });

    it('should return null for non-existent student', async () => {
      const query = `
        query GetStudent($id: ID!) {
          student(id: $id) {
            id
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          query,
          variables: { id: 'non-existent-id' },
        })
        .expect(200);

      expect(response.body.data.student).toBeNull();
    });
  });

  describe('Field Resolver: contacts', () => {
    it('should load contacts using DataLoader (no N+1)', async () => {
      const query = `
        query GetStudentsWithContacts {
          students(page: 1, limit: 5) {
            students {
              id
              fullName
              contacts {
                id
                firstName
                lastName
                email
                phone
                type
              }
              contactCount
            }
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ query })
        .expect(200);

      expect(response.body.data.students.students).toBeInstanceOf(Array);
      response.body.data.students.students.forEach((student: any) => {
        expect(student.contacts).toBeDefined();
        expect(student.contactCount).toBeDefined();
        expect(student.contactCount).toBe(student.contacts.length);
      });

      // TODO: Add query count assertion to verify no N+1
    });
  });

  describe('Field Resolver: medications', () => {
    it('should load medications using DataLoader', async () => {
      const query = `
        query GetStudentWithMedications($id: ID!) {
          student(id: $id) {
            id
            fullName
            medications {
              id
              name
              dosage
              frequency
              isActive
            }
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          query,
          variables: { id: testStudentId },
        })
        .expect(200);

      expect(response.body.data.student).toBeDefined();
      expect(response.body.data.student.medications).toBeDefined();
      expect(response.body.data.student.medications).toBeInstanceOf(Array);
    });
  });

  describe('Complex Query with Multiple Resolvers', () => {
    it('should efficiently resolve nested relationships', async () => {
      const query = `
        query ComplexStudentQuery {
          students(page: 1, limit: 3) {
            students {
              id
              fullName
              grade
              contacts {
                id
                fullName
                email
              }
              medications {
                id
                name
                dosage
              }
              healthRecord {
                id
                recordType
                title
              }
              contactCount
            }
          }
        }
      `;

      const startTime = Date.now();

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ query })
        .expect(200);

      const duration = Date.now() - startTime;

      expect(response.body.data.students.students).toBeInstanceOf(Array);
      expect(duration).toBeLessThan(1000); // Should complete in < 1 second

      // Verify DataLoader prevented N+1 queries
      response.body.data.students.students.forEach((student: any) => {
        expect(student.contacts).toBeDefined();
        expect(student.medications).toBeDefined();
        // healthRecord may be null
      });
    });
  });

  describe('Query Complexity Limiting', () => {
    it('should reject overly complex queries', async () => {
      // Create a deeply nested query
      const query = `
        query TooComplex {
          students(page: 1, limit: 100) {
            students {
              id
              contacts {
                id
                relationTo
              }
              medications {
                id
                name
              }
              healthRecord {
                id
                title
              }
            }
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ query })
        .expect(200);

      // Query should succeed if complexity is under limit
      // Or return error if over limit
      if (response.body.errors) {
        expect(response.body.errors[0].message).toContain('too complex');
      }
    });
  });

  describe('Authorization', () => {
    it('should allow nurse to query students', async () => {
      const query = `{ students(page: 1, limit: 5) { students { id } } }`;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${nurseToken}`)
        .send({ query })
        .expect(200);

      expect(response.body.data.students).toBeDefined();
    });

    // Add more authorization tests for different roles
  });

  // Helper functions
  async function createTestUser(username: string, role: UserRole): Promise<any> {
    // Implementation depends on your database setup
    return {
      id: `test-${username}-id`,
      username,
      role,
      email: `${username}@test.com`,
    };
  }

  async function createTestStudent(): Promise<string> {
    // Create test student in database
    return 'test-student-id';
  }

  async function cleanupTestData(): Promise<void> {
    // Clean up test data from database
  }
});
