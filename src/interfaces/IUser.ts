export interface IUser {
    id: string;
    login: string;
    password?: string;
    age?: number;
    isDeleted?: boolean;
}

export interface IUserInputData {
    login: string;
    password?: string;
    age?: number;
}
