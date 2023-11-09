import {app} from "../main";
import {AppDataSource} from "../db/data-source";
import {UserEntity} from "../db/entities/user.entity";
import {Repository} from "typeorm";
import {BaseController} from "./base.controller";

export class UserController implements BaseController {
    userRepository: Repository<UserEntity>

    constructor(public baseRoute: string) {
        this.userRepository = AppDataSource.dataSource.getRepository(UserEntity);
        this._getUsersListener();
        this._createUserListener();
        this._updateUserListener();
        this._findUserListener()
    }

    private _getUsersListener() {
        app.get(`${this.baseRoute}`, async (req, res, next) => {
            const users = await this.userRepository.find();
            res.send(users)
        })
    }

    private _createUserListener() {
        app.post(`${this.baseRoute}/add`, (req, res, next) => {
            const {age, password, username, job, phoneNumber, email} = req.query;
            const user = new UserEntity();
            if (req.query && age && password && username && job && phoneNumber && email) {
                user.age = +age;
                user.username = username as string;
                user.password = password as string;
                user.job = job as string;
                user.email = email as string;
                user.phoneNumber = phoneNumber as string;
                this.userRepository
                    .save(user)
                    .then(() => {
                        res
                            .status(201)
                            .send(user)
                    });
            } else {
                res
                    .status(400)
                    .send('Bad Request')
            }

        })
    }

    private _findUserListener() {
        app.get(`${this.baseRoute}/:username/:email`, async (req, res, next) => {
            const {username, email} = req.params
            if (req.params && username && email) {
                const users = await this.userRepository.findBy({username: username, email: email})
                res
                    .status(200)
                    .send(users)
            } else {
                res
                    .status(400)
                    .send('Bad Request')
            }
        })
    }

    private _updateUserListener() {
        app.patch(`${this.baseRoute}/update-user/:email`, async (req, res, next) => {
            const { email} = req.params
            const newData = req.body as UserEntity
            const currentUserData = await this.userRepository.findOneBy({email});
            if(
                currentUserData?.age && 
                currentUserData?.job && 
                newData?.age && 
                newData?.job
            ) {
                currentUserData.age = newData.age;
                currentUserData.job = newData.job; 
                const newUser = await this.userRepository.save(currentUserData)
                res.send(newUser);
            }
        })
    } 
}