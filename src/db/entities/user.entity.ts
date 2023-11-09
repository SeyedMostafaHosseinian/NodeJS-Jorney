import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    username: string;

    @Column()
    age: number;

    @Column()
    job: string;

    @Column ()
    password: string;

    @PrimaryColumn()
    email: string;

    @PrimaryColumn()
    phoneNumber: string
}