const customLoggerMiddleware = (req, res, next) => {
    const time = new Date().toISOString();
    const { method, params, query, body } = req;

    console.log(`[CUSTOM LOGGER][Time: ${time}] [Method: ${JSON.stringify(method)}] [Query: ${JSON.stringify(query)}]` +
                    `[Params: ${JSON.stringify(params)}] [Body: ${JSON.stringify(body)}]`);
    next();
};

export default customLoggerMiddleware;
