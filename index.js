const logger = require("./config/logger.js");
const mongooseSetup = require("./db/index.js");
const app = require("./app.js");

const {PORT} = require("./config")
let attempt = 0;
const MAX_ATTEMPT = 5;

const runApi = () => {
  attempt += 1;

  logger.info("Try to run API");
  mongooseSetup()
    .then(() => {
      logger.info("MongoDB connected!!");

      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => logger.info(`Server is running on Port: ${PORT}`));
    })
    .catch((err) => {
      logger.error(`${err} mongoDB didn't connect!`);
      if (attempt < MAX_ATTEMPT) {
        setTimeout(runApi, 10000);
      } else {
        logger.error("Exiting the process!");
        process.exit(1);
      }
    });
};

runApi();