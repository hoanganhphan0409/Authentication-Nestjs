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
      try {
         const user = this.userRepo.create(newUser);
         return await this.userRepo.save(user);
      } catch (error) {
         throw new Error('Could not register user');
      }
   }
   async findUserByName(userName: string): Promise<User> {
      try {
         const user = await this.userRepo.findOne({ where: { name: userName } });
         if (!user) {
            throw new Error('User not found');
         }
         return user;
      } catch (error) {
         throw new Error('Could not find user');
      }
   }

   async updateUser(user: UserUpdateDto): Promise<void> {
      try {
         const filteredData = Object.fromEntries(Object.entries(user).filter(([_, value]) => value !== undefined));
         const result = await this.userRepo.update({ name: user.name }, filteredData);
         if (result.affected === 0) {
            throw new Error('User update failed');
         }
      } catch (error) {
         throw new Error('Could not update user');
      }
   }

}