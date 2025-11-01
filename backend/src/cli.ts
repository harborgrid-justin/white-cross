#!/usr/bin/env node

import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule, ['warn', 'error', 'log']);
}

bootstrap().catch((error) => {
  console.error('Failed to run command:', error);
  process.exit(1);
});
