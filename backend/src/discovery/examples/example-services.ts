import { Injectable } from '@nestjs/common';
import {
  FeatureFlag,
  ExperimentalFeature,
  Analytics,
  Domain,
  Cacheable,
  Monitored,
} from '../decorators/metadata.decorator';
import { RateLimit } from '../decorators/rate-limit.decorator';

// Example service with feature flag
@Injectable()
@FeatureFlag('experimental')
@Analytics(true)
@Domain('health-records')
@Monitored('detailed')
export class ExperimentalHealthService {
  getExperimentalFeature(): string {
    return 'This is an experimental health feature';
  }
}

// Example service with experimental feature decorator
@Injectable()
@ExperimentalFeature('ai-diagnosis')
@Domain('clinical')
@Cacheable(300) // 5 minutes cache
export class AiDiagnosisService {
  diagnose(symptoms: string[]): string {
    return `AI diagnosis for symptoms: ${symptoms.join(', ')}`;
  }
}

// Example service with analytics enabled
@Injectable()
@Analytics(true)
@Domain('user-management')
@RateLimit(100, 60000) // 100 requests per minute
@Monitored('basic')
export class UserAnalyticsService {
  trackUserActivity(userId: string, activity: string): void {
    console.log(`Tracking activity for user ${userId}: ${activity}`);
  }
}

// Example service with caching
@Injectable()
@Cacheable(600) // 10 minutes cache
@Domain('reporting')
@Analytics(false)
export class ReportCacheService {
  generateReport(reportId: string): string {
    return `Generated report ${reportId}`;
  }
}

// Example service with rate limiting
@Injectable()
@RateLimit(50, 60000) // 50 requests per minute
@Domain('external-api')
@Monitored('detailed')
export class ExternalApiService {
  callExternalApi(endpoint: string): Promise<any> {
    return Promise.resolve({ data: `Response from ${endpoint}` });
  }
}

// Regular service without any custom decorators for comparison
@Injectable()
export class RegularService {
  doSomething(): string {
    return 'Regular service functionality';
  }
}

// Service with multiple domains (for testing filtering)
@Injectable()
@Domain('student-health')
@Analytics(true)
@Cacheable(120) // 2 minutes cache
@Monitored('basic')
export class StudentHealthService {
  getStudentHealthRecord(studentId: string): string {
    return `Health record for student ${studentId}`;
  }
}
