/**
 * Training Operations Module
 *
 * @module services/administration/trainingOperations
 */

import { logger } from '../../utils/logger';
import { TrainingModule, TrainingCompletion, User } from '../../database/models';
import { TrainingCategory } from '../../database/types/enums';
import { CreateTrainingModuleData } from './types';

/**
 * Create a training module
 */
export async function createTrainingModule(data: CreateTrainingModuleData) {
  try {
    const module = await TrainingModule.create({
      ...data,
      isRequired: data.isRequired ?? false,
      order: data.order ?? 0,
      attachments: data.attachments ?? [],
      isActive: true
    });

    logger.info(`Training module created: ${module.title} (${module.category})`);
    return module;
  } catch (error) {
    logger.error('Error creating training module:', error);
    throw error;
  }
}

/**
 * Get training modules, optionally filtered by category
 */
export async function getTrainingModules(category?: TrainingCategory) {
  try {
    const whereClause: any = { isActive: true };

    if (category) {
      whereClause.category = category;
    }

    const modules = await TrainingModule.findAll({
      where: whereClause,
      order: [
        ['order', 'ASC'],
        ['title', 'ASC']
      ]
    });

    return modules;
  } catch (error) {
    logger.error('Error fetching training modules:', error);
    throw error;
  }
}

/**
 * Get training module by ID
 */
export async function getTrainingModuleById(id: string) {
  try {
    const module = await TrainingModule.findByPk(id, {
      include: [
        {
          model: TrainingCompletion,
          as: 'completions',
          attributes: ['id', 'userId', 'score', 'completedAt']
        }
      ]
    });

    if (!module) {
      throw new Error('Training module not found');
    }

    return module;
  } catch (error) {
    logger.error('Error fetching training module:', error);
    throw error;
  }
}

/**
 * Update training module
 */
export async function updateTrainingModule(id: string, data: Partial<CreateTrainingModuleData>) {
  try {
    const module = await TrainingModule.findByPk(id);

    if (!module) {
      throw new Error('Training module not found');
    }

    await module.update(data);

    logger.info(`Training module updated: ${module.title} (${id})`);
    return module;
  } catch (error) {
    logger.error('Error updating training module:', error);
    throw error;
  }
}

/**
 * Delete training module (soft delete)
 */
export async function deleteTrainingModule(id: string) {
  try {
    const module = await TrainingModule.findByPk(id);

    if (!module) {
      throw new Error('Training module not found');
    }

    // Soft delete
    await module.update({ isActive: false });

    logger.info(`Training module deleted: ${module.title} (${id})`);
    return { success: true };
  } catch (error) {
    logger.error('Error deleting training module:', error);
    throw error;
  }
}

/**
 * Record training completion
 */
export async function recordTrainingCompletion(moduleId: string, userId: string, score?: number) {
  try {
    // Verify module exists
    const module = await TrainingModule.findByPk(moduleId);
    if (!module) {
      throw new Error('Training module not found');
    }

    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Find existing completion
    const existingCompletion = await TrainingCompletion.findOne({
      where: {
        userId,
        moduleId
      }
    });

    let completion: TrainingCompletion;

    if (existingCompletion) {
      // Update existing completion
      await existingCompletion.update({
        score,
        completedAt: new Date()
      });
      completion = existingCompletion;
    } else {
      // Create new completion
      completion = await TrainingCompletion.create({
        moduleId,
        userId,
        score,
        completedAt: new Date()
      });
    }

    logger.info(`Training completion recorded: ${module.title} for user ${userId}`);
    return completion;
  } catch (error) {
    logger.error('Error recording training completion:', error);
    throw error;
  }
}

/**
 * Get user training progress
 */
export async function getUserTrainingProgress(userId: string) {
  try {
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const completions = await TrainingCompletion.findAll({
      where: { userId },
      include: [
        {
          model: TrainingModule,
          as: 'module',
          where: { isActive: true },
          required: true
        }
      ],
      order: [['completedAt', 'DESC']]
    });

    const totalModules = await TrainingModule.count({ where: { isActive: true } });
    const requiredModules = await TrainingModule.count({
      where: { isActive: true, isRequired: true }
    });

    const completedRequired = completions.filter(
      (c: any) => c.module.isRequired
    ).length;

    return {
      completions,
      totalModules,
      completedModules: completions.length,
      requiredModules,
      completedRequired,
      completionPercentage: totalModules > 0 ? (completions.length / totalModules) * 100 : 0
    };
  } catch (error) {
    logger.error('Error fetching user training progress:', error);
    throw error;
  }
}
