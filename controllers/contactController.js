
const mongoose = require('mongoose');
const Contact = require('../models/Contact.js');
const { addData, getData, deleteData, updateData } = require('./runners/index.js');

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

    if (!contactID || (!firstName && !lastName && !phoneNumber)) {
        return res.status(400).json({ status: 'fail', detail: 'contactID && (firstName or lastName or phoneNumber) are required' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(contactID)) {
            return res.status(400).json({ status: 'fail', detail: 'Invalid Contact ID' });
        }

        const id = mongoose.Types.ObjectId(contactID);

        const query = { _id: id };
        const contact = await Contact.findOne(query);
        const oldContact = contact.toObject();

        if (firstName) {
            contact.firstName = firstName
        }
        if (lastName) {
            contact.lastName = lastName
        }
        if (phoneNumber) {
            contact.phoneNumber = phoneNumber
        }
        await contact.save();

        const redisClient = req.redis;
        await updateData(oldContact, contact, redisClient);

        return res.status(200).json({ status: 'success', contact: contact.toObject() });
    } catch (e) {

        if (e instanceof mongoose.Error.ValidationError) {
            for (errorFields in e.errors) {
                if (errorFields === 'phoneNumber') {
                    return res.status(400).json({ status: 'fail', detail: 'PhoneNumber format should be 09998882233' });
                }
            }
        }

        return res.status(404).json({ status: 'fail', detail: 'Contact not found' });
    }

}

exports.getContact = async (req, res) => {

    const textToSearch = req.query.text;

    if (!textToSearch) {
        return res.status(400).json({ status: 'fail', detail: 'Bad request' });
    }

    const redisClient = req.redis;
    let fetchedIDS = await getData(textToSearch, redisClient)

    const fetchedContacts = await Contact.find({
        '_id': {
            $in: fetchedIDS
        }
    });

    return res.status(200).json({ status: 'success', contacts: fetchedContacts });

}

exports.deleteContact = async (req, res) => {
    const { contact_id: contactID } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(contactID)) {
            return res.status(400).json({ status: 'fail', detail: 'Invalid Contact ID' });
        }

        const id = mongoose.Types.ObjectId(contactID);

        const query = { _id: id };
        const obj = await Contact.findOneAndDelete(query);

        if (!obj) {
            return res.status(404).json({ status: 'fail', detail: 'Contact not found' });
        }

        const redisClient = req.redis;
        await deleteData(obj, redisClient);

        return res.status(200).json({ status: 'success', detail: 'Contact deleted successfully' });
    } catch (e) {
        // This error is because of ObjectId casting str to ObjectId
        return res.status(400).json({ status: 'fail', detail: 'Bad request' });
    }

}