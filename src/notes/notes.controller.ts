import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDTO } from './dto/create-note.dto';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService){}

    @Get()
    findAll(){
        return this.notesService.findAll()
    }

    @Post()
    create(@Body()dto: CreateNoteDTO ){
    const temporaryUserId = 'b7e90404-fcdb-42f7-91dd-2a413799b58b';
    return this.notesService.create(dto, temporaryUserId)

    }
   
}
