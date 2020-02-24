import express from 'express';
import checkUserBodyMiddleware from '../middleware/checkUserBodyMiddleware';
import checkUserUpdateMiddleware from '../middleware/checkUserUpdateMiddleware';
import { IUserData } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { trimUserData } from '../utils/helpers';
import logger from '../loggers/winston';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const { login, limit } = req.query;
        const data = await UserService.getAll(login, limit);
        if (data && Array.isArray(data) && data.length > 0) {
            return res.json(data);
        }

        logger.warn(
            {
                method: 'UserService.getAll',
                query: { login, limit },
                message: 'Users are not found'
            },
        );

        res.status(400);
        res.end('Users are not found');
    }
    catch (e) {
        const { login, limit } = req.query;
        logger.error(
            {
                method: 'UserService.getAll',
                query: { login, limit },
                message: e.message
            },
        );
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const params = req.params;
        const userId = params.id;
        const user: IUserData = await UserService.getById(userId);
        if (user) {
            return res.json(user);
        }
        logger.warn(
            {
                params,
                method: 'UserService.getById',
                message: 'User not found'
            },
        );

        res.status(400);
        res.end('User not found');

    } catch (e) {
        const params = req.params;
        logger.error(
            {
                params,
                method: 'UserService.getById',
                message: e.message
            },
        );
        next(e);
    }
});

router.post('/', checkUserBodyMiddleware, async (req, res, next) => {
    try {
        const reqUser = req.body;
        const newUser: IUserData = await UserService.create(reqUser);
        res.json(trimUserData(newUser));
    } catch (e) {
        logger.error(
            {
                body: req.body,
                method: 'UserService.create',
                message: e.message
            },
        );
        next(e);
    }
});

router.put('/:id', checkUserUpdateMiddleware, async (req, res, next) => {
    try {
        const params = req.params;
        const userId = params.id;
        const reqUser = req.body;
        const updatedUser: IUserData = await UserService.update(userId, reqUser);

        if (updatedUser) {
            return res.json(trimUserData(updatedUser));
        }

        logger.warn(
            {
                params,
                body: req.body,
                method: 'UserService.update',
                message: 'User not found'
            },
        );

        res.status(400);
        res.end('User not found');

    } catch (e) {
        logger.error(
            {
                body: req.body,
                method: 'UserService.update',
                message: e.message
            },
        );
        next(e);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const params = req.params;
        const userId = params.id;
        const removedUser: IUserData = await UserService.delete(userId);
        if (removedUser) {
            return res.json(trimUserData(removedUser));
        }
        logger.warn(
            {
                params,
                method: 'UserService.delete',
                message: 'User not found'
            },
        );
        res.status(400);
        res.end('User not found');
    } catch (e) {
        const params = req.params;
        logger.error(
            {
                params,
                method: 'UserService.delete',
                message: e.message
            },
        );
        next(e);
    }
});

router.all('*', async (req, res) => {
    const { method, params, query, body } = req;
    logger.warn(
        {
            params,
            method,
            query,
            body,
            message: 'Wrong user url'
        },
    );
    res.status(404);
    res.end('Wrong user url');
});

export default router;
