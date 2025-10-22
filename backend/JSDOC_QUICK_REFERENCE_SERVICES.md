# JSDoc Quick Reference - Appointment & Communication Services

## Quick Copy-Paste Templates

### File Header Template

```typescript
/**
 * @fileoverview [Service Name] Service
 * @module services/[category]/[filename]
 * @description [Brief description of service purpose and capabilities]
 *
 * Key Features:
 * - [Feature 1]
 * - [Feature 2]
 * - [Feature 3]
 *
 * Business Rules:
 * - [Rule 1]
 * - [Rule 2]
 *
 * @compliance HIPAA - [Compliance note]
 * @compliance TCPA - [If applicable]
 * @compliance CAN-SPAM - [If applicable]
 *
 * @requires [dependency1]
 * @requires [dependency2]
 */
```

### Method Template - Basic

```typescript
/**
 * @method methodName
 * @description [What this method does]
 * @async
 * @static
 *
 * @param {Type} paramName - Parameter description
 * @param {Type} [optionalParam] - Optional parameter description
 *
 * @returns {Promise<ReturnType>} Description of return value
 *
 * @throws {ErrorType} When [condition]
 *
 * @example
 * const result = await Service.methodName(param);
 */
```

### Method Template - Appointment Service

```typescript
/**
 * @method scheduleAppointment
 * @description Schedule appointment with full validation and reminder setup
 * @async
 * @static
 *
 * @param {CreateAppointmentData} data - Appointment data
 * @param {string} data.studentId - Student UUID
 * @param {string} data.nurseId - Nurse UUID
 * @param {Date} data.scheduledAt - Appointment date/time
 * @param {string} data.type - Appointment type
 * @param {number} data.duration - Duration in minutes (15-120)
 *
 * @returns {Promise<Appointment>} Created appointment with reminders
 *
 * @throws {ValidationError} When time outside business hours
 * @throws {ConflictError} When nurse unavailable
 * @throws {NotFoundError} When student/nurse not found
 *
 * @business Monday-Friday, 8 AM - 5 PM only
 * @business Duration: 15-120 minutes in 15-min increments
 * @business Automatic reminders: 24hr, 2hr, 30min before
 *
 * @compliance HIPAA - Data encrypted at rest and in transit
 *
 * @example
 * const appointment = await AppointmentService.scheduleAppointment({
 *   studentId: 'student-uuid',
 *   nurseId: 'nurse-uuid',
 *   scheduledAt: new Date('2024-01-15T14:00:00'),
 *   type: 'ROUTINE_CHECKUP',
 *   duration: 30
 * });
 */
```

### Method Template - Communication Service

```typescript
/**
 * @method sendMessage
 * @description Send HIPAA-compliant message via multiple channels
 * @async
 * @static
 *
 * @param {CreateMessageData} data - Message data
 * @param {Recipient[]} data.recipients - Array of recipients
 * @param {MessageType[]} data.channels - Delivery channels
 * @param {string} [data.subject] - Message subject (required for EMAIL)
 * @param {string} data.content - Message content
 * @param {MessagePriority} data.priority - Priority level
 * @param {MessageCategory} data.category - Message category
 * @param {string} data.senderId - Sender UUID
 *
 * @returns {Promise<MessageResult>} Message and delivery statuses
 * @returns {Message} return.message - Created message
 * @returns {DeliveryStatus[]} return.deliveryStatuses - Delivery statuses
 *
 * @throws {ValidationError} When content fails HIPAA compliance
 * @throws {ValidationError} When recipients missing contact info
 * @throws {ValidationError} When content exceeds channel limits
 *
 * @business SMS: 160 char max, Email: 50,000 char max
 * @business Emergency messages auto-elevated to URGENT
 *
 * @compliance HIPAA - Content scanned for PHI, encrypted
 * @compliance TCPA - SMS requires consent
 * @compliance CAN-SPAM - Emails include unsubscribe
 *
 * @security PHI detection prevents health info in messages
 *
 * @example
 * const result = await CommunicationService.sendMessage({
 *   recipients: [{
 *     type: 'PARENT',
 *     id: 'parent-uuid',
 *     email: 'parent@example.com'
 *   }],
 *   channels: ['EMAIL'],
 *   subject: 'Health Form Reminder',
 *   content: 'Please complete annual health form',
 *   priority: 'MEDIUM',
 *   category: 'GENERAL',
 *   senderId: 'nurse-uuid'
 * });
 */
```

## Common JSDoc Tags

### Core Tags

