import db from '../db/db';
import { DataTypes, Model } from 'sequelize';
import { Group } from './group.module';
import { User } from './user.module';

const sequelize = db.getSequelize();

export class UserGroups extends Model {
    public UserId: number;
    public GroupId: number;
}

UserGroups.init({
    UserId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    GroupId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id'
        }
    }
}, {
    sequelize: sequelize,
    modelName: 'UserGroups'
});

User.belongsToMany(Group, { through: 'UserGroups', /* options */ });
Group.belongsToMany(User, { through: 'UserGroups', /* options */ });
