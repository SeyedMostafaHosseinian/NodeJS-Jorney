import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {PassportEntity} from "./passport.entity";

import {TaskEntity} from "./task.entity";

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

    @OneToMany(
        () => TaskEntity,
        (task) => task.assignee,
        {nullable: true}
    )
    tasks: TaskEntity[]

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}