| Tag | Usage | Example |
|-----|-------|---------|
| `@fileoverview` | File description | `@fileoverview Appointment Service` |
| `@module` | Module path | `@module services/appointment/appointmentService` |
| `@description` | Detailed description | `@description Manages appointments` |
| `@class` | Class declaration | `@class AppointmentService` |
| `@method` | Method name | `@method scheduleAppointment` |
| `@function` | Function declaration | `@function sendMessage` |
| `@param` | Parameter | `@param {string} id - User ID` |
| `@returns` | Return value | `@returns {Promise<User>} User object` |
| `@throws` | Exception | `@throws {NotFoundError} When not found` |
| `@example` | Code example | `@example const x = fn();` |
| `@async` | Async method | `@async` |
| `@static` | Static method | `@static` |

### Custom Tags (White Cross)

| Tag | Usage | Example |
|-----|-------|---------|
| `@business` | Business rule | `@business Monday-Friday only` |
| `@compliance` | Compliance note | `@compliance HIPAA - Encrypted` |
| `@security` | Security note | `@security PHI detection enabled` |
| `@schedule` | Cron schedule | `@schedule Run every 5 minutes` |

### Type Definitions

| Tag | Usage | Example |
|-----|-------|---------|
| `@typedef` | Type definition | `@typedef {Object} User` |
| `@property` | Object property | `@property {string} name - User name` |
| `@type` | Variable type | `@type {string}` |

## Quick Business Rules Reference

### Appointments

```typescript
/**
 * @business Monday-Friday, 8:00 AM - 5:00 PM only
 * @business Duration: 15-120 minutes in 15-minute increments
 * @business Default duration: 30 minutes
 * @business Buffer time: 15 minutes between appointments
 * @business Maximum: 16 appointments per nurse per day
 * @business Minimum cancellation notice: 2 hours
 * @business Reminders: 24hr (EMAIL), 2hr (SMS), 30min (SMS)
 */
```

### Communication

```typescript
/**
 * @business SMS: Max 160 characters (warns at 150)
 * @business Email: Max 50,000 characters
 * @business Push: Max 178 characters
 * @business Voice: Max 500 characters
 * @business Broadcast: Max 10,000 recipients
 * @business Emergency: Always URGENT priority, immediate delivery
 */
```

## Quick Compliance Reference

### HIPAA

```typescript
/**
 * @compliance HIPAA - PHI detection and sanitization
 * @compliance HIPAA - Encryption in transit (TLS 1.2+) and at rest (AES-256)
 * @compliance HIPAA - Audit logging of all access
 * @compliance HIPAA - Data retention: 7 years minimum
 */
```

### TCPA (SMS/Voice)

```typescript
/**
 * @compliance TCPA - Express written consent required for SMS
 * @compliance TCPA - Opt-out instructions in every SMS
 * @compliance TCPA - Consent tracked in database
 * @compliance TCPA - Call time restrictions: 8 AM - 9 PM local time
 * @compliance TCPA - Do Not Call list checking
 */
```

### CAN-SPAM (Email)

```typescript
/**
 * @compliance CAN-SPAM - Clear sender identification
 * @compliance CAN-SPAM - Accurate subject lines
 * @compliance CAN-SPAM - Unsubscribe link in every email
 * @compliance CAN-SPAM - Physical mailing address included
 * @compliance CAN-SPAM - Opt-out processed within 10 days
 */
```

## Common Patterns

### Pattern: Create/Update Operations

```typescript
/**
 * @method create[Entity]
 * @description Create new [entity] with validation
 * @async
 *
 * @param {Create[Entity]Data} data - Entity data
 * @returns {Promise<Entity>} Created entity
 * @throws {ValidationError} When data invalid
 * @throws {ConflictError} When entity already exists
 *
 * @example
 * const entity = await Service.createEntity(data);
 */
```

### Pattern: List Operations

```typescript
/**
 * @method get[Entities]
 * @description Retrieve entities with pagination and filtering
 * @async
 *
 * @param {number} [page=1] - Page number (1-indexed)
 * @param {number} [limit=20] - Items per page
 * @param {EntityFilters} [filters={}] - Optional filters
 *
 * @returns {Promise<PaginatedResult>} Paginated results
 * @returns {Entity[]} return.items - Entity records
 * @returns {PaginationMeta} return.pagination - Pagination metadata
 *
 * @example
 * const result = await Service.getEntities(1, 20, { status: 'active' });
 */
```

### Pattern: Status Operations

