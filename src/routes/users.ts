import express from 'express';
import checkUserBodyMiddleware from '../middleware/checkUserBodyMiddleware';
import checkUserUpdateMiddleware from '../middleware/checkUserUpdateMiddleware';
import { IUserData } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { trimUserData } from '../utils/helpers';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const { login, limit } = req.query;
        const data = await UserService.getAll(login, limit);
        if (data) {
            return res.json(data);
        }
        res.status(400);
        res.end('Users are not found');
    }
    catch (e) {
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user: IUserData = await UserService.getById(userId);
        if (user) {
            return res.json(user);
        }
        res.status(400);
        res.end('User not found');
    } catch (e) {
        next(e);
    }
});

router.post('/', checkUserBodyMiddleware, async (req, res, next) => {
    try {
        const reqUser = req.body;
        const newUser: IUserData = await UserService.create(reqUser);
        res.json(trimUserData(newUser));
    } catch (e) {
        next(e);
    }
});

router.put('/:id', checkUserUpdateMiddleware, async (req, res, next) => {
    try {
        const userId = req.params.id;
        const reqUser = req.body;
        const updatedUser: IUserData = await UserService.update(userId, reqUser);

        if (updatedUser) {
            return res.json(trimUserData(updatedUser));
        }
        res.status(400);
        res.end('User not found');
    } catch (e) {
        next(e);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        const removedUser: IUserData = await UserService.delete(userId);
        if (removedUser) {
            return res.json(trimUserData(removedUser));
        }
        res.status(400);
        res.end('User not found');
    } catch (e) {
        next(e);
    }
});

router.all('*', async (req, res) => {
    res.status(404);
    res.end('Wrong user url');
});

export default router;
