// TODO: Ask if it is normal to use those types of interfaces
export interface IUserData {
    id: string;
    login: string;
    password?: string;
    age?: number;
    isDeleted?: boolean;
}

export interface IUserCreateData {
    login: string;
    password: string;
    age: number;
}

export interface IUserUpdateData {
    login?: string;
    password?: string;
    age?: number;
}
