import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "src/user/dto/user.dto";
import { UseLoginDto } from "src/user/dto/userLogin.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { User } from "src/typeorm/entity/User";
import { UserUpdateDto } from "src/user/dto/userUpdate.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Token } from "src/typeorm/entity/Token";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        @InjectRepository(Token)
        private tokenRepo: Repository<Token>
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
                await this.addToken(user.name, accessToken);
                return {
                    token: accessToken
                }
            }
            else throw new UnauthorizedException('Password does not match.');
        }
        else throw new NotFoundException('User not found');
    }
    async logout(userName: string){
        if (userName == "") throw new ConflictException("User name is empty");
        const user = await this.tokenRepo.findOne({where:{name : userName}});
        this.tokenRepo.remove(user);
        return { status: 'success', message: "Logout successfully." }
    }
    async getInforByName(userName: string): Promise<User> {
        return this.userService.findUserByName(userName);
    }
    async addToken(userName:string, token: string) {
        const newToken = this.tokenRepo.create({ name: userName, token: token });
        return this.tokenRepo.save(newToken);
     }
}