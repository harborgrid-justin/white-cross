/**
 * Contact GraphQL Resolver
 *
 * Implements all GraphQL queries and mutations for Contact entity.
 * Integrates with ContactService for business logic and enforces
 * authentication and authorization via guards.
 *
 * Features:
 * - Role-based access control with GqlRolesGuard
 * - PHI access protected by role restrictions
 */
import { Args, Context, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, GqlRolesGuard } from '../guards';
import { Roles } from '@/auth';
import { Contact, UserRole } from '@/database';
import {
  ContactDto,
  ContactFilterInputDto,
  ContactInputDto,
  ContactListResponseDto,
  ContactStatsDto,
  ContactType,
  ContactUpdateInputDto,
  DeleteResponseDto,
  StudentDto,
} from '../dto';
import { ContactService } from '@/services/communication/contact';
import { ContactType as DomainContactType } from '../../../services/communication/contact/enums/contact-type.enum';
import type { GraphQLContext } from '../types/context.interface';


/**
 * GraphQL context structure
 */
interface GraphQLContext {
  req?: {
    user?: {
      userId: string;
      organizationId: string;
      role: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}


/**
 * GraphQL context structure
 */
interface GraphQLContext {
  req?: {
    user?: {
      userId: string;
      organizationId: string;
      role: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Contact Resolver
 * Handles all GraphQL operations for contacts
 */
@Resolver(() => ContactDto)
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  /**
   * Transform domain ContactType to GraphQL ContactType
   */
  private transformContactType(domainType: DomainContactType): ContactType {
    switch (domainType) {
      case DomainContactType.Guardian:
        return ContactType.Guardian;
      case DomainContactType.Staff:
        return ContactType.Staff;
      case DomainContactType.Vendor:
        return ContactType.Vendor;
      case DomainContactType.Provider:
        return ContactType.Provider;
      case DomainContactType.Other:
        return ContactType.Other;
      default:
        return ContactType.Other;
    }
  }

  /**
   * Transform GraphQL ContactType to domain ContactType
   */
  private transformGraphQLContactType(
    graphqlType: ContactType,
  ): DomainContactType {
    switch (graphqlType) {
      case ContactType.Guardian:
        return DomainContactType.Guardian;
      case ContactType.Staff:
        return DomainContactType.Staff;
      case ContactType.Vendor:
        return DomainContactType.Vendor;
      case ContactType.Provider:
        return DomainContactType.Provider;
      case ContactType.Other:
        return DomainContactType.Other;
      default:
        return DomainContactType.Other;
    }
  }

  /**
   * Map Contact model to ContactDto
   * Converts all null values to undefined for GraphQL compatibility
   */
  private mapContactToDto(contact: Contact): ContactDto {
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

  /**
   * Query: Get paginated list of contacts with optional filtering
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE, COUNSELOR
   */
  @Query(() => ContactListResponseDto, { name: 'contacts' })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
    UserRole.COUNSELOR,
  )
  async getContacts(
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Number, defaultValue: 20 }) limit: number,
    @Args('orderBy', { type: () => String, defaultValue: 'lastName' })
    orderBy: string,
    @Args('orderDirection', { type: () => String, defaultValue: 'ASC' })
    orderDirection: string,
    @Args('filters', { type: () => ContactFilterInputDto, nullable: true })
    filters?: ContactFilterInputDto,
    @Context() context?: GraphQLContext,
  ): Promise<ContactListResponseDto> {
    // Convert filters to service format
    const serviceFilters: Record<string, unknown> = {};
    if (filters) {
      if (filters.type) serviceFilters.type = filters.type;
      if (filters.types) serviceFilters.type = filters.types;
      if (filters.isActive !== undefined)
        serviceFilters.isActive = filters.isActive;
      if (filters.relationTo) serviceFilters.relationTo = filters.relationTo;
      if (filters.search) serviceFilters.search = filters.search;
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

  /**
   * Query: Get single contact by ID
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE, COUNSELOR
   */
  @Query(() => ContactDto, { name: 'contact', nullable: true })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
    UserRole.COUNSELOR,
  )
  async getContact(
    @Args('id', { type: () => ID }) id: string,
    @Context() context?: GraphQLContext,
  ): Promise<ContactDto | null> {
    const contact = await this.contactService.getContactById(id);
    if (!contact) {
      return null;
    }

    return this.mapContactToDto(contact);
  }

  /**
   * Query: Get contacts by relation (e.g., student's guardians)
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE, COUNSELOR
   */
  @Query(() => [ContactDto], { name: 'contactsByRelation' })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
    UserRole.COUNSELOR,
  )
  async getContactsByRelation(
    @Args('relationTo', { type: () => ID }) relationTo: string,
    @Args('type', { type: () => String, nullable: true }) type?: string,
    @Context() context?: GraphQLContext,
  ): Promise<ContactDto[]> {
    const contacts = await this.contactService.getContactsByRelation(
      relationTo,
      type as any,
    );
    return contacts.map((contact) => this.mapContactToDto(contact));
  }

  /**
   * Query: Search contacts by query string
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE, COUNSELOR
   */
  @Query(() => [ContactDto], { name: 'searchContacts' })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
    UserRole.COUNSELOR,
  )
  async searchContacts(
    @Args('query', { type: () => String }) query: string,
    @Args('limit', { type: () => Number, defaultValue: 10 }) limit: number,
    @Context() context?: GraphQLContext,
  ): Promise<ContactDto[]> {
    const contacts = await this.contactService.searchContacts(query, limit);
    return contacts.map((contact) => this.mapContactToDto(contact));
  }

  /**
   * Query: Get contact statistics
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN
   */
  @Query(() => ContactStatsDto, { name: 'contactStats' })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DISTRICT_ADMIN)
  async getContactStats(@Context() context?: GraphQLContext): Promise<ContactStatsDto> {
    return await this.contactService.getContactStats();
  }

