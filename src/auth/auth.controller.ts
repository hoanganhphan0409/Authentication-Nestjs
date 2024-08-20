import { Body, Controller, Post, Get, Headers, Request, UseGuards, Patch} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDto } from "src/user/dto/user.dto";
import { UseLoginDto } from "src/user/dto/userLogin.dto";
import { AuthGuard } from "./auth.guard";
import { UserUpdateDto } from "src/user/dto/userUpdate.dto";

@Controller('auth')
export class AuthController{
    constructor(private authService : AuthService){}
    @Post('register')
    async registerUser(@Body() user: UserDto){
        return this.authService.register(user);
    }
    @Post('login')
    async login(@Body() user : UseLoginDto){
        return this.authService.login(user);
    }
    @UseGuards(AuthGuard)
    @Get("infor")
    async getInforUser(@Request() req){
        const user = await this.authService.getInforByName(req.user.username);
        return {name: user.name, email: user.email, age: user.age, role: user.role };
    }
    @UseGuards(AuthGuard)
    @Patch("update")
    async updateUser(@Body() user: UserUpdateDto){
        return this.authService.update(user)
    }
}