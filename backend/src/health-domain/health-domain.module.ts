import { Module } from '@nestjs/common';
import { HealthDomainService } from './health-domain.service';
import { HealthDomainController } from './health-domain.controller';

@Module({
  providers: [HealthDomainService],
  controllers: [HealthDomainController]
})
export class HealthDomainModule {}
