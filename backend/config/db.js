const mongoose = require('mongoose');

let cachedConnection = null;
let cachedPromise = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(process.env.MONGODB_URI).then(conn => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      cachedConnection = conn;
      return conn;
    });
  }

  try {
    return await cachedPromise;
  } catch (error) {
    cachedPromise = null;
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
