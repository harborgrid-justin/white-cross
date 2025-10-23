/**
 * Frequency Parser Strategy Pattern
 * @description Strategy pattern for parsing medication frequency strings
 * Implements Open/Closed Principle - open for extension, closed for modification
 */

/**
 * Schedule time representation
 */
export interface ScheduleTime {
  hour: number;
  minute: number;
}

/**
 * Frequency Parser Strategy Interface
 * All frequency parsers must implement this interface
 */
export interface IFrequencyParser {
  /**
   * Check if this parser can handle the given frequency string
   * @param frequency - Frequency string to check
   * @returns True if this parser can handle the frequency
   */
  canParse(frequency: string): boolean;

  /**
   * Parse the frequency string into scheduled times
   * @param frequency - Frequency string to parse
   * @returns Array of scheduled times
   */
  parse(frequency: string): ScheduleTime[];

  /**
   * Get the priority of this parser (higher = checked first)
   * @returns Priority number
   */
  getPriority(): number;
}

/**
 * Once Daily Frequency Parser
 */
export class OnceDailyParser implements IFrequencyParser {
  canParse(frequency: string): boolean {
    const freq = frequency.toLowerCase();
    return freq.includes('once') || freq.includes('1x') || freq === 'daily' || freq === 'qd';
  }

  parse(frequency: string): ScheduleTime[] {
    return [{ hour: 9, minute: 0 }]; // 9 AM
  }

  getPriority(): number {
    return 10;
  }
}

/**
 * Twice Daily (BID) Frequency Parser
 */
export class TwiceDailyParser implements IFrequencyParser {
  canParse(frequency: string): boolean {
    const freq = frequency.toLowerCase();
    return freq.includes('twice') || freq.includes('2x') || freq.includes('bid');
  }

  parse(frequency: string): ScheduleTime[] {
    return [
      { hour: 9, minute: 0 },  // 9 AM
      { hour: 21, minute: 0 }  // 9 PM
    ];
  }

  getPriority(): number {
    return 10;
  }
}

/**
 * Three Times Daily (TID) Frequency Parser
 */
export class ThreeTimesDailyParser implements IFrequencyParser {
  canParse(frequency: string): boolean {
    const freq = frequency.toLowerCase();
    return freq.includes('3') || freq.includes('three') || freq.includes('tid');
  }

  parse(frequency: string): ScheduleTime[] {
    return [
      { hour: 8, minute: 0 },  // 8 AM
      { hour: 14, minute: 0 }, // 2 PM
      { hour: 20, minute: 0 }  // 8 PM
    ];
  }

  getPriority(): number {
    return 10;
  }
}

/**
 * Four Times Daily (QID) Frequency Parser
 */
export class FourTimesDailyParser implements IFrequencyParser {
  canParse(frequency: string): boolean {
    const freq = frequency.toLowerCase();
    return freq.includes('4') || freq.includes('four') || freq.includes('qid');
  }

  parse(frequency: string): ScheduleTime[] {
    return [
      { hour: 8, minute: 0 },  // 8 AM
      { hour: 12, minute: 0 }, // 12 PM
      { hour: 16, minute: 0 }, // 4 PM
      { hour: 20, minute: 0 }  // 8 PM
    ];
  }

  getPriority(): number {
    return 10;
  }
}

/**
 * Every 6 Hours Frequency Parser
 */
export class Every6HoursParser implements IFrequencyParser {
  canParse(frequency: string): boolean {
    const freq = frequency.toLowerCase();
    return freq.includes('every 6 hours') || freq.includes('q6h');
  }

  parse(frequency: string): ScheduleTime[] {
    return [
      { hour: 6, minute: 0 },
      { hour: 12, minute: 0 },
      { hour: 18, minute: 0 },
      { hour: 0, minute: 0 }
    ];
  }

  getPriority(): number {
    return 15; // Higher priority for specific patterns
  }
}

/**
 * Every 8 Hours Frequency Parser
 */
export class Every8HoursParser implements IFrequencyParser {
  canParse(frequency: string): boolean {
    const freq = frequency.toLowerCase();
    return freq.includes('every 8 hours') || freq.includes('q8h');
  }

  parse(frequency: string): ScheduleTime[] {
    return [
      { hour: 8, minute: 0 },
      { hour: 16, minute: 0 },
      { hour: 0, minute: 0 }
    ];
  }

