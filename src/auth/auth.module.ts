import { Module } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
//import { AuthController } from "./auth.controller";
@Module ({
    imports:[],
    //controllers: [AuthController],
    providers: [AuthService, UserService]
}) export class AuthModule{}