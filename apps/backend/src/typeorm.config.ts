import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const isSQLite = process.env.DB_TYPE === 'sqlite' || !process.env.DATABASE_URL;

const sqliteConfig: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'dev.db',
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
};

const postgresConfig: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  ssl:
    process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : false,
};

export default new DataSource(isSQLite ? sqliteConfig : postgresConfig);
