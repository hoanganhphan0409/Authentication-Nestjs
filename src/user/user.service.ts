import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
@Injectable()
export class UserService{
   private users = [{name:"hoanganh123",password:"hoang"}, {name: "hehaha123",password:"122222"}];
   allUsers() :string{
    return JSON.stringify(this.users);
   }
   registerUser(newUser : UserDto){
        this.users.push(newUser);
   }
}