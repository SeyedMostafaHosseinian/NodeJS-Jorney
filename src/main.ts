import express, { Express } from "express";
import "reflect-metadata";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import dataSource from "./db/data-source";
import { AuthController } from "./controlers/auth.controller";
import { PassportController } from "./controlers/passport.controller";
import { TaskController } from "./controlers/task.controller";
import cookieParser from 'cookie-parser';
import { checkJWt } from "./middlewares/checkJWT.guard";

const cors = require("cors");
export const app = express();

function applyMiddlewares(app: Express) {
  app
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(checkJWt)
}

function configENV() {
  dotenv.config();
}

function connectToDatabase() {
  console.log("connecting to the database...");
  return dataSource.initialize();
}

async function startService() {
  /** set env **/
  configENV();
  const [port, appName] = [process.env["PORT"], process.env["APP_NAME"]];
  /** apply middlewares **/
  applyMiddlewares(app);
  /** connecting to the database **/
  await connectToDatabase()
    .then(() => console.log("🛢️ connected to the database successfully!"))
    .catch((e) => console.log("⚠️ connection to database is failed!!", e));
  /** listening  **/
  app.listen(port, () => {
    console.log(`[${appName}] App successfully started on port: [${port}] `);
  });

  /** start controllers **/
  app.get("/", async (req, res, next) => {
    res.send(`Welcome to ${appName} App`);
  });

  new AuthController("/users");
  new PassportController("/passport");
  new TaskController("/tasks");
}

startService();
