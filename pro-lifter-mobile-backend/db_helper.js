const mongoDB = require("mongodb");
const { MongoClient } = mongoDB;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please update the MONGODB_URI variable");
}

async function connectToDatabase() {
  try {
    console.log(MONGODB_URI);
    let client = new MongoClient(MONGODB_URI);
    await client.connect();
    let db = client.db("task-tracker");
    return db;
  } catch (error) {
    console.error("Error: ", error);
  }
}

module.exports = { connectToDatabase };
