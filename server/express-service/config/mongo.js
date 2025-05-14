const { MongoClient } = require("mongodb");

// MongoDB URI - Replace with your actual MongoDB connection string
const uri =
  "mongodb+srv://mhoffman0727:8QLhEMcKJ0KLteoZ@soundsphere.krdh1if.mongodb.net/?retryWrites=true&w=majority&appName=SoundSphere";

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    // Create a new MongoClient
    const client = new MongoClient(uri);

    // Establish connection to the MongoDB server
    await client.connect();

    // Specify the database
    const db = client.db("soundsphere"); // Replace "soundsphere" with your actual DB name

    console.log("Connected to MongoDB!");

    // Example: You can interact with your database here
    // For example, listing all collections
    const collections = await db.listCollections().toArray();
    console.log("Collections in the database:", collections);

    // Return the db client for further operations
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
}
