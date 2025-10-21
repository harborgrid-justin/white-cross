/**
 * WF-COMP-359 | emergencyContactSchemas.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../types/student.types | Dependencies: zod, ../types/student.types
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, types | Key Features: arrow component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { z } from 'zod'
import { ContactPriority, PreferredContactMethod, VerificationStatus } from '../types/student.types'

/**
 * Emergency Contact Validation Schemas
 * Comprehensive Zod schemas matching backend Sequelize validations
 * Updated: 2025-10-11
 */

// Valid relationship types (matching backend)
const VALID_RELATIONSHIPS = [
  'PARENT',
  'GUARDIAN',
  'SIBLING',
  'GRANDPARENT',
  'AUNT_UNCLE',
  'FAMILY_FRIEND',
  'NEIGHBOR',
  'OTHER'
] as const

// Valid notification channels
const NOTIFICATION_CHANNELS = ['sms', 'email', 'voice'] as const

/**
 * Phone number validation
 * Supports international formats with country codes
 */
const phoneNumberSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 characters')
  .max(20, 'Phone number cannot exceed 20 characters')
  .refine(
    (value) => {
      const cleanPhone = value.replace(/[\s\-().]/g, '')

      // International format: +1 to +999 followed by 7-15 digits
      const internationalRegex = /^\+\d{1,3}\d{7,15}$/

      // US/Canada format: optional +1, then 10 digits
      const northAmericaRegex = /^(\+?1)?\d{10}$/

      return internationalRegex.test(cleanPhone) || northAmericaRegex.test(cleanPhone)
    },
    {
      message:
        'Phone number must be a valid format. Examples: +1-555-123-4567, (555) 123-4567, +44 20 1234 5678'
    }
  )
  .refine(
    (value) => {
      const cleanPhone = value.replace(/[\s\-().]/g, '').replace(/^\+/, '')
      // Ensure it's not all the same digit (e.g., 1111111111)
      return !/^(\d)\1+$/.test(cleanPhone)
    },
    {
      message: 'Phone number cannot be all the same digit'
    }
  )

/**
 * Email validation
 * Enhanced validation preventing disposable email domains
 */
const emailSchema = z
  .string()
  .email('Email must be a valid email address')
  .max(255, 'Email cannot exceed 255 characters')
  .refine(
    (value) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      return emailRegex.test(value)
    },
    {
      message: 'Email must be a valid format (e.g., contact@example.com)'
    }
  )
  .refine(
    (value) => {
      // Prevent common disposable email domains for security
      const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com']
      const domain = value.split('@')[1]?.toLowerCase()
      return !domain || !disposableDomains.includes(domain)
    },
    {
      message: 'Disposable email addresses are not allowed'
    }
  )

/**
 * Name validation (first/last name)
 * Allows letters, spaces, hyphens, and apostrophes
 */
