import express from 'express';
import { UserGroupService } from '../services/user-group.service';
import {runAsyncWrapper} from "../utils/helpers";

const router = express.Router();

router.get('/', runAsyncWrapper(async (req, res) => {
    const data = await UserGroupService.getAll();
    return res.json(data);
}));

router.post('/:id', runAsyncWrapper(async (req, res) => {
    const groupId = req.params.id;
    const {userIds} = req.body;
    const data = await UserGroupService.addUsersToGroup(groupId, userIds);
    return res.json(data);
}));

export default router;
