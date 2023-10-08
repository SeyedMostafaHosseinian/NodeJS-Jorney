import express from 'express';
import './example';

export const app = express();

app.listen(3000);


app.get('/', (req, res, next) => {
    res.send('Welcome to node app')
})

