import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "src/user/dto/user.dto";
import { UseLoginrDto } from "src/user/dto/userLogin.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) { }
    async register(user: UserDto) {
        if (this.userService.findUserByName(user.name))
            console.log("user already exsited");
        else {
            user.password = await bcrypt.hash(user.password,10);
            this.userService.registerUser(user);
            console.log("register successful");
        }
    }
    async login(user: UseLoginrDto): Promise<{ token: string }> {
        const userLogin = this.userService.findUserByName(user.name);
        if (userLogin) {
            const isMatch = await bcrypt.compare(user.password, userLogin.password);
            if (isMatch) {
                console.log("login successful");
                const payload = { username: user.name }
                return {
                    token: await this.jwtService.signAsync(payload)
                }
            }
            else console.log("password does not match");
        }
        else console.log("user does not existed");
    }
    getInforByName(userName: string) {
        return this.userService.findUserByName(userName);
    }
}