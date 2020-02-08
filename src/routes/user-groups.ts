import express from 'express';
import { UserGroupService } from '../services/user-group.service';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const data = await UserGroupService.getAll();
        if (data) {
            return res.json(data);
        }
        res.status(400);
        res.end('User Groups are not found');
    }
    catch (e) {
        next(e);
    }
});

router.post('/:id', async (req, res, next) => {
    const groupId = req.params.id;
    const { userIds } = req.body;
    try {
        const data = await UserGroupService.addUsersToGroup(groupId, userIds);
        if (data) {
            return res.json(data);
        }
        res.status(400);
        res.end('User Groups are not found');
    }
    catch (e) {
        next(e);
    }
});

export default router;
