import { Body, Controller, Post, Get, Headers} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDto } from "src/user/dto/user.dto";
import { UseLoginrDto } from "src/user/dto/userLogin.dto";

@Controller('auth')
export class AuthController{
    constructor(private authService : AuthService){}
    @Post('register')
    registerUser(@Body() user: UserDto){
        this.authService.register(user);
    }
    @Post('login')
    login(@Body() user : UseLoginrDto){
        this.authService.login(user);
    }
    @Get("infor")
    getInforUser(@Headers() headers){
        //this.authService.
    }
}