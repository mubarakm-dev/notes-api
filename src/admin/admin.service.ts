import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from "../database/schema"
import { eq } from 'drizzle-orm';
import { DB } from 'src/database/database.module';

@Injectable()
export class AdminService {
    constructor(@Inject(DB) private readonly db:NodePgDatabase<typeof schema >){}

    async findUserWithNotes(userId: string){

        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.id, userId),
            with: {notes:true}

        })

        if(!user){
            throw new NotFoundException(`The user with id ${userId} can not be found`)
        }

        return user

    }

}
