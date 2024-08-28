import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm/entity/User";
import { Repository } from "typeorm";
import { UserUpdateDto } from "./dto/userUpdate.dto";

@Injectable()
export class UserService {
   constructor(@InjectRepository(User)
   private userRepo: Repository<User>
   ) { }
   async registerUser(newUser: UserDto): Promise<UserDto> {
      const user = this.userRepo.create(newUser);
      return await this.userRepo.save(user);
   }
   async findUserByName(userName: string): Promise<User> {
      const user = await this.userRepo.findOne({ where: { name: userName } });
      return user;
   }
   async findUserByEmail(email: string): Promise<User> {
      const user = await this.userRepo.findOne({ where: { email: email } });
      return user;
   }
   async updateUser(user: UserUpdateDto): Promise<void> {
      const filteredData = Object.fromEntries(Object.entries(user).filter(([_, value]) => value !== undefined));
      const result = await this.userRepo.update({ name: user.name }, filteredData);
      if (result.affected === 0) {
         throw new Error('User update failed');
      }
   }

}