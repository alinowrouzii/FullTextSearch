const mongoose = require("mongoose");
const Contact = require("./../../../models/Contact.js");

exports.getData = async (query) => {

    const dataToFetch = query.toLowerCase().trim().split(" ")
    const resultData = []
    const contactList = await Contact.find();

    for (const contact of contactList) {

        let found = true;
        for (word of dataToFetch) {
            if (!String(contact.firstName).toLowerCase().startsWith(word) && !String(contact.lastName).toLowerCase().startsWith(word) && !String(contact.phoneNumber).toLowerCase().startsWith(word)) {
                found = false;
                break;
            }
        }
        if (found) {
            resultData.push(contact)
        }
    }
    return resultData;
}