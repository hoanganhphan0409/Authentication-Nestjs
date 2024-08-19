import { Module } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { ConfigModule } from "@nestjs/config";
@Module({
    imports: [JwtModule.register({ global: true, secret: "hoanganh" }),UserModule],
    controllers: [AuthController],
    providers: [AuthService]
}) export class AuthModule { }