import { Module } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/typeorm/entity/User";
@Module({
    imports: [ConfigModule.forRoot(),JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('SECRET_KEY')
        }),
      }),UserModule,TypeOrmModule.forFeature([User])],
    controllers: [AuthController],
    providers: [AuthService,ConfigService]
}) export class AuthModule { }