import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"tokens"})
export class Token{ 

    @Column({unique:true})
    name: string;

    @Column()
    token: string;
}