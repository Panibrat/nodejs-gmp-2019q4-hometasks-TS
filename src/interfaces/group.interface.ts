export interface IGroupData {
    id: number;
    name: string;
    permissions: string[];
}

export interface IGroupCreateData {
    name: string;
    permissions: string[];
}
export interface IGroupUpdateData {
    name?: string;
    permissions?: string[];
}

export interface IUserGroupRelation {
    GroupId: number;
    UserId: number;
}
