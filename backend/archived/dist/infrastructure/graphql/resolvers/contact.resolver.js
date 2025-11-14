"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const guards_1 = require("../guards");
const auth_1 = require("../../../services/auth");
const database_1 = require("../../../database");
const dto_1 = require("../dto");
const contact_1 = require("../../../services/communication/contact");
const contact_type_enum_1 = require("../../../services/communication/contact/enums/contact-type.enum");
let ContactResolver = class ContactResolver {
    contactService;
    constructor(contactService) {
        this.contactService = contactService;
    }
    transformContactType(domainType) {
        switch (domainType) {
            case contact_type_enum_1.ContactType.Guardian:
                return dto_1.ContactType.Guardian;
            case contact_type_enum_1.ContactType.Staff:
                return dto_1.ContactType.Staff;
            case contact_type_enum_1.ContactType.Vendor:
                return dto_1.ContactType.Vendor;
            case contact_type_enum_1.ContactType.Provider:
                return dto_1.ContactType.Provider;
            case contact_type_enum_1.ContactType.Other:
                return dto_1.ContactType.Other;
            default:
                return dto_1.ContactType.Other;
        }
    }
    transformGraphQLContactType(graphqlType) {
        switch (graphqlType) {
            case dto_1.ContactType.Guardian:
                return contact_type_enum_1.ContactType.Guardian;
            case dto_1.ContactType.Staff:
                return contact_type_enum_1.ContactType.Staff;
            case dto_1.ContactType.Vendor:
                return contact_type_enum_1.ContactType.Vendor;
            case dto_1.ContactType.Provider:
                return contact_type_enum_1.ContactType.Provider;
            case dto_1.ContactType.Other:
                return contact_type_enum_1.ContactType.Other;
            default:
                return contact_type_enum_1.ContactType.Other;
        }
    }
    mapContactToDto(contact) {
        return {
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email ?? undefined,
            phone: contact.phone ?? undefined,
            organization: contact.organization ?? undefined,
            address: contact.address ?? undefined,
            city: contact.city ?? undefined,
            state: contact.state ?? undefined,
            zip: contact.zip ?? undefined,
            relationTo: contact.relationTo ?? undefined,
            relationshipType: contact.relationshipType ?? undefined,
            customFields: contact.customFields ?? undefined,
            notes: contact.notes ?? undefined,
            title: contact.title ?? undefined,
            createdBy: contact.createdBy ?? undefined,
            updatedBy: contact.updatedBy ?? undefined,
            type: this.transformContactType(contact.type),
            isActive: contact.isActive,
            createdAt: contact.createdAt,
            updatedAt: contact.updatedAt,
            fullName: `${contact.firstName} ${contact.lastName}`,
            displayName: contact.organization
                ? `${contact.firstName} ${contact.lastName} (${contact.organization})`
                : `${contact.firstName} ${contact.lastName}`,
        };
    }
    async getContacts(page, limit, orderBy, orderDirection, filters, context) {
        const serviceFilters = {};
        if (filters) {
            if (filters.type)
                serviceFilters.type = filters.type;
            if (filters.types)
                serviceFilters.type = filters.types;
            if (filters.isActive !== undefined)
                serviceFilters.isActive = filters.isActive;
            if (filters.relationTo)
                serviceFilters.relationTo = filters.relationTo;
            if (filters.search)
                serviceFilters.search = filters.search;
        }
        const result = await this.contactService.getContacts({
            ...serviceFilters,
            page,
            limit,
            orderBy,
            orderDirection,
        });
        return {
            contacts: result.contacts.map((contact) => this.mapContactToDto(contact)),
            pagination: {
                ...result.pagination,
                totalPages: result.pagination.pages,
            },
        };
    }
    async getContact(id, context) {
        const contact = await this.contactService.getContactById(id);
        if (!contact) {
            return null;
        }
        return this.mapContactToDto(contact);
    }
    async getContactsByRelation(relationTo, type, context) {
        const contacts = await this.contactService.getContactsByRelation(relationTo, type);
        return contacts.map((contact) => this.mapContactToDto(contact));
    }
    async searchContacts(query, limit, context) {
        const contacts = await this.contactService.searchContacts(query, limit);
        return contacts.map((contact) => this.mapContactToDto(contact));
    }
    async getContactStats(context) {
        return await this.contactService.getContactStats();
    }
    async createContact(input, context) {
        const userId = context.req?.user?.id;
        const transformedInput = {
            ...input,
            type: this.transformGraphQLContactType(input.type),
        };
        const contact = await this.contactService.createContact(transformedInput);
        return this.mapContactToDto(contact);
    }
    async updateContact(id, input, context) {
        const userId = context.req?.user?.id;
        const transformedInput = {
            ...input,
            type: input.type
                ? this.transformGraphQLContactType(input.type)
                : undefined,
        };
        const contact = await this.contactService.updateContact(id, transformedInput);
        return this.mapContactToDto(contact);
    }
    async deleteContact(id, context) {
        await this.contactService.deleteContact(id);
        return {
            success: true,
            message: 'Contact deleted successfully',
        };
    }
    async deactivateContact(id, context) {
        const userId = context.req?.user?.id;
        const contact = await this.contactService.deactivateContact(id, userId);
        return this.mapContactToDto(contact);
    }
    async reactivateContact(id, context) {
        const userId = context.req?.user?.id;
        const contact = await this.contactService.reactivateContact(id, userId);
        return this.mapContactToDto(contact);
    }
    async student(contact, context) {
        try {
            if (contact.relationTo) {
                return await context.loaders.studentLoader.load(contact.relationTo);
            }
            return null;
        }
        catch (error) {
            console.error(`Error loading student for contact ${contact.id}:`, error);
            return null;
        }
    }
};
exports.ContactResolver = ContactResolver;
__decorate([
    (0, graphql_1.Query)(() => dto_1.ContactListResponseDto, { name: 'contacts' }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE, database_1.UserRole.COUNSELOR),
    __param(0, (0, graphql_1.Args)('page', { type: () => Number, defaultValue: 1 })),
    __param(1, (0, graphql_1.Args)('limit', { type: () => Number, defaultValue: 20 })),
    __param(2, (0, graphql_1.Args)('orderBy', { type: () => String, defaultValue: 'lastName' })),
    __param(3, (0, graphql_1.Args)('orderDirection', { type: () => String, defaultValue: 'ASC' })),
    __param(4, (0, graphql_1.Args)('filters', { type: () => dto_1.ContactFilterInputDto, nullable: true })),
    __param(5, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, dto_1.ContactFilterInputDto, Object]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "getContacts", null);
__decorate([
    (0, graphql_1.Query)(() => dto_1.ContactDto, { name: 'contact', nullable: true }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE, database_1.UserRole.COUNSELOR),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "getContact", null);
__decorate([
    (0, graphql_1.Query)(() => [dto_1.ContactDto], { name: 'contactsByRelation' }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE, database_1.UserRole.COUNSELOR),
    __param(0, (0, graphql_1.Args)('relationTo', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('type', { type: () => String, nullable: true })),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "getContactsByRelation", null);
__decorate([
    (0, graphql_1.Query)(() => [dto_1.ContactDto], { name: 'searchContacts' }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE, database_1.UserRole.COUNSELOR),
    __param(0, (0, graphql_1.Args)('query', { type: () => String })),
    __param(1, (0, graphql_1.Args)('limit', { type: () => Number, defaultValue: 10 })),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "searchContacts", null);
__decorate([
    (0, graphql_1.Query)(() => dto_1.ContactStatsDto, { name: 'contactStats' }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "getContactStats", null);
__decorate([
    (0, graphql_1.Mutation)(() => dto_1.ContactDto),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ContactInputDto, Object]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "createContact", null);
__decorate([
    (0, graphql_1.Mutation)(() => dto_1.ContactDto),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('input')),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ContactUpdateInputDto, Object]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "updateContact", null);
__decorate([
    (0, graphql_1.Mutation)(() => dto_1.DeleteResponseDto),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "deleteContact", null);
__decorate([
    (0, graphql_1.Mutation)(() => dto_1.ContactDto),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "deactivateContact", null);
__decorate([
    (0, graphql_1.Mutation)(() => dto_1.ContactDto),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "reactivateContact", null);
__decorate([
    (0, graphql_1.ResolveField)(() => dto_1.StudentDto, { name: 'student', nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ContactDto, Object]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "student", null);
exports.ContactResolver = ContactResolver = __decorate([
    (0, graphql_1.Resolver)(() => dto_1.ContactDto),
    __metadata("design:paramtypes", [contact_1.ContactService])
], ContactResolver);
//# sourceMappingURL=contact.resolver.js.map