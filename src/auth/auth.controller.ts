import { Body, Controller, Post, Get, Headers, Request, UseGuards} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDto } from "src/user/dto/user.dto";
import { UseLoginrDto } from "src/user/dto/userLogin.dto";
import { AuthGuard } from "./auth.guard";

@Controller('auth')
export class AuthController{
    constructor(private authService : AuthService){}
    @Post('register')
    async registerUser(@Body() user: UserDto){
        return this.authService.register(user);
    }
    @Post('login')
    async login(@Body() user : UseLoginrDto){
        return this.authService.login(user);
    }
    @UseGuards(AuthGuard)
    @Get("infor")
    async getInforUser(@Request() req){
        const user = await this.authService.getInforByName(req.user.username);
        return {name: user.name, email: user.email, age: user.age, role: user.role };
    }
}