import { IsString, MinLength } from "class-validator";



export class CreateNoteDTO {
    @IsString()
    @MinLength(5)
    title!: string;
    
    @IsString()
    body!: string;
}