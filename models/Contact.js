const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        maxLength: 40,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        maxLength: 40,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        maxLength: 40,
        validate: {
            validator: function (v) {
                return /^0?\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;