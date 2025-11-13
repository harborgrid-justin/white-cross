import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ClinicalProtocol } from '../entities/clinical-protocol.entity';
import { ProtocolStatus } from '../enums/protocol-status.enum';
import { CreateProtocolDto } from '../dto/protocol/create-protocol.dto';
import { UpdateProtocolDto } from '../dto/protocol/update-protocol.dto';
import { ActivateProtocolDto } from '../dto/protocol/activate-protocol.dto';
import { ProtocolFiltersDto } from '../dto/protocol/protocol-filters.dto';

import { BaseService } from '../../common/base';
@Injectable()
export class ClinicalProtocolService extends BaseService {
  constructor(
    @InjectModel(ClinicalProtocol)
    private protocolModel: typeof ClinicalProtocol,
  ) {}

  async create(createDto: CreateProtocolDto): Promise<ClinicalProtocol> {
    return this.protocolModel.create(createDto as any);
  }

  async findOne(id: string): Promise<ClinicalProtocol> {
    const protocol = await this.protocolModel.findByPk(id);
    if (!protocol) throw new NotFoundException(`Protocol ${id} not found`);
    return protocol;
  }

  async findAll(
    filters: ProtocolFiltersDto,
  ): Promise<{ protocols: ClinicalProtocol[]; total: number }> {
    const whereClause: any = {};

    if (filters.status) whereClause.status = filters.status;
    if (filters.category) whereClause.category = filters.category;
    if (filters.name) whereClause.name = { [Op.iLike]: `%${filters.name}%` };
    if (filters.tag) whereClause.tags = { [Op.contains]: [filters.tag] };
    if (filters.activeOnly) whereClause.status = ProtocolStatus.ACTIVE;

    const { rows: protocols, count: total } =
      await this.protocolModel.findAndCountAll({
        where: whereClause,
        offset: filters.offset || 0,
        limit: filters.limit || 20,
        order: [['name', 'ASC']],
      });

    return { protocols, total };
  }

  async getActiveProtocols(): Promise<ClinicalProtocol[]> {
    return this.protocolModel.findAll({
      where: { status: ProtocolStatus.ACTIVE },
      order: [['name', 'ASC']],
    });
  }

  async update(
    id: string,
    updateDto: UpdateProtocolDto,
  ): Promise<ClinicalProtocol> {
    const protocol = await this.findOne(id);
    Object.assign(protocol, updateDto);
    await protocol.save();
    return protocol;
  }

  async activate(
    id: string,
    activateDto: ActivateProtocolDto,
  ): Promise<ClinicalProtocol> {
    const protocol = await this.findOne(id);
    if (protocol.status === ProtocolStatus.ACTIVE) {
      throw new BadRequestException('Protocol is already active');
    }

    protocol.status = ProtocolStatus.ACTIVE;
    protocol.approvedBy = activateDto.approvedBy;
    protocol.approvedDate = activateDto.approvedDate;
    protocol.effectiveDate =
      activateDto.effectiveDate || activateDto.approvedDate;

    await protocol.save();
    return protocol;
  }

  async deactivate(id: string): Promise<ClinicalProtocol> {
    const protocol = await this.findOne(id);
    protocol.status = ProtocolStatus.INACTIVE;
    await protocol.save();
    return protocol;
  }

  async remove(id: string): Promise<void> {
    const result = await this.protocolModel.destroy({ where: { id } });
    if (result === 0) throw new NotFoundException(`Protocol ${id} not found`);
    this.logInfo(`Deleted protocol ${id}`);
  }
}
