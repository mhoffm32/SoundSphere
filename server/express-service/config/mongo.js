const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri =
  "mongodb+srv://mhoffman0727:8QLhEMcKJ0KLteoZ@soundsphere.krdh1if.mongodb.net/?retryWrites=true&w=majority&appName=SoundSphere";

let client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

const connectToMongo = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("soundsphere");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = {
  client,
  connectToMongo,
  getDb: () => db,
};
