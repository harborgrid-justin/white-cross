/**
 * Load Testing Script for Health Records Service
 *
 * Uses Artillery.io for comprehensive load testing
 *
 * Install: npm install -g artillery
 * Run: artillery run loadtest/health-records-load-test.js
 *
 * Or use k6 for more advanced scenarios
 */

module.exports = {
  config: {
    target: 'http://localhost:3001',
    phases: [
      // Warm-up phase
      {
        duration: 60,
        arrivalRate: 5,
        name: 'Warm-up',
      },
      // Ramp-up phase
      {
        duration: 120,
        arrivalRate: 5,
        rampTo: 50,
        name: 'Ramp-up to 50 req/sec',
      },
      // Sustained load
      {
        duration: 300,
        arrivalRate: 50,
        name: 'Sustained load at 50 req/sec',
      },
      // Spike test
      {
        duration: 60,
        arrivalRate: 100,
        name: 'Spike to 100 req/sec',
      },
      // Cool-down
      {
        duration: 60,
        arrivalRate: 10,
        name: 'Cool-down',
      },
    ],
    payload: {
      path: './test-data/test-users.csv',
      fields: ['token', 'studentId'],
    },
    defaults: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    variables: {
      baseUrl: 'http://localhost:3001',
    },
    plugins: {
      expect: {},
      'artillery-plugin-metrics-by-endpoint': {
        // Group metrics by endpoint
        stripQueryString: true,
      },
    },
  },
  scenarios: [
    {
      name: 'Health Records - Read Heavy Workflow',
      weight: 60,
      flow: [
        // Login (cached token in real scenario)
        {
          post: {
            url: '/api/auth/login',
            json: {
              email: 'nurse1@whitecross.com',
              password: 'Test@1234',
            },
            capture: {
              json: '$.data.token',
              as: 'authToken',
            },
          },
        },
        // Get student health summary (most frequent)
        {
          get: {
            url: '/api/health-records/summary/{{ studentId }}',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            expect: [
              {
                statusCode: 200,
              },
              {
                contentType: 'application/json',
              },
            ],
          },
        },
        // Get student health records (paginated)
        {
          get: {
            url: '/api/health-records/student/{{ studentId }}?page=1&limit=20',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            expect: {
              statusCode: 200,
            },
          },
        },
        // Get allergies
        {
          get: {
            url: '/api/health-records/allergies/{{ studentId }}',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            expect: {
              statusCode: 200,
            },
          },
        },
        // Get recent vitals
        {
          get: {
            url: '/api/health-records/vitals/{{ studentId }}?limit=10',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            expect: {
              statusCode: 200,
            },
          },
        },
        // Think time (user reads data)
        {
          think: 2,
        },
      ],
    },
    {
      name: 'Health Records - Write Operations',
      weight: 30,
      flow: [
        // Login
        {
          post: {
            url: '/api/auth/login',
            json: {
              email: 'nurse1@whitecross.com',
              password: 'Test@1234',
            },
            capture: {
              json: '$.data.token',
              as: 'authToken',
            },
          },
        },
        // Create health record
        {
          post: {
            url: '/api/health-records',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            json: {
              studentId: '{{ studentId }}',
              type: 'CHECKUP',
              date: '{{ $timestamp }}',
              description: 'Routine checkup - load test',
              vital: {
                temperature: 98.6,
                bloodPressureSystolic: 120,
                bloodPressureDiastolic: 80,
                heartRate: 72,
              },
              provider: 'Dr. Load Test',
            },
            expect: {
              statusCode: 201,
            },
          },
        },
        // Think time
        {
          think: 1,
        },
        // Get updated summary to verify cache invalidation
        {
          get: {
            url: '/api/health-records/summary/{{ studentId }}',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            expect: {
              statusCode: 200,
            },
          },
        },
      ],
    },
    {
      name: 'Health Records - Search Operations',
      weight: 10,
      flow: [
        // Login
        {
          post: {
            url: '/api/auth/login',
            json: {
              email: 'nurse1@whitecross.com',
              password: 'Test@1234',
            },
            capture: {
              json: '$.data.token',
              as: 'authToken',
            },
          },
        },
        // Search health records
        {
          get: {
            url: '/api/health-records/search?q={{ $randomString() }}&page=1&limit=20',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            expect: {
              statusCode: 200,
            },
          },
        },
        // Think time
        {
          think: 3,
        },
      ],
    },
  ],
};

// Performance expectations (SLAs)
const PERFORMANCE_SLAS = {
  // Response time SLAs (milliseconds)
  responseTime: {
    p50: 200, // 50th percentile < 200ms
    p95: 500, // 95th percentile < 500ms
    p99: 1000, // 99th percentile < 1000ms
  },
  // Error rate SLA
  errorRate: 0.01, // < 1% error rate
  // Throughput SLA
  throughput: 50, // Handle 50 req/sec sustained
};

console.log('Performance SLAs:');
console.log(JSON.stringify(PERFORMANCE_SLAS, null, 2));
