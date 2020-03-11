import express from 'express';
import HttpError from 'standard-http-error';
import checkGroupBodyMiddleware from '../middleware/checkGroupBodyMiddleware';
import { GroupService } from '../services/group.service';
import {runAsyncWrapper} from "../utils/helpers";

const router = express.Router();

router.get('/', runAsyncWrapper(async (req, res) => {
    const data = await GroupService.getAll();
    return res.json(data);
}));

router.get('/:id', runAsyncWrapper(async (req, res) => {
    const groupId = req.params.id;
    const group = await GroupService.getById(groupId);
    return res.json(group);
}));

router.post('/', checkGroupBodyMiddleware, runAsyncWrapper(async (req, res) => {
    const reqGroup = req.body;
    const newGroup = await GroupService.create(reqGroup);
    res.json(newGroup);
}));

router.put('/:id', checkGroupBodyMiddleware, runAsyncWrapper(async (req, res) => {
    const groupId = req.params.id;
    const reqGroup = req.body;
    const updatedGroup = await GroupService.updateById(groupId, reqGroup);

    return res.json(updatedGroup);
}));

router.delete('/:id', runAsyncWrapper(async (req, res) => {
    const groupId = req.params.id;
    const removedGroup = await GroupService.deleteById(groupId);
    return res.json(removedGroup);
}));

router.all('*', async () => {
    throw new HttpError(404, `Wrong group url :(`);
});

export default router;
