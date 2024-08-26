import { Body, Controller, Post, Get, Headers, Request, UseGuards, Patch} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDto } from "src/user/dto/user.dto";
import { UseLoginDto } from "src/user/dto/userLogin.dto";
import { AuthGuard } from "./auth.guard";
import { UserUpdateDto } from "src/user/dto/userUpdate.dto";
import { AuthGuardRefresh } from "./auth.guard.refresh";

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
        const {password,id, ...remain} = user
        return remain
    }
    @UseGuards(AuthGuard)
    @Patch("update")
    async updateUser(@Body() user: UserUpdateDto){
        return this.authService.update(user)
    }
    @Post('logout')
    @UseGuards(AuthGuard)
    async logout(@Headers() headers){
        return this.authService.logout(headers.authorization?.split(' ')[1]);
    }
    @Post("refresh")
    @UseGuards(AuthGuardRefresh)
    async refreshToken(@Headers() headers, @Request() req){
        return this.authService.refreshToken(req.user.username);
    }
}