const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be between 1 and 100 characters')
  .refine(
    (value) => /^[a-zA-Z\s'-]+$/.test(value),
    {
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
  )

/**
 * Relationship validation
 * Must be one of the predefined relationship types
 */
const relationshipSchema = z
  .string()
  .min(1, 'Relationship is required')
  .max(50, 'Relationship must be between 1 and 50 characters')
  .refine(
    (value) => {
      const upperValue = value.toUpperCase()
      return VALID_RELATIONSHIPS.includes(upperValue as any)
    },
    {
      message: `Relationship must be one of: ${VALID_RELATIONSHIPS.join(', ')}`
    }
  )

/**
 * Contact priority validation
 */
const prioritySchema = z.nativeEnum(ContactPriority, {
  error: () => ({ message: 'Priority must be PRIMARY, SECONDARY, or EMERGENCY_ONLY' })
})

/**
 * Preferred contact method validation
 */
const preferredContactMethodSchema = z.nativeEnum(PreferredContactMethod, {
  error: () => ({ message: 'Preferred contact method must be SMS, EMAIL, VOICE, or ANY' })
})

/**
 * Verification status validation
 */
const verificationStatusSchema = z.nativeEnum(VerificationStatus, {
  error: () => ({ message: 'Verification status must be UNVERIFIED, PENDING, VERIFIED, or FAILED' })
})

/**
 * Notification channels validation
 */
const notificationChannelsSchema = z
  .array(z.enum(NOTIFICATION_CHANNELS))
  .min(1, 'At least one notification channel is required')
  .refine(
    (channels) => {
      // Remove duplicates
      return channels.length === new Set(channels).size
    },
    {
      message: 'Notification channels must be unique'
    }
  )

/**
 * Create Emergency Contact Schema
 * Used for creating new emergency contacts
 */
export const createEmergencyContactSchema = z
  .object({
    studentId: z.string().uuid('Student ID must be a valid UUID'),
    firstName: nameSchema,
    lastName: nameSchema,
    relationship: relationshipSchema,
    phoneNumber: phoneNumberSchema,
    email: emailSchema.optional(),
    address: z.string().max(500, 'Address cannot exceed 500 characters').optional(),
    priority: prioritySchema,
    preferredContactMethod: preferredContactMethodSchema.optional(),
    notificationChannels: notificationChannelsSchema.optional(),
    canPickupStudent: z.boolean().optional(),
    notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional()
  })
  .refine(
    (data) => {
      // If email notification channel is selected, email must be provided
      if (data.notificationChannels?.includes('email') && !data.email) {
        return false
      }
      return true
    },
    {
      message: 'Email address is required when email is selected as a notification channel',
      path: ['email']
    }
  )

/**
 * Update Emergency Contact Schema
 * Used for updating existing emergency contacts
 */
export const updateEmergencyContactSchema = z
  .object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    relationship: relationshipSchema.optional(),
    phoneNumber: phoneNumberSchema.optional(),
    email: emailSchema.optional(),
    address: z.string().max(500, 'Address cannot exceed 500 characters').optional(),
    priority: prioritySchema.optional(),
    isActive: z.boolean().optional(),
    preferredContactMethod: preferredContactMethodSchema.optional(),
    verificationStatus: verificationStatusSchema.optional(),
    notificationChannels: notificationChannelsSchema.optional(),
    canPickupStudent: z.boolean().optional(),
    notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional()
  })
  .refine(
    (data) => {
      // If email notification channel is selected, email must be provided
      if (data.notificationChannels?.includes('email') && !data.email) {
        return false
      }
      return true
    },
    {
      message: 'Email address is required when email is selected as a notification channel',
      path: ['email']
    }
  )

/**
 * Emergency Contact Form Schema
 * Used for form validation in UI
 */
export const emergencyContactFormSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    relationship: relationshipSchema,
    phoneNumber: phoneNumberSchema,
    email: emailSchema.optional(),
    address: z.string().max(500, 'Address cannot exceed 500 characters').optional(),
    priority: prioritySchema,
    preferredContactMethod: preferredContactMethodSchema.optional(),
    notificationChannels: notificationChannelsSchema.optional(),
    canPickupStudent: z.boolean().optional(),
    notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional()
  })
  .refine(
    (data) => {
      // If email notification channel is selected, email must be provided
      if (data.notificationChannels?.includes('email') && !data.email) {
        return false
      }
      return true
    },
    {
      message: 'Email address is required when email is selected as a notification channel',
      path: ['email']
    }
  )

/**
 * Contact verification request schema
 */
export const contactVerificationSchema = z.object({
  contactId: z.string().uuid('Contact ID must be a valid UUID'),
  method: z.enum(['sms', 'email', 'voice'], {
    error: () => ({ message: 'Verification method must be sms, email, or voice' })
  })
})

/**
 * Emergency notification schema
 */
export const emergencyNotificationSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message cannot exceed 1000 characters'),
  type: z.enum(['emergency', 'health', 'medication', 'general'], {
    error: () => ({ message: 'Type must be emergency, health, medication, or general' })
  }),
  priority: z.enum(['low', 'medium', 'high', 'critical'], {
    error: () => ({ message: 'Priority must be low, medium, high, or critical' })
  }),
  channels: z
    .array(z.enum(['sms', 'email', 'voice']))
    .min(1, 'At least one notification channel is required'),
  attachments: z.array(z.string()).optional()
})

/**
 * Export types inferred from schemas
 */
export type CreateEmergencyContactInput = z.infer<typeof createEmergencyContactSchema>
export type UpdateEmergencyContactInput = z.infer<typeof updateEmergencyContactSchema>
export type EmergencyContactFormInput = z.infer<typeof emergencyContactFormSchema>
export type ContactVerificationInput = z.infer<typeof contactVerificationSchema>
export type EmergencyNotificationInput = z.infer<typeof emergencyNotificationSchema>
