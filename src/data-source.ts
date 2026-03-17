import "reflect-metadata"
import { DataSource } from "typeorm"
import { config } from "dotenv"

config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: ["src/infra/database/entities/*.ts"],
    migrations: ["src/infra/database/migrations/*.ts"],
    subscribers: [],
})
