import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS Configuration for White Cross Healthcare Platform
 *
 * Enterprise-grade design system configuration with:
 * - Healthcare-specific color palette
 * - WCAG 2.1 AAA compliant color contrasts
 * - Custom components and utilities
 * - Responsive design breakpoints
 * - Animation and transition presets
 *
 * @see https://tailwindcss.com/docs/configuration
 */

const config: Config = {
  // Content sources for Tailwind to scan
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/stories/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // Dark mode configuration (class-based)
  darkMode: ['class', 'class'],

  theme: {
  	extend: {
  		colors: {
  			// Semantic colors (reference CSS variables from tokens.css)
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))'
  			},
  			error: {
  				DEFAULT: 'hsl(var(--error))',
  				foreground: 'hsl(var(--error-foreground))'
  			},
  			// Alias for backwards compatibility (error = danger)
  			danger: {
  				DEFAULT: 'hsl(var(--error))',
  				foreground: 'hsl(var(--error-foreground))'
  			},
  			info: {
  				DEFAULT: 'hsl(var(--info))',
  				foreground: 'hsl(var(--info-foreground))'
  			},
  			// Primitive color scales (for backward compatibility)
  			blue: {
  				50: 'hsl(var(--blue-50))',
  				100: 'hsl(var(--blue-100))',
  				200: 'hsl(var(--blue-200))',
  				300: 'hsl(var(--blue-300))',
  				400: 'hsl(var(--blue-400))',
  				500: 'hsl(var(--blue-500))',
  				600: 'hsl(var(--blue-600))',
  				700: 'hsl(var(--blue-700))',
  				800: 'hsl(var(--blue-800))',
  				900: 'hsl(var(--blue-900))',
  				950: 'hsl(var(--blue-950))'
  			},
  			teal: {
  				50: 'hsl(var(--teal-50))',
  				100: 'hsl(var(--teal-100))',
  				200: 'hsl(var(--teal-200))',
  				300: 'hsl(var(--teal-300))',
  				400: 'hsl(var(--teal-400))',
  				500: 'hsl(var(--teal-500))',
  				600: 'hsl(var(--teal-600))',
  				700: 'hsl(var(--teal-700))',
  				800: 'hsl(var(--teal-800))',
  				900: 'hsl(var(--teal-900))',
  				950: 'hsl(var(--teal-950))'
  			},
  			green: {
  				50: 'hsl(var(--green-50))',
  				100: 'hsl(var(--green-100))',
  				200: 'hsl(var(--green-200))',
  				300: 'hsl(var(--green-300))',
  				400: 'hsl(var(--green-400))',
  				500: 'hsl(var(--green-500))',
  				600: 'hsl(var(--green-600))',
  				700: 'hsl(var(--green-700))',
  				800: 'hsl(var(--green-800))',
  				900: 'hsl(var(--green-900))',
  				950: 'hsl(var(--green-950))'
  			},
  			orange: {
  				50: 'hsl(var(--orange-50))',
  				100: 'hsl(var(--orange-100))',
  				200: 'hsl(var(--orange-200))',
  				300: 'hsl(var(--orange-300))',
  				400: 'hsl(var(--orange-400))',
  				500: 'hsl(var(--orange-500))',
  				600: 'hsl(var(--orange-600))',
  				700: 'hsl(var(--orange-700))',
  				800: 'hsl(var(--orange-800))',
  				900: 'hsl(var(--orange-900))',
  				950: 'hsl(var(--orange-950))'
  			},
  			red: {
  				50: 'hsl(var(--red-50))',
  				100: 'hsl(var(--red-100))',
  				200: 'hsl(var(--red-200))',
  				300: 'hsl(var(--red-300))',
  				400: 'hsl(var(--red-400))',
  				500: 'hsl(var(--red-500))',
  				600: 'hsl(var(--red-600))',
  				700: 'hsl(var(--red-700))',
  				800: 'hsl(var(--red-800))',
  				900: 'hsl(var(--red-900))',
  				950: 'hsl(var(--red-950))'
  			},
  			gray: {
  				50: 'hsl(var(--gray-50))',
  				100: 'hsl(var(--gray-100))',
  				200: 'hsl(var(--gray-200))',
  				300: 'hsl(var(--gray-300))',
  				400: 'hsl(var(--gray-400))',
  				500: 'hsl(var(--gray-500))',
  				600: 'hsl(var(--gray-600))',
  				700: 'hsl(var(--gray-700))',
  				800: 'hsl(var(--gray-800))',
  				900: 'hsl(var(--gray-900))',
  				950: 'hsl(var(--gray-950))'
  			},
  			// Layout & Surface
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			surface: 'hsl(var(--surface))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'Fira Code',
  				'Consolas',
  				'Monaco',
  				'monospace'
  			]
  		},
  		fontSize: {
  			xs: [
  				'0.75rem',
  				{
  					lineHeight: '1rem'
  				}
  			],
  			sm: [
  				'0.875rem',
  				{
  					lineHeight: '1.25rem'
  				}
  			],
  			base: [
  				'1rem',
  				{
  					lineHeight: '1.5rem'
  				}
  			],
  			lg: [
  				'1.125rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			xl: [
  				'1.25rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			'2xl': [
  				'1.5rem',
  				{
  					lineHeight: '2rem'
  				}
  			],
  			'3xl': [
  				'1.875rem',
  				{
  					lineHeight: '2.25rem'
  				}
  			],
  			'4xl': [
  				'2.25rem',
  				{
  					lineHeight: '2.5rem'
  				}
  			],
  			'5xl': [
  				'3rem',
  				{
  					lineHeight: '1'
  				}
  			]
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'92': '23rem',
  			'100': '25rem',
  			'104': '26rem',
  			'108': '27rem',
  			'112': '28rem',
  			'128': '32rem'
  		},
  		borderRadius: {
  			none: '0',
  			sm: 'calc(var(--radius) - 4px)',
  			DEFAULT: '0.25rem',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			xl: '0.75rem',
  			'2xl': '1rem',
  			'3xl': '1.5rem',
  			full: '9999px'
  		},
  		boxShadow: {
  			sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  			DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  			md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  			lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  			xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  			'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  			inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  			none: 'none',
  			card: '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
  			'card-hover': '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  			modal: '0 10px 40px rgba(0, 0, 0, 0.15)'
  		},
  		animation: {
  			'spin-slow': 'spin 3s linear infinite',
  			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'bounce-slow': 'bounce 2s infinite',
  			'fade-in': 'fadeIn 0.5s ease-in-out',
  			'slide-up': 'slideUp 0.3s ease-out',
  			'slide-down': 'slideDown 0.3s ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					transform: 'translateY(10px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			slideDown: {
  				'0%': {
  					transform: 'translateY(-10px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		screens: {
  			xs: '475px',
  			sm: '640px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1280px',
  			'2xl': '1536px',
  			'3xl': '1920px'
  		},
  		zIndex: {
  			'0': '0',
  			'10': '10',
  			'20': '20',
  			'30': '30',
  			'40': '40',
  			'50': '50',
  			dropdown: '1000',
  			sticky: '1020',
  			fixed: '1030',
  			'modal-backdrop': '1040',
  			modal: '1050',
  			popover: '1060',
  			tooltip: '1070'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		}
  	}
  },

  // ==========================================
  // PLUGINS
  // ==========================================
  plugins: [
    /**
     * Custom Tailwind CSS plugin for healthcare-specific component classes.
     *
     * Adds pre-built utility classes for common healthcare UI patterns including
     * cards, buttons, badges, and form inputs. These classes ensure visual consistency
     * across the White Cross platform and reduce boilerplate CSS.
     *
     * Component Classes Added:
     * - .healthcare-card: Healthcare data card with hover effects
     * - .healthcare-button-primary: Primary action button (blue)
     * - .healthcare-button-secondary: Secondary action button (white)
     * - .healthcare-button-danger: Destructive action button (red)
     * - .status-active: Active status badge (green)
     * - .status-inactive: Inactive status badge (gray)
     * - .status-warning: Warning status badge (orange)
     * - .status-error: Error status badge (red)
     * - .healthcare-input: Standardized form input styling
     *
     * Utility Classes Added:
     * - .scrollbar-hide: Hide scrollbar while maintaining scroll functionality
     * - .focus-ring: Standard focus ring for accessibility
     * - .focus-ring-inset: Inset focus ring
     * - .touch-target: Minimum touch target size (44px)
     * - .glass-effect: Glassmorphism effect
     *
     * @param {object} helpers - Tailwind CSS plugin helpers
     * @param {function} helpers.addComponents - Function to add component classes
     * @param {function} helpers.addUtilities - Function to add utility classes
     * @param {function} helpers.theme - Function to access theme values
     *
     * @example
     * ```tsx
     * // Use healthcare card component
     * <div className="healthcare-card">Patient information...</div>
     *
     * // Use healthcare button
     * <button className="healthcare-button-primary">Save Record</button>
     *
     * // Use status badge
     * <span className="status-active">Active</span>
     *
     * // Use utility class
     * <div className="scrollbar-hide overflow-auto">...</div>
     * ```
     */
    function({ addComponents, addUtilities, theme }: any) {
      addComponents({
        // Healthcare Card Component
        '.healthcare-card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.card'),
          padding: theme('spacing.6'),
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: theme('boxShadow.card-hover'),
          },
        },

        // Button Components
        '.healthcare-button-primary': {
          backgroundColor: theme('colors.primary.600'),
          color: theme('colors.white'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.primary.700'),
          },
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${theme('colors.primary.200')}`,
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },

        '.healthcare-button-secondary': {
          backgroundColor: theme('colors.white'),
          color: theme('colors.primary.600'),
          border: `1px solid ${theme('colors.primary.600')}`,
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.primary.50'),
          },
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${theme('colors.primary.200')}`,
          },
        },

        '.healthcare-button-danger': {
          backgroundColor: theme('colors.error.600'),
          color: theme('colors.white'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.error.700'),
          },
        },

        // Status Badges
        '.status-active': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.1')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          color: theme('colors.success.700'),
          backgroundColor: theme('colors.success.100'),
          borderRadius: theme('borderRadius.full'),
        },

        '.status-inactive': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.1')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          color: theme('colors.gray.700'),
          backgroundColor: theme('colors.gray.100'),
          borderRadius: theme('borderRadius.full'),
        },

        '.status-warning': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.1')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          color: theme('colors.warning.700'),
          backgroundColor: theme('colors.warning.100'),
          borderRadius: theme('borderRadius.full'),
        },

        '.status-error': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.1')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          color: theme('colors.error.700'),
          backgroundColor: theme('colors.error.100'),
          borderRadius: theme('borderRadius.full'),
        },

        // Form Input
        '.healthcare-input': {
          width: '100%',
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.base'),
          borderRadius: theme('borderRadius.md'),
          border: `1px solid ${theme('colors.gray.300')}`,
          transition: 'border-color 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 3px ${theme('colors.primary.100')}`,
          },
          '&::placeholder': {
            color: theme('colors.gray.400'),
          },
        },
      });

      // Add custom utility classes
      addUtilities({
        // Hide scrollbar while maintaining scroll functionality
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },

        // Thin scrollbar
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('colors.gray.100'),
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.gray.400'),
            borderRadius: theme('borderRadius.full'),
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: theme('colors.gray.500'),
          },
        },

        // Focus ring utilities for accessibility
        '.focus-ring': {
          outline: 'none',
          '&:focus-visible': {
            outlineWidth: '2px',
            outlineStyle: 'solid',
            outlineColor: theme('colors.primary.500'),
            outlineOffset: '2px',
          },
        },

        '.focus-ring-inset': {
          outline: 'none',
          '&:focus-visible': {
            outlineWidth: '2px',
            outlineStyle: 'solid',
            outlineColor: theme('colors.primary.500'),
            outlineOffset: '-2px',
          },
        },

        // Minimum touch target for accessibility
        '.touch-target': {
          minWidth: '44px',
          minHeight: '44px',
        },

        // Glass effect (glassmorphism)
        '.glass-effect': {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },

        '.glass-effect-dark': {
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },

        // Text truncation utilities
        '.truncate-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },

        '.truncate-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },

        '.truncate-4': {
          display: '-webkit-box',
          '-webkit-line-clamp': '4',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },

        // Safe area insets for mobile devices
        '.safe-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },

        '.safe-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },

        '.safe-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },

        '.safe-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },
      });
    },
      require("tailwindcss-animate")
],
};

export default config;

