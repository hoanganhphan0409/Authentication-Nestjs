import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './typeorm/entity/User';
import { Token } from './typeorm/entity/Token';
@Module({
  imports: [ConfigModule.forRoot({isGlobal : true}),TypeOrmModule
    .forRootAsync({imports:[ConfigModule],inject:[ConfigService],useFactory:(configService: ConfigService)=>({
      type:"mysql",
      host:configService.get<string>("DATABASE_HOST"),
      port: configService.get<number>("DATABASE_HOST"),
      username: configService.get<string>("DATABASE_USER_NAME"),
      password: configService.get<string>("DATABASE_PASSWORD"),
      database: configService.get<string>("DATABASE_NAME"),
      entities: [User, Token],
      synchronize: true
    })}),UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
