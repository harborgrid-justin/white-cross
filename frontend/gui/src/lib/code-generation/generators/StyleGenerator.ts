/**
 * Style Generator
 *
 * Converts CSS styles to Tailwind CSS classes.
 * Handles common CSS properties and generates optimized Tailwind classes.
 */

import type { CSSProperties } from '@/types';

/**
 * Tailwind class mapping for CSS properties
 */
const TAILWIND_MAPPINGS: Record<string, (value: any) => string | null> = {
  // Display
  display: (value) => {
    const displayMap: Record<string, string> = {
      block: 'block',
      'inline-block': 'inline-block',
      inline: 'inline',
      flex: 'flex',
      'inline-flex': 'inline-flex',
      grid: 'grid',
      'inline-grid': 'inline-grid',
      hidden: 'hidden',
      none: 'hidden',
    };
    return displayMap[value] || null;
  },

  // Position
  position: (value) => {
    const positionMap: Record<string, string> = {
      static: 'static',
      fixed: 'fixed',
      absolute: 'absolute',
      relative: 'relative',
      sticky: 'sticky',
    };
    return positionMap[value] || null;
  },

  // Flex Direction
  flexDirection: (value) => {
    const flexDirMap: Record<string, string> = {
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
      column: 'flex-col',
      'column-reverse': 'flex-col-reverse',
    };
    return flexDirMap[value] || null;
  },

  // Justify Content
  justifyContent: (value) => {
    const justifyMap: Record<string, string> = {
      'flex-start': 'justify-start',
      'flex-end': 'justify-end',
      center: 'justify-center',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
      'space-evenly': 'justify-evenly',
    };
    return justifyMap[value] || null;
  },

  // Align Items
  alignItems: (value) => {
    const alignMap: Record<string, string> = {
      'flex-start': 'items-start',
      'flex-end': 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    };
    return alignMap[value] || null;
  },

  // Text Align
  textAlign: (value) => {
    const textAlignMap: Record<string, string> = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    };
    return textAlignMap[value] || null;
  },

  // Font Weight
  fontWeight: (value) => {
    const weightMap: Record<string | number, string> = {
      100: 'font-thin',
      200: 'font-extralight',
      300: 'font-light',
      400: 'font-normal',
      500: 'font-medium',
      600: 'font-semibold',
      700: 'font-bold',
      800: 'font-extrabold',
      900: 'font-black',
      thin: 'font-thin',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };
    return weightMap[value] || null;
  },

  // Overflow
  overflow: (value) => {
    const overflowMap: Record<string, string> = {
      auto: 'overflow-auto',
      hidden: 'overflow-hidden',
      visible: 'overflow-visible',
      scroll: 'overflow-scroll',
    };
    return overflowMap[value] || null;
  },

  // Cursor
  cursor: (value) => `cursor-${value}`,

  // Opacity
  opacity: (value) => {
    const opacityValue = Math.round(parseFloat(value) * 100);
    return `opacity-${opacityValue}`;
  },
};

/**
 * Style Generator class
 *
 * Converts CSS properties to Tailwind CSS classes.
 */
export class StyleGenerator {
  private classes: Set<string> = new Set();
  private customStyles: Record<string, any> = {};

  /**
   * Add CSS properties and convert to Tailwind classes
   *
   * @param styles - CSS properties object
   */
  addStyles(styles: CSSProperties): void {
    Object.entries(styles).forEach(([property, value]) => {
      if (value === undefined || value === null) return;

      const tailwindClass = this.convertToTailwind(property, value);

      if (tailwindClass) {
        if (Array.isArray(tailwindClass)) {
          tailwindClass.forEach((cls) => this.classes.add(cls));
        } else {
          this.classes.add(tailwindClass);
        }
      } else {
        // Store custom styles that can't be converted to Tailwind
        this.customStyles[property] = value;
      }
    });
  }

