import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class UserDto{
    @IsNotEmpty()
    name : string;
    @IsNotEmpty()
    password : string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNumber()
    age: number;
    @IsNotEmpty()
    role: string;
}