  getPriority(): number {
    return 15; // Higher priority for specific patterns
  }
}

/**
 * Every 12 Hours Frequency Parser
 */
export class Every12HoursParser implements IFrequencyParser {
  canParse(frequency: string): boolean {
    const freq = frequency.toLowerCase();
    return freq.includes('every 12 hours') || freq.includes('q12h');
  }

  parse(frequency: string): ScheduleTime[] {
    return [
      { hour: 8, minute: 0 },
      { hour: 20, minute: 0 }
    ];
  }

  getPriority(): number {
    return 15;
  }
}

/**
 * As Needed (PRN) Frequency Parser
 */
export class AsNeededParser implements IFrequencyParser {
  canParse(frequency: string): boolean {
    const freq = frequency.toLowerCase();
    return freq.includes('as needed') || freq.includes('prn') || freq.includes('as required');
  }

  parse(frequency: string): ScheduleTime[] {
    // PRN medications have no scheduled times
    return [];
  }

  getPriority(): number {
    return 20; // Highest priority - most specific
  }
}

/**
 * Default Frequency Parser (fallback)
 */
export class DefaultFrequencyParser implements IFrequencyParser {
  canParse(frequency: string): boolean {
    return true; // Always matches (fallback)
  }

  parse(frequency: string): ScheduleTime[] {
    // Default to once daily at 9 AM
    return [{ hour: 9, minute: 0 }];
  }

  getPriority(): number {
    return 0; // Lowest priority - always last
  }
}

/**
 * Frequency Parser Registry
 * Manages all frequency parsers and delegates parsing to the appropriate strategy
 */
export class FrequencyParserRegistry {
  private parsers: IFrequencyParser[] = [];

  constructor() {
    // Register default parsers
    this.registerDefaultParsers();
  }

  /**
   * Register all default frequency parsers
   * @private
   */
  private registerDefaultParsers(): void {
    this.register(new AsNeededParser());
    this.register(new Every6HoursParser());
    this.register(new Every8HoursParser());
    this.register(new Every12HoursParser());
    this.register(new OnceDailyParser());
    this.register(new TwiceDailyParser());
    this.register(new ThreeTimesDailyParser());
    this.register(new FourTimesDailyParser());
    this.register(new DefaultFrequencyParser());
  }

  /**
   * Register a new frequency parser
   * @param parser - Frequency parser to register
   */
  register(parser: IFrequencyParser): void {
    this.parsers.push(parser);
    // Sort by priority (highest first)
    this.parsers.sort((a, b) => b.getPriority() - a.getPriority());
  }

  /**
   * Unregister a frequency parser
   * @param parser - Frequency parser to unregister
   */
  unregister(parser: IFrequencyParser): void {
    const index = this.parsers.indexOf(parser);
    if (index > -1) {
      this.parsers.splice(index, 1);
    }
  }

  /**
   * Parse a frequency string using registered parsers
   * @param frequency - Frequency string to parse
   * @returns Array of scheduled times
   */
  parse(frequency: string): ScheduleTime[] {
    if (!frequency || typeof frequency !== 'string') {
      // Invalid input - use default
      return [{ hour: 9, minute: 0 }];
    }

    // Find first parser that can handle this frequency
    const parser = this.parsers.find(p => p.canParse(frequency));

    if (!parser) {
      // No parser found - use default (should never happen with DefaultFrequencyParser)
      return [{ hour: 9, minute: 0 }];
    }

    return parser.parse(frequency);
  }

  /**
   * Get all registered parsers
   * @returns Array of registered parsers
   */
  getParsers(): IFrequencyParser[] {
    return [...this.parsers];
  }

  /**
   * Clear all registered parsers
   */
  clear(): void {
    this.parsers = [];
  }
}

/**
 * Singleton instance of FrequencyParserRegistry
 * Use this for consistent frequency parsing across the application
 */
export const frequencyParserRegistry = new FrequencyParserRegistry();

/**
 * Convenience function to parse frequency strings
 * @param frequency - Frequency string to parse
 * @returns Array of scheduled times
 */
export function parseFrequency(frequency: string): ScheduleTime[] {
  return frequencyParserRegistry.parse(frequency);
}
