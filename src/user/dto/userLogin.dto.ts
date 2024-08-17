import { IsNotEmpty } from "class-validator";

export class UseLoginrDto{
    @IsNotEmpty()
    name : string;
    @IsNotEmpty()
    password : string;
    // @IsNotEmpty()
    // @IsEmail()
    // email: string;
}