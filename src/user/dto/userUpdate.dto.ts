import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UserUpdateDto{
    @IsNotEmpty()
    name : string;
    @IsNotEmpty()
    @IsOptional()
    password? : string;
    @IsNotEmpty()
    @IsOptional()
    @IsEmail()
    email?: string;
    @IsOptional()
    @IsNumber()
    age?: number;
    @IsNotEmpty()
    @IsOptional()
    role?: string;
}