/**
 * LOC: DATAPERSIST001
 * File: data-persistence-layers.ts
 * Purpose: Data persistence layer implementations with caching and transaction support
 */
import { Injectable, Logger } from "@nestjs/common";
import { DataPersistenceService } from "../data-persistence-kit";
import { CrudOperationsService } from "../crud-operations-kit";
import { BulkOperationsService } from "../bulk-operations-kit";

@Injectable()
export class DataPersistenceLayerService {
  private readonly logger = new Logger(DataPersistenceLayerService.name);
  
  constructor(
    private readonly persistenceService: DataPersistenceService,
    private readonly crudService: CrudOperationsService,
    private readonly bulkService: BulkOperationsService,
  ) {}
  
  async persistEntity(model: string, data: any): Promise<any> {
    this.logger.log(`Persisting entity: ${model}`);
    return this.persistenceService.createRecord(model, data);
  }
  
  async persistBulk(model: string, records: any[]): Promise<any> {
    this.logger.log(`Bulk persisting ${records.length} records to ${model}`);
    return this.bulkService.bulkInsert(model, { records, chunkSize: 1000 });
  }
  
  async updatePersisted(model: string, id: string, data: any): Promise<any> {
    this.logger.log(`Updating persisted entity: ${model}:${id}`);
    return this.persistenceService.updateRecord(model, id, data);
  }
  
  async deletePersisted(model: string, id: string, soft: boolean = true): Promise<any> {
    this.logger.log(`Deleting persisted entity: ${model}:${id} (soft: ${soft})`);
    return soft
      ? this.persistenceService.softDeleteRecord(model, id)
      : this.persistenceService.deleteRecord(model, id);
  }
}

export { DataPersistenceLayerService };
