"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTableAttributes = buildTableAttributes;
const sequelize_1 = require("sequelize");
function buildTableAttributes(attributes, options = {}) {
    const { timestamps = true, paranoid = false } = options;
    const completeAttributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        ...attributes,
    };
    if (timestamps) {
        completeAttributes.createdAt = {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
        };
        completeAttributes.updatedAt = {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
        };
    }
    if (paranoid) {
        completeAttributes.deletedAt = {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        };
    }
    return completeAttributes;
}
//# sourceMappingURL=table-attributes-builder.js.map