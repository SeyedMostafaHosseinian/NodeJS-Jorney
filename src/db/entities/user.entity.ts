import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {PassportEntity} from "./passport.entity";

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

    @Column()
    password: string;

    @PrimaryColumn()
    email: string;

    @PrimaryColumn()
    phoneNumber: string

    @OneToOne(() => PassportEntity, (passport) => passport.user)
    @JoinColumn()
    passport: PassportEntity
}