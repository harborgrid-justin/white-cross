import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LanguageTranslationService } from '../language-translation.service';
import { DetectLanguageDto, TranslateBulkMessagesDto, TranslateMessageDto } from '../dto';

import { BaseController } from '@/common/base';
@ApiTags('Language Translation')
@Controller('enterprise-features/translate')
@ApiBearerAuth()
export class TranslationController extends BaseController {
  constructor(private readonly translationService: LanguageTranslationService) {}

  @Post()
  @ApiOperation({ summary: 'Translate message' })
  @ApiResponse({ status: 200, description: 'Message translated' })
  translateMessage(@Body() dto: TranslateMessageDto) {
    return this.translationService.translateText(dto.text, dto.targetLanguage);
  }

  @Post('detect')
  @ApiOperation({ summary: 'Detect language of text' })
  @ApiResponse({ status: 200, description: 'Language detected' })
  detectLanguage(@Body() dto: DetectLanguageDto) {
    return this.translationService.detectLanguage(dto.text);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Translate bulk messages' })
  @ApiResponse({ status: 200, description: 'Messages translated' })
  translateBulkMessages(@Body() dto: TranslateBulkMessagesDto) {
    return this.translationService.translateBulk(dto.messages, dto.targetLanguage);
  }
}