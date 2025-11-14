import { Test, TestingModule } from '@nestjs/testing';
import { TranslationController } from './translation.controller';
import { LanguageTranslationService } from '../language-translation.service';
import { DetectLanguageDto, TranslateBulkMessagesDto, TranslateMessageDto } from '../dto';

describe('TranslationController', () => {
  let controller: TranslationController;
  let service: jest.Mocked<LanguageTranslationService>;

  const mockTranslationService = {
    translateText: jest.fn(),
    detectLanguage: jest.fn(),
    translateBulk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationController],
      providers: [
        {
          provide: LanguageTranslationService,
          useValue: mockTranslationService,
        },
      ],
    }).compile();

    controller = module.get<TranslationController>(TranslationController);
    service = module.get(LanguageTranslationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('translateMessage', () => {
    it('should translate English to Spanish', async () => {
      const dto: TranslateMessageDto = {
        text: 'Your appointment is scheduled for tomorrow',
        targetLanguage: 'es',
      };

      const expectedResult = {
        originalText: dto.text,
        translatedText: 'Su cita está programada para mañana',
        targetLanguage: 'es',
        sourceLanguage: 'en',
      };

      mockTranslationService.translateText.mockResolvedValue(expectedResult);

      const result = await controller.translateMessage(dto);

      expect(service.translateText).toHaveBeenCalledWith(dto.text, dto.targetLanguage);
      expect(result.targetLanguage).toBe('es');
    });

    it('should handle unsupported language', async () => {
      const dto: TranslateMessageDto = {
        text: 'Hello',
        targetLanguage: 'xyz',
      };

      mockTranslationService.translateText.mockRejectedValue(
        new Error('Unsupported target language'),
      );

      await expect(controller.translateMessage(dto)).rejects.toThrow(
        'Unsupported target language',
      );
    });
  });

  describe('detectLanguage', () => {
    it('should detect English language', async () => {
      const dto: DetectLanguageDto = {
        text: 'This is a test message',
      };

      const expectedResult = {
        text: dto.text,
        detectedLanguage: 'en',
        confidence: 0.99,
      };

      mockTranslationService.detectLanguage.mockResolvedValue(expectedResult);

      const result = await controller.detectLanguage(dto);

      expect(service.detectLanguage).toHaveBeenCalledWith(dto.text);
      expect(result.detectedLanguage).toBe('en');
    });

    it('should detect Spanish language', async () => {
      const dto: DetectLanguageDto = {
        text: 'Hola, ¿cómo estás?',
      };

      mockTranslationService.detectLanguage.mockResolvedValue({
        text: dto.text,
        detectedLanguage: 'es',
        confidence: 0.98,
      });

      const result = await controller.detectLanguage(dto);

      expect(result.detectedLanguage).toBe('es');
    });
  });

  describe('translateBulkMessages', () => {
    it('should translate multiple messages', async () => {
      const dto: TranslateBulkMessagesDto = {
        messages: [
          'Your appointment is confirmed',
          'Please bring your ID',
          'Thank you',
        ],
        targetLanguage: 'fr',
      };

      const expectedResult = {
        translations: [
          { original: dto.messages[0], translated: 'Votre rendez-vous est confirmé' },
          { original: dto.messages[1], translated: 'Veuillez apporter votre ID' },
          { original: dto.messages[2], translated: 'Merci' },
        ],
        targetLanguage: 'fr',
      };

      mockTranslationService.translateBulk.mockResolvedValue(expectedResult);

      const result = await controller.translateBulkMessages(dto);

      expect(service.translateBulk).toHaveBeenCalledWith(dto.messages, dto.targetLanguage);
      expect(result.translations).toHaveLength(3);
    });
  });
});
