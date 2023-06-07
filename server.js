require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.SERVER_PORT || 3000; // PORT NUMBER

// Running server up with connecting to MongoDB
const main = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true
    });
    // Starting listening to the server on given port
    app.listen(PORT, () => console.log('Server has been started on port: ', PORT));
    console.log('Connection to MongoDB using Mongoose established successfully!');
  } catch (err) {
    console.log('SOME PROBLEM WHEN CONNECTING TO MONGODB.')
    console.log(err);
  }
};

main();
