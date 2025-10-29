import { PartialType } from '@nestjs/swagger';
import { HealthDomainCreateRecordDto } from './create-health-record.dto';

export class HealthDomainUpdateRecordDto extends PartialType(HealthDomainCreateRecordDto) {}
