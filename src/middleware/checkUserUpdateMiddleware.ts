import Joi from '@hapi/joi';

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

const checkUserUpdateMiddleware = (req, res, next) => {
    const user = req.body;
    const { error } = userUpdateSchema.validate(user);
    if (error) {
        const { message } = error.details[0];
        return res.status(400).send(message);
    }
    next();
};

export default checkUserUpdateMiddleware;
