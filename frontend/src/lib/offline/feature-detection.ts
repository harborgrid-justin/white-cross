/**
 * Feature Detection Utilities
 *
 * Item 245: Feature detection over browser detection
 *
 * Detects browser capabilities instead of checking user agent strings.
 */

/**
 * Detect if browser supports a specific feature
 */
export const features = {
  /**
   * Local Storage
   */
  localStorage: typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null,

  /**
   * Session Storage
   */
  sessionStorage: typeof window !== 'undefined' && 'sessionStorage' in window && window.sessionStorage !== null,

  /**
   * IndexedDB
   */
  indexedDB: typeof window !== 'undefined' && 'indexedDB' in window,

  /**
   * Service Workers
   */
  serviceWorker: typeof window !== 'undefined' && 'serviceWorker' in navigator,

  /**
   * Web Workers
   */
  webWorker: typeof Worker !== 'undefined',

  /**
   * WebSocket
   */
  webSocket: typeof WebSocket !== 'undefined',

  /**
   * Geolocation
   */
  geolocation: typeof navigator !== 'undefined' && 'geolocation' in navigator,

  /**
   * Push Notifications
   */
  pushNotifications: typeof window !== 'undefined' && 'Notification' in window,

  /**
   * Clipboard API
   */
  clipboard: typeof navigator !== 'undefined' && 'clipboard' in navigator,

  /**
   * Web Crypto API
   */
  crypto: typeof window !== 'undefined' && 'crypto' in window && 'subtle' in window.crypto,

  /**
   * IntersectionObserver
   */
  intersectionObserver: typeof IntersectionObserver !== 'undefined',

  /**
   * ResizeObserver
   */
  resizeObserver: typeof ResizeObserver !== 'undefined',

  /**
   * MutationObserver
   */
  mutationObserver: typeof MutationObserver !== 'undefined',

  /**
   * Fetch API
   */
  fetch: typeof fetch !== 'undefined',

  /**
   * AbortController
   */
  abortController: typeof AbortController !== 'undefined',

  /**
   * CSS Custom Properties (CSS Variables)
   */
  cssVariables: typeof CSS !== 'undefined' && CSS.supports && CSS.supports('--test', '0'),

  /**
   * CSS Grid
   */
  cssGrid: typeof CSS !== 'undefined' && CSS.supports && CSS.supports('display', 'grid'),

  /**
   * CSS Flexbox
   */
  cssFlexbox: typeof CSS !== 'undefined' && CSS.supports && CSS.supports('display', 'flex'),

  /**
   * WebGL
   */
  webGL: ((): boolean => {
    if (typeof document === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      return !!(
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      );
    } catch {
      return false;
    }
  })(),

  /**
   * Media Devices (Camera/Microphone)
   */
  mediaDevices: typeof navigator !== 'undefined' && 'mediaDevices' in navigator,

  /**
   * Pointer Events
   */
  pointerEvents: typeof window !== 'undefined' && 'PointerEvent' in window,

  /**
   * Touch Events
   */
  touchEvents: typeof window !== 'undefined' && 'ontouchstart' in window,

  /**
   * Passive Event Listeners
   */
  passiveEventListeners: ((): boolean => {
    if (typeof window === 'undefined') return false;
    let supported = false;
    try {
      const options = Object.defineProperty({}, 'passive', {
        get: () => {
          supported = true;
          return true;
        },
      });
      window.addEventListener('test', null as any, options);
      window.removeEventListener('test', null as any, options);
    } catch {
      supported = false;
    }
    return supported;
  })(),
};

/**
 * Feature detection with fallback values
 */
export function detectFeature<T>(
  feature: keyof typeof features,
  onSupported: T,
  onUnsupported: T
): T {
  return features[feature] ? onSupported : onUnsupported;
}

/**
 * Check multiple features
 */
export function checkFeatures(requiredFeatures: Array<keyof typeof features>): {
  supported: boolean;
  missing: Array<keyof typeof features>;
} {
  const missing = requiredFeatures.filter(feature => !features[feature]);

  return {
    supported: missing.length === 0,
    missing,
  };
}

/**
 * Display warning for unsupported features
 */
export function warnUnsupportedFeatures(requiredFeatures: Array<keyof typeof features>): void {
  const { supported, missing } = checkFeatures(requiredFeatures);

  if (!supported) {
    console.warn(
      `[Feature Detection] The following features are not supported in this browser:`,
      missing
    );
  }
}

/**
 * Progressive enhancement helper
 */
export function withFeature<T>(
  feature: keyof typeof features,
  enhancedImplementation: () => T,
  fallbackImplementation: () => T
): T {
  return features[feature] ? enhancedImplementation() : fallbackImplementation();
}

export default features;
