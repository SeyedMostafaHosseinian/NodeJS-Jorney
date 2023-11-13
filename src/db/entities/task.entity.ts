import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {TaskStatusEnum} from "../interfaces";

import {UserEntity} from "./user.entity";


@Entity()
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @PrimaryColumn('varchar')
    displayId: string

    @Column({
        type: 'enum',
        enum: TaskStatusEnum,
        default: TaskStatusEnum.TODO
    })
    status: TaskStatusEnum

    @Column('varchar')
    title: string

    @Column('varchar')
    description: string

    @ManyToOne(
        () => UserEntity,
        (user) => user.tasks,
        {
            nullable: true,
            onDelete: "SET NULL"
        }
    )
    assignee: UserEntity

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}