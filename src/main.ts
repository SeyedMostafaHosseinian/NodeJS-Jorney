import express from 'express';

export const app = express();

/** for run train files. if you want test and train, uncomment import of your target file in follow file **/
import './async-programming/train-main';
import './working-with-files/work-with-files-train';

function runService() {
    app.listen(3000);
    app.get('/', (req, res, next) => {
        res.send('Welcome to node app')
    })
}

// runService();