import { ConflictException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) {}
    async signup(dto: SignupDto){
        const existingUser = await this.userService.findByEmail(dto.email)

        if(existingUser){
            throw new ConflictException("Email already in use")
        }

       const passwordHash = await bcrypt.hash(dto.password, 10)
        const user = await this.userService.create(dto.email, passwordHash)

        return{id: user?.id, email: user?.email}


    }
}
