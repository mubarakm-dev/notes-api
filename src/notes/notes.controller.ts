import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDTO } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

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

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string){
        return this.notesService.findOne(id)
    }

    @Patch(":id")
    update(@Param("id", ParseUUIDPipe) id:string, @Body() dto:UpdateNoteDto){
        return this.notesService.update(id, dto )
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id', ParseUUIDPipe) id:string ){
        return this.notesService.remove(id)

    }
   
}
