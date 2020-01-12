import users from '../db/users.json';
import uuidv1 from 'uuid/v1';

import { UserData } from './types';

const clearObject = (obj: object): object => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
    });
    return obj;
};

class UserService {
    userList: UserData[];
    constructor(initUsers = []) {
        this.userList = initUsers;
    }

    public getAllUsers(): UserData[] {
        return this.userList.filter(user => !user.isDeleted);
    }

    public getUserById(id: string): UserData {
        const userIndex = this.userList.findIndex(user => user.id === id);
        if (userIndex > -1 && !this.userList[userIndex].isDeleted) {
            return this.userList[userIndex];
        }
        return null;
    }

    public removeUserById(id: string): UserData {
        const user = this.getUserById(id);
        if (user) {
            user.isDeleted = true;
            return user;
        }
        return null;
    }

    public updateUserById(id: string, payload: UserData): UserData {
        const { login, password, age } = payload;
        const updateValuesObject = clearObject({ login, password, age });
        let user = this.getUserById(id);
        if (user) {
            user = Object.assign(user, updateValuesObject);
            return user;
        }
        return null;
    }

    public createUser({ login, password, age }): UserData {
        const newUser: UserData = {
            login,
            password,
            age,
            isDeleted: false,
            id: uuidv1()
        };
        this.userList.push(newUser);
        return newUser;
    }

    public getAutoSuggestUsers(loginSubstring: string, limit: number): UserData[] {
        const getUsersByLoginSubstring = (substring) => {
            return this.userList
                .filter(user => !user.isDeleted && user.login.startsWith(substring))
                .sort((a, b) => {
                    return a.login > b.login ? 1 : -1;
                });
        };
        if (loginSubstring && limit) {
            return getUsersByLoginSubstring(loginSubstring).slice(0, Number(limit));
        }
        if (loginSubstring) {
            return getUsersByLoginSubstring(loginSubstring);
        }
        if (limit) {
            return this.userList
                .filter(user => !user.isDeleted)
                .sort((a, b) => {
                    return a.login > b.login ? 1 : -1;
                })
                .slice(0, Number(limit));
        }
        return null;
    }
}

export default new UserService(users);
