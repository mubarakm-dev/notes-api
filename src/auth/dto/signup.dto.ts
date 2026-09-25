import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class SignupDto {
    @IsEmail()
    email!: string;

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    @IsString()
    @MinLength(7)
    password!: string;
}


