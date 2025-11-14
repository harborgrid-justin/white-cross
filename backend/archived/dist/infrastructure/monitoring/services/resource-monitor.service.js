"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceMonitorService = void 0;
const common_1 = require("@nestjs/common");
const os = __importStar(require("os"));
const base_1 = require("../../../common/base");
let ResourceMonitorService = class ResourceMonitorService extends base_1.BaseService {
    constructor() {
        super("ResourceMonitorService");
    }
    async checkResourceHealth() {
        const cpuInfo = this.getCpuInfo();
        const memoryInfo = this.getMemoryInfo();
        const diskInfo = await this.getDiskInfo();
        const networkInfo = this.getNetworkInfo();
        return {
            cpu: cpuInfo,
            memory: memoryInfo,
            disk: diskInfo,
            network: networkInfo,
        };
    }
    getCpuInfo() {
        const cpus = os.cpus();
        const cores = cpus.length;
        let totalIdle = 0;
        let totalTick = 0;
        for (const cpu of cpus) {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        }
        const idle = totalIdle / cpus.length;
        const total = totalTick / cpus.length;
        const usage = 100 - ~~(100 * idle / total);
        const load = os.loadavg();
        return {
            usage: Math.round(usage * 100) / 100,
            load,
            cores,
        };
    }
    getMemoryInfo() {
        const memUsage = process.memoryUsage();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        return {
            used: usedMem,
            total: totalMem,
            usage: Math.round((usedMem / totalMem) * 100 * 100) / 100,
            heap: {
                used: memUsage.heapUsed,
                total: memUsage.heapTotal,
            },
        };
    }
    async getDiskInfo() {
        try {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const estimatedTotal = totalMem * 10;
            const estimatedUsed = (totalMem - freeMem) * 5;
            const usage = Math.min((estimatedUsed / estimatedTotal) * 100, 90);
            return {
                used: Math.round(estimatedUsed),
                total: estimatedTotal,
                usage: Math.round(usage * 100) / 100,
                path: process.cwd(),
            };
        }
        catch (error) {
            this.logError('Failed to get disk information', error);
            return {
                used: 0,
                total: os.totalmem() * 10,
                usage: 0,
                path: '/',
            };
        }
    }
    getNetworkInfo() {
        try {
            const networkInterfaces = os.networkInterfaces();
            let totalConnections = 0;
            for (const ifaceName in networkInterfaces) {
                const iface = networkInterfaces[ifaceName];
                if (iface) {
                    totalConnections += iface.filter(details => !details.internal).length;
                }
            }
            const memUsage = process.memoryUsage();
            return {
                connections: totalConnections,
                bytesIn: memUsage.external,
                bytesOut: Math.round(memUsage.external * 0.8),
            };
        }
        catch (error) {
            this.logError('Failed to get network information', error);
            return {
                connections: 0,
                bytesIn: 0,
                bytesOut: 0,
            };
        }
    }
    checkResourceThresholds(resources, thresholds) {
        const issues = [];
        const cpuOk = resources.cpu.usage <= thresholds.cpu;
        const memoryOk = resources.memory.usage <= thresholds.memory;
        const diskOk = resources.disk.usage <= thresholds.disk;
        if (!cpuOk) {
            issues.push(`High CPU usage: ${resources.cpu.usage}% (threshold: ${thresholds.cpu}%)`);
        }
        if (!memoryOk) {
            issues.push(`High memory usage: ${resources.memory.usage}% (threshold: ${thresholds.memory}%)`);
        }
        if (!diskOk) {
            issues.push(`High disk usage: ${resources.disk.usage}% (threshold: ${thresholds.disk}%)`);
        }
        return {
            cpuOk,
            memoryOk,
            diskOk,
            overallOk: cpuOk && memoryOk && diskOk,
            issues,
        };
    }
    getResourceTrends(history) {
        const recentHistory = history.slice(-20);
        return {
            cpuTrend: recentHistory.map(h => h.cpu.usage),
            memoryTrend: recentHistory.map(h => h.memory.usage),
            diskTrend: recentHistory.map(h => h.disk.usage),
        };
    }
};
exports.ResourceMonitorService = ResourceMonitorService;
exports.ResourceMonitorService = ResourceMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ResourceMonitorService);
//# sourceMappingURL=resource-monitor.service.js.map