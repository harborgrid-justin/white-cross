import { Test, TestingModule } from '@nestjs/testing';
import { ConditionAnalyticsService } from './condition-analytics.service';

describe('ConditionAnalyticsService', () => {
  let service: ConditionAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConditionAnalyticsService],
    }).compile();

    service = module.get<ConditionAnalyticsService>(ConditionAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('normalizeCondition', () => {
    it('should normalize allergy conditions', () => {
      expect(service.normalizeCondition('Seasonal Allergy')).toBe('Seasonal Allergies');
      expect(service.normalizeCondition('allergic reaction')).toBe('Seasonal Allergies');
    });

    it('should normalize asthma conditions', () => {
      expect(service.normalizeCondition('Asthma attack')).toBe('Asthma');
      expect(service.normalizeCondition('asthma')).toBe('Asthma');
    });

    it('should normalize flu conditions', () => {
      expect(service.normalizeCondition('Influenza')).toBe('Influenza');
      expect(service.normalizeCondition('flu symptoms')).toBe('Influenza');
    });

    it('should normalize headache conditions', () => {
      expect(service.normalizeCondition('migraine')).toBe('Headache');
      expect(service.normalizeCondition('headache')).toBe('Headache');
    });

    it('should return original diagnosis for unknown conditions', () => {
      expect(service.normalizeCondition('Rare Disease')).toBe('Rare Disease');
    });

    it('should handle case-insensitive input', () => {
      expect(service.normalizeCondition('ADHD SYMPTOMS')).toBe('ADHD');
    });

    it('should trim whitespace', () => {
      expect(service.normalizeCondition('  Anxiety  ')).toBe('Anxiety');
    });
  });

  describe('categorizeCondition', () => {
    it('should categorize allergy conditions', () => {
      expect(service.categorizeCondition('Seasonal Allergies')).toBe('Allergy');
    });

    it('should categorize respiratory conditions', () => {
      expect(service.categorizeCondition('Asthma')).toBe('Respiratory');
      expect(service.categorizeCondition('Upper respiratory infection')).toBe('Respiratory');
    });

    it('should categorize mental health conditions', () => {
      expect(service.categorizeCondition('Anxiety disorder')).toBe('Mental Health');
      expect(service.categorizeCondition('ADHD')).toBe('Mental Health');
    });

    it('should categorize injury conditions', () => {
      expect(service.categorizeCondition('Fracture')).toBe('Injury');
      expect(service.categorizeCondition('Sports injury')).toBe('Injury');
    });

    it('should categorize infectious diseases', () => {
      expect(service.categorizeCondition('Bacterial infection')).toBe('Infectious Disease');
    });

    it('should return General for uncategorized conditions', () => {
      expect(service.categorizeCondition('Unknown condition')).toBe('General');
    });
  });

  describe('detectSeasonality', () => {
    it('should detect allergy season', () => {
      const result = service.detectSeasonality('Seasonal Allergies', 3);
      expect(result).toBeDefined();
      expect(result?.peakMonths).toContain('April');
      expect(result?.lowMonths).toContain('December');
    });

    it('should detect flu season', () => {
      const result = service.detectSeasonality('Influenza', 0);
      expect(result).toBeDefined();
      expect(result?.peakMonths).toContain('January');
      expect(result?.lowMonths).toContain('July');
    });

    it('should return undefined for non-seasonal conditions', () => {
      const result = service.detectSeasonality('Broken Arm', 5);
      expect(result).toBeUndefined();
    });
  });

  describe('getConditionColor', () => {
    it('should return consistent colors for same condition', () => {
      const color1 = service.getConditionColor('Asthma');
      const color2 = service.getConditionColor('Asthma');
      expect(color1).toBe(color2);
    });

    it('should return valid hex colors', () => {
      const color = service.getConditionColor('Test Condition');
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  describe('isChronicCondition', () => {
    it('should identify chronic conditions', () => {
      expect(service.isChronicCondition('Asthma')).toBe(true);
      expect(service.isChronicCondition('Diabetes Type 1')).toBe(true);
      expect(service.isChronicCondition('ADHD')).toBe(true);
      expect(service.isChronicCondition('Chronic pain')).toBe(true);
    });

    it('should not identify acute conditions as chronic', () => {
      expect(service.isChronicCondition('Cold')).toBe(false);
      expect(service.isChronicCondition('Flu')).toBe(false);
    });
  });

  describe('getConditionSeverity', () => {
    it('should return HIGH for severe conditions', () => {
      expect(service.getConditionSeverity('Severe allergic reaction')).toBe('HIGH');
      expect(service.getConditionSeverity('Emergency situation')).toBe('HIGH');
      expect(service.getConditionSeverity('Critical condition')).toBe('HIGH');
    });

    it('should return MEDIUM for moderate conditions', () => {
      expect(service.getConditionSeverity('Moderate injury')).toBe('MEDIUM');
      expect(service.getConditionSeverity('Bacterial infection')).toBe('MEDIUM');
    });

    it('should return LOW for minor conditions', () => {
      expect(service.getConditionSeverity('Minor scrape')).toBe('LOW');
      expect(service.getConditionSeverity('Headache')).toBe('LOW');
    });
  });

  describe('groupConditionsByCategory', () => {
    it('should group conditions correctly', () => {
      const conditions = ['Asthma', 'Anxiety', 'Fracture', 'Allergy', 'ADHD'];
      const grouped = service.groupConditionsByCategory(conditions);

      expect(grouped.has('Respiratory')).toBe(true);
      expect(grouped.has('Mental Health')).toBe(true);
      expect(grouped.has('Injury')).toBe(true);
      expect(grouped.has('Allergy')).toBe(true);
    });

    it('should handle empty array', () => {
      const grouped = service.groupConditionsByCategory([]);
      expect(grouped.size).toBe(0);
    });

    it('should group multiple conditions in same category', () => {
      const conditions = ['Anxiety', 'ADHD', 'Depression'];
      const grouped = service.groupConditionsByCategory(conditions);

      expect(grouped.get('Mental Health')).toEqual(expect.arrayContaining(['Anxiety', 'ADHD']));
    });
  });
});
