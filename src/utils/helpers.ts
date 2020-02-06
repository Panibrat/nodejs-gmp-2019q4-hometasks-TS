import { IUserData } from '../interfaces/user.interface';

export const trimUserData = ({ id, login, age }: IUserData): IUserData => {
    return { id, login, age };
};
