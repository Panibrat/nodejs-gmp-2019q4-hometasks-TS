import express from 'express';
import checkUserBodyMiddleware from '../middleware/checkUserBodyMiddleware';
import checkUserUpdateMiddleware from '../middleware/checkUserUpdateMiddleware';
import { UserData } from '../services/types';
import { UserService } from '../services/userService';

const router = express.Router();

router.get('/', async (req, res) => {
    const { login, limit } = req.query;
    const data = await UserService.getAll(login, limit);
    res.json(data);
});

router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    const user: UserData = await UserService.getById(userId);
    if (user) {
        return res.json(user);
    }
    res.status(400);
    res.end('User not found');
});

router.post('/', checkUserBodyMiddleware, async (req, res) => {
    const reqUser = req.body;
    const newUser: UserData = await UserService.create(reqUser);
    res.json(newUser);
});

router.put('/:id', checkUserUpdateMiddleware, async (req, res) => {
    const userId = req.params.id;
    const reqUser = req.body;
    const updatedUser: UserData = await UserService.update(userId, reqUser);
    if (updatedUser) {
        return res.json(updatedUser);
    }
    res.status(400);
    res.end('User not found');
});

router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    const removedUser: UserData = await UserService.delete(userId);
    if (removedUser) {
        return res.json(removedUser);
    }
    res.status(400);
    res.end('User not found');
});

export default router;
