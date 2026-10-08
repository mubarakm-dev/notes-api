import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from "../database/schema"
import { asc, count, desc, eq } from 'drizzle-orm';
import { DB } from '../database/database.module';
import { FindNotesDto } from '../common/pagination/find-notes.dto';

@Injectable()
export class AdminService {
    constructor(@Inject(DB) private readonly db: NodePgDatabase<typeof schema>) { }

    async findUserWithNotes(userId: string, query: FindNotesDto) {
        const { page = 1, limit = 10, sort = 'desc' } = query;
        const offset = (page - 1) * limit

        const [user] = await this.db.select().from(schema.users).where(eq(schema.users.id, userId))

        if (!user) {
            throw new NotFoundException(`The user with id ${userId} can not be found`)
        }

        const userNotes = await this.db.select().from(schema.notes)
            .where(eq(schema.notes.userId, userId))
            .orderBy(sort === 'asc' ? asc(schema.notes.createdAt) : desc(schema.notes.createdAt))
            .limit(limit)
            .offset(offset);

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            notes: userNotes,
        }
    }

    async getStats() {
        const userRows = await this.db.select({ userCount: count() }).from(schema.users);
        const noteRows = await this.db.select({ noteCount: count() }).from(schema.notes);

        return {
            totalUsers: userRows[0]!.userCount,
            totalNotes: noteRows[0]!.noteCount,
        }
    }


}
