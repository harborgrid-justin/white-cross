/**
 * LOC: PAYGQL001
 * File: /reuse/edwards/financial/composites/downstream/graphql-payment-resolvers.ts
 * Purpose: GraphQL Payment Resolvers
 */
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GraphQLPaymentResolvers {
  private readonly logger = new Logger(GraphQLPaymentResolvers.name);

  async getPayment(paymentId: number): Promise<any> {
    return { paymentId, amount: 5000, status: 'PROCESSED' };
  }

  async createPayment(input: any): Promise<any> {
    this.logger.log('Creating payment via GraphQL');
    return { paymentId: 1, status: 'CREATED' };
  }
}
export { GraphQLPaymentResolvers };
