const logger = require("./config/logger.js");
const mongooseSetup = require("./db/index.js");
const app = require("./app.js");
const contactRoute = require("./routes/contactRoute.js");
const redisStart = require("./db/redis.js");
const { PORT } = require("./config");

let attempt = 0;
const MAX_ATTEMPT = 5;

const runAPI = async () => {
  attempt += 1;

  logger.info("Try to run API");
  try {
    await mongooseSetup();
    logger.info("MongoDB connected!!");

    const redisClient = await redisStart();
    logger.info("Redis connected!!");

    app.use(function (req, res, next) {
      req.redis = redisClient;
      next();
    });

    app.get("/ping", (req, res) => {
      res.send("PONG");
    });

    app.use("/api/contact", contactRoute);

    return app;
  } catch (err) {
    logger.error(`${err} mongoDB didn't connect!`);
    if (attempt < MAX_ATTEMPT) {
      setTimeout(runApi, 10000);
    } else {
      logger.error("Exiting the process!");
      process.exit(1);
    }
  }
};

runAPI().then((app) => {
  app.listen(PORT, () => logger.info(`Server is running on Port: ${PORT}`));
})

module.exports = runAPI;
