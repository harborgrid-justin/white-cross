import { Module } from '@nestjs/common';
import { HealthDomainService } from './health-domain.service';

@Module({
  providers: [HealthDomainService]
})
export class HealthDomainModule {}
