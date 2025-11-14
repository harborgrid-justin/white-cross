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
exports.CqrsService = exports.CqrsModule = void 0;
const common_1 = require("@nestjs/common");
const command_bus_1 = require("./command-bus");
const query_bus_1 = require("./query-bus");
let CqrsModule = class CqrsModule {
};
exports.CqrsModule = CqrsModule;
exports.CqrsModule = CqrsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            command_bus_1.CommandBus,
            query_bus_1.QueryBus,
            {
                provide: 'COMMAND_BUS',
                useExisting: command_bus_1.CommandBus,
            },
            {
                provide: 'QUERY_BUS',
                useExisting: query_bus_1.QueryBus,
            },
        ],
        exports: [command_bus_1.CommandBus, query_bus_1.QueryBus, 'COMMAND_BUS', 'QUERY_BUS'],
    })
], CqrsModule);
const common_2 = require("@nestjs/common");
let CqrsService = class CqrsService {
    commandBus;
    queryBus;
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    onModuleInit() {
    }
    async executeCommand(command) {
        return this.commandBus.execute(command);
    }
    async executeQuery(query) {
        return this.queryBus.execute(query);
    }
    registerCommandHandler(commandType, handler) {
        this.commandBus.registerHandler(commandType, handler);
    }
    registerQueryHandler(queryType, handler) {
        this.queryBus.registerHandler(queryType, handler);
    }
    getStatistics() {
        return {
            commands: {
                registered: this.commandBus.getRegisteredCommands(),
                count: this.commandBus.getRegisteredCommands().length,
            },
            queries: {
                registered: this.queryBus.getRegisteredQueries(),
                count: this.queryBus.getRegisteredQueries().length,
                cacheStats: this.queryBus.getCacheStats(),
            },
        };
    }
};
exports.CqrsService = CqrsService;
exports.CqrsService = CqrsService = __decorate([
    (0, common_2.Injectable)(),
    __metadata("design:paramtypes", [command_bus_1.CommandBus,
        query_bus_1.QueryBus])
], CqrsService);
//# sourceMappingURL=cqrs.module.js.map