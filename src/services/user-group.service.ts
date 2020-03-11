import HttpError from 'standard-http-error';
import { UserGroups } from '../models/userGroup.model';
import db from '../db/db';
import {IUserGroupRelation} from "../interfaces/group.interface";

const sequelize = db.getSequelize();

export class UserGroupService {
    static async getAll(): Promise<Array<IUserGroupRelation>> {
        const userGroupsList = await UserGroups.findAll();
        if (userGroupsList && Array.isArray(userGroupsList) && userGroupsList.length > 0) {
            return userGroupsList;
        }
        throw new HttpError(404, `Can't find any user groups from Database :(`);
    }

    static async addUsersToGroup(GroupId: number, userIds: number[]): Promise<Array<IUserGroupRelation>> {
        const results = [];
        const t = await sequelize.transaction();

        try {
            for (const UserId of userIds) {
                const tmp = await UserGroups.create({ GroupId, UserId }, { transaction: t });
                results.push(tmp);
            }
            await t.commit();
        } catch (e) {
            await t.rollback();
            throw new Error(e);
        }

        if (results.length > 0) {
            return results;
        }
        throw new HttpError(404, `Can't add any user to group :(`);
    }
}
