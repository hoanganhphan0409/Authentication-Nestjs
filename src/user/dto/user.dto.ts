import { IsEmail, IsNotEmpty } from "class-validator";

export class UserDto{
    @IsNotEmpty()
    name : string;
    @IsNotEmpty()
    password : string;
    // @IsNotEmpty()
    // @IsEmail()
    // email: string;
}