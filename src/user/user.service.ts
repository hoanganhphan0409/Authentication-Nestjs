import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm/entity/User";
import { Repository } from "typeorm";
@Injectable()
export class UserService{
   private users = [{name:"hoanganh123",password:"hoang"}, {name: "hehaha123",password:"122222"}];
   constructor(@InjectRepository(User)
   private userRepo: Repository<User>
   ){}
   allUsers() :string{
      return JSON.stringify(this.users);
   }
   async registerUser(newUser : UserDto) : Promise<UserDto>{
      const user = this.userRepo.create(newUser);
      return this.userRepo.save(user);
   }
   async findUserByName(userName : string): Promise<UserDto | null>{
      return this.userRepo.findOne({ where: {name: userName } });      
   }
}