import { IsNotEmpty, IsEmail, ValidateIf } from "class-validator";

export class UseLoginDto {
    @ValidateIf(o => !o.email)
    @IsNotEmpty()
    name: string;

    @ValidateIf(o => !o.name) 
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
