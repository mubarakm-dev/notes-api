import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { }
    async signup(dto: SignupDto) {
        const existingUser = await this.userService.findByEmail(dto.email)

        if (existingUser) {
            throw new ConflictException("Email already in use")
        }

        const passwordHash = await bcrypt.hash(dto.password, 10)
        const user = await this.userService.create(dto.email, passwordHash)

        return { id: user?.id, email: user?.email }


    }

    async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email)
        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        const isMatch = await bcrypt.compare(dto.password, user.passwordHash)
        if (!isMatch) {
            throw new UnauthorizedException("Invalid credentials")
        }
        const payload = { sub: user.id, email: user.email, role:user.role };
        const accessToken = await this.jwtService.signAsync(payload)

        return {id:user.id, email: user.email, token: accessToken };


        
    }
}
