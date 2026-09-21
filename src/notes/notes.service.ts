import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB } from '../database/database.module';
import * as schema from "../database/schema"
import { CreateNoteDTO } from './dto/create-note.dto';
import { eq } from 'drizzle-orm';
import { UpdateNoteDto } from './dto/update-note.dto';


@Injectable()
export class NotesService {
    constructor(@Inject(DB) private readonly db: NodePgDatabase<typeof schema>) { }

    async findAll() {
        return this.db.select().from(schema.notes)
    }

    async create(dto: CreateNoteDTO, userId: string) {
        const [note] = await this.db.insert(schema.notes).values({
            ...dto,
            userId
        }).returning()

        return note;
    }

    async findOne(id: string) {
        const [note] = await this.db.select().from(schema.notes).where(eq(schema.notes.id, id));

        if (!note) {
            throw new NotFoundException(`Note with id ${id} not found`)
        }

        return note
    }


    async update(id: string, dto: UpdateNoteDto) {
        const [note] = await this.db.update(schema.notes).set({ ...dto, updatedAt: new Date() }).where(eq(schema.notes.id, id)).returning()

        if (!note) {
            throw new NotFoundException(`Note with id ${id} not found`)
        }

        return note
    }

    async remove(id: string) {
        const [note] = await this.db.delete(schema.notes).where(eq(schema.notes.id, id)).returning()

        if (!note) {
            throw new NotFoundException(`Note with id ${id} not found`)
        }

    }

}

