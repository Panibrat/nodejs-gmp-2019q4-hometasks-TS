import { IUserData } from '../interfaces/user.interface';

export const trimUserData = ({ id, login, age }: IUserData): IUserData => {
    return { id, login, age };
};

export const runAsyncWrapper = (callback) => {
    return function (req, res, next) {
        callback(req, res, next)
            .catch(next)
    }
};
