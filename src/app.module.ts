import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import {TypeOrmModule} from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './typeorm/entity/User';
@Module({
  imports: [ConfigModule.forRoot({isGlobal : true}),TypeOrmModule
    .forRootAsync({imports:[ConfigModule],inject:[ConfigService],useFactory:(configService: ConfigService)=>({
      type:"mysql",
      host:"localhost",
      port: 3306,
      username:"root",
      password:"hoanganh123",
      database:"mapx",
      entities: [User],
      synchronize: true
    })})],
  controllers: [AppController,UserController,AuthController],
  providers: [AppService,UserService,AuthService],
})
export class AppModule {}
