import express from 'express';
import HttpError from 'standard-http-error';
import indexRouter from './routes';
import usersRouter from './routes/users';
import groupsRouter from './routes/groups';
import userGroupRouter from './routes/user-groups';
import customLoggerMiddleware from './middleware/customLoggerMiddleware';
import db from './db/db';

db.testConnection();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('*', customLoggerMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/groups', groupsRouter);
app.use('/user-groups', userGroupRouter);

app.use((err, req, res, next) => {
    if (err && err instanceof HttpError) {
        res.status(err.status).send(err.message); //TODO: Ask why here is: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    }
    console.error(err.stack);
    res.status(500).send('Oooops! Internal server or db error :( \n' + err);
});

app.all('*', (req, res) => {
    res.status(404);
    res.end('Wrong url');
});

export default app;
