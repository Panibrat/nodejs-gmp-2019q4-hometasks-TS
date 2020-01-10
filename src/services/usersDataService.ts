// import users from '../db/users.json';
import uuidv1 from 'uuid/v1';

const users = [
    {
        id: 1,
        login: "Mama",
        password: "22",
        age: 21,
        isDeleted: false
    }
];

const clearObject = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
    });
    return obj;
};

class UserService {
    userList;
    constructor(initUsers = []) {
        this.userList = initUsers;
    }

    getAllUsers() {
        return this.userList.filter(user => !user.isDeleted);
    }

    getUserById(id) {
        const userIndex = this.userList.findIndex(user => user.id === id);
        if (userIndex > -1 && !this.userList[userIndex].isDeleted) {
            return this.userList[userIndex];
        }
        return null;
    }

    removeUserById(id) {
        const user = this.getUserById(id);
        if (user) {
            user.isDeleted = true;
            return user;
        }
        return null;
    }

    updateUserById(id, payload) {
        const { login, password, age } = payload;
        const updateValuesObject = clearObject({ login, password, age });
        let user = this.getUserById(id);
        if (user) {
            user = Object.assign(user, updateValuesObject);
            return user;
        }
        return null;
    }

    createUser({ login, password, age }) {
        const newUser = {
            login,
            password,
            age,
            isDeleted: false,
            id: uuidv1()
        };
        this.userList.push(newUser);
        return newUser;
    }

    getAutoSuggestUsers(loginSubstring, limit) {
        const getUsersByLoginSubstring = (substring) => {
            return this.userList
                .filter(user => !user.isDeleted && user.login.startsWith(substring))
                .sort((a, b) => {
                    return a.login > b.login;
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
                    return a.login > b.login;
                })
                .slice(0, Number(limit));
        }
        return null;
    }
}

export default new UserService(users);
