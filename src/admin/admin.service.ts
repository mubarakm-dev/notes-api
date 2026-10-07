import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from "../database/schema"
import { count, eq } from 'drizzle-orm';
import { DB } from '../database/database.module';
import { FindNotesDto } from '../common/pagination/find-notes.dto/find-notes.dto';

@Injectable()
export class AdminService {
    constructor(@Inject(DB) private readonly db: NodePgDatabase<typeof schema>) { }

    async findUserWithNotes(userId: string, dto:FindNotesDto) {


        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.id, userId),
            with: { notes: true }

        })

        if (!user) {
            throw new NotFoundException(`The user with id ${userId} can not be found`)
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            notes: user.notes,
        }
    }

    async getStats(){
        const [{userCount}] = await this.db.select({userCount: count()}).from(schema.users)

        const [{noteCount}] = await this.db.select({noteCount: count()}).from(schema.notes)

        return{
            totalUsers: userCount,
            totalNotes: noteCount
        }
    }

}
