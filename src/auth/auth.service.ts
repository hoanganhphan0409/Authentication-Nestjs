import { Injectable } from "@nestjs/common";
import { UserDto } from "src/user/dto/user.dto";
import { UseLoginrDto } from "src/user/dto/userLogin.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService{
    constructor (private userService : UserService){}
    register(user : UserDto){
        if (this.userService.findUserByName(user.name))
            console.log("user already exsited");
        else {
            this.userService.registerUser(user);
            console.log("register successful");
        }
    }
    login(user: UseLoginrDto){
        const userLogin = this.userService.findUserByName(user.name);
        if (userLogin){
            if (user.password == userLogin.password) console.log("login successful");
            else console.log("password does not match");
        } 
        else console.log("user does not existed");
    }
    getInfor(token: string){
    }
}