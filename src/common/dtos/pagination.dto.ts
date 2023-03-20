import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @IsOptional()
    @IsPositive()
    @Type(() => Number) // enableImplicitConversions: true en la main
    limit?: number;


    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;

    @IsOptional()
    @Type(() => Boolean)
    
    enable?: boolean;

    @IsOptional()
    @Type(() => Boolean)
    verify?: boolean;
}