  /**
   * Mutation: Create new contact
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE
   */
  @Mutation(() => ContactDto)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  )
  async createContact(
    @Args('input') input: ContactInputDto,
    @Context() context: GraphQLContext,
  ): Promise<ContactDto> {
    const userId = context.req?.user?.id;
    const transformedInput = {
      ...input,
      type: this.transformGraphQLContactType(input.type),
    };
    const contact = await this.contactService.createContact(transformedInput);

    return this.mapContactToDto(contact);
  }

  /**
   * Mutation: Update existing contact
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE
   */
  @Mutation(() => ContactDto)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  )
  async updateContact(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: ContactUpdateInputDto,
    @Context() context: GraphQLContext,
  ): Promise<ContactDto> {
    const userId = context.req?.user?.id;
    const transformedInput = {
      ...input,
      type: input.type
        ? this.transformGraphQLContactType(input.type)
        : undefined,
    };
    const contact = await this.contactService.updateContact(
      id,
      transformedInput,
    );

    return this.mapContactToDto(contact);
  }

  /**
   * Mutation: Delete contact
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN only
   */
  @Mutation(() => DeleteResponseDto)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DISTRICT_ADMIN)
  async deleteContact(
    @Args('id', { type: () => ID }) id: string,
    @Context() context?: GraphQLContext,
  ): Promise<DeleteResponseDto> {
    await this.contactService.deleteContact(id);
    return {
      success: true,
      message: 'Contact deleted successfully',
    };
  }

  /**
   * Mutation: Deactivate contact
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE
   */
  @Mutation(() => ContactDto)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  )
  async deactivateContact(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: GraphQLContext,
  ): Promise<ContactDto> {
    const userId = context.req?.user?.id;
    const contact = await this.contactService.deactivateContact(id, userId);

    return this.mapContactToDto(contact);
  }

  /**
   * Mutation: Reactivate contact
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE
   */
  @Mutation(() => ContactDto)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  )
  async reactivateContact(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: GraphQLContext,
  ): Promise<ContactDto> {
    const userId = context.req?.user?.id;
    const contact = await this.contactService.reactivateContact(id, userId);

    return this.mapContactToDto(contact);
  }

  /**
   * Field Resolver: Load student for a contact
   *
   * Uses DataLoader from context to batch and cache student queries.
   * The DataLoader is shared across all field resolvers in this request for optimal batching.
   *
   * @param contact - Parent contact object
   * @param context - GraphQL context containing DataLoaders
   * @returns Student associated with the contact, or null if not found
   */
  @ResolveField(() => StudentDto, { name: 'student', nullable: true })
  async student(
    @Parent() contact: ContactDto,
    @Context() context: GraphQLContext,
  ): Promise<StudentDto | null> {
    try {
      // If contact has relationTo (student ID), use DataLoader to fetch student
      if (contact.relationTo) {
        return await context.loaders.studentLoader.load(
          contact.relationTo,
        );
      }
      return null;
    } catch (error) {
      console.error(
        `Error loading student for contact ${contact.id}:`,
        error,
      );
      return null;
    }
  }
}
