const mongoose = require('mongoose');

let cachedPromise = null;

const isConnected = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
  if (isConnected()) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000
    });
  }

  try {
    await cachedPromise;
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    return mongoose.connection;
  } catch (error) {
    cachedPromise = null;
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
