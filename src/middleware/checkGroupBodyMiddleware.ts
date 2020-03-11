import Joi from '@hapi/joi';
import HttpError from 'standard-http-error';

const groupCreateSchema = Joi.object(
    {
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        permissions: Joi.array()
            .items(Joi.string())
            .required()
    }
);

const groupUpdateSchema = Joi.object(
    {
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(30),
        permissions: Joi.array()
            .items(Joi.string())
    }
);

const checkGroupBodyMiddleware = (req, res, next) => {
    const group = req.body;
    const method = req.method;
    let error = null;
    switch (method) {
        case 'POST':
            error = groupCreateSchema.validate(group).error;
            break;
        case 'PUT':
            error = groupUpdateSchema.validate(group).error;
            break;
    }

    if (error) {
        const { message } = error.details[0];
        throw new HttpError(400, message);
    }
    next();
};

export default checkGroupBodyMiddleware;
