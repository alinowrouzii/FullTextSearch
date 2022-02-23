

exports.getData = async (query, redisClient) => {


}


exports.addData = async (data, redisClient) => {
    const {firstName, lastName, phoneNumber, id: docID} = data;

    let data_to_add = String(firstName + " " + lastName + " " + phoneNumber);
    data_to_add = data_to_add.trim().split(" ")

    console.log(data_to_add)
    // TODO: add all prefex of each word to set
    for (const word of data_to_add) {
        redisClient.sAdd(word, docID)
    }


    for (const word of data_to_add) {
        const names = await redisClient.sMembers(word)
        console.log(word,names)
        console.log("=====")
    }
}