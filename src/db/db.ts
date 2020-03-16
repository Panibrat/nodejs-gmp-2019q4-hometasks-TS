import { Sequelize } from 'sequelize';
import nodeConfig from '../config/envConfig';

const { dbConnectionUri } = nodeConfig;
const sequelize = new Sequelize(dbConnectionUri, {
    define: {
        timestamps: false
    }
});

class Db {
    sequelize;
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

    closeConnection() {
        this.sequelize.close();
    }
}

export default new Db(sequelize);
