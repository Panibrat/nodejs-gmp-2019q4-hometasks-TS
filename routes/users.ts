import * as express from 'express';
import usersDataService from '../src/services/usersDataService';
import checkUserBodyMiddleware from '../middleware/checkUserBodyMiddleware';
import checkUserUpdateMiddleware from '../middleware/checkUserUpdateMiddleware';

const router = express.Router();

const trimUserData = ({ id, login, age }) => {
    return { id, login, age };
};

router.get('/', (req, res) => {
    const { login, limit } = req.query;
    if (login || limit) {
        const list = usersDataService.getAutoSuggestUsers(login, limit).map(trimUserData);
        return res.json(list);
    }
    const data = usersDataService.getAllUsers().map(trimUserData);
    res.json(data);
});

router.get('/:id', (req, res) => {
    const userId = req.params.id;
    const user = usersDataService.getUserById(userId);
    if (user) {
        return res.json(trimUserData(user));
    }
    res.status(400);
    res.end('User not found');
});

router.post('/', checkUserBodyMiddleware, (req, res) => {
    const reqUser = req.body;
    const newUser = usersDataService.createUser(reqUser);
    res.json(trimUserData(newUser));
});

router.put('/:id', checkUserUpdateMiddleware, (req, res) => {
    const userId = req.params.id;
    const reqUser = req.body;
    const updatedUser = usersDataService.updateUserById(userId, reqUser);
    if (updatedUser) {
        return res.json(trimUserData(updatedUser));
    }
    res.status(400);
    res.end('User not found');
});

router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    const removedUser = usersDataService.removeUserById(userId);
    if (removedUser) {
        return res.json(trimUserData(removedUser));
    }
    res.status(400);
    res.end('User not found');
});

export default router;
