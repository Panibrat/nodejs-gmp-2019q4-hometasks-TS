import { UserGroups } from '../models/userGroup.module';
import db from '../db/db';

const sequelize = db.getSequelize();

export class UserGroupService {
    static getAll() {
        return UserGroups.findAll();
    }

    static async addUsersToGroup(GroupId, userIds) {
        const results = [];
        const t = await sequelize.transaction();

        try {
            for (const UserId of userIds) {
                const tmp = await UserGroups.create({ GroupId, UserId }, { transaction: t });
                results.push(tmp);
            }
            await t.commit();
            return results;

        } catch (e) {
            await t.rollback();
            throw new Error(e);
        }
    }
}
