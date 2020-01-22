import { User } from '../models/userModel';
import { UserData } from '../services/types';

export class UserService {
    static getAll() {
        return User.findAll({
            where: {isDeleted: false},
            attributes: ['id', 'login', 'age']
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
}
