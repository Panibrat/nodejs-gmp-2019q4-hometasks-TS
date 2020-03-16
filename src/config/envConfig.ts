import dotenv from 'dotenv';

dotenv.config();

const {PORT, DB_CONNECTION_URI, MY_SECRET_KEY} = process.env;

const nodeConfig = {
    port: PORT || 3030,
    dbConnectionUri: DB_CONNECTION_URI,
    tokenSecretKey: MY_SECRET_KEY,
    tokenExpiresIn: 600,
};

export default nodeConfig;
