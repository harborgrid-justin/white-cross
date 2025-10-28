/**
 * GraphQL Authentication Guard
 *
 * Enforces JWT authentication for GraphQL resolvers.
 * Extracts and validates JWT tokens from GraphQL context.
 */
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * GraphQL JWT Authentication Guard
 *
 * Extends Passport JWT strategy for GraphQL context.
 * Automatically extracts user from request and adds to context.
 */
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  /**
   * Get request from GraphQL execution context
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  /**
   * Handle request after authentication
   *
   * Adds authenticated user to GraphQL context
   */
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
