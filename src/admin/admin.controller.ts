import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles/roles.guard';
import { AdminService } from './admin.service';
import { Roles } from '../common/roles/roles.decorator';
import { FindNotesDto } from '../common/pagination/find-notes.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('/users/:id/notes')
    findUserNotes(@Param('id', ParseUUIDPipe) id: string, @Query() query: FindNotesDto) {

        return this.adminService.findUserWithNotes(id, query);

    }

    @Get('/stats')
    getStats() {
        return this.adminService.getStats()
    }



}
