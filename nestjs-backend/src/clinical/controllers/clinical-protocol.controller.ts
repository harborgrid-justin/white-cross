import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClinicalProtocolService } from '../services/clinical-protocol.service';
import { CreateProtocolDto } from '../dto/protocol/create-protocol.dto';
import { UpdateProtocolDto } from '../dto/protocol/update-protocol.dto';
import { ActivateProtocolDto } from '../dto/protocol/activate-protocol.dto';
import { ProtocolFiltersDto } from '../dto/protocol/protocol-filters.dto';

@ApiTags('Clinical - Protocols')
@Controller('clinical/protocols')
export class ClinicalProtocolController {
  constructor(private readonly protocolService: ClinicalProtocolService) {}

  @Post()
  @ApiOperation({ summary: 'Create clinical protocol' })
  async create(@Body() createDto: CreateProtocolDto) {
    return this.protocolService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Query clinical protocols' })
  async findAll(@Query() filters: ProtocolFiltersDto) {
    return this.protocolService.findAll(filters);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active protocols' })
  async getActive() {
    return this.protocolService.getActiveProtocols();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get protocol by ID' })
  async findOne(@Param('id') id: string) {
    return this.protocolService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update protocol' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateProtocolDto) {
    return this.protocolService.update(id, updateDto);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate protocol' })
  async activate(@Param('id') id: string, @Body() activateDto: ActivateProtocolDto) {
    return this.protocolService.activate(id, activateDto);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate protocol' })
  async deactivate(@Param('id') id: string) {
    return this.protocolService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete protocol' })
  async remove(@Param('id') id: string) {
    await this.protocolService.remove(id);
  }
}
