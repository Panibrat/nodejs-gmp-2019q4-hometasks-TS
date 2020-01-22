import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const dbUri = process.env.DB_CONNECTION_URI;
const sequelize = new Sequelize(dbUri, {
    define: {
        timestamps: false
    }
});

class Db {
    sequelize: any;
    constructor(sq) {
        this.sequelize = sq;
    }
    testConnection() {
        this.sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
    }
    getSequelize() {
        return this.sequelize;
    }
}

export default new Db(sequelize);
