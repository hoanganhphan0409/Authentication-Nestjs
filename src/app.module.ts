import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './typeorm/entity/User';
@Module({
  // imports: [ConfigModule.forRoot({isGlobal : true}),TypeOrmModule
  //   .forRootAsync({imports:[ConfigModule],inject:[ConfigService],useFactory:(configService: ConfigService)=>({
  //     type:"mysql",
  //     host:"localhost",
  //     port: 3306,
  //     username:"root",
  //     password:"hoanganh123",
  //     database:"mapx",
  //     entities: [User],
  //     synchronize: true
  //   })})],
  imports: [UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
