import { Op } from 'sequelize';
import { User } from '../models/user.module';

export class UserService {
    static getAll(search, limit) {
        const searchLimit = limit ? limit : null;
        const whereObj = search ?
            { isDeleted: false, login: {[Op.like]: `${search}%`}}
            :
            { isDeleted: false };

        return User.findAll({
            where: whereObj,
            attributes: ['id', 'login', 'age'],
            limit: searchLimit,
            order: ['login']
        });
    }

    static getById(id) {
        return User.findOne({
            where: {
                id: id,
                isDeleted: false
            },
            attributes: ['id', 'login', 'age']
        });
    }

    static create({ login, password, age }) {
        return User.create({ login, password, age });
    }

    static async update(id, payload) {
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
        return null;
    }

    static async delete(id) {
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
        return null;
    }
}
