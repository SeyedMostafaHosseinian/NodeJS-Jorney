import {DataSource} from "typeorm";

export function createDataSource() {
    return new DataSource({
        type: "postgres",
        host: "localhost",
        port: process.env?.DB_PORT ? +process.env?.DB_PORT : 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: true,
        entities: [],
        subscribers: [],
        migrations: [],
    })
}