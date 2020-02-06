import express from 'express';
import indexRouter from './routes';
import usersRouter from './routes/users';
import db from './db/db';

db.testConnection();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.all('*', async (req, res) => {
    res.status(404);
    res.end('Wrong url');
});

export default app;
