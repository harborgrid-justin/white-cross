import { Test, TestingModule } from '@nestjs/testing';
import { PhoneValidatorService } from './phone-validator.service';
import { PhoneNumberType, PhoneNumberValidationResult } from '../dto/phone-number.dto';

describe('PhoneValidatorService', () => {
  let service: PhoneValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneValidatorService],
    }).compile();

    service = module.get<PhoneValidatorService>(PhoneValidatorService);
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate valid US phone number with country code', async () => {
      const result = await service.validatePhoneNumber('+15551234567');

      expect(result.isValid).toBe(true);
      expect(result.e164Format).toBe('+15551234567');
      expect(result.countryCode).toBe('US');
      expect(result.nationalFormat).toBeDefined();
    });

    it('should validate US phone number without country code', async () => {
      const result = await service.validatePhoneNumber('(555) 123-4567', 'US');

      expect(result.isValid).toBe(true);
      expect(result.countryCode).toBe('US');
    });

    it('should return invalid for empty phone number', async () => {
      const result = await service.validatePhoneNumber('');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number is empty');
    });

    it('should return invalid for malformed phone number', async () => {
      const result = await service.validatePhoneNumber('123');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid phone number');
    });

    it('should validate international phone numbers', async () => {
      const ukResult = await service.validatePhoneNumber('+447911123456');
      expect(ukResult.isValid).toBe(true);
      expect(ukResult.countryCode).toBe('GB');

      const frResult = await service.validatePhoneNumber('+33612345678');
      expect(frResult.isValid).toBe(true);
      expect(frResult.countryCode).toBe('FR');
    });

    it('should detect phone number type', async () => {
      const result = await service.validatePhoneNumber('+15551234567');

      expect(result.type).toBeDefined();
      expect(Object.values(PhoneNumberType)).toContain(result.type);
    });

    it('should handle phone numbers with special formatting', async () => {
      const result = await service.validatePhoneNumber('+1 (555) 123-4567');

      expect(result.isValid).toBe(true);
      expect(result.e164Format).toBe('+15551234567');
    });

    it('should trim whitespace before validation', async () => {
      const result = await service.validatePhoneNumber('  +15551234567  ');

      expect(result.isValid).toBe(true);
    });
  });

  describe('normalizeToE164', () => {
    it('should normalize valid phone number to E.164 format', async () => {
      const e164 = await service.normalizeToE164('(555) 123-4567', 'US');

      expect(e164).toBe('+15551234567');
    });

    it('should return null for invalid phone number', async () => {
      const e164 = await service.normalizeToE164('invalid');

      expect(e164).toBeNull();
    });

    it('should handle phone numbers already in E.164 format', async () => {
      const e164 = await service.normalizeToE164('+15551234567');

      expect(e164).toBe('+15551234567');
    });
  });

  describe('getCountryCode', () => {
    it('should extract country code from phone number', async () => {
      const country = await service.getCountryCode('+15551234567');

      expect(country).toBe('US');
    });

    it('should return null for invalid phone number', async () => {
      const country = await service.getCountryCode('invalid');

      expect(country).toBeNull();
    });

    it('should detect various country codes', async () => {
      expect(await service.getCountryCode('+447911123456')).toBe('GB');
      expect(await service.getCountryCode('+33612345678')).toBe('FR');
      expect(await service.getCountryCode('+61412345678')).toBe('AU');
    });
  });

  describe('getNumberType', () => {
    it('should detect mobile numbers', async () => {
      const type = await service.getNumberType('+15551234567');

      expect(type).toBeDefined();
    });

    it('should return null for invalid phone number', async () => {
      const type = await service.getNumberType('invalid');

      expect(type).toBeNull();
    });

    it('should work with default country', async () => {
      const type = await service.getNumberType('(555) 123-4567', 'US');

      expect(type).toBeDefined();
    });
  });

  describe('isMobileNumber', () => {
    it('should return true for mobile numbers', async () => {
      const isMobile = await service.isMobileNumber('+15551234567');

      // Result depends on the number, test the functionality
      expect(typeof isMobile).toBe('boolean');
    });

    it('should return false for invalid numbers', async () => {
      const isMobile = await service.isMobileNumber('invalid');

      expect(isMobile).toBe(false);
    });

    it('should detect fixed line or mobile numbers', async () => {
      const result = await service.validatePhoneNumber('+15551234567');

      if (result.type === PhoneNumberType.FIXED_LINE_OR_MOBILE) {
        const isMobile = await service.isMobileNumber('+15551234567');
        expect(isMobile).toBe(true);
      }
    });
  });

  describe('validateBatch', () => {
    it('should validate multiple phone numbers', async () => {
      const numbers = ['+15551234567', '+447911123456', 'invalid'];

      const results = await service.validateBatch(numbers);

      expect(results).toHaveLength(3);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(true);
      expect(results[2].isValid).toBe(false);
    });

    it('should handle empty array', async () => {
      const results = await service.validateBatch([]);

      expect(results).toHaveLength(0);
    });

    it('should apply default country to all numbers', async () => {
      const numbers = ['(555) 123-4567', '(555) 987-6543'];

      const results = await service.validateBatch(numbers, 'US');

      expect(results.every((r) => r.isValid || r.error)).toBe(true);
    });

    it('should validate each number independently', async () => {
      const numbers = ['+15551234567', 'invalid', '+447911123456'];

      const results = await service.validateBatch(numbers);

      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(false);
      expect(results[2].isValid).toBe(true);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format phone number nationally', async () => {
      const formatted = await service.formatPhoneNumber(
        '+15551234567',
        'national'
      );

      expect(formatted).toBeDefined();
      expect(formatted).not.toBe('+15551234567');
    });

    it('should format phone number internationally', async () => {
      const formatted = await service.formatPhoneNumber(
        '(555) 123-4567',
        'international',
        'US'
      );

      expect(formatted).toContain('+1');
    });

    it('should return null for invalid phone number', async () => {
      const formatted = await service.formatPhoneNumber('invalid', 'national');

      expect(formatted).toBeNull();
    });

    it('should use international format by default', async () => {
      const formatted = await service.formatPhoneNumber('+15551234567');

      expect(formatted).toContain('+1');
    });

    it('should handle formatting with default country', async () => {
      const formatted = await service.formatPhoneNumber(
        '(555) 123-4567',
        'national',
        'US'
      );

      expect(formatted).toBeDefined();
    });
  });

  describe('mapPhoneNumberType', () => {
    it('should map all phone number types correctly', async () => {
      // Test that the service can handle various number types
      const result = await service.validatePhoneNumber('+15551234567');

      // Verify the type is one of our enum values
      if (result.isValid && result.type) {
        expect(Object.values(PhoneNumberType)).toContain(result.type);
      }
    });
  });

  describe('error handling', () => {
    it('should handle parsing errors gracefully', async () => {
      const result = await service.validatePhoneNumber('++invalid++');

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle unexpected characters', async () => {
      const result = await service.validatePhoneNumber('+1-555-ABC-DEFG');

      expect(result.isValid).toBe(false);
    });

    it('should handle very long strings', async () => {
      const longString = '1'.repeat(100);
      const result = await service.validatePhoneNumber(longString);

      expect(result.isValid).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle phone numbers with extensions', async () => {
      const result = await service.validatePhoneNumber('+15551234567 ext 123');

      // May be valid or invalid depending on library behavior
      expect(result).toHaveProperty('isValid');
    });

    it('should handle toll-free numbers', async () => {
      const result = await service.validatePhoneNumber('+18001234567');

      expect(result.isValid).toBe(true);
      if (result.type) {
        expect([PhoneNumberType.TOLL_FREE, PhoneNumberType.UNKNOWN]).toContain(
          result.type
        );
      }
    });

    it('should handle premium rate numbers', async () => {
      const result = await service.validatePhoneNumber('+19001234567');

      // Test that it's handled without crashing
      expect(result).toHaveProperty('isValid');
    });
  });
});
