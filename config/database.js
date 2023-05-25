const mongoose = require('mongoose');
const dotenv = require('dotenv').config({ path: 'config/.env' });

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Specify the correct write concern mode here
  // For example, 'majority' or a specific number like 3
  writeConcern: {
    w: 'majority'
  }
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error in connecting to MongoDB'));

db.once('open', function () {
  console.log('Connected to Database :: Mongodb');
});

module.exports = db;
