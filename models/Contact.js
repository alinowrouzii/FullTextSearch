const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 40,
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 40,
    },
    phoneNumber: {
        type: String,
        required: true,
        maxLength: 40,
    },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;