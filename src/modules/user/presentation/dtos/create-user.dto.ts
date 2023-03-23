import { Type } from "class-transformer";
import { IsEmail, IsString, Matches, MaxLength, MinLength, IsIn, IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {


    @IsString()
    @MinLength(3)
    userName: string;

    @IsString()
    @MinLength(1)
    firstName: string;

    @IsString()
    @MinLength(1)
    lastName: string;

    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    @MaxLength(50)
    passwordConfirmation?: string;

    @IsDateString()
    @IsNotEmpty()
    birthday: Date;

    @IsIn([
        'man', 'woman', 'prefer not to say'
    ])
    gender: string;

    @IsOptional()
    @Type(() => Boolean)
    
    enable?: boolean;

    @IsOptional()
    @Type(() => Boolean)
    verify?: boolean;

    

}
