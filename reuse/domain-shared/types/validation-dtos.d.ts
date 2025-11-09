/**
 * File: /reuse/domain-shared/types/validation-dtos.ts
 * Purpose: Common validation DTO base classes and decorators for domain kits
 *
 * Provides reusable DTO base classes and validation patterns used across
 * construction, consulting, and engineer domains.
 *
 * @module DomainShared/ValidationDTOs
 * @version 1.0.0
 */
/**
 * Base DTO with common audit fields
 */
export declare abstract class BaseDTO {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
}
/**
 * Base create DTO - excludes id and audit timestamps
 */
export declare abstract class CreateDTO {
    metadata?: Record<string, unknown>;
    notes?: string;
}
/**
 * Base update DTO - all fields optional except id
 */
export declare abstract class UpdateDTO {
    id: string;
    metadata?: Record<string, unknown>;
    notes?: string;
}
/**
 * Address validation DTO
 */
export declare class AddressDTO {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
}
/**
 * Contact information validation DTO
 */
export declare class ContactInfoDTO {
    email?: string;
    phone?: string;
    mobile?: string;
    fax?: string;
    website?: string;
}
/**
 * Money amount validation DTO
 */
export declare class MoneyAmountDTO {
    amount: number;
    currency: string;
}
/**
 * Date range validation DTO
 */
export declare class DateRangeDTO {
    startDate: Date;
    endDate: Date;
}
/**
 * Pagination query DTO
 */
export declare class PaginationQueryDTO {
    page?: number;
    limit?: number;
}
/**
 * Sort query DTO
 */
export declare class SortQueryDTO {
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * Search query DTO
 */
export declare class SearchQueryDTO {
    search?: string;
}
/**
 * Combined list query DTO with pagination, sorting, and search
 */
export declare class ListQueryDTO extends PaginationQueryDTO {
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
}
/**
 * File attachment DTO
 */
export declare class AttachmentDTO {
    fileName: string;
    fileSize: number;
    mimeType: string;
    storageKey: string;
    description?: string;
}
/**
 * Bulk operation DTO
 */
export declare class BulkOperationDTO {
    ids: string[];
}
/**
 * Bulk delete DTO
 */
export declare class BulkDeleteDTO extends BulkOperationDTO {
    hardDelete?: boolean;
}
//# sourceMappingURL=validation-dtos.d.ts.map