import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import * as schema from "./schema"
import { drizzle } from "drizzle-orm/node-postgres";


export const DB = 'DB_CONNECTION';


@Global()
@Module({
    providers:[{
        provide: DB,
        inject: [ConfigService],
        useFactory:(config:ConfigService)=>{
            const pool = new Pool({
                connectionString: config.getOrThrow<string>("DATABASE_URL"),
            });

            return drizzle(pool, {schema})

        }

    }],
    exports: [DB]
})

export class DatabaseModule {}