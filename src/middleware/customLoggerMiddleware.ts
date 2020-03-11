const customLoggerMiddleware = (req, res, next) => {
    const time = new Date();
    const { method, params, query, body } = req;

    console.log(`[Time: ${time}] [Method: ${JSON.stringify(method)}] [Query: ${JSON.stringify(query)}]` +
                    `[Params: ${JSON.stringify(params)}] [Body: ${JSON.stringify(body)}]`);
    next();
};

export default customLoggerMiddleware;
