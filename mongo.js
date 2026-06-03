const mongoose = require('mongoose');

async function connectMongo() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerceDB';

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 3000,
    socketTimeoutMS: 3000,
    connectTimeoutMS: 3000
  });
  console.log('✅ MongoDB Connected:', uri);
}

module.exports = { connectMongo };

