import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "src/user/dto/user.dto";
import { UseLoginrDto } from "src/user/dto/userLogin.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { User } from "src/typeorm/entity/User";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) { }
    async register(user: UserDto) {
        if (await this.userService.findUserByName(user.name) != null){
            throw new ConflictException("This username already exists.")
        }
        else {
            user.password = await bcrypt.hash(user.password,10);
            await this.userService.registerUser(user);
            return {status: 'success',message: "User registered successfully."}
        }
    }
    async login(user: UseLoginrDto): Promise<{ token: string }> {
        const userLogin = await this.userService.findUserByName(user.name);
        if (userLogin) {
            const isMatch = await bcrypt.compare(user.password, userLogin.password);
            if (isMatch) {
                const payload = { username: user.name }
                return {
                    token: await this.jwtService.signAsync(payload)
                }
            }
            else throw new UnauthorizedException('Password does not match.');
        }
        else throw new NotFoundException('User not found');
    }
    async getInforByName(userName: string): Promise<User> {
        return this.userService.findUserByName(userName);
    }
}