import Joi from '@hapi/joi';
import HttpError from 'standard-http-error';

const userCreateSchema = Joi.object(
    {
        login: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{2,30}$'))
            .required(),
        age: Joi.number()
            .min(4)
            .max(130)
    }
);

const userUpdateSchema = Joi.object(
    {
        login: Joi.string()
            .alphanum()
            .min(3)
            .max(30),
        password: Joi.string()
            .strip()
            .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{2,30}$')),
        age: Joi.number()
            .min(4)
            .max(130)
    }
);

const checkUserBodyMiddleware = (req, res, next) => {
    const user = req.body;
    const method = req.method;
    let error = null;
    switch (method) {
        case 'POST':
            error = userCreateSchema.validate(user).error;
            break;
        case 'PUT':
            error = userUpdateSchema.validate(user).error;
            break;
    }
    if (error) {
        const { message } = error.details[0];
        throw new HttpError(400, message);
    }
    next();
};

export default checkUserBodyMiddleware;
