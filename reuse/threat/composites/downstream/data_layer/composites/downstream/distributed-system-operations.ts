/**
 * LOC: DISTRIBUTED001
 * File: distributed-system-operations.ts
 * Purpose: Distributed system coordination, consensus, and cross-region operations
 */

import { Injectable, Logger } from "@nestjs/common";

export enum NodeStatus {
  ACTIVE = "ACTIVE",
  STANDBY = "STANDBY",
  DEGRADED = "DEGRADED",
  OFFLINE = "OFFLINE",
}

export interface IDistributedNode {
  id: string;
  region: string;
  status: NodeStatus;
  lastHeartbeat: Date;
  load: number;
  capacity: number;
}

export interface IDistributedTask {
  id: string;
  type: string;
  payload: any;
  assignedNode?: string;
  status: "pending" | "running" | "completed" | "failed";
  createdAt: Date;
  completedAt?: Date;
}

@Injectable()
export class DistributedSystemOperationsService {
  private readonly logger = new Logger(DistributedSystemOperationsService.name);
  private readonly nodes: Map<string, IDistributedNode> = new Map();
  private readonly tasks: Map<string, IDistributedTask> = new Map();
  private readonly leaderNodeId: string = "node-1"; // Simple leader election

  constructor() {
    this.initializeNodes();
    this.startHeartbeatMonitoring();
  }

  async distributeTask(task: Omit<IDistributedTask, "id" | "createdAt" | "status">): Promise<IDistributedTask> {
    const distributedTask: IDistributedTask = {
      id: `task-${Date.now()}`,
      ...task,
      status: "pending",
      createdAt: new Date(),
    };

    // Select optimal node for task execution
    const targetNode = this.selectNode();
    
    if (targetNode) {
      distributedTask.assignedNode = targetNode.id;
      distributedTask.status = "running";
      this.logger.log(`Task ${distributedTask.id} assigned to node ${targetNode.id}`);
    } else {
      this.logger.warn(`No available nodes for task ${distributedTask.id}`);
    }

    this.tasks.set(distributedTask.id, distributedTask);
    return distributedTask;
  }

  async rebalanceTasks(): Promise<{ moved: number; balanced: boolean }> {
    this.logger.log("Rebalancing tasks across nodes");

    const activeNodes = Array.from(this.nodes.values()).filter(n => n.status === NodeStatus.ACTIVE);
    if (activeNodes.length === 0) return { moved: 0, balanced: false };

    const runningTasks = Array.from(this.tasks.values()).filter(t => t.status === "running");
    
    // Calculate average load
    const avgLoad = runningTasks.length / activeNodes.length;
    let moved = 0;

    for (const node of activeNodes) {
      const nodeTasks = runningTasks.filter(t => t.assignedNode === node.id);
      
      if (nodeTasks.length > avgLoad * 1.5) {
        // Node is overloaded, move some tasks
        const tasksToMove = Math.ceil(nodeTasks.length - avgLoad);
        for (let i = 0; i < tasksToMove; i++) {
          const task = nodeTasks[i];
          const targetNode = this.selectNode();
          if (targetNode && targetNode.id !== node.id) {
            task.assignedNode = targetNode.id;
            moved++;
          }
        }
      }
    }

    return { moved, balanced: true };
  }

  async executeDistributedQuery(query: any): Promise<any[]> {
    this.logger.log("Executing distributed query across all nodes");

    const activeNodes = Array.from(this.nodes.values()).filter(n => n.status === NodeStatus.ACTIVE);
    const results: any[] = [];

    // Fan-out query to all nodes
    const promises = activeNodes.map(node => this.executeQueryOnNode(node, query));
    
    // Gather results
    const nodeResults = await Promise.allSettled(promises);
    
    for (const result of nodeResults) {
      if (result.status === "fulfilled") {
        results.push(...result.value);
      }
    }

    return results;
  }

  async synchronizeData(sourceNode: string, targetNode: string, data: any): Promise<boolean> {
    this.logger.log(`Synchronizing data from ${sourceNode} to ${targetNode}`);

    const target = this.nodes.get(targetNode);
    if (!target || target.status !== NodeStatus.ACTIVE) {
      return false;
    }

    // Simulate data synchronization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  }

  getClusterStatus(): {
    totalNodes: number;
    activeNodes: number;
    totalTasks: number;
    runningTasks: number;
    avgLoad: number;
    isHealthy: boolean;
  } {
    const activeNodes = Array.from(this.nodes.values()).filter(n => n.status === NodeStatus.ACTIVE).length;
    const runningTasks = Array.from(this.tasks.values()).filter(t => t.status === "running").length;
    const avgLoad = activeNodes > 0 ? runningTasks / activeNodes : 0;
    const isHealthy = activeNodes >= 2 && avgLoad < 0.8;

    return {
      totalNodes: this.nodes.size,
      activeNodes,
      totalTasks: this.tasks.size,
      runningTasks,
      avgLoad,
      isHealthy,
    };
  }

  private initializeNodes(): void {
    const regions = ["us-east-1", "us-west-2", "eu-west-1"];
    
    for (let i = 1; i <= 3; i++) {
      this.nodes.set(`node-${i}`, {
        id: `node-${i}`,
        region: regions[i - 1],
        status: NodeStatus.ACTIVE,
        lastHeartbeat: new Date(),
        load: 0.3,
        capacity: 1.0,
      });
    }
  }

  private selectNode(): IDistributedNode | null {
    const activeNodes = Array.from(this.nodes.values())
      .filter(n => n.status === NodeStatus.ACTIVE)
      .sort((a, b) => a.load - b.load);

    return activeNodes.length > 0 ? activeNodes[0] : null;
  }

  private async executeQueryOnNode(node: IDistributedNode, query: any): Promise<any[]> {
    // Simulate query execution on node
    await new Promise(resolve => setTimeout(resolve, 500));
    return [{ nodeId: node.id, results: [] }];
  }

  private startHeartbeatMonitoring(): void {
    setInterval(() => {
      for (const [id, node] of this.nodes) {
        const timeSinceHeartbeat = Date.now() - node.lastHeartbeat.getTime();
        
        if (timeSinceHeartbeat > 60000) {
          node.status = NodeStatus.OFFLINE;
          this.logger.warn(`Node ${id} marked as offline`);
        }
      }
    }, 30000);
  }
}

export { DistributedSystemOperationsService };