  /**
   * Convert a CSS property to Tailwind class
   *
   * @param property - CSS property name
   * @param value - CSS property value
   * @returns Tailwind class(es) or null
   */
  private convertToTailwind(
    property: string,
    value: any
  ): string | string[] | null {
    // Check if we have a direct mapping
    if (TAILWIND_MAPPINGS[property]) {
      return TAILWIND_MAPPINGS[property](value);
    }

    // Handle spacing (margin, padding)
    if (property.startsWith('margin') || property.startsWith('padding')) {
      return this.convertSpacing(property, value);
    }

    // Handle width and height
    if (property === 'width' || property === 'height') {
      return this.convertDimension(property, value);
    }

    // Handle colors
    if (
      property === 'color' ||
      property === 'backgroundColor' ||
      property === 'borderColor'
    ) {
      return this.convertColor(property, value);
    }

    // Handle border
    if (property.startsWith('border')) {
      return this.convertBorder(property, value);
    }

    // Handle gap
    if (property === 'gap') {
      return this.convertGap(value);
    }

    return null;
  }

  /**
   * Convert spacing (margin, padding) to Tailwind
   *
   * @param property - Spacing property
   * @param value - Spacing value
   * @returns Tailwind class or null
   */
  private convertSpacing(property: string, value: string | number): string | null {
    const prefix = property.startsWith('margin') ? 'm' : 'p';

    // Handle direction-specific spacing
    const directionMap: Record<string, string> = {
      marginTop: 'mt',
      marginRight: 'mr',
      marginBottom: 'mb',
      marginLeft: 'ml',
      paddingTop: 'pt',
      paddingRight: 'pr',
      paddingBottom: 'pb',
      paddingLeft: 'pl',
    };

    const direction = directionMap[property] || prefix;

    // Convert value to Tailwind spacing scale
    const spacing = this.convertToSpacingScale(value);

    if (spacing !== null) {
      return `${direction}-${spacing}`;
    }

    return null;
  }

  /**
   * Convert dimension (width, height) to Tailwind
   *
   * @param property - Dimension property
   * @param value - Dimension value
   * @returns Tailwind class or null
   */
  private convertDimension(property: string, value: string | number): string | null {
    const prefix = property === 'width' ? 'w' : 'h';

    // Handle special values
    if (value === '100%') return `${prefix}-full`;
    if (value === 'auto') return `${prefix}-auto`;
    if (value === '100vw') return 'w-screen';
    if (value === '100vh') return 'h-screen';

    // Handle pixel values
    if (typeof value === 'number' || value.endsWith('px')) {
      const numValue = typeof value === 'number' ? value : parseInt(value);
      const spacing = this.convertToSpacingScale(numValue);

      if (spacing !== null) {
        return `${prefix}-${spacing}`;
      }
    }

    return null;
  }

  /**
   * Convert color to Tailwind
   *
   * @param property - Color property
   * @param value - Color value
   * @returns Tailwind class or null
   */
  private convertColor(property: string, value: string): string | null {
    const prefixMap: Record<string, string> = {
      color: 'text',
      backgroundColor: 'bg',
      borderColor: 'border',
    };

    const prefix = prefixMap[property];

    // Handle named colors
    const colorName = this.getColorName(value);

    if (colorName) {
      return `${prefix}-${colorName}`;
    }

    return null;
  }

  /**
   * Convert border to Tailwind
   *
   * @param property - Border property
   * @param value - Border value
   * @returns Tailwind class or null
   */
  private convertBorder(property: string, value: string | number): string | null {
    if (property === 'borderRadius') {
      const radiusMap: Record<string, string> = {
        '0': 'rounded-none',
        '0.125rem': 'rounded-sm',
        '0.25rem': 'rounded',
        '0.375rem': 'rounded-md',
        '0.5rem': 'rounded-lg',
        '0.75rem': 'rounded-xl',
        '1rem': 'rounded-2xl',
        '1.5rem': 'rounded-3xl',
        '9999px': 'rounded-full',
        '50%': 'rounded-full',
      };

      return radiusMap[value.toString()] || 'rounded';
    }

    if (property === 'border') {
      // Simple border
      return 'border';
    }

    return null;
  }

  /**
   * Convert gap to Tailwind
   *
   * @param value - Gap value
   * @returns Tailwind class or null
   */
  private convertGap(value: string | number): string | null {
    const spacing = this.convertToSpacingScale(value);

    if (spacing !== null) {
      return `gap-${spacing}`;
    }

    return null;
  }

