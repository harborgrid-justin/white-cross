import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Template category' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Email subject line' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Message body template' })
  @IsString()
  body: string;

  @ApiProperty({ description: 'List of variable names in template', type: [String] })
  @IsArray()
  @IsString({ each: true })
  variables: string[];

  @ApiProperty({ description: 'Language code (e.g., en, es)' })
  @IsString()
  language: string;

  @ApiProperty({ description: 'User who created the template' })
  @IsString()
  createdBy: string;
}

export class RenderTemplateDto {
  @ApiProperty({ description: 'Template ID' })
  @IsString()
  templateId: string;

  @ApiProperty({ description: 'Variable values for template rendering' })
  variables: { [key: string]: string };
}

export class MessageTemplateResponseDto {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  variables: string[];
  language: string;
  createdBy: string;
  createdAt: Date;
}