```typescript
/**
 * @method update[Entity]Status
 * @description Update entity status with validation
 * @async
 *
 * @param {string} id - Entity UUID
 * @param {EntityStatus} newStatus - New status
 * @param {string} [reason] - Reason for status change
 *
 * @returns {Promise<Entity>} Updated entity
 *
 * @throws {NotFoundError} When entity not found
 * @throws {StateError} When status transition not allowed
 *
 * @business Status transitions validated via state machine
 * @business All transitions logged for audit
 *
 * @example
 * const updated = await Service.updateEntityStatus(
 *   'entity-uuid',
 *   'COMPLETED',
 *   'Task finished'
 * );
 */
```

### Pattern: Batch Operations

```typescript
/**
 * @method process[Entities]
 * @description Batch process entities
 * @async
 *
 * @param {ProcessOptions} [options={}] - Processing options
 * @param {number} [options.batchSize=50] - Batch size
 * @param {Date} [options.beforeDate] - Process entities before date
 *
 * @returns {Promise<ProcessResult>} Processing results
 * @returns {number} return.total - Total entities processed
 * @returns {number} return.successful - Successfully processed
 * @returns {number} return.failed - Failed to process
 *
 * @schedule Recommended: Run every [X] minutes via cron
 *
 * @example
 * const result = await Service.processEntities({ batchSize: 100 });
 * console.log(`Processed: ${result.successful}/${result.total}`);
 */
```

## VSCode Snippet

Add to `.vscode/snippets.code-snippets`:

```json
{
  "JSDoc Method - Full": {
    "prefix": "jsdoc-method",
    "body": [
      "/**",
      " * @method ${1:methodName}",
      " * @description ${2:Method description}",
      " * @async",
      " * @static",
      " *",
      " * @param {${3:Type}} ${4:paramName} - ${5:Parameter description}",
      " *",
      " * @returns {Promise<${6:ReturnType}>} ${7:Return description}",
      " *",
      " * @throws {${8:ErrorType}} When ${9:condition}",
      " *",
      " * @business ${10:Business rule}",
      " *",
      " * @compliance HIPAA - ${11:Compliance note}",
      " *",
      " * @example",
      " * ${12:// Example code}",
      " */"
    ]
  }
}
```

## IntelliJ Live Template

Add to File > Settings > Editor > Live Templates:

```
/**
 * @method $METHOD$
 * @description $DESC$
 * @async
 * @static
 *
 * @param {$TYPE$} $PARAM$ - $PARAMDESC$
 *
 * @returns {Promise<$RETURN$>} $RETURNDESC$
 *
 * @throws {$ERROR$} When $CONDITION$
 *
 * @business $BUSINESS$
 *
 * @example
 * $EXAMPLE$
 */
```

## Validation Checklist

Before committing, verify:

- [ ] File has `@fileoverview` and `@module`
- [ ] All public methods have JSDoc
- [ ] All parameters documented
- [ ] Return value documented
- [ ] Exceptions documented
- [ ] Business rules noted
- [ ] Compliance requirements noted
- [ ] At least one example provided
- [ ] Examples are valid and up-to-date
- [ ] Types match TypeScript definitions

## Common Mistakes to Avoid

### ❌ Missing Parameter Descriptions

```typescript
// Bad
/**
 * @param {string} id
 */

// Good
/**
 * @param {string} id - Entity UUID
 */
```

### ❌ No Examples

```typescript
// Bad
/**
 * @method getData
 * @returns {Promise<Data>} The data
 */

// Good
/**
 * @method getData
 * @returns {Promise<Data>} The data
 *
 * @example
 * const data = await getData();
 * console.log(data);
 */
```

### ❌ Missing Business Rules

```typescript
// Bad
/**
 * @method scheduleAppointment
 * @param {Date} time - Appointment time
 */

// Good
/**
 * @method scheduleAppointment
 * @param {Date} time - Appointment time
 *
 * @business Monday-Friday, 8 AM - 5 PM only
 * @business Minimum 2 hours advance notice
 */
```

### ❌ Missing Compliance Notes

```typescript
// Bad
/**
 * @method sendHealthReminder
 */

// Good
/**
 * @method sendHealthReminder
 *
 * @compliance HIPAA - No PHI in message content
 * @compliance TCPA - SMS requires consent
 */
```

## Resources

- **Main Documentation**: F:/temp/white-cross/backend/APPOINTMENT_COMMUNICATION_SERVICES_JSDOC.md
- **Summary**: F:/temp/white-cross/backend/SERVICES_JSDOC_SUMMARY.md
- **JSDoc Official**: https://jsdoc.app/
- **TypeDoc**: https://typedoc.org/

---

**Last Updated**: 2025-10-22
**Version**: 1.0
