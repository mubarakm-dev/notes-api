import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { string } from "joi";


export class SignupDto{
     @IsEmail()
    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(7)
    password!: string;
}
   

