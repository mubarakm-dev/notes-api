import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB } from '../database/database.module';
import * as schema from "../database/schema"

@Injectable()
export class NotesService {
    constructor(@Inject(DB) private readonly db:NodePgDatabase<typeof schema>){}

    async findAll(){
        return this.db.select().from(schema.notes)
    }
}
