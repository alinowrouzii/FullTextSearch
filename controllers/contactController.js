
const mongoose = require('mongoose');
const Contact = require('../models/Contact.js');
const { addData } = require('./runners/index.js');

exports.createContact = async (req, res) => {
    const { firstName, lastName, phoneNumber } = req.body;

    if (!firstName || !lastName || !phoneNumber) {
        return res.status(400).json({ status: 'fail', detail: 'firstName and lastName and phoneNumber are required' });
    }
    try {

        const contact = await new Contact({
            firstName, lastName, phoneNumber
        })
        await contact.save();

        const redisClient = req.redis;
        await addData(contact, redisClient);

        return res.status(201).json({ status: 'success', contact: contact.toObject() });
    }
    catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            for (errorFields in e.errors) {
                if (errorFields === 'phoneNumber') {
                    return res.status(400).json({ status: 'fail', detail: 'PhoneNumber format should be 09998882233' });
                }
            }
        }
        return res.status(400).json({ status: 'fail', detail: 'Bad request' });
    }
}

exports.updateContact = async (req, res) => {
    const { contactID, firstName, lastName, phoneNumber } = req.body;

    if (!contactID || !firstName || !lastName || !phoneNumber) {
        return res.status(400).json({ status: 'fail', detail: 'contactID && firstName and lastName and phoneNumber are required' });
    }

    try {
        const id = mongoose.Types.ObjectId(contactID);

        const query = { _id: id };
        const updatedFields = { firstName, lastName, phoneNumber }
        const contact = await Contact.findOneAndUpdate(query, updatedFields, {
            new: true
        });

        return res.status(200).json({ status: 'success', contact: contact.toObject() });
    } catch (e) {

        if (String(e).includes("BSONTypeError")) {
            return res.status(400).json({ status: 'fail', detail: 'Invalid Contact ID' });
        }
        return res.status(404).json({ status: 'fail', detail: 'Contact not found' });
    }

}

exports.getContact = async (req, res) => {

}

exports.deleteContact = async (req, res) => {
    const { contact_id: contactID } = req.params;

    try {
        const id = mongoose.Types.ObjectId(contactID);

        const query = { _id: id };
        const obj = await Contact.findOneAndDelete(query);
        if (!obj) {
            return res.status(404).json({ status: 'fail', detail: 'Contact not found' });
        }

        return res.status(200).json({ status: 'success', detail: 'Contact deleted successfully' });
    } catch (e) {
        // This error is because of ObjectId casting str to ObjectId
        return res.status(400).json({ status: 'fail', detail: 'Invalid Contact ID' });
    }

}