import db from '../db/db';
import { DataTypes, Model } from 'sequelize';

const sequelize = db.getSequelize();

export class Group extends Model {
    public id: number;
    public name: string;
    public permissions: string[];
}

Group.init({
               name: {
                   allowNull: false,
                   type: DataTypes.STRING,
               },
               permissions: DataTypes.ARRAY(DataTypes.STRING),
           }, {
               sequelize: sequelize,
               modelName: 'Group',
           });
