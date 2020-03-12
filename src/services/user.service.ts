import HttpError from 'standard-http-error';
import { Op } from 'sequelize';
import { User } from '../models/user.model';
import {IUserCreateData, IUserData, IUserUpdateData} from "../interfaces/user.interface";
import logger from "../loggers/winston";

export class UserService {
    static async getAll(search?: string, limit?: number): Promise<Array<IUserData>> {
        const searchLimit = limit ? limit : null;
        const whereObj = search ?
            { isDeleted: false, login: {[Op.like]: `${search}%`}}
            :
            { isDeleted: false };
        logger.log(
            {
                level: 'info',
                message: 'Getting all users',
                method: 'UserService.getAll',
                query: { search, limit },
            },
        );

        const users = await User.findAll({
            where: whereObj,
            attributes: ['id', 'login', 'age'],
            limit: searchLimit,
            order: ['login']
        });
        if (users && Array.isArray(users) && users.length > 0) {
            return users;
        }
        logger.warn(
            {
                method: 'UserService.getAll',
                query: { search, limit },
                message: 'Users are not found'
            },
        );
        throw new HttpError(404, `Can't find any user from Database :(`);
    }

    static async getById(id: string): Promise<IUserData> {
        logger.log(
            {
                level: 'info',
                message: 'Getting user by id',
                method: 'UserService.getById',
                params: { id },
            },
        );
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
        logger.warn(
            {
                method: 'UserService.getById',
                params: `id: ${id}`,
                message: 'Users are not found'
            },
        );
        throw new HttpError(404, `User not found :(`);
    }

    static async create({ login, password, age }: IUserCreateData): Promise<IUserData> {
        logger.log(
            {
                level: 'info',
                message: 'Creating new user',
                method: 'UserService.create',
                params: { login, password, age },
            },
        );
        return User.create({ login, password, age });
    }

    static async updateById(id: string, payload: IUserUpdateData): Promise<IUserData> {
        const { login, password, age } = payload;
        logger.log(
            {
                level: 'info',
                message: 'Updating current user',
                method: 'UserService.updateById',
                params: { login, password, age, id },
            },
        );
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
        logger.warn(
            {
                method: 'UserService.updateById',
                params: { login, password, age, id },
                message: 'Users are not found'
            },
        );
        throw new HttpError(404, `User not found :(`);
    }

    static async deleteById(id: string): Promise<IUserData> {
        logger.log(
            {
                level: 'info',
                message: 'Delete current user',
                method: 'UserService.deleteById',
                params: { id },
            },
        );
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
        logger.warn(
            {
                method: 'UserService.deleteById',
                params: { id },
                message: 'User not found'
            },
        );
        throw new HttpError(404, `User not found :(`);
    }
}
