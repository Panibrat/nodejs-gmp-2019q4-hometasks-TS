import express from 'express';
import indexRouter from './routes';
import usersRouter from './routes/users';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbPort = process.env.DB_PORT;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

const dbConnectionLink = `postgres://${ dbUser }:${ dbPass }@${ dbHost }:${ dbPort }/${ dbName }`;
console.log('dbConnectionLink', dbConnectionLink);
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
const sequelize = new Sequelize(dbConnectionLink);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
