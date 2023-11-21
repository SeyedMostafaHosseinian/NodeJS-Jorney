import { app } from "../main";
import dataSource from "../db/data-source";
import { UserEntity } from "../db/entities/user.entity";
import { Repository } from "typeorm";
import { TaskEntity } from "../db/entities/task.entity";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthController {
  userRepository: Repository<UserEntity>;
  taskRepository: Repository<TaskEntity>;

  constructor(public baseRoute: string) {
    this.userRepository = dataSource.getRepository(UserEntity);
    this.taskRepository = dataSource.getRepository(TaskEntity);

    this._getUsersListener();
    this._signupListener();
    this._loginListener();
    this._updateUserListener();
    this._findUserListener();
    this._deleteUserListener();
  }

  private _getUsersListener() {
    app.get(`${this.baseRoute}`, async (req, res, next) => {
      const users = await this.userRepository.find({
        relations: {
          passport: true,
          tasks: true,
        },
      });
      res.send(users);
    });
  }

  private _signupListener() {
    app.post(`${this.baseRoute}/signup`, async (req, res, next) => {
      const { age, password, username, job, phoneNumber, email } = req.body;

      //check for avoid insert iterate email or phoneNumber
      const exists = await this.userRepository
        .createQueryBuilder("user")
        .where("user.email = :email", { email: email })
        .orWhere("user.phoneNumber = :phoneNumber", {
          phoneNumber: phoneNumber,
        })
        .getMany();
      if (exists && exists?.length) {
        res.status(409).send("User already exist");
        return;
      }

      const user = new UserEntity();
      if (
        req.query &&
        age &&
        password &&
        username &&
        job &&
        phoneNumber &&
        email
      ) {
        user.age = +age;
        user.username = username as string;
        user.password = await bycrypt.hash(password, 10);
        user.job = job as string;
        user.email = email as string;
        user.phoneNumber = phoneNumber as string;
        this.userRepository.save(user).then(() => {
          const accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
          if (!accessTokenSecretKey) return;
          const accesToken = jwt.sign({ ...user }, accessTokenSecretKey, {
            expiresIn: process.env.TOKEN_EXPIRY || 30,
          });
          res
            .status(201)
            .cookie("accessToken", accesToken, { httpOnly: true })
            .send(user);
        });
      } else {
        res.status(400).send("Bad Request");
      }
    });
  }
  private _loginListener() {
    app.post(`${this.baseRoute}/login`, async (req, res, next) => {
      const { password, email } = req.body;
      if (!email || !password) {
        res.status(400).send("Bad Request");
        return;
      }
      const user = await this.userRepository.findOneBy({ email: email });
      if (!user) {
        res.status(404).send("user not found");
        return;
      }

      const validation = await bycrypt.compare(password, user.password);
      const accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;

      if (!accessTokenSecretKey) return;
      if (validation) {
        const accesToken = jwt.sign({ ...user }, accessTokenSecretKey, {
          expiresIn: process.env.TOKEN_EXPIRY || 30,
        });

        res
          .status(200)
          .cookie("accessToken", accesToken, { httpOnly: true })
          .send(user);
        return;
      } else {
        res.status(401).send("password is invalid");
      }
    });
  }

  private _findUserListener() {
    app.get(`${this.baseRoute}/:username/:email`, async (req, res, next) => {
      const { username, email } = req.params;
      if (req.params && username && email) {
        const users = await this.userRepository.findBy({
          username: username,
          email: email,
        });
        res.status(200).send(users);
      } else {
        res.status(400).send("Bad Request");
      }
    });
  }

  private _updateUserListener() {
    app.patch(
      `${this.baseRoute}/update-user/:email`,
      async (req, res, next) => {
        const { email } = req.params;
        const newData = req.body as UserEntity;
        const currentUserData = await this.userRepository.findOneBy({ email });
        if (currentUserData) {
          if (
            currentUserData?.age &&
            currentUserData?.job &&
            newData?.age &&
            newData?.job
          ) {
            currentUserData.age = newData.age;
            currentUserData.job = newData.job;
            const newUser = await this.userRepository.save(currentUserData);
            res.send(newUser);
          }
        } else {
          res.status(404);
          res.send("User not found");
        }
      }
    );
  }

  private _deleteUserListener() {
    app.delete(`${this.baseRoute}/delete-user`, async (req, res, next) => {
      const { email } = req.body;
      if (!email) {
        res.status(400).send("Bad Request");
        return;
      }

      const user = await this.userRepository.findOne({
        where: { email: email },
        relations: { passport: true, tasks: true },
      });

      if (user) {
        this.userRepository.remove(user as UserEntity).then((u) => {
          res.status(200).send(u);
        });
      } else {
        res.status(404).send("User not found");
      }
    });
  }
}
