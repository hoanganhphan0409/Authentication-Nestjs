import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"tokens"})
export class Token{ 
    @PrimaryGeneratedColumn()
    id: number;
    @Column({unique:true})
    name: string;

    @Column()
    token: string;
}