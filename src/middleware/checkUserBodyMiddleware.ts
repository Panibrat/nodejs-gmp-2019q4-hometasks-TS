import Joi from '@hapi/joi';

const userSchema = Joi.object(
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
            .required()
    }
);

const checkUserBodyMiddleware = (req, res, next) => {
    const user = req.body;

    const { error } = userSchema.validate(user);
    if (error) {
        const { message } = error.details[0];
        return res.status(400).send(message);
    }
    next();
};

export default checkUserBodyMiddleware;
