import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity()
export class PassportEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    country: string

    @Column('varchar')
    birthPlace: string;

    @OneToOne(() => UserEntity, (user) => user.passport)
    user: UserEntity

}