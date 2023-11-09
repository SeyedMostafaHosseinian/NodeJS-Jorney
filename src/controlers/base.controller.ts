import {Repository} from "typeorm";
import {UserEntity} from "../db/entities/user.entity";

export abstract class BaseController {
    userRepository: Repository<UserEntity>

    constructor(public baseRoute: string) {
    }

}