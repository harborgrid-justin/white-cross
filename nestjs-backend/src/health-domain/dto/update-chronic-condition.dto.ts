import { PartialType } from '@nestjs/swagger';
import { CreateChronicConditionDto } from './create-chronic-condition.dto';

export class UpdateChronicConditionDto extends PartialType(CreateChronicConditionDto) {}
