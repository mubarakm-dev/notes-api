import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { NotesService } from './notes.service';
import { CreateNoteDTO } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {

    user: {
        userId: string;
        email: string;
        role: string;
    };
}

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
    constructor(private readonly notesService: NotesService){}

    @Get()
    findAll(@Req() req: RequestWithUser){
        return this.notesService.findAll(req.user.userId)
    }

    @Post()
    create(@Body()dto: CreateNoteDTO, @Req() req: RequestWithUser){
    return this.notesService.create(dto, req.user.userId)

    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe)  id: string, @Req() req: RequestWithUser){
        return this.notesService.findOne(id, req.user.userId)
    }

    @Patch(":id")
    update(@Param("id", ParseUUIDPipe) id:string, @Req() req: RequestWithUser, @Body() dto:UpdateNoteDto){
        return this.notesService.update(id, req.user.userId, dto )
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id', ParseUUIDPipe) id:string, @Req() req: RequestWithUser ){
        return this.notesService.remove(id, req.user.userId)

    }
   
}
