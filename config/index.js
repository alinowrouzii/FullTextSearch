
require("dotenv").config();

module.exports =  {
    DEBUG: process.env.DEBUG === 'True',
    MONGO_URL: process.env.MONGO_URL,
    BASE_URL: process.env.BASE_URL,
    PORT: process.env.PORT || 5000,
}