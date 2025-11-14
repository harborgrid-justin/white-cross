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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplexityPlugin = void 0;
const apollo_1 = require("@nestjs/apollo");
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("graphql");
const graphql_query_complexity_1 = require("graphql-query-complexity");
const MAX_COMPLEXITY = 1000;
const COMPLEXITY_WEIGHTS = {
    scalar: 1,
    object: 5,
    list: 10,
    relationship: 15,
};
let ComplexityPlugin = class ComplexityPlugin {
    gqlSchemaHost;
    constructor(gqlSchemaHost) {
        this.gqlSchemaHost = gqlSchemaHost;
    }
    async serverWillStart() {
        console.log('GraphQL Complexity Plugin initialized');
        console.log(`Maximum query complexity: ${MAX_COMPLEXITY}`);
    }
    async requestDidStart() {
        const schema = this.gqlSchemaHost.schema;
        return {
            async didResolveOperation({ request, document }) {
                try {
                    const complexity = (0, graphql_query_complexity_1.getComplexity)({
                        schema,
                        operationName: request.operationName,
                        query: document,
                        variables: request.variables,
                        estimators: [
                            (0, graphql_query_complexity_1.fieldExtensionsEstimator)(),
                            (0, graphql_query_complexity_1.simpleEstimator)({
                                defaultComplexity: COMPLEXITY_WEIGHTS.scalar,
                            }),
                        ],
                    });
                    console.log('Query Complexity:', {
                        operationName: request.operationName,
                        complexity,
                        timestamp: new Date().toISOString(),
                    });
                    if (complexity > MAX_COMPLEXITY) {
                        throw new graphql_2.GraphQLError(`Query is too complex: ${complexity}. Maximum allowed complexity: ${MAX_COMPLEXITY}. ` +
                            `Please simplify your query or paginate the results.`, {
                            extensions: {
                                code: 'QUERY_TOO_COMPLEX',
                                complexity,
                                maxComplexity: MAX_COMPLEXITY,
                            },
                        });
                    }
                    if (complexity > MAX_COMPLEXITY * 0.8) {
                        console.warn(`Query complexity is approaching limit: ${complexity}/${MAX_COMPLEXITY}`, {
                            operationName: request.operationName,
                        });
                    }
                }
                catch (error) {
                    if (error instanceof graphql_2.GraphQLError) {
                        throw error;
                    }
                    console.error('Error calculating query complexity:', error);
                }
            },
        };
    }
};
exports.ComplexityPlugin = ComplexityPlugin;
exports.ComplexityPlugin = ComplexityPlugin = __decorate([
    (0, apollo_1.Plugin)(),
    __metadata("design:paramtypes", [graphql_1.GraphQLSchemaHost])
], ComplexityPlugin);
//# sourceMappingURL=complexity.plugin.js.map