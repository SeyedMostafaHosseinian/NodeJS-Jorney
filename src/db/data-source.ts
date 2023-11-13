import {DataSource} from "typeorm";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";

export abstract class AppDataSource {
    public static dataSource: DataSource;

    static createDataSource(): DataSource {
        this.dataSource = new DataSource({
            type: "postgres",
            host: "localhost",
            port: process.env?.DB_PORT ? +process.env?.DB_PORT : 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            synchronize: true,
            logging: false,
            entities: ['src/db/entities/**/*.ts',],
            subscribers: [],
            migrations: [],
        } as PostgresConnectionOptions)
        return this.dataSource;
    }
}
