import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import dotenv from 'dotenv';

dotenv.config();
export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: process.env?.DB_PORT ? +process.env?.DB_PORT : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD + '',
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: ["src/db/entities/**/*.ts"],
  migrations: ["src/db/migrations/**/*.ts"],
  subscribers: [],
  migrationsTableName: "migrations",
} as PostgresConnectionOptions);
