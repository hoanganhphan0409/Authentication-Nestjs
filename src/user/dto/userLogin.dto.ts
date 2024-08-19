import { IsNotEmpty } from "class-validator";

export class UseLoginrDto{
    @IsNotEmpty()
    name : string;
    @IsNotEmpty()
    password : string;
}