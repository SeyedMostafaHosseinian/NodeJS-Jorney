import express, {Express} from 'express';
import 'reflect-metadata';
import dotenv from 'dotenv';
import {createDataSource} from "./db/data-source";

const cors = require('cors')
export const app = express();

function applyMiddlewares(app: Express) {
    app.use(cors())
}

function configENV() {
    dotenv.config();
}

function connectToDatabase() {
    console.log('connecting to the database...')
    return createDataSource().initialize()
}

async function startService() {
    /** set env **/
    configENV();
    const [port, appName] = [process.env['PORT'], process.env['APP_NAME']];
    /** apply middlewares **/
    applyMiddlewares(app);
    /** connecting to the database **/
    await connectToDatabase()
        .then(() => console.log('connected to the database successfully!'))
        .catch(() => console.log('connection to database is failed!!'));
    /** listening  **/
    await app.listen(port, () => {
        console.log(`[${appName}] App successfully started on port: [${port}] `)
    });
    app.get('/', (req, res, next) => {
        res.send(`Welcome to ${appName} App`)
    })
}

startService();
