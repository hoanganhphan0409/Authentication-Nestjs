import { Body, Controller, Post, Get, Headers, Request, UseGuards} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDto } from "src/user/dto/user.dto";
import { UseLoginrDto } from "src/user/dto/userLogin.dto";
import { AuthGuard } from "./auth.guard";

@Controller('auth')
export class AuthController{
    constructor(private authService : AuthService){}
    @Post('register')
    registerUser(@Body() user: UserDto){
        this.authService.register(user);
    }
    @Post('login')
    login(@Body() user : UseLoginrDto){
        return this.authService.login(user);
    }
    @UseGuards(AuthGuard)
    @Get("infor")
    getInforUser(@Request() req){        
        return this.authService.getInforByName(req.user.username); 
    }
}