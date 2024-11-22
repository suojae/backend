import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as process from 'node:process';

export const mysqlConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || 3306,
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_DATABASE || '',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
