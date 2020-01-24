import express from 'express';
import checkUserBodyMiddleware from '../middleware/checkUserBodyMiddleware';
import checkUserUpdateMiddleware from '../middleware/checkUserUpdateMiddleware';
import { IUserData } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

const router = express.Router();

router.get('/', async (req, res) => {
    const { login, limit } = req.query;
    const data = await UserService.getAll(login, limit);
    if (data) {
        return res.json(data);
    }
    res.status(400);
    res.end('Users are not found');
});

router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    const user: IUserData = await UserService.getById(userId);
    if (user) {
        return res.json(user);
    }
    res.status(400);
    res.end('User not found');
});

router.post('/', checkUserBodyMiddleware, async (req, res) => {
    const reqUser = req.body;
    const newUser: IUserData = await UserService.create(reqUser);
    res.json(newUser);
});

router.put('/:id', checkUserUpdateMiddleware, async (req, res) => {
    const userId = req.params.id;
    const reqUser = req.body;
    const updatedUser: IUserData = await UserService.update(userId, reqUser);
    if (updatedUser) {
        return res.json(updatedUser);
    }
    res.status(400);
    res.end('User not found');
});

router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    const removedUser: IUserData = await UserService.delete(userId);
    if (removedUser) {
        return res.json(removedUser);
    }
    res.status(400);
    res.end('User not found');
});

export default router;
