import { Repository } from "typeorm";
import { PassportEntity } from "../db/entities/passport.entity";
import { app } from "../main";
import dataSource from "../db/data-source";
import { UserEntity } from "../db/entities/user.entity";

export class PassportController {
  passportRepository: Repository<PassportEntity>;
  userRepository: Repository<UserEntity>;

  constructor(public baseRoute: string) {
    this.passportRepository = dataSource.getRepository(PassportEntity);
    this.userRepository = dataSource.getRepository(UserEntity);

    this._getAllPassportListener();
    this._addPassportListener();
    this._updatePassportListener();
  }

  private _addPassportListener() {
    app.post(`${this.baseRoute}/add`, async (req, res, next) => {
      const { userEmail, userPhoneNumber, birthPlace, country } = req.body;

      if (!(userEmail && userPhoneNumber && birthPlace && country)) {
        res.status(400).send("Bad request");
        return;
      }

      const user = await this._getUser(userEmail, userPhoneNumber);

      if (!user) {
        res.status(404).send("User not found");
        return;
      }

      const existPassport = await this._getPassport(user);

      if (existPassport) {
        res.status(409).send("Passport for this user is existed");
        return;
      }

      const passport = new PassportEntity();
      passport.birthPlace = birthPlace;
      passport.country = country;
      passport.user = user;

      this.passportRepository.save(passport).then((p) => {
        res.status(201).send(p);
      });
    });
  }

  private _getAllPassportListener() {
    app.get(`${this.baseRoute}`, async (req, res, next) => {
      const filters = req.query;
      console.log(filters);

      const passports = await this.passportRepository.find({
        where: { ...req.query },
        relations: {
          user: true,
        },
      });
      res.status(200).send(passports);
    });
  }

  private _updatePassportListener() {
    app.patch(`${this.baseRoute}`, async (req, res, next) => {
      const { userEmail, userPhoneNumber, birthPlace, country } = req.body;

      if (!(userEmail && userPhoneNumber && birthPlace && country)) {
        res.status(400).send("Bad request");
        return;
      }

      const user = await this._getUser(userEmail, userPhoneNumber);
      console.log(user);

      if (!user) {
        res.status(405).send("Not allowed change passport without user");
        return;
      }

      const passport = await this._getPassport(user);
      console.log(passport);

      if (passport) {
        passport.country = country;
        passport.birthPlace = birthPlace;
        this.passportRepository.save(passport).then((p) => {
          res.status(200).send(p);
        });
      } else {
        res.status(404).send("Passport not found");
      }
    });
  }

  private _getUser(email: string, phoneNumber: string, getRelation = true) {
    return this.userRepository.findOne({
      where: {
        email: email,
        phoneNumber: phoneNumber,
      },
      relations: {
        passport: getRelation,
      },
    });
  }

  private _getPassport(user: UserEntity, getRelation = true) {
    return this.passportRepository.findOne({
      where: { user: user },
      relations: { user: getRelation },
    });
  }
}
