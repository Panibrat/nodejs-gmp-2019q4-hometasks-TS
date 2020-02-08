import { Group } from '../models/group.module';

export class GroupService {
    static getAll() {
        return Group.findAll();
    }

    static getById(id) {
        return Group.findByPk(id);
    }

    static create({ name, permissions }) {
        return Group.create({ name, permissions });
    }

    static async update(id, payload) {
        const { name, permissions } = payload;
        const group = await Group.findByPk(id);
        if (group) {
            group.name = name ? name : group.name;
            group.permissions = permissions ? permissions : group.permissions;
            return group.save();
        }
        return null;
    }

    static async delete(id) {
        const group = await Group.findByPk(id);
        if (group) {
            return group.destroy();
        }
        return null;
    }

}
