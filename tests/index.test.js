const mongoose = require("mongoose");
const supertest = require("supertest");
const runAPI = require("./../index.js");
const mongooseSetup = require("./../db/index.js");
const redisStart = require("./../db/redis.js")
const logger = require("../config/logger");

const contactData = require("./data/contactDataSamller.json");
const queryList = require("./data/querySamller.json");

jest.setTimeout(3000000);

beforeAll(async () => {
    try {
        await mongooseSetup();

        await mongoose.connection.db.dropDatabase();
        logger.info("Mongo dropped successfully");

        const client = await redisStart();
        await client.sendCommand(["FLUSHDB"]);
        logger.info("Redis dropped successfully")

        Promise.resolve();
    } catch (err) {
        logger.error(err);
        process.exit(0);
    }
});


afterAll((done) => {
    mongoose.connection.close(() => {
        logger.info('Connection closed successfully');
        done()
    })
});



test("create 1000 Contacts ", async () => {
    logger.info("create test started")
    const app = await runAPI();
    // console.log(contactData)
    for (const contact of contactData.objects) {
        // console.log(contact.firstName)

        await supertest(app).post("/api/contact/")
            .send(contact)
            .expect(201)
    }

    logger.info("create test ended")

});

test("1000 query on Contacts (InvertedIndex approach)", async () => {
    logger.info("get test started")

    const app = await runAPI();
    // console.log(contactData)
    for (const query of queryList) {
        // console.log(contact.firstName)

        await supertest(app).get(`/api/contact/?text=${query}`)
            .expect(200)
            // .then((data)=>{
            //     console.log(data.body)
            // })
    }

});


test("1000 query on Contacts (Ordinary approach) ", async () => {
    logger.info("ordinary get test started")

    const app = await runAPI();
    // console.log(contactData)
    for (const query of queryList) {
        // console.log(query)

        await supertest(app).get(`/api/contact/ordinary/?text=${query}`)
            .expect(200)
            // .then((data)=>{
            //     console.log(data.body)
            // })
    }

});