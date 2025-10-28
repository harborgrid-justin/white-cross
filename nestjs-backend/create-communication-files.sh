#!/bin/bash

# Script to create all communication module files
BASE_DIR="/home/user/white-cross/nestjs-backend/src/communication"

# Create DTOs
cat > "$BASE_DIR/dto/create-message-template.dto.ts" << 'EOF'
import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { MessageType, MessageCategory } from '../enums';

export class CreateMessageTemplateDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  subject?: string;

  @IsString()
  @MinLength(1)
  content: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsEnum(MessageCategory)
  category: MessageCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  createdBy: string;
}
EOF

cat > "$BASE_DIR/dto/update-message-template.dto.ts" << 'EOF'
import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageTemplateDto } from './create-message-template.dto';

export class UpdateMessageTemplateDto extends PartialType(CreateMessageTemplateDto) {}
EOF

cat > "$BASE_DIR/dto/recipient.dto.ts" << 'EOF'
import { IsString, IsOptional, IsEnum, IsEmail, Matches } from 'class-validator';
import { RecipientType } from '../enums';

export class RecipientDto {
  @IsEnum(RecipientType)
  type: RecipientType;

  @IsString()
  id: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be in E.164 format' })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  pushToken?: string;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;
}
EOF

cat > "$BASE_DIR/dto/create-message.dto.ts" << 'EOF'
import { IsString, IsOptional, IsEnum, IsArray, IsDateString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageType, MessagePriority, MessageCategory } from '../enums';
import { RecipientDto } from './recipient.dto';

export class CreateMessageDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  recipients: RecipientDto[];

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(MessageType, { each: true })
  channels: MessageType[];

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  content: string;

  @IsEnum(MessagePriority)
  priority: MessagePriority;

  @IsEnum(MessageCategory)
  category: MessageCategory;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @IsString()
  senderId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  translateTo?: string[];
}
EOF

cat > "$BASE_DIR/dto/broadcast-message.dto.ts" << 'EOF'
import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, IsDateString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageType, MessagePriority, MessageCategory } from '../enums';

class BroadcastAudienceDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  grades?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nurseIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  studentIds?: string[];

  @IsOptional()
  @IsBoolean()
  includeParents?: boolean;

  @IsOptional()
  @IsBoolean()
  includeEmergencyContacts?: boolean;
}

export class BroadcastMessageDto {
  @ValidateNested()
  @Type(() => BroadcastAudienceDto)
  audience: BroadcastAudienceDto;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(MessageType, { each: true })
  channels: MessageType[];

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  content: string;

  @IsEnum(MessagePriority)
  priority: MessagePriority;

  @IsEnum(MessageCategory)
  category: MessageCategory;

  @IsString()
  senderId: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  translateTo?: string[];
}
EOF

cat > "$BASE_DIR/dto/emergency-alert.dto.ts" << 'EOF'
import { IsString, IsEnum, IsArray, IsOptional, ArrayMinSize } from 'class-validator';
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
EOF

cat > "$BASE_DIR/dto/index.ts" << 'EOF'
export * from './create-message-template.dto';
export * from './update-message-template.dto';
export * from './recipient.dto';
export * from './create-message.dto';
export * from './broadcast-message.dto';
export * from './emergency-alert.dto';
EOF

echo "DTOs created successfully"
