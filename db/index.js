const mongoose = require('mongoose');
const logger = require('../config/logger.js');
const {
   MONGO_URL
} = require("../config/index.js");

module.exports = async () => {
    
    try {
        await mongoose.connect(MONGO_URL);
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}