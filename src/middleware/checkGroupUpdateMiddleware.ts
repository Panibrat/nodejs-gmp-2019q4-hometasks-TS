import Joi from '@hapi/joi';

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

const checkGroupUpdateMiddleware = (req, res, next) => {
    const group = req.body;
    const { error } = groupUpdateSchema.validate(group);
    if (error) {
        const { message } = error.details[0];
        return res.status(400).send(message);
    }
    next();
};

export default checkGroupUpdateMiddleware;
