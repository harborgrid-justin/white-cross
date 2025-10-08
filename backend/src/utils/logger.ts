import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // If there's a stack trace, include it
    if (stack) {
      log += `\n${stack}`;
    }
    
    // If there's additional metadata, include it
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

const baseLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'white-cross-api' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  baseLogger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Create a custom logger wrapper with proper error handling
export const logger = {
  info: baseLogger.info.bind(baseLogger),
  warn: baseLogger.warn.bind(baseLogger),
  debug: baseLogger.debug.bind(baseLogger),
  error: (message: string, error?: Error | unknown) => {
    if (error instanceof Error) {
      baseLogger.error(message, { error: error.message, stack: error.stack });
    } else if (error && typeof error === 'object') {
      baseLogger.error(message, { error: JSON.stringify(error) });
    } else if (error) {
      baseLogger.error(`${message} ${error}`);
    } else {
      baseLogger.error(message);
    }
  }
};
