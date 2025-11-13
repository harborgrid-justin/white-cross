/**
 * LOC: EMERGENCY-BROADCAST-DTO-TEMPLATE-001
 * DTO for emergency template response
 */

import { EmergencyType } from '../emergency-broadcast.enums';

export class EmergencyTemplateDto {
  title: string;
  message: string;
}

export class EmergencyTemplatesResponseDto {
  templates: Record<EmergencyType, EmergencyTemplateDto>;
}
