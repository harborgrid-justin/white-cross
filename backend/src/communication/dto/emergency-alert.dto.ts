import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';
import { MessageType } from '../enums';

export class EmergencyAlertDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  @IsEnum(['ALL_STAFF', 'NURSES_ONLY', 'SPECIFIC_GROUPS'])
  audience: 'ALL_STAFF' | 'NURSES_ONLY' | 'SPECIFIC_GROUPS';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  groups?: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(MessageType, { each: true })
  channels: MessageType[];

  @IsString()
  senderId: string;
}
