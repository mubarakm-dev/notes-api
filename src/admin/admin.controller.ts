import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles/roles.guard';
import { AdminService } from './admin.service';
import { Roles } from '../common/roles/roles.decorator';

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
