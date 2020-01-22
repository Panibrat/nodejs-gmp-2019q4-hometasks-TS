import db from '../db/Db';
import { DataTypes, Model } from 'sequelize';

const sequelize = db.getSequelize();

export class User extends Model {
    public id: number;
    public login: string;
    public password: string;
    public age?: number;
    public isDeleted: boolean;
}

User.init({
    // attributes
    login: {
        allowNull: false,
        type: DataTypes.STRING
    },
    password: DataTypes.STRING,
    age: DataTypes.INTEGER,
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize: sequelize,
    modelName: 'User'
    // options
});
