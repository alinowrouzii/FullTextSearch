const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { BASE_URL } = require("./config/index.js");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();

app.use(express.json({ limit: "20mb", extended: true }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(
    cors({
        origin: BASE_URL,
        credentials: true,
    })
);

app.use(cookieParser());

var options = {
    explorer: true,
};

const swaggerDocument = YAML.load("./swagger.yaml");
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options)
);



module.exports = app;