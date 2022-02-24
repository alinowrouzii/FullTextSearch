const { createClient } = require("redis");
const logger = require("../config/logger");

module.exports = async () => {
    const client = createClient();

    client.on('error', (err) => logger.error(`Redis Client Error ${err}`));

    await client.connect();

    return Promise.resolve(client)
};