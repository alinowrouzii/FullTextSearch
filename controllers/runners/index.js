const getData = async (query, redisClient) => {

    const data_to_fetch = query.trim().split(" ")

    const fetchedIDS = await redisClient.SINTER(data_to_fetch)
    return fetchedIDS
}

const addData = async (data, redisClient) => {
    const { firstName, lastName, phoneNumber, _id: docID } = data;

    let data_to_add = String(firstName + " " + lastName + " " + phoneNumber);
    data_to_add = data_to_add.trim().split(" ")

    for (const word of data_to_add) {

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

    let dataToRemove = String(firstName + " " + lastName + " " + phoneNumber);
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