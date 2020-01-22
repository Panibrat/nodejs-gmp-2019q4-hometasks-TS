import express from 'express';
import usersDataService from '../services/usersDataService';
import checkUserBodyMiddleware from '../middleware/checkUserBodyMiddleware';
import checkUserUpdateMiddleware from '../middleware/checkUserUpdateMiddleware';
import { UserData } from '../services/types';
import { UserService } from '../services/userService';

const router = express.Router();

const trimUserData = ({ id, login, age }: UserData): UserData => {
    return { id, login, age };
};

/*router.get('/', (req, res) => {
    const { login, limit } = req.query;
    if (login || limit) {
        const list: UserData[] = usersDataService.getAutoSuggestUsers(login, limit).map(trimUserData);
        return res.json(list);
    }
    const data: UserData[] = usersDataService.getAllUsers().map(trimUserData);
    res.json(data);
});*/

router.get('/', async (req, res) => {
    const data = await UserService.getAll();
    res.json(data);
});

/*router.get('/:id', (req, res) => {
    const userId = req.params.id;
    const user: UserData = usersDataService.getUserById(userId);
    if (user) {
        return res.json(trimUserData(user));
    }
    res.status(400);
    res.end('User not found');
});*/

router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    const user: UserData = await UserService.getById(userId);
    if (user) {
        return res.json(trimUserData(user));
    }
    res.status(400);
    res.end('User not found');
});

/*router.post('/', checkUserBodyMiddleware, (req, res) => {
    const reqUser = req.body;
    const newUser: UserData = usersDataService.createUser(reqUser);
    res.json(trimUserData(newUser));
});*/

router.post('/', checkUserBodyMiddleware, async (req, res) => {
    const reqUser = req.body;
    const newUser: UserData = await UserService.create(reqUser);
    res.json(newUser);
});

router.put('/:id', checkUserUpdateMiddleware, (req, res) => {
    const userId = req.params.id;
    const reqUser = req.body;
    const updatedUser: UserData = usersDataService.updateUserById(userId, reqUser);
    if (updatedUser) {
        return res.json(trimUserData(updatedUser));
    }
    res.status(400);
    res.end('User not found');
});

router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    const removedUser: UserData = usersDataService.removeUserById(userId);
    if (removedUser) {
        return res.json(trimUserData(removedUser));
    }
    res.status(400);
    res.end('User not found');
});

export default router;
