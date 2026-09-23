import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB } from '../database/database.module';
import * as schema from "../database/schema"
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
    constructor(@Inject(DB) private readonly db: NodePgDatabase<typeof schema>){}


    async findByEmail(email: string){
        const [user] = await this.db.select().from(schema.users).where(eq(schema.users.email, email))
        return user;
    }

    async create(email: string, passwordHash:string){
        const [user] = await this.db.insert(schema.users).values({email, passwordHash}).returning()

        return user;

    }
}
