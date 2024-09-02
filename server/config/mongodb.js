require('dotenv').config()
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.uri


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const database = client.db("hck-72");
module.exports = database;