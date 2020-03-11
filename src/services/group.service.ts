import HttpError from 'standard-http-error';
import { Group } from '../models/group.model';
import {IGroupCreateData, IGroupData, IGroupUpdateData} from "../interfaces/group.interface";

export class GroupService {
    static async getAll(): Promise<Array<IGroupData>> {
        const groups = await Group.findAll();
        if (groups && Array.isArray(groups) && groups.length > 0) {
            return groups;
        }
        throw new HttpError(404, `Can't find any group from Database :(`);
    }

    static async getById(id: number): Promise<IGroupData> {
        const group = await Group.findByPk(id);
        if (group) {
            return group;
        }
        throw new HttpError(404, `Group is not found :(`);
    }

    static create({ name, permissions }: IGroupCreateData): Promise<IGroupData> {
        return Group.create({ name, permissions });
    }

    static async updateById(id: number, payload: IGroupUpdateData): Promise<IGroupData> {
        const { name, permissions } = payload;
        const group = await Group.findByPk(id);
        if (group) {
            group.name = name ? name : group.name;
            group.permissions = permissions ? permissions : group.permissions;
            return group.save();
        }
        throw new HttpError(404, `Group is not found :(`);
    }

    static async deleteById(id: number): Promise<IGroupData> {
        const group = await Group.findByPk(id);
        if (group) {
            return group.destroy();
        }
        throw new HttpError(404, `Group is not found :(`);
    }
}
