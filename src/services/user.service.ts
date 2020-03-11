import HttpError from 'standard-http-error';
import { Op } from 'sequelize';
import { User } from '../models/user.model';
import {IUserCreateData, IUserData, IUserUpdateData} from "../interfaces/user.interface";

export class UserService {
    static async getAll(search?: string, limit?: number): Promise<Array<IUserData>> {
        const searchLimit = limit ? limit : null;
        const whereObj = search ?
            { isDeleted: false, login: {[Op.like]: `${search}%`}}
            :
            { isDeleted: false };

        const users = await User.findAll({
            where: whereObj,
            attributes: ['id', 'login', 'age'],
            limit: searchLimit,
            order: ['login']
        });
        if (users && Array.isArray(users) && users.length > 0) {
            return users;
        }
        throw new HttpError(404, `Can't find any user from Database :(`);
    }

    static async getById(id: string): Promise<IUserData> {
        const user = await User.findOne({
            where: {
                id: id,
                isDeleted: false
            },
            attributes: ['id', 'login', 'age']
        });
        if (user) {
            return user;
        }
        throw new HttpError(404, `User not found :(`);
    }

    static async create({ login, password, age }: IUserCreateData): Promise<IUserData> {
        return User.create({ login, password, age });
    }

    static async updateById(id: string, payload: IUserUpdateData): Promise<IUserData> {
        const { login, password, age } = payload;
        const user = await User
            .findOne({
                         where: {
                             id: id,
                             isDeleted: false,
                         }
                     });
        if (user) {
            user.login = login ? login : user.login;
            user.password = password ? password : user.password;
            user.age = age ? age : user.age;
            return user.save();
        }
        throw new HttpError(404, `User not found :(`);
    }

    static async deleteById(id: string): Promise<IUserData> {
        const user = await User
            .findOne({
                         where: {
                             id: id,
                             isDeleted: false,
                         }
                     });
        if (user) {
            user.isDeleted = true;
            return user.save();
        }
        throw new HttpError(404, `User not found :(`);
    }
}
