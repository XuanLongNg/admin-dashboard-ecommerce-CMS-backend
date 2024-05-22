import { ConfigFactory, registerAs } from '@nestjs/config';

export const appConfig: ConfigFactory = registerAs('app', () => ({
  port: process.env.PORT ?? 4000,
  database: {
    type: process.env.DB_CONNECTION ?? 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? '3306',
    database: process.env.DB_DATABASE ?? 'mysql',
    username: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
    strict: process.env.DB_STRICT ?? '',
  },
}));
