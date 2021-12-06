import {ConnectionOptions} from "typeorm";
import path from "path";

const isCompiled = path.extname(__filename).includes('js')
export default {
    type: process.env.DB_TYPE || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5433,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "example",
    database: process.env.DB_NAME || "postgres",
    synchronize: process.env.DB_SYNC || false,
    logging: process.env.DB_LOGS || false,
    entities: [
        // find all files with a .ts/.js extension, in all subfolders of src/entities
        `src/entities/**/*.${isCompiled ? "js" : "ts"}`
    ],
    migrations: [
        // find all files with a .ts/.js extension, in all subfolders of src/migrations
        `src/migrations/**/*.${isCompiled ? "js" : "ts"}`
    ],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscribers'
    },
} as ConnectionOptions;
