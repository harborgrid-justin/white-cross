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
  DeleteResponseDto
} from '../dto';
import { ContactService } from '../../../contact/services/contact.service';

/**
 * Contact Resolver
 * Handles all GraphQL operations for contacts
 */
@Resolver(() => ContactDto)
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

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

    const result = await this.contactService.findAll({
      ...serviceFilters,
      page,
      limit,
      orderBy,
      orderDirection
    });

    return {
      contacts: result.contacts.map(contact => ({
        ...contact,
        fullName: `${contact.firstName} ${contact.lastName}`,
        displayName: contact.organization
          ? `${contact.firstName} ${contact.lastName} (${contact.organization})`
          : `${contact.firstName} ${contact.lastName}`
      })),
      pagination: result.pagination
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
    const contact = await this.contactService.findOne(id);
    if (!contact) {
      return null;
    }

    return {
      ...contact,
      fullName: `${contact.firstName} ${contact.lastName}`,
      displayName: contact.organization
        ? `${contact.firstName} ${contact.lastName} (${contact.organization})`
        : `${contact.firstName} ${contact.lastName}`
    };
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
    const contacts = await this.contactService.findByRelation(relationTo, type);
    return contacts.map(contact => ({
      ...contact,
      fullName: `${contact.firstName} ${contact.lastName}`,
      displayName: contact.organization
        ? `${contact.firstName} ${contact.lastName} (${contact.organization})`
        : `${contact.firstName} ${contact.lastName}`
    }));
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
    const contacts = await this.contactService.search(query, limit);
    return contacts.map(contact => ({
      ...contact,
      fullName: `${contact.firstName} ${contact.lastName}`,
      displayName: contact.organization
        ? `${contact.firstName} ${contact.lastName} (${contact.organization})`
        : `${contact.firstName} ${contact.lastName}`
    }));
  }

  /**
   * Query: Get contact statistics
   */
  @Query(() => ContactStatsDto, { name: 'contactStats' })
  @UseGuards(GqlAuthGuard)
  async getContactStats(@Context() context?: any): Promise<ContactStatsDto> {
    return await this.contactService.getStats();
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
    const contact = await this.contactService.create(input, userId);

    return {
      ...contact,
      fullName: `${contact.firstName} ${contact.lastName}`,
      displayName: contact.organization
        ? `${contact.firstName} ${contact.lastName} (${contact.organization})`
        : `${contact.firstName} ${contact.lastName}`
    };
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
    const contact = await this.contactService.update(id, input, userId);

    return {
      ...contact,
      fullName: `${contact.firstName} ${contact.lastName}`,
      displayName: contact.organization
        ? `${contact.firstName} ${contact.lastName} (${contact.organization})`
        : `${contact.firstName} ${contact.lastName}`
    };
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
    await this.contactService.remove(id);
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
    const contact = await this.contactService.update(id, { isActive: false }, userId);

    return {
      ...contact,
      fullName: `${contact.firstName} ${contact.lastName}`,
      displayName: contact.organization
        ? `${contact.firstName} ${contact.lastName} (${contact.organization})`
        : `${contact.firstName} ${contact.lastName}`
    };
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
    const contact = await this.contactService.update(id, { isActive: true }, userId);

    return {
      ...contact,
      fullName: `${contact.firstName} ${contact.lastName}`,
      displayName: contact.organization
        ? `${contact.firstName} ${contact.lastName} (${contact.organization})`
        : `${contact.firstName} ${contact.lastName}`
    };
  }
}
