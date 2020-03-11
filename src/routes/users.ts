import express from 'express';
import HttpError from 'standard-http-error';
import checkUserBodyMiddleware from '../middleware/checkUserBodyMiddleware';
import { IUserData } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { trimUserData, runAsyncWrapper } from '../utils/helpers';

const router = express.Router();

router.get('/', runAsyncWrapper(async (req, res) => {
    const {login, limit} = req.query;
    const data = await UserService.getAll(login, limit);
    return res.json(data);
}));

router.get('/:id', runAsyncWrapper(async (req, res) => {
    const userId = req.params.id;
    const user: IUserData = await UserService.getById(userId);
    return res.json(user);
}));

router.post('/', checkUserBodyMiddleware, runAsyncWrapper(async (req, res) => {
    const reqUser = req.body;
    const newUser: IUserData = await UserService.create(reqUser);
    return res.json(trimUserData(newUser));
}));

router.put('/:id', checkUserBodyMiddleware, runAsyncWrapper(async (req, res) => {
        const userId = req.params.id;
        const reqUser = req.body;
        const updatedUser: IUserData = await UserService.updateById(userId, reqUser);
        return res.json(trimUserData(updatedUser));
}));

router.delete('/:id', runAsyncWrapper(async (req, res) => {
    const userId = req.params.id;
    const removedUser: IUserData = await UserService.deleteById(userId);
    return res.json(trimUserData(removedUser));
}));

router.all('*', () => {
    throw new HttpError(404, `Wrong user url :(`);
});

export default router;
