/**
 * Database Providers
 *
 * Factory providers for database connections and related services.
 */

import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize';
import { DATABASE_CONNECTION } from '../tokens/database.tokens';

export const databaseProviders: Provider[] = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (configService: ConfigService): Promise<Sequelize> => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get<string>('database.host', 'localhost'),
        port: configService.get<number>('database.port', 5432),
        username: configService.get<string>('database.username', 'postgres'),
        password: configService.get<string>('database.password', 'password'),
        database: configService.get<string>('database.name', 'education_db'),
        logging: configService.get<boolean>('database.logging', false)
          ? (sql: string) => console.log(sql)
          : false,
        pool: {
          max: configService.get<number>('database.pool.max', 10),
          min: configService.get<number>('database.pool.min', 2),
          acquire: configService.get<number>('database.pool.acquire', 30000),
          idle: configService.get<number>('database.pool.idle', 10000)
        },
        define: {
          timestamps: true,
          underscored: true,
          freezeTableName: true
        }
      });

      try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
      }

      return sequelize;
    },
    inject: [ConfigService]
  }
];
