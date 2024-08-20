import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm/entity/User";
import { Repository } from "typeorm";

@Injectable()
export class UserService{
   constructor(@InjectRepository(User)
   private userRepo: Repository<User>
   ){}
   async registerUser(newUser : UserDto) : Promise<UserDto>{
      const user = this.userRepo.create(newUser);
      return this.userRepo.save(user);
   }
   async findUserByName(userName : string): Promise<User>{
      return this.userRepo.findOne({ where: {name: userName } });      
   }
}