
import { Type as TransformType } from "class-transformer";
import { IsIn, IsOptional, IsPositive } from "class-validator";



export class FindNotesDto {
    @IsOptional()
    @TransformType(() => Number)
    @IsPositive()
    page?: number = 1


    @IsOptional()
    @TransformType(() => Number)
    @IsPositive()
    limit?: number = 10


    @IsOptional()
    @IsIn(['asc', 'desc'])
    sort?: 'asc' | 'desc' = "desc"
}