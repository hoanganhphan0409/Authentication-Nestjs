import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
@Module({
  imports: [ConfigModule.forRoot(), JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('SECRET_KEY')
    }),
  }),
    UserModule,
  CacheModule.register()],
  controllers: [AuthController],
  providers: [AuthService, ConfigService]
}) export class AuthModule { }