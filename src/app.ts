import express from 'express';
import indexRouter from './routes';
import usersRouter from './routes/users';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
