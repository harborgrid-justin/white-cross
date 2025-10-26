/**
 * @fileoverview Theme Slice - UI Theme and Preferences Management
 * @module stores/slices/themeSlice
 * @category Store
 *
 * Manages global UI theme and user interface preferences.
 * Persisted to localStorage for consistent experience across sessions.
 *
 * Features:
 * - Dark/light mode toggle
 * - Color scheme preferences
 * - UI density settings
 * - Accessibility preferences
 * - SSR-compatible
 * - Persisted to localStorage (non-PHI)
 *
 * @example
 * ```typescript
 * import { useAppSelector, useAppDispatch } from '@/stores/hooks';
 * import { toggleTheme, setColorScheme } from '@/stores/slices/themeSlice';
 *
 * function ThemeToggle() {
 *   const { mode } = useAppSelector(state => state.theme);
 *   const dispatch = useAppDispatch();
 *
 *   return (
 *     <button onClick={() => dispatch(toggleTheme())}>
 *       {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
 *     </button>
 *   );
 * }
 * ```
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Theme mode options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Color scheme options for healthcare UI
 */
export type ColorScheme = 'blue' | 'teal' | 'purple' | 'green';

/**
 * UI density options
 */
export type UIDensity = 'comfortable' | 'compact' | 'spacious';

/**
 * Theme state interface
 */
export interface ThemeState {
  /**
   * Current theme mode
   */
  mode: ThemeMode;

  /**
   * Color scheme for UI elements
   */
  colorScheme: ColorScheme;

  /**
   * UI density setting
   */
  density: UIDensity;

  /**
   * High contrast mode for accessibility
   */
  highContrast: boolean;

  /**
   * Reduced motion for accessibility
   */
  reducedMotion: boolean;

  /**
   * Font size multiplier (1.0 = normal, 1.2 = 20% larger)
   */
  fontSizeMultiplier: number;

  /**
   * Show tooltips for UI elements
   */
  showTooltips: boolean;

  /**
   * Sidebar collapsed state
   */
  sidebarCollapsed: boolean;
}

/**
 * Initial theme state with defaults
 */
const initialState: ThemeState = {
  mode: 'system',
  colorScheme: 'blue',
  density: 'comfortable',
  highContrast: false,
  reducedMotion: false,
  fontSizeMultiplier: 1.0,
  showTooltips: true,
  sidebarCollapsed: false,
};

/**
 * Theme slice with reducers for UI preferences
 */
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    /**
     * Set theme mode (light, dark, or system)
     */
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },

    /**
     * Toggle between light and dark mode
     */
    toggleTheme: (state) => {
      if (state.mode === 'light') {
        state.mode = 'dark';
      } else if (state.mode === 'dark') {
        state.mode = 'light';
      } else {
        // If system, toggle to opposite of current system preference
        const prefersDark = typeof window !== 'undefined' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        state.mode = prefersDark ? 'light' : 'dark';
      }
    },

    /**
     * Set color scheme for UI
     */
    setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
      state.colorScheme = action.payload;
    },

    /**
     * Set UI density
     */
    setDensity: (state, action: PayloadAction<UIDensity>) => {
      state.density = action.payload;
    },

    /**
     * Toggle high contrast mode
     */
    toggleHighContrast: (state) => {
      state.highContrast = !state.highContrast;
    },

    /**
     * Set high contrast mode
     */
    setHighContrast: (state, action: PayloadAction<boolean>) => {
      state.highContrast = action.payload;
    },

    /**
     * Toggle reduced motion
     */
    toggleReducedMotion: (state) => {
      state.reducedMotion = !state.reducedMotion;
    },

    /**
     * Set reduced motion
     */
    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.reducedMotion = action.payload;
    },

    /**
     * Set font size multiplier
     */
    setFontSizeMultiplier: (state, action: PayloadAction<number>) => {
      // Clamp between 0.8 and 1.5
      state.fontSizeMultiplier = Math.max(0.8, Math.min(1.5, action.payload));
    },

    /**
     * Toggle tooltips visibility
     */
    toggleTooltips: (state) => {
      state.showTooltips = !state.showTooltips;
    },

    /**
     * Set tooltips visibility
     */
    setShowTooltips: (state, action: PayloadAction<boolean>) => {
      state.showTooltips = action.payload;
    },

    /**
     * Toggle sidebar collapsed state
     */
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    /**
     * Set sidebar collapsed state
     */
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },

    /**
     * Reset theme to defaults
     */
    resetTheme: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Export actions
export const {
  setThemeMode,
  toggleTheme,
  setColorScheme,
  setDensity,
  toggleHighContrast,
  setHighContrast,
  toggleReducedMotion,
  setReducedMotion,
  setFontSizeMultiplier,
  toggleTooltips,
  setShowTooltips,
  toggleSidebar,
  setSidebarCollapsed,
  resetTheme,
} = themeSlice.actions;

// Export reducer
export default themeSlice.reducer;

// Selectors
export const selectTheme = (state: { theme: ThemeState }) => state.theme;
export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.mode;
export const selectColorScheme = (state: { theme: ThemeState }) => state.theme.colorScheme;
export const selectDensity = (state: { theme: ThemeState }) => state.theme.density;
export const selectIsHighContrast = (state: { theme: ThemeState }) => state.theme.highContrast;
export const selectIsReducedMotion = (state: { theme: ThemeState }) => state.theme.reducedMotion;
export const selectFontSizeMultiplier = (state: { theme: ThemeState }) => state.theme.fontSizeMultiplier;
export const selectShowTooltips = (state: { theme: ThemeState }) => state.theme.showTooltips;
export const selectIsSidebarCollapsed = (state: { theme: ThemeState }) => state.theme.sidebarCollapsed;

/**
 * Get effective theme mode (resolves 'system' to actual mode)
 */
export const selectEffectiveThemeMode = (state: { theme: ThemeState }): 'light' | 'dark' => {
  const { mode } = state.theme;

  if (mode === 'system') {
    // Check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default for SSR
  }

  return mode;
};
