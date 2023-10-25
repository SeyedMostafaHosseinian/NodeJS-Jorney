import express, {Express} from 'express';
import dotenv from 'dotenv';
const cors = require('cors')
export const app = express();

import './decorators/decorators';

function runService() {
    configENV();
    const port = process.env['PORT'];
    const appName = process.env['APP_NAME'];
    applyMiddlewares(app);
    app.listen(port, () => {
        console.log('App successfully started on port: ' + port)
    });
    app.get('/', (req, res, next) => {
        res.send(`Welcome to ${appName} App`)
    })
}

// runService();
function applyMiddlewares(app: Express) {
    app.use(cors())
}

function configENV() {
    dotenv.config();
}