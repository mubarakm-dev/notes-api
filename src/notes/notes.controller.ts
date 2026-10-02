import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDTO } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user/current-user.decorator';
import type {CurrentUserPayload } from '../common/current-user/current-user.decorator';
import { FindNotesDto } from './dto/find-notes.dto';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
    constructor(private readonly notesService: NotesService){}

    @Get()
    findAll(@CurrentUser() user: CurrentUserPayload, @Query() query:FindNotesDto){
        return this.notesService.findAll(user.userId, query)
    }

    @Post()
    create(@Body() dto: CreateNoteDTO, @CurrentUser() user: CurrentUserPayload){
    return this.notesService.create(dto, user.userId)

    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe)  id: string,  @CurrentUser() user: CurrentUserPayload){
        return this.notesService.findOne(id, user.userId)
    }

    @Patch(":id")
    update(@Param("id", ParseUUIDPipe) id:string,  @CurrentUser() user: CurrentUserPayload, @Body() dto:UpdateNoteDto){
        return this.notesService.update(id, user.userId, dto )
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id', ParseUUIDPipe) id:string,  @CurrentUser() user: CurrentUserPayload){
        return this.notesService.remove(id, user.userId)

    }
   
}
