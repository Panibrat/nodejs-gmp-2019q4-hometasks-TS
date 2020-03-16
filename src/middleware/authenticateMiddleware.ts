import jwt from 'jsonwebtoken';
import HttpError from 'standard-http-error';
import nodeConfig from '../config/envConfig';

const { tokenSecretKey } = nodeConfig;

const authenticateMiddleware = (req, res, next) => {
    const token = req.header('x-access-token');
    if (!token) {
        throw new HttpError(401, 'Unauthorized Error');
}
    try {
        const decoded = jwt.verify(token, tokenSecretKey);
    } catch (e) {
        throw new HttpError(403, 'Forbidden Error');
    }
    req.token = token;
    next();
};

export default authenticateMiddleware;
