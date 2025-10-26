/** @type {import('tailwindcss').Config} */
/**
 * HEALTHCARE-SPECIFIC TAILWIND CONFIGURATION
 * Extended configuration for 15 critical school nurse SaaS features
 *
 * Features covered:
 * 1. PHI Disclosure Tracking
 * 2. Encryption UI
 * 3. Tamper Alerts
 * 4. Drug Interaction Checker
 * 5. Outbreak Detection
 * 6. Real-Time Alerts
 * 7. Clinic Visit Tracking
 * 8. Immunization Dashboard
 * 9. Medicaid Billing
 * 10. PDF Reports
 * 11. Immunization UI
 * 12. Secure Document Sharing
 * 13. State Registry Integration
 * 14. Export Scheduling
 * 15. SIS Integration
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* ============================================
         HEALTHCARE COLOR SYSTEM
         ============================================ */
      colors: {
        // Primary Brand Colors (Healthcare Blue)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },

        // Secondary Colors (Slate Gray)
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },

        // Success States (Green) - Compliance, Complete, Healthy
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },

        // Warning States (Amber) - Caution, Pending, Review Needed
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },

        // Danger States (Red) - Critical, Error, Emergency
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },

        // Info States (Blue) - Informational
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },

        // Healthcare-specific: Medical/Treatment
        medical: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },

        /* ============================================
           FEATURE-SPECIFIC COLOR SYSTEMS
           ============================================ */

        // Alert Severity System (for Real-Time Alerts, Tamper Alerts, Outbreak Detection)
        severity: {
          // Info - Low priority informational
          info: {
            bg: '#eff6ff',
            border: '#bfdbfe',
            text: '#1e40af',
            icon: '#3b82f6',
            dark: { bg: '#1e3a8a', border: '#1d4ed8', text: '#bfdbfe' }
          },
          // Low - Minor issues, FYI
          low: {
            bg: '#f0fdf4',
            border: '#bbf7d0',
            text: '#15803d',
            icon: '#22c55e',
            dark: { bg: '#14532d', border: '#15803d', text: '#bbf7d0' }
          },
          // Medium - Needs attention
          medium: {
            bg: '#fffbeb',
            border: '#fde68a',
            text: '#b45309',
            icon: '#f59e0b',
            dark: { bg: '#78350f', border: '#b45309', text: '#fde68a' }
          },
          // High - Urgent action required
          high: {
            bg: '#fff7ed',
            border: '#fed7aa',
            text: '#c2410c',
            icon: '#f97316',
            dark: { bg: '#7c2d12', border: '#c2410c', text: '#fed7aa' }
          },
          // Critical - Immediate action required
          critical: {
            bg: '#fef2f2',
            border: '#fecaca',
            text: '#b91c1c',
            icon: '#ef4444',
            dark: { bg: '#7f1d1d', border: '#b91c1c', text: '#fecaca' }
          },
          // Emergency - Life-threatening situation
          emergency: {
            bg: '#450a0a',
            border: '#dc2626',
            text: '#ffffff',
            icon: '#fef2f2',
            dark: { bg: '#450a0a', border: '#dc2626', text: '#ffffff' }
          },
        },

        // Drug Interaction Severity (for Drug Interaction Checker)
        interaction: {
          // No interaction
          none: '#22c55e',
          // Minor - Monitor
          minor: '#84cc16',
          // Moderate - Caution advised
          moderate: '#f59e0b',
          // Major - Avoid combination
          major: '#f97316',
          // Severe - Contraindicated
          severe: '#ef4444',
          // Unknown - Insufficient data
          unknown: '#94a3b8',
        },

        // Immunization Compliance Status (for Immunization Dashboard & UI)
        immunization: {
          // Fully compliant
          compliant: '#22c55e',
          // Partially compliant
          partial: '#fbbf24',
          // Overdue
          overdue: '#f97316',
          // Non-compliant
          noncompliant: '#ef4444',
          // Exempt (religious, medical)
          exempt: '#8b5cf6',
          // Unknown status
          unknown: '#64748b',
          // In progress
          pending: '#3b82f6',
        },

        // Encryption & Security Status (for Encryption UI, Secure Document Sharing)
        encryption: {
          // Encrypted at rest and in transit
          encrypted: '#22c55e',
          // Partially encrypted
          partial: '#f59e0b',
          // Not encrypted
          unencrypted: '#ef4444',
          // Encryption in progress
          encrypting: '#3b82f6',
          // Key rotated recently
          rotated: '#8b5cf6',
          // Key expired
          expired: '#f97316',
        },

        // PHI Protection Levels (for PHI Disclosure Tracking)
        phi: {
          // Public data (no PHI)
          public: '#94a3b8',
          // Limited PHI
          limited: '#fbbf24',
          // Full PHI
          protected: '#f97316',
          // Highly sensitive PHI
          sensitive: '#ef4444',
          // Redacted/Masked
          redacted: '#64748b',
        },

        // Billing & Claims Status (for Medicaid Billing)
        billing: {
          // Draft - Not submitted
          draft: '#94a3b8',
          // Submitted - Awaiting response
          submitted: '#3b82f6',
          // Approved - Payment pending
          approved: '#22c55e',
          // Paid - Completed
          paid: '#059669',
          // Rejected - Needs correction
          rejected: '#ef4444',
          // Under review
          review: '#f59e0b',
          // Appealed
          appealed: '#8b5cf6',
        },

        // Sync Status (for State Registry Integration, SIS Integration)
        sync: {
          // Synced successfully
          synced: '#22c55e',
          // Syncing in progress
          syncing: '#3b82f6',
          // Sync failed
          failed: '#ef4444',
          // Pending sync
          pending: '#f59e0b',
          // Partial sync (some records failed)
          partial: '#f97316',
          // Never synced
          never: '#94a3b8',
          // Sync conflict
          conflict: '#dc2626',
        },

        // Export & Scheduling Status (for Export Scheduling)
        export: {
          // Scheduled
          scheduled: '#3b82f6',
          // Running
          running: '#8b5cf6',
          // Completed
          completed: '#22c55e',
          // Failed
          failed: '#ef4444',
          // Cancelled
          cancelled: '#94a3b8',
          // Pending
          pending: '#f59e0b',
        },

        // Clinic Visit Status (for Clinic Visit Tracking)
        visit: {
          // Checked in
          checkedIn: '#3b82f6',
          // In progress
          inProgress: '#8b5cf6',
          // Completed
          completed: '#22c55e',
          // Missed/No-show
          missed: '#f97316',
          // Cancelled
          cancelled: '#94a3b8',
        },

        // Outbreak Detection Levels (for Outbreak Detection)
        outbreak: {
          // Normal - No concerns
          normal: '#22c55e',
          // Elevated - Slight increase
          elevated: '#fbbf24',
          // Alert - Significant increase
          alert: '#f97316',
          // Outbreak - Confirmed outbreak
          outbreak: '#ef4444',
          // Critical - Widespread outbreak
          critical: '#dc2626',
        },

        // Audit & Compliance (for Tamper Alerts, Audit Logs)
        audit: {
          // Clean - No issues
          clean: '#22c55e',
          // Reviewed - Passed review
          reviewed: '#3b82f6',
          // Flagged - Needs investigation
          flagged: '#f59e0b',
          // Tampered - Integrity compromised
          tampered: '#ef4444',
          // Suspicious - Unusual activity
          suspicious: '#f97316',
        },
      },

      /* ============================================
         HEALTHCARE SPACING SYSTEM
         ============================================ */
      spacing: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '176': '44rem',
        '192': '48rem',
        '208': '52rem',
        '224': '56rem',
        '240': '60rem',
        '256': '64rem',
      },

      /* ============================================
         TYPOGRAPHY
         ============================================ */
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: ['Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },

      /* ============================================
         SHADOWS & EFFECTS
         ============================================ */
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'smooth': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'crisp': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'heavy': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

        // Alert-specific glows
        'glow-info': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-success': '0 0 20px rgba(34, 197, 94, 0.4)',
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.4)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.4)',
        'glow-critical': '0 0 30px rgba(220, 38, 38, 0.6)',
        'glow-emergency': '0 0 40px rgba(185, 28, 28, 0.8)',

        // PHI protection visual cue
        'phi-protected': '0 0 0 2px rgba(249, 115, 22, 0.2), 0 0 0 4px rgba(249, 115, 22, 0.1)',
        'phi-sensitive': '0 0 0 2px rgba(239, 68, 68, 0.3), 0 0 0 4px rgba(239, 68, 68, 0.15)',
      },

      /* ============================================
         BORDER RADIUS
         ============================================ */
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },

      /* ============================================
         ANIMATIONS
         ============================================ */
      transitionDuration: {
        '0': '0ms',
        '50': '50ms',
        '100': '100ms',
        '200': '200ms',
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '450': '450ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },

      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-in-out-back': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },

      /* ============================================
         Z-INDEX SCALE
         ============================================ */
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      /* ============================================
         KEYFRAME ANIMATIONS
         ============================================ */
      keyframes: {
        // Fade animations
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },

        // Slide animations
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },

        // Scale animations
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-down': {
          '0%': { transform: 'scale(1.05)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },

        // Bounce animation
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },

        // Shake animation (for errors, alerts)
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },

        // Pulse animations
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'pulse-danger': {
          '0%, 100%': {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
          },
          '50%': {
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderColor: 'rgba(239, 68, 68, 0.5)',
          },
        },
        'pulse-warning': {
          '0%, 100%': {
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
          },
          '50%': {
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            borderColor: 'rgba(245, 158, 11, 0.5)',
          },
        },

        // Spin animations
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },

        // Wiggle animation
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },

        // Ping animation
        'ping-slow': {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },

        // Emergency flash animation
        'flash-emergency': {
          '0%, 100%': { opacity: '1', backgroundColor: 'rgba(185, 28, 28, 0.9)' },
          '50%': { opacity: '0.7', backgroundColor: 'rgba(220, 38, 38, 0.7)' },
        },

        // Progress bar fill
        'progress-fill': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },

        // Shimmer loading effect
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },

        // Alert entrance
        'alert-entrance': {
          '0%': {
            transform: 'translateY(-100%) scale(0.8)',
            opacity: '0',
          },
          '50%': {
            transform: 'translateY(10px) scale(1.02)',
          },
          '100%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1',
          },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'scale-up': 'scale-up 0.2s ease-out',
        'scale-down': 'scale-down 0.2s ease-out',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-danger': 'pulse-danger 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-warning': 'pulse-warning 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'flash-emergency': 'flash-emergency 1s ease-in-out infinite',
        'progress-fill': 'progress-fill 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'alert-entrance': 'alert-entrance 0.5s ease-out',
      },

      /* ============================================
         BACKDROP BLUR
         ============================================ */
      backdropBlur: {
        xs: '2px',
      },

      /* ============================================
         GRID SYSTEM
         ============================================ */
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },

      /* ============================================
         MAX WIDTH
         ============================================ */
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },

      /* ============================================
         MIN HEIGHT
         ============================================ */
      minHeight: {
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '8rem',
      },
    },
  },

  /* ============================================
     PLUGINS
     ============================================ */
  plugins: [
    function({ addUtilities, addComponents }) {
      /* ============================================
         UTILITY CLASSES
         ============================================ */
      const newUtilities = {
        // Scrollbar styles
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f5f9'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd5e1',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#94a3b8'
          }
        },

        // PHI visual indicators
        '.phi-indicator': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '4px',
            height: '100%',
            backgroundColor: '#f97316',
            borderRadius: '2px 0 0 2px',
          }
        },
        '.phi-indicator-sensitive': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '4px',
            height: '100%',
            backgroundColor: '#ef4444',
            borderRadius: '2px 0 0 2px',
          }
        },

        // Encrypted badge
        '.encrypted-badge': {
          position: 'relative',
          '&::after': {
            content: '🔒',
            position: 'absolute',
            top: '0.25rem',
            right: '0.25rem',
            fontSize: '0.75rem',
            opacity: '0.7',
          }
        },
      };

      addUtilities(newUtilities);
    }
  ],
}
