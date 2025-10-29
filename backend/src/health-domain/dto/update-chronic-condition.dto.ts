import { PartialType } from '@nestjs/swagger';
import { HealthDomainCreateChronicConditionDto } from './create-chronic-condition.dto';

export class HealthDomainUpdateChronicConditionDto extends PartialType(HealthDomainCreateChronicConditionDto) {}
