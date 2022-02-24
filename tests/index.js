
const fs = require('fs');

// select random prefix of word that has length of more than or equal to three!
const selectWordPrefix = (word) => {
    const toWhichIndex = Math.floor(Math.random() * (word.length - 3)) + 3
    return word.substring(0, toWhichIndex)
}

const createRnadomQuery = (data, fileToStore) => {

    const queryList = []
    for (const { firstName, lastName, phoneNumber } of data.objects) {

        const num = Math.floor(Math.random() * 4);

        let selectedWord;
        if (num == 0) {
            selectedWord = selectWordPrefix(firstName);
        } else if (num == 1) {
            selectedWord = selectWordPrefix(lastName);
        } else if (num == 2) {
            selectedWord = selectWordPrefix(firstName) + " " + selectWordPrefix(lastName);
        } else {
            selectedWord = selectWordPrefix(phoneNumber);
        }
        queryList.push(selectedWord)
    }

    const jsonData = JSON.stringify(queryList);
    fs.writeFile(fileToStore, jsonData, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

const contactData = require("./data/contactData.json");

createRnadomQuery(contactData, "./data/query.json")