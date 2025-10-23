/**
 * LOC: GQL-RESOLVER-001
 * WC-GQL-RESOLVER-001 | GraphQL Resolvers
 * 
 * Purpose: GraphQL resolver functions for queries and mutations
 * Inspired by: TwentyHQ resolver patterns
 * Features: Type-safe resolvers, permission checking, error handling
 * 
 * UPSTREAM (imports from):
 *   - ContactService
 *   - StudentService
 *   - Permission system
 * 
 * DOWNSTREAM (imported by):
 *   - Apollo Server setup
 */

import { GraphQLError } from 'graphql';
import { GraphQLScalarType, Kind } from 'graphql';
import ContactService from '../../../services/contact';
import { StudentService } from '../../../services/student';
import { ContactType } from '../../../database/models/core/Contact';
import { checkPermission, Role, Resource, Action } from '../../../shared/permissions';

/**
 * DateTime scalar type
 */
const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: any) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  },
  parseValue(value: any) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

/**
 * JSON scalar type
 */
const jsonScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value: any) {
    return value;
  },
  parseValue(value: any) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.OBJECT) {
      return ast;
    }
    return null;
  },
});

/**
 * Get user from context
 */
function getUserFromContext(context: any) {
  if (!context.user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.user;
}

/**
 * Check user permission
 */
function checkUserPermission(context: any, resource: Resource, action: Action) {
  const user = getUserFromContext(context);
  
  const result = checkPermission({
    userId: user.id,
    userRole: user.role as Role,
    resource,
    action,
  });

  if (!result.allowed) {
    throw new GraphQLError(`Permission denied: ${result.reason}`, {
      extensions: { code: 'FORBIDDEN' },
    });
  }
}

/**
 * Resolvers
 */
export const resolvers = {
  // Custom scalars
  DateTime: dateTimeScalar,
  JSON: jsonScalar,

  // Computed fields for Contact
  Contact: {
    fullName: (parent: any) => `${parent.firstName} ${parent.lastName}`,
    displayName: (parent: any) => {
      if (parent.organization) {
        return `${parent.firstName} ${parent.lastName} (${parent.organization})`;
      }
      return `${parent.firstName} ${parent.lastName}`;
    },
  },

  // Computed fields for Student
  Student: {
    fullName: (parent: any) => `${parent.firstName} ${parent.lastName}`,
  },

  // Queries
  Query: {
    // Contact Queries
    contacts: async (_parent: any, args: any, context: any) => {
      checkUserPermission(context, Resource.Contact, Action.List);

      const { page, limit, orderBy, orderDirection, filters } = args;
      
      // Convert filters
      const serviceFilters: any = {};
      if (filters) {
        if (filters.type) serviceFilters.type = filters.type;
        if (filters.types) serviceFilters.type = filters.types;
        if (filters.isActive !== undefined) serviceFilters.isActive = filters.isActive;
        if (filters.relationTo) serviceFilters.relationTo = filters.relationTo;
        if (filters.search) serviceFilters.search = filters.search;
      }

      const result = await ContactService.getContacts(serviceFilters, {
        page,
        limit,
        orderBy,
        orderDirection,
      });

      return result;
    },

    contact: async (_parent: any, args: any, context: any) => {
      checkUserPermission(context, Resource.Contact, Action.Read);
      
      try {
        const contact = await ContactService.getContactById(args.id);
        return contact;
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
    },

    contactsByRelation: async (_parent: any, args: any, context: any) => {
      checkUserPermission(context, Resource.Contact, Action.List);
      
      const { relationTo, type } = args;
      const contacts = await ContactService.getContactsByRelation(
        relationTo,
        type as ContactType
      );
      return contacts;
    },

    searchContacts: async (_parent: any, args: any, context: any) => {
      checkUserPermission(context, Resource.Contact, Action.List);
      
      const { query, limit } = args;
      const contacts = await ContactService.searchContacts(query, limit);
      return contacts;
    },

    contactStats: async (_parent: any, _args: any, context: any) => {
      checkUserPermission(context, Resource.Contact, Action.List);
      
      const stats = await ContactService.getContactStats();
      return stats;
    },

    // Student Queries
    students: async (_parent: any, args: any, context: any) => {
      checkUserPermission(context, Resource.Student, Action.List);

      const { page, limit, orderBy, filters } = args;
      
      // Build filters for student service
      const studentFilters: any = {};
      if (filters) {
        if (filters.isActive !== undefined) studentFilters.isActive = filters.isActive;
        if (filters.grade) studentFilters.grade = filters.grade;
        if (filters.nurseId) studentFilters.nurseId = filters.nurseId;
        if (filters.search) studentFilters.search = filters.search;
      }

      const result: any = await StudentService.getStudents(page, limit, studentFilters);
      
      // Ensure result has the expected structure
      // Handle different response formats from StudentService
      const students = result.students || [];
      const paginationData: any = result.pagination || {};
      
      return {
        students,
        pagination: {
          page: paginationData.page || page || 1,
          limit: paginationData.limit || limit || 20,
          total: paginationData.total || 0,
          totalPages: paginationData.pages || paginationData.totalPages || 0,
        },
      };
    },

    student: async (_parent: any, args: any, context: any) => {
      checkUserPermission(context, Resource.Student, Action.Read);
      
      try {
        const student = await StudentService.getStudentById(args.id);
        return student;
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
    },
  },

  // Mutations
  Mutation: {
    // Contact Mutations
    createContact: async (_parent: any, args: any, context: any) => {
      checkUserPermission(context, Resource.Contact, Action.Create);
      
      const user = getUserFromContext(context);
      
      try {
        const contact = await ContactService.createContact(args.input, user.id);
        return contact;
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
    },

    updateContact: async (_parent: any, args: any, context: any) => {
      checkUserPermission(context, Resource.Contact, Action.Update);
      
      const user = getUserFromContext(context);
      
      try {
        const contact = await ContactService.updateContact(args.id, args.input, user.id);
        return contact;
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: error.code || 'BAD_USER_INPUT' },
        });
      }
    },

    deleteContact: async (_parent: any, args: any, context: any) => {
      checkUserPermission(context, Resource.Contact, Action.Delete);
      
      try {
        const result = await ContactService.deleteContact(args.id);
        return result;
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
    },

    deactivateContact: async (_parent: any, args: any, context: any) => {
      checkUserPermission(context, Resource.Contact, Action.Update);
      
      const user = getUserFromContext(context);
      
      try {
        const contact = await ContactService.deactivateContact(args.id, user.id);
        return contact;
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
    },

    reactivateContact: async (_parent: any, args: any, context: any) => {
      checkUserPermission(context, Resource.Contact, Action.Update);
      
      const user = getUserFromContext(context);
      
      try {
        const contact = await ContactService.reactivateContact(args.id, user.id);
        return contact;
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
    },
  },
};

export default resolvers;
