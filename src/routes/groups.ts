import express from 'express';
import checkGroupBodyMiddleware from '../middleware/checkGroupBodyMiddleware';
import checkGroupUpdateMiddleware from '../middleware/checkGroupUpdateMiddleware';
import { GroupService } from '../services/group.service';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await GroupService.getAll();
        if (data) {
            return res.json(data);
        }
        res.status(400);
        res.end('Groups are not found');
    }
    catch (e) {
        res.status(500);
        res.end('Oooops! Internal server error :( \n' + e);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const groupId = req.params.id;
        const group = await GroupService.getById(groupId);
        if (group) {
            return res.json(group);
        }
        res.status(400);
        res.end('Group not found');
    } catch (e) {
        res.status(500);
        res.end('Oooops! Internal server error :( \n' + e);
    }
});

router.post('/', checkGroupBodyMiddleware, async (req, res) => {
    try {
        const reqGroup = req.body;
        const newGroup= await GroupService.create(reqGroup);
        res.json(newGroup);
    } catch (e) {
        res.status(500);
        res.end('Oooops! Internal server error :( \n' + e);
    }
});

router.put('/:id', checkGroupUpdateMiddleware, async (req, res) => {
    try {
        const groupId = req.params.id;
        const reqGroup = req.body;
        const updatedGroup = await GroupService.update(groupId, reqGroup);

        if (updatedGroup) {
            return res.json(updatedGroup);
        }
        res.status(400);
        res.end('Group is not found');
    } catch (e) {
        res.status(500);
        res.end('Oooops! Internal server error :( \n' + e);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const groupId = req.params.id;
        const removedGroup = await GroupService.delete(groupId);
        if (removedGroup) {
            return res.json(removedGroup);
        }
        res.status(400);
        res.end('Group is not found');
    } catch (e) {
        res.status(500);
        res.end('Oooops! Internal server error :( \n' + e);
    }
});

router.all('*', async (req, res) => {
    res.status(404);
    res.end('Wrong url');
});

export default router;
