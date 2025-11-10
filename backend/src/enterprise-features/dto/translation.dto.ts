import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TranslateMessageDto {
  @ApiProperty({ description: 'Text to translate' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Target language code (e.g., es, fr, zh)' })
  @IsString()
  targetLanguage: string;
}

export class DetectLanguageDto {
  @ApiProperty({ description: 'Text to analyze' })
  @IsString()
  text: string;
}

export class TranslateBulkMessagesDto {
  @ApiProperty({
    description: 'Array of messages to translate',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  messages: string[];

  @ApiProperty({ description: 'Target language code' })
  @IsString()
  targetLanguage: string;
}
