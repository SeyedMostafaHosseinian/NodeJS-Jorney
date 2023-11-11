import {app} from "../main";
import {AppDataSource} from "../db/data-source";
import {UserEntity} from "../db/entities/user.entity";
import {Repository} from "typeorm";

export class UserController {
    userRepository: Repository<UserEntity>

    constructor(public baseRoute: string) {
        this.userRepository = AppDataSource.dataSource.getRepository(UserEntity);
        this._getUsersListener();
        this._createUserListener();
        this._updateUserListener();
        this._findUserListener();
        this._deleteUserListener();
    }

    private _getUsersListener() {
        app.get(`${this.baseRoute}`, async (req, res, next) => {
            const users = await this.userRepository.find({relations: {passport: true}});
            res.send(users)
        })
    }

    private _createUserListener() {
        app.post(`${this.baseRoute}/add`, async (req, res, next) => {
            const {age, password, username, job, phoneNumber, email} = req.body;

            //check for avoid insert iterate email or phoneNumber
            const exists = await this.userRepository
                .createQueryBuilder('user')
                .where('user.email = :email', {email: email})
                .orWhere('user.phoneNumber = :phoneNumber', {phoneNumber: phoneNumber})
                .getMany();
            if (exists && exists?.length) {
                res
                    .status(409)
                    .send('User already exist');
                return;
            }

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
            const {email} = req.params
            const newData = req.body as UserEntity
            const currentUserData = await this.userRepository.findOneBy({email});
            if (currentUserData) {
                if (
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
            } else {
                res.status(404);
                res.send('User not found');
            }

        })
    }

    private _deleteUserListener() {
        app.delete(`${this.baseRoute}/delete-user`, async (req, res, next) => {
            const {email} = req.body;
            if (!email) {
                res
                    .status(400)
                    .send('Bad Request');

                return;
            }

            const user = await this.userRepository.findOneBy({email: email});
            if (user) {
                const deletedUser = await this.userRepository.remove(user as UserEntity)
                res
                    .status(200)
                    .send(user)

            } else {
                res
                    .status(404)
                    .send('User not found')
            }
        })
    }
}