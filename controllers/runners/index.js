const getData = async (query, redisClient) => {

    const dataToFetch = query.toLowerCase().trim().split(" ")

    const fetchedIDS = await redisClient.SINTER(dataToFetch)
    return fetchedIDS
}

const addData = async (data, redisClient) => {
    const { firstName, lastName, phoneNumber, _id: docID } = data;

    let dataToAdd = String(firstName + " " + lastName + " " + phoneNumber).toLowerCase();
    dataToAdd = dataToAdd.trim().split(" ")

    for (const word of dataToAdd) {

        // add all prefix of word to our set.
        // we store all prefix of words that have more than or equal of three chars
        for (let endIndex = 3; endIndex <= word.length; endIndex++) {
            const wordToAdd = word.substring(0, endIndex)
            redisClient.sAdd(wordToAdd, docID)
        }
    }
}

const deleteData = async (oldData, redisClient) => {

    const { firstName, lastName, phoneNumber, _id: docID } = oldData;

    let dataToRemove = String(firstName + " " + lastName + " " + phoneNumber).toLowerCase();
    dataToRemove = dataToRemove.trim().split(" ")

    for (const word of dataToRemove) {
        // Similar to addData, remove all prefix of stored data
        for (let endIndex = 3; endIndex <= word.length; endIndex++) {
            const wordToRemove = word.substring(0, endIndex)
            redisClient.sRem(wordToRemove, docID)
        }
    }
}

const updateData = async (oldData, newData, redisClient) => {
    await deleteData(oldData, redisClient);
    await addData(newData, redisClient);
}

exports.addData = addData;
exports.getData = getData;
exports.deleteData = deleteData;
exports.updateData = updateData;