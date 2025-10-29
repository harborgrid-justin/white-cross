/**
 * Contact GraphQL Resolver
 *
 * Implements all GraphQL queries and mutations for Contact entity.
 * Integrates with ContactService for business logic and enforces
 * authentication and authorization via guards.
 */
import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import {
  ContactDto,
  ContactListResponseDto,
  ContactInputDto,
  ContactUpdateInputDto,
  ContactFilterInputDto,
  ContactStatsDto,
  DeleteResponseDto,
  ContactType
} from '../dto';
import { ContactService } from '../../../contact/services/contact.service';
import { ContactType as DomainContactType } from '../../../contact/enums/contact-type.enum';
import { Contact } from '../../../database/models/contact.model';

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
  private transformGraphQLContactType(graphqlType: ContactType): DomainContactType {
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
        : `${contact.firstName} ${contact.lastName}`
    };
  }

  /**
   * Query: Get paginated list of contacts with optional filtering
   */
  @Query(() => ContactListResponseDto, { name: 'contacts' })
  @UseGuards(GqlAuthGuard)
  async getContacts(
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Number, defaultValue: 20 }) limit: number,
    @Args('orderBy', { type: () => String, defaultValue: 'lastName' }) orderBy: string,
    @Args('orderDirection', { type: () => String, defaultValue: 'ASC' }) orderDirection: string,
    @Args('filters', { type: () => ContactFilterInputDto, nullable: true }) filters?: ContactFilterInputDto,
    @Context() context?: any
  ): Promise<ContactListResponseDto> {
    // Convert filters to service format
    const serviceFilters: any = {};
    if (filters) {
      if (filters.type) serviceFilters.type = filters.type;
      if (filters.types) serviceFilters.type = filters.types;
      if (filters.isActive !== undefined) serviceFilters.isActive = filters.isActive;
      if (filters.relationTo) serviceFilters.relationTo = filters.relationTo;
      if (filters.search) serviceFilters.search = filters.search;
    }

    const result = await this.contactService.getContacts({
      ...serviceFilters,
      page,
      limit,
      orderBy,
      orderDirection
    });

    return {
      contacts: result.contacts.map(contact => this.mapContactToDto(contact)),
      pagination: {
        ...result.pagination,
        totalPages: result.pagination.pages
      }
    };
  }

  /**
   * Query: Get single contact by ID
   */
  @Query(() => ContactDto, { name: 'contact', nullable: true })
  @UseGuards(GqlAuthGuard)
  async getContact(
    @Args('id', { type: () => ID }) id: string,
    @Context() context?: any
  ): Promise<ContactDto | null> {
    const contact = await this.contactService.getContactById(id);
    if (!contact) {
      return null;
    }

    return this.mapContactToDto(contact);
  }

  /**
   * Query: Get contacts by relation (e.g., student's guardians)
   */
  @Query(() => [ContactDto], { name: 'contactsByRelation' })
  @UseGuards(GqlAuthGuard)
  async getContactsByRelation(
    @Args('relationTo', { type: () => ID }) relationTo: string,
    @Args('type', { type: () => String, nullable: true }) type?: string,
    @Context() context?: any
  ): Promise<ContactDto[]> {
    const contacts = await this.contactService.getContactsByRelation(relationTo, type as any);
    return contacts.map(contact => this.mapContactToDto(contact));
  }

  /**
   * Query: Search contacts by query string
   */
  @Query(() => [ContactDto], { name: 'searchContacts' })
  @UseGuards(GqlAuthGuard)
  async searchContacts(
    @Args('query', { type: () => String }) query: string,
    @Args('limit', { type: () => Number, defaultValue: 10 }) limit: number,
    @Context() context?: any
  ): Promise<ContactDto[]> {
    const contacts = await this.contactService.searchContacts(query, limit);
    return contacts.map(contact => this.mapContactToDto(contact));
  }

  /**
   * Query: Get contact statistics
   */
  @Query(() => ContactStatsDto, { name: 'contactStats' })
  @UseGuards(GqlAuthGuard)
  async getContactStats(@Context() context?: any): Promise<ContactStatsDto> {
    return await this.contactService.getContactStats();
  }

  /**
   * Mutation: Create new contact
   */
  @Mutation(() => ContactDto)
  @UseGuards(GqlAuthGuard)
  async createContact(
    @Args('input') input: ContactInputDto,
    @Context() context: any
  ): Promise<ContactDto> {
    const userId = context.req?.user?.id;
    const transformedInput = {
      ...input,
      type: this.transformGraphQLContactType(input.type)
    };
    const contact = await this.contactService.createContact(transformedInput);

    return this.mapContactToDto(contact);
  }

  /**
   * Mutation: Update existing contact
   */
  @Mutation(() => ContactDto)
  @UseGuards(GqlAuthGuard)
  async updateContact(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: ContactUpdateInputDto,
    @Context() context: any
  ): Promise<ContactDto> {
    const userId = context.req?.user?.id;
    const transformedInput = {
      ...input,
      type: input.type ? this.transformGraphQLContactType(input.type) : undefined
    };
    const contact = await this.contactService.updateContact(id, transformedInput);

    return this.mapContactToDto(contact);
  }

  /**
   * Mutation: Delete contact
   */
  @Mutation(() => DeleteResponseDto)
  @UseGuards(GqlAuthGuard)
  async deleteContact(
    @Args('id', { type: () => ID }) id: string,
    @Context() context?: any
  ): Promise<DeleteResponseDto> {
    await this.contactService.deleteContact(id);
    return {
      success: true,
      message: 'Contact deleted successfully'
    };
  }

  /**
   * Mutation: Deactivate contact
   */
  @Mutation(() => ContactDto)
  @UseGuards(GqlAuthGuard)
  async deactivateContact(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: any
  ): Promise<ContactDto> {
    const userId = context.req?.user?.id;
    const contact = await this.contactService.deactivateContact(id, userId);

    return this.mapContactToDto(contact);
  }

  /**
   * Mutation: Reactivate contact
   */
  @Mutation(() => ContactDto)
  @UseGuards(GqlAuthGuard)
  async reactivateContact(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: any
  ): Promise<ContactDto> {
    const userId = context.req?.user?.id;
    const contact = await this.contactService.reactivateContact(id, userId);

    return this.mapContactToDto(contact);
  }
}
