import { IsNotEmpty } from "class-validator";

export class UseLoginDto{
    @IsNotEmpty()
    name : string;
    @IsNotEmpty()
    password : string;
}