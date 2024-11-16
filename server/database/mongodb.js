const mongoose = require("mongoose");

const connectToDatabase = () => {
  const uri = process.env.MONGODB_URI; // Ensure this is set in your environment variables

  mongoose
    .connect(uri)
    .then(() => {
      const db = mongoose.connection;
      console.log(
        `Successfully connected to MongoDB database: ${db.name} at host: ${db.host}`
      );
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err.message);
    });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB connection disconnected");
  });
};

module.exports = connectToDatabase;
