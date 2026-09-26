import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [UsersModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory:(config: ConfigService)=>({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {expiresIn: '15m'}
      })
    })

  ],
  controllers: [AuthController],
  providers: [AuthService],

})
export class AuthModule { }
