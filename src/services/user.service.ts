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
        })
            .catch(e => {
                console.log('[DB ERROR] ', e);
                return null;
            });
    }

    static getById(id) {
        return User.findOne({
            where: {
                id: id,
                isDeleted: false
            },
            attributes: ['id', 'login', 'age']
        })
            .catch(e => {
                console.log('[DB ERROR] ', e);
            return null;
        });
    }

    static create({ login, password, age }) {
        return User.create({ login, password, age })
            .then( user => {
                return User.findOne({
                    where: {
                        id: user.id,
                    },
                    attributes: ['id', 'login', 'age']
                })
            })
            .catch(e => {
                console.log('[DB ERROR] ', e);
                return null;
            });
    }

    static update(id, payload) {
        return User.update(
            { ...payload },
            {
                where: {
                    id: id,
                    isDeleted: false
                }
            }
            ).then( () => {
                return User.findOne({
                    where: {
                        id: id,
                        isDeleted: false
                    },
                    attributes: ['id', 'login', 'age']
                })
             })
            .catch(e => {
                console.log('[DB ERROR] ', e);
                return null;
            })
    }

    static delete(id) {
        return User.update(
            {isDeleted: true},
            {
                where: {
                    id: id,
                    isDeleted: false
                }
            }
            ).then( (status) => {
                if (status[0] === 0) {
                    return null;
                }
                return User.findOne({
                    where: {
                        id: id
                    },
                    attributes: ['id', 'login', 'age']
                })
             })
            .catch(e => {
                console.log('[DB ERROR] ', e);
                return null;
            })
    }
}