  /**
   * Convert value to Tailwind spacing scale
   *
   * @param value - Value to convert
   * @returns Spacing scale value or null
   */
  private convertToSpacingScale(value: string | number): string | number | null {
    const numValue =
      typeof value === 'number'
        ? value
        : value.endsWith('px')
          ? parseInt(value)
          : null;

    if (numValue === null) return null;

    // Tailwind spacing scale: 0.25rem = 1 unit (4px)
    const spacingMap: Record<number, string | number> = {
      0: '0',
      1: '0.5',
      2: '0.5',
      4: '1',
      6: '1.5',
      8: '2',
      10: '2.5',
      12: '3',
      14: '3.5',
      16: '4',
      20: '5',
      24: '6',
      28: '7',
      32: '8',
      36: '9',
      40: '10',
      44: '11',
      48: '12',
      56: '14',
      64: '16',
      80: '20',
      96: '24',
      112: '28',
      128: '32',
    };

    return spacingMap[numValue] || null;
  }

  /**
   * Get color name from hex/rgb value
   *
   * @param value - Color value
   * @returns Color name or null
   */
  private getColorName(value: string): string | null {
    // Common color mappings
    const colorMap: Record<string, string> = {
      '#000000': 'black',
      '#ffffff': 'white',
      '#ef4444': 'red-500',
      '#3b82f6': 'blue-500',
      '#10b981': 'green-500',
      '#f59e0b': 'yellow-500',
      '#8b5cf6': 'purple-500',
      '#ec4899': 'pink-500',
      '#6b7280': 'gray-500',
    };

    return colorMap[value.toLowerCase()] || null;
  }

  /**
   * Get all Tailwind classes
   *
   * @returns Array of Tailwind classes
   */
  getClasses(): string[] {
    return Array.from(this.classes);
  }

  /**
   * Get custom styles that couldn't be converted
   *
   * @returns Custom styles object
   */
  getCustomStyles(): Record<string, any> {
    return this.customStyles;
  }

  /**
   * Get className string
   *
   * @returns Space-separated class names
   */
  getClassName(): string {
    return this.getClasses().join(' ');
  }

  /**
   * Check if there are custom styles
   *
   * @returns True if custom styles exist
   */
  hasCustomStyles(): boolean {
    return Object.keys(this.customStyles).length > 0;
  }

  /**
   * Clear all classes and custom styles
   */
  clear(): void {
    this.classes.clear();
    this.customStyles = {};
  }

  /**
   * Merge with another StyleGenerator
   *
   * @param other - Other StyleGenerator to merge
   */
  merge(other: StyleGenerator): void {
    other.getClasses().forEach((cls) => this.classes.add(cls));
    Object.assign(this.customStyles, other.getCustomStyles());
  }

  /**
   * Generate style attribute code
   *
   * @returns Style attribute code or null
   */
  generateStyleAttribute(): string | null {
    if (!this.hasCustomStyles()) return null;

    const styleEntries = Object.entries(this.customStyles)
      .map(([key, value]) => `${key}: '${value}'`)
      .join(', ');

    return `style={{ ${styleEntries} }}`;
  }

  /**
   * Generate className attribute code
   *
   * @returns ClassName attribute code
   */
  generateClassNameAttribute(): string {
    const className = this.getClassName();
    return className ? `className="${className}"` : '';
  }
}

/**
 * Convert CSS properties to Tailwind classes
 *
 * @param styles - CSS properties
 * @returns Tailwind class string
 */
export function stylesToTailwind(styles: CSSProperties): string {
  const generator = new StyleGenerator();
  generator.addStyles(styles);
  return generator.getClassName();
}

/**
 * Convert CSS properties to both Tailwind classes and custom styles
 *
 * @param styles - CSS properties
 * @returns Object with className and style
 */
export function stylesToReactProps(styles: CSSProperties): {
  className: string;
  style?: Record<string, any>;
} {
  const generator = new StyleGenerator();
  generator.addStyles(styles);

  const result: { className: string; style?: Record<string, any> } = {
    className: generator.getClassName(),
  };

  if (generator.hasCustomStyles()) {
    result.style = generator.getCustomStyles();
  }

  return result;
}
