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
exports.WorkerPoolService = void 0;
const common_1 = require("@nestjs/common");
const worker_threads_1 = require("worker_threads");
const os_1 = require("os");
const events_1 = require("events");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let WorkerPoolService = class WorkerPoolService extends base_1.BaseService {
    workers = [];
    taskQueue = [];
    taskIdCounter = 0;
    poolSize;
    workerScript;
    taskTimeout;
    isShuttingDown = false;
    isInitialized = false;
    eventEmitter;
    constructor(workerScript, options = {}) {
        const logger = new logger_service_1.LoggerService();
        super({ serviceName: 'WorkerPoolService', logger });
        this.eventEmitter = new events_1.EventEmitter();
        this.workerScript = workerScript;
        this.poolSize = options.poolSize || Math.max(2, (0, os_1.cpus)().length - 1);
        this.taskTimeout = options.taskTimeout || 30000;
    }
    async onModuleInit() {
        this.initializePool();
    }
    async onModuleDestroy() {
        await this.shutdown();
    }
    initializePool() {
        if (this.isInitialized) {
            this.logWarning('Worker pool already initialized');
            return;
        }
        this.logInfo(`Initializing worker pool with ${this.poolSize} workers`);
        for (let i = 0; i < this.poolSize; i++) {
            this.createWorker();
        }
        this.isInitialized = true;
        this.logInfo(`Worker pool initialized with ${this.workers.length} workers`);
    }
    createWorker() {
        const worker = new worker_threads_1.Worker(this.workerScript);
        const workerInfo = {
            worker,
            busy: false,
            taskCount: 0,
            errors: 0,
        };
        worker.on('message', (message) => {
            this.handleWorkerMessage(workerInfo, message);
        });
        worker.on('error', (error) => {
            this.handleWorkerError(workerInfo, error);
        });
        worker.on('exit', (code) => {
            this.handleWorkerExit(workerInfo, code);
        });
        this.workers.push(workerInfo);
    }
    handleWorkerMessage(workerInfo, _message) {
        workerInfo.busy = false;
        workerInfo.taskCount++;
        this.processNextTask();
    }
    handleWorkerError(workerInfo, error) {
        workerInfo.errors++;
        this.logError('Worker error', {
            error: error.message,
            errorCount: workerInfo.errors,
            stack: error.stack,
        });
        if (workerInfo.errors > 5) {
            this.logWarning(`Worker error threshold exceeded, restarting worker`);
            this.restartWorker(workerInfo);
        }
    }
    handleWorkerExit(workerInfo, code) {
        if (code !== 0 && !this.isShuttingDown) {
            this.logWarning(`Worker exited with code ${code}, restarting...`);
            this.restartWorker(workerInfo);
        }
    }
    restartWorker(workerInfo) {
        const index = this.workers.indexOf(workerInfo);
        if (index === -1)
            return;
        workerInfo.worker.terminate().catch((error) => {
            this.logError('Error terminating worker', error);
        });
        this.workers.splice(index, 1);
        this.createWorker();
        this.logInfo('Worker restarted successfully');
    }
    getAvailableWorker() {
        return this.workers.find((w) => !w.busy) || null;
    }
    processNextTask() {
        if (this.taskQueue.length === 0)
            return;
        const worker = this.getAvailableWorker();
        if (!worker)
            return;
        this.taskQueue.sort((a, b) => b.priority - a.priority);
        const task = this.taskQueue.shift();
        if (!task)
            return;
        this.executeTaskOnWorker(worker, task);
    }
    executeTaskOnWorker(workerInfo, task) {
        workerInfo.busy = true;
        const timeoutId = setTimeout(() => {
            task.reject(new Error('Task timeout exceeded'));
            workerInfo.busy = false;
            this.processNextTask();
        }, this.taskTimeout);
        task.timeout = timeoutId;
        workerInfo.worker.once('message', (message) => {
            clearTimeout(timeoutId);
            if (message.success) {
                task.resolve(message.result);
            }
            else {
                task.reject(new Error(message.error));
            }
        });
        workerInfo.worker.postMessage({
            type: task.type,
            data: task.data,
        });
    }
    async executeTask(type, data, priority = 0) {
        if (this.isShuttingDown) {
            throw new Error('Worker pool is shutting down');
        }
        if (!this.isInitialized) {
            throw new Error('Worker pool not initialized');
        }
        return new Promise((resolve, reject) => {
            const task = {
                id: `task_${++this.taskIdCounter}`,
                type,
                data,
                priority,
                resolve,
                reject,
            };
            const worker = this.getAvailableWorker();
            if (worker) {
                this.executeTaskOnWorker(worker, task);
            }
            else {
                this.taskQueue.push(task);
            }
        });
    }
    getStats() {
        return {
            poolSize: this.poolSize,
            activeWorkers: this.workers.filter((w) => w.busy).length,
            idleWorkers: this.workers.filter((w) => !w.busy).length,
            queuedTasks: this.taskQueue.length,
            totalTasksProcessed: this.workers.reduce((sum, w) => sum + w.taskCount, 0),
            totalErrors: this.workers.reduce((sum, w) => sum + w.errors, 0),
        };
    }
    async shutdown() {
        if (this.isShuttingDown) {
            this.logWarning('Worker pool already shutting down');
            return;
        }
        this.isShuttingDown = true;
        this.logInfo('Shutting down worker pool...');
        this.taskQueue.forEach((task) => {
            if (task.timeout)
                clearTimeout(task.timeout);
            task.reject(new Error('Worker pool shutting down'));
        });
        this.taskQueue = [];
        await Promise.all(this.workers.map(async (workerInfo) => {
            try {
                await workerInfo.worker.terminate();
            }
            catch (error) {
                this.logError('Error terminating worker', error);
            }
        }));
        this.workers = [];
        this.isInitialized = false;
        this.logInfo('Worker pool shutdown complete');
    }
};
exports.WorkerPoolService = WorkerPoolService;
exports.WorkerPoolService = WorkerPoolService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String, Object])
], WorkerPoolService);
//# sourceMappingURL=worker-pool.service.js.map