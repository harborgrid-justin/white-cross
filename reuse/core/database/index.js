"use strict";
/**
 * @fileoverview Database & ORM Barrel Export
 * @module core/database
 *
 * Comprehensive database and ORM utilities including Sequelize models, queries,
 * associations, transactions, migrations, and CRUD operations.
 *
 * @example Sequelize model creation
 * ```typescript
 * import { createModel, defineAssociations } from '@reuse/core/database';
 *
 * const User = createModel(sequelize, {
 *   tableName: 'users',
 *   fields: {
 *     id: { type: DataTypes.INTEGER, primaryKey: true },
 *     email: { type: DataTypes.STRING, unique: true },
 *     name: { type: DataTypes.STRING }
 *   }
 * });
 * ```
 *
 * @example Transaction management
 * ```typescript
 * import { withTransaction } from '@reuse/core/database';
 *
 * await withTransaction(sequelize, async (transaction) => {
 *   await User.create({ email: 'user@example.com' }, { transaction });
 *   await Profile.create({ userId: user.id }, { transaction });
 * });
 * ```
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudKit = exports.SchemaDesignKit = exports.OrmKit = exports.ConnectionKit = void 0;
// ============================================================================
// SEQUELIZE UTILITIES
// ============================================================================
__exportStar(require("./sequelize"), exports);
// ============================================================================
// MIGRATIONS
// ============================================================================
__exportStar(require("./migrations"), exports);
// ============================================================================
// MAIN EXPORTS
// ============================================================================
__exportStar(require("./connection-kit"), exports);
__exportStar(require("./orm-kit"), exports);
__exportStar(require("./schema-design-kit"), exports);
__exportStar(require("./crud-kit"), exports);
// ============================================================================
// DEFAULT EXPORTS
// ============================================================================
var connection_kit_1 = require("./connection-kit");
Object.defineProperty(exports, "ConnectionKit", { enumerable: true, get: function () { return __importDefault(connection_kit_1).default; } });
var orm_kit_1 = require("./orm-kit");
Object.defineProperty(exports, "OrmKit", { enumerable: true, get: function () { return __importDefault(orm_kit_1).default; } });
var schema_design_kit_1 = require("./schema-design-kit");
Object.defineProperty(exports, "SchemaDesignKit", { enumerable: true, get: function () { return __importDefault(schema_design_kit_1).default; } });
var crud_kit_1 = require("./crud-kit");
Object.defineProperty(exports, "CrudKit", { enumerable: true, get: function () { return __importDefault(crud_kit_1).default; } });
//# sourceMappingURL=index.js.map