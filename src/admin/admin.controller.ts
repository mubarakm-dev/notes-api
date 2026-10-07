import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { AdminService } from './admin.service';
import { Roles } from 'src/common/roles/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService){}

    @Get('/users/:id/notes')
    @Roles('admin')
    findUserNotes(@Param('id', ParseUUIDPipe) id:string){

        return this.adminService.findUserWithNotes(id);

    }
     

}
