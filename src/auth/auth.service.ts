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
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private configService: ConfigService,
        @Inject(CACHE_MANAGER)
        private readonly cacheService: Cache
    ) { }
    async register(user: UserDto) {
        if (await this.userService.findUserByName(user.name)) {
            throw new ConflictException("This username already exists.")
        }
        else if (await this.userService.findUserByEmail(user.email)) {
            throw new ConflictException("This email already exists.")
        }
        else {
            user.password = await bcrypt.hash(user.password,10);
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
    async login(user: UseLoginDto): Promise<{ access_token: string, refresh_token: string }> {
        const userLogin = user.name != undefined?
            await this.userService.findUserByName(user.name) : await this.userService.findUserByEmail(user.email) ;
        if (userLogin) {
            const isMatch = await bcrypt.compare(user.password, userLogin.password);
            if (isMatch) {
                return await this.genToken(user.name);
            }
            else throw new UnauthorizedException('Password does not match.');
        }
        else throw new NotFoundException('User not found');
    }
    async genToken(name: string) {
        const payload = { username: name };
        const accessToken = await this.jwtService.signAsync(
            payload,
            {
                secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
                expiresIn: '15m',
            },
        );

        const refreshToken = await this.jwtService.signAsync(
            payload,
            {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
                expiresIn: '7d',
            },
        );
        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }
    async logout(token: string) {
        try {
            await this.cacheService.set(token, "blacklisted", 50000);
        }
        catch (error) {
            throw new Error('Logout failed');
        }
        return { status: 'success', message: "Logout successfully." }
    }

    async refreshToken(username: string) {
        try {
            return await this.genToken(username);
        }
        catch (error) {
            throw new Error('Refresh token failed');
        }
    }

    async getInforByName(userName: string): Promise<User> {
        return this.userService.findUserByName(userName);
    }
}