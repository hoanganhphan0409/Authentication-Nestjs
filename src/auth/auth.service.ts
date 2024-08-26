import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "src/user/dto/user.dto";
import { UseLoginDto } from "src/user/dto/userLogin.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { User } from "src/typeorm/entity/User";
import { UserUpdateDto } from "src/user/dto/userUpdate.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,

        @Inject(CACHE_MANAGER)
        private readonly cacheService: Cache
    ) { }
    async register(user: UserDto) {
        if (await this.userService.findUserByName(user.name)) {
            throw new ConflictException("This username already exists.")
        }
        else {
            user.password = await bcrypt.hash(user.password, 10);
            await this.userService.registerUser(user);
            return { status: 'success', message: "User registered successfully." }
        }
    }
    async update(user: UserUpdateDto) {
        if (await this.userService.findUserByName(user.name) == null) {
            throw new NotFoundException('User not found');
        }
        else {
            if (user.password != undefined)
                user.password = await bcrypt.hash(user.password, 10);
            await this.userService.updateUser(user);
            return { status: 'success', message: "User updated successfully." }
        }
    }
    async login(user: UseLoginDto): Promise<{ token: string }> {
        const userLogin = await this.userService.findUserByName(user.name);
        if (userLogin) {
            const isMatch = await bcrypt.compare(user.password, userLogin.password);
            if (isMatch) {
                const payload = { username: user.name };
                const accessToken = await this.jwtService.signAsync(payload);
                return {
                    token: accessToken
                }
            }
            else throw new UnauthorizedException('Password does not match.');
        }
        else throw new NotFoundException('User not found');
    }
    async logout(token: string) {
        try {
            await this.cacheService.set(token, "blacklisted", 100000);
        }
        catch (error) {
            throw new Error('Logout failed');
        }
        return { status: 'success', message: "Logout successfully." }
    }
    async getInforByName(userName: string): Promise<User> {
        return this.userService.findUserByName(userName);
    }
}