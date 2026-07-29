export const loggerConfig = {
  provider: 'pino',
  level: 'info',
} as const;

export type LoggerConfig = typeof loggerConfig;
