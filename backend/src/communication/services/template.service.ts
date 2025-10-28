import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MessageTemplate } from '../../database/models/message-template.model';
import { CreateTemplateDto, UpdateTemplateDto } from '../dto/create-template.dto';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(
    @InjectModel(MessageTemplate) private templateModel: typeof MessageTemplate,
  ) {}

  async createTemplate(data: CreateTemplateDto & { createdById: string }) {
    this.logger.log(`Creating template: ${data.name}`);

    const template = await this.templateModel.create({
      name: data.name,
      subject: data.subject,
      content: data.content,
      type: data.type,
      category: data.category,
      variables: data.variables || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdById: data.createdById,
    } as any);

    return { template: template.toJSON() };
  }

  async getTemplates(type?: string, category?: string, isActive?: boolean) {
    const where: any = {};

    if (type) where.type = type;
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive;

    const templates = await this.templateModel.findAll({
      where,
      order: [['name', 'ASC']],
    });

    return {
      templates: templates.map((t) => t.toJSON()),
    };
  }

  async getTemplateById(id: string) {
    const template = await this.templateModel.findByPk(id, {
      include: [{ all: true }],
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return { template: template.toJSON() };
  }

  async updateTemplate(id: string, data: UpdateTemplateDto) {
    const template = await this.templateModel.findByPk(id);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await template.update(data as any);

    return { template: template.toJSON() };
  }

  async deleteTemplate(id: string) {
    const template = await this.templateModel.findByPk(id);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await template.destroy();
  }
}
