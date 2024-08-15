import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('user') export class UserController{
    constructor(private userService: UserService){}
    @Post('create')
    registerUser(@Body() user: UserDto){
        console.log(user);
        this.userService.registerUser(user);    
    }
}
