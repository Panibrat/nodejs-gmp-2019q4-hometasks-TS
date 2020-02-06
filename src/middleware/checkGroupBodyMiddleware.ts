import Joi from '@hapi/joi';

const groupSchema = Joi.object(
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

const checkGroupBodyMiddleware = (req, res, next) => {
    const group = req.body;

    const { error } = groupSchema.validate(group);
    if (error) {
        const { message } = error.details[0];
        return res.status(400).send(message);
    }
    next();
};

export default checkGroupBodyMiddleware;
