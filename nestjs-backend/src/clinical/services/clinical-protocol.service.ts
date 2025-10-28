import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ClinicalProtocol } from '../entities/clinical-protocol.entity';
import { ProtocolStatus } from '../enums/protocol-status.enum';
import { CreateProtocolDto } from '../dto/protocol/create-protocol.dto';
import { UpdateProtocolDto } from '../dto/protocol/update-protocol.dto';
import { ActivateProtocolDto } from '../dto/protocol/activate-protocol.dto';
import { ProtocolFiltersDto } from '../dto/protocol/protocol-filters.dto';

@Injectable()
export class ClinicalProtocolService {
  private readonly logger = new Logger(ClinicalProtocolService.name);

  constructor(
    @InjectRepository(ClinicalProtocol)
    private protocolRepository: Repository<ClinicalProtocol>,
  ) {}

  async create(createDto: CreateProtocolDto): Promise<ClinicalProtocol> {
    const protocol = this.protocolRepository.create(createDto);
    return this.protocolRepository.save(protocol);
  }

  async findOne(id: string): Promise<ClinicalProtocol> {
    const protocol = await this.protocolRepository.findOne({ where: { id } });
    if (!protocol) throw new NotFoundException(`Protocol ${id} not found`);
    return protocol;
  }

  async findAll(filters: ProtocolFiltersDto): Promise<{ protocols: ClinicalProtocol[]; total: number }> {
    const queryBuilder = this.protocolRepository.createQueryBuilder('protocol');

    if (filters.status) queryBuilder.andWhere('protocol.status = :status', { status: filters.status });
    if (filters.category) queryBuilder.andWhere('protocol.category = :category', { category: filters.category });
    if (filters.name) queryBuilder.andWhere('protocol.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.tag) queryBuilder.andWhere(':tag = ANY(protocol.tags)', { tag: filters.tag });
    if (filters.activeOnly) queryBuilder.andWhere('protocol.status = :active', { active: ProtocolStatus.ACTIVE });

    const [protocols, total] = await queryBuilder
      .skip(filters.offset || 0)
      .take(filters.limit || 20)
      .orderBy('protocol.name', 'ASC')
      .getManyAndCount();

    return { protocols, total };
  }

  async getActiveProtocols(): Promise<ClinicalProtocol[]> {
    return this.protocolRepository.find({
      where: { status: ProtocolStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async update(id: string, updateDto: UpdateProtocolDto): Promise<ClinicalProtocol> {
    const protocol = await this.findOne(id);
    Object.assign(protocol, updateDto);
    return this.protocolRepository.save(protocol);
  }

  async activate(id: string, activateDto: ActivateProtocolDto): Promise<ClinicalProtocol> {
    const protocol = await this.findOne(id);
    if (protocol.status === ProtocolStatus.ACTIVE) {
      throw new BadRequestException('Protocol is already active');
    }

    protocol.status = ProtocolStatus.ACTIVE;
    protocol.approvedBy = activateDto.approvedBy;
    protocol.approvedDate = activateDto.approvedDate;
    protocol.effectiveDate = activateDto.effectiveDate || activateDto.approvedDate;

    return this.protocolRepository.save(protocol);
  }

  async deactivate(id: string): Promise<ClinicalProtocol> {
    const protocol = await this.findOne(id);
    protocol.status = ProtocolStatus.INACTIVE;
    return this.protocolRepository.save(protocol);
  }

  async remove(id: string): Promise<void> {
    const result = await this.protocolRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Protocol ${id} not found`);
    this.logger.log(`Deleted protocol ${id}`);
  }
}
