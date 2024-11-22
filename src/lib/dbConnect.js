const mongoose = require("mongoose");

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to the database.");
    return;
  }

  try {
    await mongoose.connect(`${process.env.MONGO_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error(`Failed to connect to the database: ${error}`);
  }
};

module.exports = { connectToDatabase };
